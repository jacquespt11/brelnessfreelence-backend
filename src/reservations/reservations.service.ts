import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReservationDto, UpdateReservationStatusDto, ReservationStatus } from './dto/reservation.dto';
import { NotificationsGateway } from '../notifications/notifications.gateway';
import { DiscountsService } from '../discounts/discounts.service';

@Injectable()
export class ReservationsService {
  constructor(
    private prisma: PrismaService,
    private notifications: NotificationsGateway,
    private discountsService: DiscountsService,
  ) {}

  // ── Public ─────────────────────────────────────────────────
  // A customer makes a reservation for a product
  async create(shopId: string, dto: CreateReservationDto) {
    // 1. Verify the product exists and belongs to the shop
    const product = await this.prisma.product.findUnique({ 
      where: { id: dto.productId },
      include: { variants: true } as any
    });
    if (!product || product.shopId !== shopId) {
      throw new NotFoundException('Produit introuvable dans cette boutique');
    }

    let variant: any = null;
    if (dto.variantId) {
      variant = (product as any).variants?.find(v => v.id === dto.variantId);
      if (!variant) throw new NotFoundException('Variante introuvable');
    }

    // 2. Check stock availability if not a service
    const isService = product.isService;
    if (!isService) {
      if (variant) {
        if (variant.stock < dto.quantity) throw new BadRequestException('Stock insuffisant pour cette variante');
      } else {
        if (product.stock < dto.quantity) throw new BadRequestException('Stock insuffisant');
      }
    } else {
      if (!dto.bookingDate || !dto.bookingSlot) {
        throw new BadRequestException('La date et le créneau sont obligatoires pour un service');
      }
    }

    // Calcul du total (Avant réduction)
    const basePrice = (variant ? variant.price || product.price : product.price) || 0;
    let totalAmount = basePrice * dto.quantity;
    let appliedDiscountId = null;

    // Gestion du code promo si fourni
    if (dto.discountCode) {
       const discount = await this.discountsService.validateCode(shopId, dto.discountCode, totalAmount);
       if (discount.type === 'PERCENT') {
         totalAmount = totalAmount - (totalAmount * (discount.value / 100));
       } else {
         totalAmount = totalAmount - discount.value;
       }
       if (totalAmount < 0) totalAmount = 0;
       appliedDiscountId = discount.id;
    }

    // 3. Create the reservation and deduct stock inside a transaction
    return this.prisma.$transaction(async (tx) => {
      const reservation = await tx.reservation.create({
        data: {
          shopId,
          productId: dto.productId,
          variantId: dto.variantId,
          bookingDate: dto.bookingDate,
          bookingSlot: dto.bookingSlot,
          customerName: dto.customerName,
          customerPhone: dto.customerPhone,
          customerEmail: dto.customerEmail,
          notes: dto.notes,
          quantity: dto.quantity,
          totalAmount: totalAmount,
          discountCode: dto.discountCode,
          status: ReservationStatus.PENDING,
        },
      });

      if (!isService) {
        if (variant) {
          // decrement variant stock
          await tx.productVariant.update({
            where: { id: dto.variantId },
            data: { stock: { decrement: dto.quantity } },
          });
        } else {
          // decrement product stock
          await tx.product.update({
            where: { id: dto.productId },
            data: { stock: { decrement: dto.quantity } },
          });
        }
      }

      // Si un code promo a été validé, incrémenter son compteur d'utilisation
      if (appliedDiscountId) {
        await (tx as any).discount.update({
          where: { id: appliedDiscountId },
          data: { usedCount: { increment: 1 } }
        });
      }

      // Emit real-time notifications
      this.notifications.notifyShopAdmin(shopId, 'new_reservation', reservation);

      // Save persistent notifications to Database
      await tx.notification.create({
        data: {
          shopId,
          title: 'Nouvelle réservation',
          message: `Réservation pour ${product.name} par ${dto.customerName}`,
          type: 'reservation',
        }
      });

      return reservation;
    });
  }

