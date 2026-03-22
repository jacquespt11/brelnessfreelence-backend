import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateShopDto, UpdateShopDto } from './dto/shop.dto';
import { NotificationsGateway } from '../notifications/notifications.gateway';

@Injectable()
export class ShopsService {
  constructor(
    private prisma: PrismaService,
    private notifications: NotificationsGateway,
  ) {}

  // Super Admin: list all shops
  async findAll(search?: string) {
    const shops = await this.prisma.shop.findMany({
      where: search
        ? { OR: [{ name: { contains: search, mode: 'insensitive' } }, { slug: { contains: search, mode: 'insensitive' } }] }
        : undefined,
      include: { 
        users: { select: { id: true, name: true, email: true, status: true } },
        _count: { select: { products: true, reservations: true } },
        licenses: { orderBy: { createdAt: 'desc' }, take: 1 }
      },
      orderBy: { createdAt: 'desc' },
    });

    return shops.map(shop => ({
      ...shop,
      license: shop.licenses?.[0] || null
    }));
  }

  // Get a single shop by ID
  async findOne(id: string) {
    const shop = await this.prisma.shop.findUnique({
      where: { id },
      include: { 
        users: { select: { id: true, name: true, email: true, status: true } },
        _count: { select: { products: true, reservations: true } },
        licenses: { orderBy: { createdAt: 'desc' }, take: 1 }
      },
    });
    if (!shop) throw new NotFoundException('Boutique introuvable');
    
    return {
      ...shop,
      license: shop.licenses?.[0] || null
    };
  }

  // Get shop by subdomain slug (for public access)
  async findBySlug(slug: string) {
    const shop = await this.prisma.shop.findUnique({ where: { slug } });
    if (!shop) throw new NotFoundException('Boutique introuvable');
    return shop;
  }

  // Super Admin: create a new shop
  async create(dto: CreateShopDto) {
    const existing = await this.prisma.shop.findUnique({ where: { slug: dto.slug } });
    if (existing) throw new ConflictException(`Le sous-domaine "${dto.slug}" est déjà utilisé`);

    const shop = await this.prisma.shop.create({ 
      data: {
        ...dto,
        licenses: {
          create: {
            type: 'Basic',
            status: 'Actif',
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Default 30 days
          }
        }
      },
      include: { 
        users: { select: { id: true, name: true, email: true, status: true } },
        _count: { select: { products: true, reservations: true } },
        licenses: { orderBy: { createdAt: 'desc' }, take: 1 }
      }
    });

    // Notify Super Admin
    this.notifications.notifySuperAdmins('shop_created', shop);
    await this.prisma.notification.create({
      data: {
        title: 'Nouvelle Boutique',
        message: `La boutique "${shop.name}" vient d'être créée.`,
        type: 'shop',
      }
    });

    return {
      ...shop,
      license: shop.licenses?.[0] || null
    };
  }

  // Super Admin: update a shop
  async update(id: string, dto: UpdateShopDto) {
    await this.findOne(id);

    // Check slug uniqueness if changing
    if (dto.slug) {
      const existing = await this.prisma.shop.findFirst({ where: { slug: dto.slug, NOT: { id } } });
      if (existing) throw new ConflictException(`Le sous-domaine "${dto.slug}" est déjà utilisé`);
    }

    return this.prisma.shop.update({ where: { id }, data: dto });
  }

  // Super Admin: toggle shop status
  async toggleStatus(id: string) {
    const shop = await this.findOne(id);
    const updated = await this.prisma.shop.update({
      where: { id },
      data: { status: shop.status === 'active' ? 'inactive' : 'active' },
    });

    this.notifications.notifySuperAdmins('shop_updated', updated);
    await this.prisma.notification.create({
      data: {
        title: 'Statut Boutique Modifié',
        message: `La boutique "${shop.name}" est maintenant ${updated.status}.`,
        type: 'shop',
      }
    });

    return updated;
  }

  // Super Admin: delete a shop
  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.shop.delete({ where: { id } });
  }

  // Super Admin: renew license
  async renewLicense(shopId: string, type: string, days: number) {
    const newExpiry = new Date(Date.now() + days * 86400000);
    const res = await this.prisma.license.create({
      data: {
        shopId,
        type,
        status: 'Actif',
        startDate: new Date(),
        endDate: newExpiry
      }
    });

    this.notifications.notifySuperAdmins('license_renewed', { shopId, type, newExpiry });
    await this.prisma.notification.create({
      data: {
        title: 'Licence Renouvelée',
        message: `Nouvelle licence "${type}" pour la boutique ID: ${shopId}.`,
        type: 'license',
      }
    });

    return res;
  }

  // Super Admin: cancel license
  async cancelLicense(shopId: string) {
    const latest = await this.prisma.license.findFirst({ where: { shopId }, orderBy: { createdAt: 'desc' } });
    if (latest) {
      await this.prisma.license.update({ where: { id: latest.id }, data: { status: 'Annulé' } });
    }
    const updatedShop = await this.prisma.shop.update({ where: { id: shopId }, data: { status: 'inactive' } });

    this.notifications.notifySuperAdmins('license_cancelled', { shopId });
    await this.prisma.notification.create({
      data: {
        title: 'Licence Annulée',
        message: `La licence de la boutique "${updatedShop.name}" a été annulée.`,
        type: 'license',
      }
    });

    return updatedShop;
  }

  // Shop Admin: get their own shop (by shopId from JWT)
  async findMyShop(shopId: string) {
    return this.findOne(shopId);
  }

  // Shop Admin: update their own shop
  async updateMyShop(shopId: string, dto: UpdateShopDto) {
    return this.update(shopId, dto);
  }

  // Shop Admin: get analytics
  async getAnalytics(shopId: string, period: string = 'week') {
    const now = new Date();
    let startDate = new Date();
    
    if (period === 'week') startDate.setDate(now.getDate() - 7);
    else if (period === 'month') startDate.setMonth(now.getMonth() - 1);
    else if (period === 'year') startDate.setFullYear(now.getFullYear() - 1);
    else startDate.setDate(now.getDate() - 7);

    const reservations = await this.prisma.reservation.findMany({
      where: { shopId, createdAt: { gte: startDate } },
      select: { createdAt: true, status: true }
    });

    const completedRes = await this.prisma.reservation.findMany({
      where: { shopId, status: 'COMPLETED' },
      include: { product: true }
    });

    const totalRevenue = completedRes.reduce((sum, res) => sum + ((res.product?.price || 0) * res.quantity), 0);

    const trendMap = new Map<string, number>();
    reservations.forEach(r => {
      const dateStr = r.createdAt.toISOString().split('T')[0];
      trendMap.set(dateStr, (trendMap.get(dateStr) || 0) + 1);
    });

    const trends = Array.from(trendMap.entries()).map(([date, count]) => ({ date, count })).sort((a,b) => a.date.localeCompare(b.date));

    const topProducts = await this.prisma.product.findMany({
      where: { shopId },
      orderBy: { reservations: { _count: 'desc' } },
      include: { _count: { select: { reservations: true } } },
      take: 5
    });

    return {
      period,
      totalReservations: reservations.length,
      revenue: totalRevenue,
      trends,
      topProducts: topProducts.map(p => ({
        id: p.id,
        name: p.name,
        reservationCount: p._count.reservations
      }))
    };
  }
}
