"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReservationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const reservation_dto_1 = require("./dto/reservation.dto");
const notifications_gateway_1 = require("../notifications/notifications.gateway");
const discounts_service_1 = require("../discounts/discounts.service");
let ReservationsService = class ReservationsService {
    prisma;
    notifications;
    discountsService;
    constructor(prisma, notifications, discountsService) {
        this.prisma = prisma;
        this.notifications = notifications;
        this.discountsService = discountsService;
    }
    async create(shopId, dto) {
        const product = await this.prisma.product.findUnique({
            where: { id: dto.productId },
            include: { variants: true }
        });
        if (!product || product.shopId !== shopId) {
            throw new common_1.NotFoundException('Produit introuvable dans cette boutique');
        }
        let variant = null;
        if (dto.variantId) {
            variant = product.variants?.find(v => v.id === dto.variantId);
            if (!variant)
                throw new common_1.NotFoundException('Variante introuvable');
        }
        const isService = product.isService;
        if (!isService) {
            if (variant) {
                if (variant.stock < dto.quantity)
                    throw new common_1.BadRequestException('Stock insuffisant pour cette variante');
            }
            else {
                if (product.stock < dto.quantity)
                    throw new common_1.BadRequestException('Stock insuffisant');
            }
        }
        else {
            if (!dto.bookingDate || !dto.bookingSlot) {
                throw new common_1.BadRequestException('La date et le créneau sont obligatoires pour un service');
            }
        }
        const basePrice = (variant ? variant.price || product.price : product.price) || 0;
        let totalAmount = basePrice * dto.quantity;
        let appliedDiscountId = null;
        if (dto.discountCode) {
            const discount = await this.discountsService.validateCode(shopId, dto.discountCode, totalAmount);
            if (discount.type === 'PERCENT') {
                totalAmount = totalAmount - (totalAmount * (discount.value / 100));
            }
            else {
                totalAmount = totalAmount - discount.value;
            }
            if (totalAmount < 0)
                totalAmount = 0;
            appliedDiscountId = discount.id;
        }
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
                    status: reservation_dto_1.ReservationStatus.PENDING,
                },
            });
            if (!isService) {
                if (variant) {
                    await tx.productVariant.update({
                        where: { id: dto.variantId },
                        data: { stock: { decrement: dto.quantity } },
                    });
                }
                else {
                    await tx.product.update({
                        where: { id: dto.productId },
                        data: { stock: { decrement: dto.quantity } },
                    });
                }
            }
            if (appliedDiscountId) {
                await tx.discount.update({
                    where: { id: appliedDiscountId },
                    data: { usedCount: { increment: 1 } }
                });
            }
            this.notifications.notifyShopAdmin(shopId, 'new_reservation', reservation);
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
    async findByShop(shopId) {
        if (!shopId)
            return [];
        try {
            return await this.prisma.reservation.findMany({
                where: { shopId },
                include: {
                    product: { select: { name: true, price: true, images: true } },
                    variant: true
                },
                orderBy: { createdAt: 'desc' },
            });
        }
        catch (err) {
            console.error('[ReservationsService.findByShop] Error:', err?.message, 'shopId:', shopId);
            return [];
        }
    }
    async getShopCustomers(shopId) {
        if (!shopId)
            return [];
        let reservations = [];
        try {
            reservations = await this.prisma.reservation.findMany({
                where: { shopId },
                include: { product: true },
            });
        }
        catch (err) {
            console.error('[ReservationsService.getShopCustomers] Error:', err?.message, 'shopId:', shopId);
            return [];
        }
        const customerMap = new Map();
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
            if (res.status === 'COMPLETED' && res.product) {
                client.totalGenerated += (res.product.price * res.quantity);
            }
            if (new Date(res.createdAt) > new Date(client.lastActivity)) {
                client.lastActivity = res.createdAt;
                client.name = res.customerName;
            }
        });
        const now = new Date();
        const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
        return Array.from(customerMap.values()).map(c => ({
            ...c,
            status: new Date(c.lastActivity) > thirtyDaysAgo ? 'Actif' : 'Inactif'
        }));
    }
    async updateStatus(id, shopId, dto) {
        const reservation = await this.prisma.reservation.findUnique({ where: { id } });
        if (!reservation)
            throw new common_1.NotFoundException('Réservation introuvable');
        if (reservation.shopId !== shopId)
            throw new common_1.ForbiddenException('Accès refusé');
        return this.prisma.$transaction(async (tx) => {
            if (dto.status === reservation_dto_1.ReservationStatus.CANCELLED && reservation.status !== reservation_dto_1.ReservationStatus.CANCELLED) {
                const prod = await tx.product.findUnique({ where: { id: reservation.productId } });
                if (!prod?.isService) {
                    if (reservation.variantId) {
                        await tx.productVariant.update({
                            where: { id: reservation.variantId },
                            data: { stock: { increment: reservation.quantity } },
                        });
                    }
                    else {
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
            this.notifications.notifyShopAdmin(shopId, 'reservation_updated', updated);
            return updated;
        });
    }
    async remove(id, shopId) {
        const reservation = await this.prisma.reservation.findUnique({ where: { id } });
        if (!reservation)
            throw new common_1.NotFoundException('Réservation introuvable');
        if (reservation.shopId !== shopId)
            throw new common_1.ForbiddenException('Accès refusé');
        return this.prisma.reservation.delete({ where: { id } });
    }
    async findAllGlobal() {
        return this.prisma.reservation.findMany({
            include: {
                shop: { select: { name: true, slug: true } },
                product: { select: { name: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
};
exports.ReservationsService = ReservationsService;
exports.ReservationsService = ReservationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_gateway_1.NotificationsGateway,
        discounts_service_1.DiscountsService])
], ReservationsService);
//# sourceMappingURL=reservations.service.js.map