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
let ReservationsService = class ReservationsService {
    prisma;
    notifications;
    constructor(prisma, notifications) {
        this.prisma = prisma;
        this.notifications = notifications;
    }
    async create(shopId, dto) {
        const product = await this.prisma.product.findUnique({ where: { id: dto.productId } });
        if (!product || product.shopId !== shopId) {
            throw new common_1.NotFoundException('Produit introuvable dans cette boutique');
        }
        if (product.stock < dto.quantity) {
            throw new common_1.BadRequestException('Stock insuffisant');
        }
        return this.prisma.$transaction(async (tx) => {
            const reservation = await tx.reservation.create({
                data: {
                    shopId,
                    productId: dto.productId,
                    customerName: dto.customerName,
                    customerPhone: dto.customerPhone,
                    customerEmail: dto.customerEmail,
                    quantity: dto.quantity,
                    status: reservation_dto_1.ReservationStatus.PENDING,
                },
            });
            await tx.product.update({
                where: { id: dto.productId },
                data: { stock: { decrement: dto.quantity } },
            });
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
        return this.prisma.reservation.findMany({
            where: { shopId },
            include: {
                product: { select: { name: true, price: true, images: true } }
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getShopCustomers(shopId) {
        const reservations = await this.prisma.reservation.findMany({
            where: { shopId },
            include: { product: true },
        });
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
                await tx.product.update({
                    where: { id: reservation.productId },
                    data: { stock: { increment: reservation.quantity } },
                });
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
        notifications_gateway_1.NotificationsGateway])
], ReservationsService);
//# sourceMappingURL=reservations.service.js.map