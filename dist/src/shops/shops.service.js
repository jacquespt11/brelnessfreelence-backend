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
let ShopsService = class ShopsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
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
                        status: 'Actif',
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
        return this.prisma.shop.update({
            where: { id },
            data: { status: shop.status === 'active' ? 'inactive' : 'active' },
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.shop.delete({ where: { id } });
    }
    async renewLicense(shopId, type, days) {
        const newExpiry = new Date(Date.now() + days * 86400000);
        return this.prisma.license.create({
            data: {
                shopId,
                type,
                status: 'Actif',
                startDate: new Date(),
                endDate: newExpiry
            }
        });
    }
    async cancelLicense(shopId) {
        const latest = await this.prisma.license.findFirst({ where: { shopId }, orderBy: { createdAt: 'desc' } });
        if (latest) {
            await this.prisma.license.update({ where: { id: latest.id }, data: { status: 'Annulé' } });
        }
        return this.prisma.shop.update({ where: { id: shopId }, data: { status: 'inactive' } });
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
        const reservations = await this.prisma.reservation.findMany({
            where: { shopId, createdAt: { gte: startDate } },
            select: { createdAt: true, status: true }
        });
        const completedRes = await this.prisma.reservation.findMany({
            where: { shopId, status: 'COMPLETED' },
            include: { product: true }
        });
        const totalRevenue = completedRes.reduce((sum, res) => sum + ((res.product?.price || 0) * res.quantity), 0);
        const trendMap = new Map();
        reservations.forEach(r => {
            const dateStr = r.createdAt.toISOString().split('T')[0];
            trendMap.set(dateStr, (trendMap.get(dateStr) || 0) + 1);
        });
        const trends = Array.from(trendMap.entries()).map(([date, count]) => ({ date, count })).sort((a, b) => a.date.localeCompare(b.date));
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
};
exports.ShopsService = ShopsService;
exports.ShopsService = ShopsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ShopsService);
//# sourceMappingURL=shops.service.js.map