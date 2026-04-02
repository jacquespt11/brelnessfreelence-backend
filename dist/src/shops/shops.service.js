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
exports.ShopsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const notifications_gateway_1 = require("../notifications/notifications.gateway");
let ShopsService = class ShopsService {
    prisma;
    notifications;
    constructor(prisma, notifications) {
        this.prisma = prisma;
        this.notifications = notifications;
    }
    async findAll(search) {
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
    async findOne(id) {
        const shop = await this.prisma.shop.findUnique({
            where: { id },
            include: {
                users: { select: { id: true, name: true, email: true, status: true } },
                _count: { select: { products: true, reservations: true } },
                licenses: { orderBy: { createdAt: 'desc' }, take: 1 }
            },
        });
        if (!shop)
            throw new common_1.NotFoundException('Boutique introuvable');
        return {
            ...shop,
            license: shop.licenses?.[0] || null
        };
    }
    async findBySlug(slug) {
        const shop = await this.prisma.shop.findUnique({ where: { slug } });
        if (!shop)
            throw new common_1.NotFoundException('Boutique introuvable');
        return shop;
    }
    async create(dto) {
        const existing = await this.prisma.shop.findUnique({ where: { slug: dto.slug } });
        if (existing)
            throw new common_1.ConflictException(`Le sous-domaine "${dto.slug}" est déjà utilisé`);
        const shop = await this.prisma.shop.create({
            data: {
                ...dto,
                licenses: {
                    create: {
                        type: 'Basic',
                        status: 'ACTIVE',
                        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                    }
                }
            },
            include: {
                users: { select: { id: true, name: true, email: true, status: true } },
                _count: { select: { products: true, reservations: true } },
                licenses: { orderBy: { createdAt: 'desc' }, take: 1 }
            }
        });
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
    async update(id, dto) {
        await this.findOne(id);
        if (dto.slug) {
            const existing = await this.prisma.shop.findFirst({ where: { slug: dto.slug, NOT: { id } } });
            if (existing)
                throw new common_1.ConflictException(`Le sous-domaine "${dto.slug}" est déjà utilisé`);
        }
        return this.prisma.shop.update({ where: { id }, data: dto });
    }
    async toggleStatus(id) {
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
    async remove(id) {
        await this.findOne(id);
        return this.prisma.shop.delete({ where: { id } });
    }
    async renewLicense(shopId, type, days) {
        const newExpiry = new Date(Date.now() + days * 86400000);
        const res = await this.prisma.license.create({
            data: {
                shopId,
                type,
                status: 'ACTIVE',
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
    async cancelLicense(shopId) {
        const latest = await this.prisma.license.findFirst({ where: { shopId }, orderBy: { createdAt: 'desc' } });
        if (latest) {
            await this.prisma.license.update({ where: { id: latest.id }, data: { status: 'CANCELLED' } });
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
    async findMyShop(shopId) {
        return this.findOne(shopId);
    }
    async updateMyShop(shopId, dto) {
        return this.update(shopId, dto);
    }
    async getAnalytics(shopId, period = 'week') {
        const now = new Date();
        let startDate = new Date();
        if (period === 'week')
            startDate.setDate(now.getDate() - 7);
        else if (period === 'month')
            startDate.setMonth(now.getMonth() - 1);
        else if (period === 'year')
            startDate.setFullYear(now.getFullYear() - 1);
        else
            startDate.setDate(now.getDate() - 7);
        let products = [];
        try {
            products = await this.prisma.product.findMany({
                where: { shopId },
                select: { id: true, views: true, name: true, _count: { select: { reservations: true } } }
            });
        }
        catch (e) {
            products = await this.prisma.product.findMany({
                where: { shopId },
                select: { id: true, name: true, _count: { select: { reservations: true } } }
            });
        }
        const totalViews = products.reduce((sum, p) => sum + (p.views || 0), 0);
        const topProducts = products
            .sort((a, b) => b._count.reservations - a._count.reservations)
            .slice(0, 5)
            .map((p) => ({
            id: p.id,
            name: p.name,
            reservationCount: p._count.reservations
        }));
        const reservations = await this.prisma.reservation.findMany({
            where: { shopId, createdAt: { gte: startDate } },
            include: { product: { select: { price: true, isService: true } } }
        });
        let totalRevenue = 0;
        let completedCount = 0;
        let productSales = 0;
        let serviceSales = 0;
        const trendMap = new Map();
        reservations.forEach(r => {
            const dateStr = r.createdAt.toISOString().split('T')[0];
            const currentTrend = trendMap.get(dateStr) || { count: 0, revenue: 0 };
            currentTrend.count += 1;
            if (r.status === 'COMPLETED') {
                completedCount++;
                const itemRev = r.totalAmount ?? ((r.product?.price || 0) * r.quantity);
                totalRevenue += itemRev;
                currentTrend.revenue += itemRev;
                if (r.product?.isService) {
                    serviceSales++;
                }
                else {
                    productSales++;
                }
            }
            trendMap.set(dateStr, currentTrend);
        });
        const completionRate = reservations.length > 0 ? Math.round((completedCount / reservations.length) * 100) : 0;
        const trends = Array.from(trendMap.entries())
            .map(([date, data]) => ({ date, count: data.count, revenue: data.revenue }))
            .sort((a, b) => a.date.localeCompare(b.date));
        const salesByCategory = [
            { name: 'Produits', value: productSales, color: '#1877f2' },
            { name: 'Services', value: serviceSales, color: '#e1306c' }
        ].filter(c => c.value > 0);
        const avgRating = "4.8";
        return {
            period,
            totalReservations: reservations.length,
            revenue: totalRevenue,
            totalViews,
            completionRate,
            avgRating,
            trends,
            salesByCategory,
            topProducts
        };
    }
};
exports.ShopsService = ShopsService;
exports.ShopsService = ShopsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_gateway_1.NotificationsGateway])
], ShopsService);
//# sourceMappingURL=shops.service.js.map