  // ── Shop Admin ─────────────────────────────────────────────
  // Shop Admin gets all reservations for their shop
  async findByShop(shopId: string) {
    if (!shopId) return [];
    try {
      return await this.prisma.reservation.findMany({
        where: { shopId },
        include: { 
          product: { select: { name: true, price: true, images: true } },
          variant: true as any
        },
        orderBy: { createdAt: 'desc' },
      });
    } catch (err: any) {
      console.error('[ReservationsService.findByShop] Error:', err?.message, 'shopId:', shopId);
      return [];
    }
  }

  async getShopCustomers(shopId: string) {
    if (!shopId) return [];
    let reservations: any[] = [];
    try {
      reservations = await this.prisma.reservation.findMany({
        where: { shopId },
        include: { product: true },
      });
    } catch (err: any) {
      console.error('[ReservationsService.getShopCustomers] Error:', err?.message, 'shopId:', shopId);
      return [];
    }

    // Group by customerPhone
    const customerMap = new Map<string, any>();

    reservations.forEach(res => {
      const phone = res.customerPhone || 'Unknown';
      if (!customerMap.has(phone)) {
        customerMap.set(phone, {
          name: res.customerName,
          phone: res.customerPhone,
          email: res.customerEmail,
          reservationsCount: 0,
          totalGenerated: 0,
          lastActivity: res.createdAt,
          status: 'Inactif',
        });
      }

      const client = customerMap.get(phone);
      client.reservationsCount += 1;
      
      // Calculate revenue if COMPLETED
      if (res.status === 'COMPLETED' && res.product) {
        client.totalGenerated += (res.product.price * res.quantity);
      }

      if (new Date(res.createdAt) > new Date(client.lastActivity)) {
        client.lastActivity = res.createdAt;
        client.name = res.customerName; // take most recent name
      }
    });

    const now = new Date();
    const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));

    return Array.from(customerMap.values()).map(c => ({
      ...c,
      status: new Date(c.lastActivity) > thirtyDaysAgo ? 'Actif' : 'Inactif'
    }));
  }

  async updateStatus(id: string, shopId: string, dto: UpdateReservationStatusDto) {
    const reservation = await this.prisma.reservation.findUnique({ where: { id } });
    if (!reservation) throw new NotFoundException('Réservation introuvable');
    if (reservation.shopId !== shopId) throw new ForbiddenException('Accès refusé');

    return this.prisma.$transaction(async (tx) => {
      // If cancelled and previously it wasn't cancelled, we return the stock
      if (dto.status === ReservationStatus.CANCELLED && reservation.status !== ReservationStatus.CANCELLED) {
        const prod = await tx.product.findUnique({ where: { id: reservation.productId } });
        if (!prod?.isService) {
          if (reservation.variantId) {
            await tx.productVariant.update({
              where: { id: reservation.variantId },
              data: { stock: { increment: reservation.quantity } },
            });
          } else {
            await tx.product.update({
              where: { id: reservation.productId },
              data: { stock: { increment: reservation.quantity } },
            });
          }
        }
      }
      const updated = await tx.reservation.update({
        where: { id },
        data: { status: dto.status },
      });

      // Emit real-time status update notification (e.g. to customer if they were connected, or log)
      this.notifications.notifyShopAdmin(shopId, 'reservation_updated', updated);

      return updated;
    });
  }

  async remove(id: string, shopId: string) {
    const reservation = await this.prisma.reservation.findUnique({ where: { id } });
    if (!reservation) throw new NotFoundException('Réservation introuvable');
    if (reservation.shopId !== shopId) throw new ForbiddenException('Accès refusé');

    return this.prisma.reservation.delete({ where: { id } });
  }

  // ── Super Admin ────────────────────────────────────────────
  // Global visibility without data leakage in individual shop context
  async findAllGlobal() {
    return this.prisma.reservation.findMany({
      include: { 
        shop: { select: { name: true, slug: true } },
        product: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
