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
exports.DiscountsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let DiscountsService = class DiscountsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async validateCode(shopId, code, cartTotal) {
        const discount = await this.prisma.discount.findFirst({
            where: { shopId, code, isActive: true },
        });
        if (!discount) {
            throw new common_1.NotFoundException('Code promo invalide');
        }
        if (discount.expiresAt && new Date(discount.expiresAt) < new Date()) {
            throw new common_1.BadRequestException('Ce code promo a expiré');
        }
        if (discount.maxUses && discount.usedCount >= discount.maxUses) {
            throw new common_1.BadRequestException("Ce code promo a atteint sa limite d'utilisation");
        }
        if (discount.minAmount && cartTotal < discount.minAmount) {
            throw new common_1.BadRequestException(`Amount minimum requis: ${discount.minAmount} FCFA`);
        }
        return discount;
    }
    async findByShop(shopId) {
        if (!shopId)
            return [];
        try {
            return await this.prisma.discount.findMany({
                where: { shopId },
                orderBy: { createdAt: 'desc' },
            });
        }
        catch (err) {
            console.error('[DiscountsService.findByShop] Error:', err?.message, 'shopId:', shopId);
            return [];
        }
    }
    async create(shopId, dto) {
        const existing = await this.prisma.discount.findFirst({
            where: { shopId, code: dto.code },
        });
        if (existing) {
            throw new common_1.BadRequestException('Un code avec ce nom existe déjà pour cette boutique');
        }
        return this.prisma.discount.create({
            data: {
                ...dto,
                shopId,
            },
        });
    }
    async update(id, shopId, dto) {
        const discount = await this.prisma.discount.findUnique({
            where: { id },
        });
        if (!discount)
            throw new common_1.NotFoundException('Code promo introuvable');
        if (discount.shopId !== shopId)
            throw new common_1.ForbiddenException('Accès refusé');
        if (dto.code && dto.code !== discount.code) {
            const existing = await this.prisma.discount.findFirst({
                where: { shopId, code: dto.code },
            });
            if (existing) {
                throw new common_1.BadRequestException('Un code avec ce nom existe déjà pour cette boutique');
            }
        }
        return this.prisma.discount.update({
            where: { id },
            data: dto,
        });
    }
    async remove(id, shopId) {
        const discount = await this.prisma.discount.findUnique({
            where: { id },
        });
        if (!discount)
            throw new common_1.NotFoundException('Code promo introuvable');
        if (discount.shopId !== shopId)
            throw new common_1.ForbiddenException('Accès refusé');
        return this.prisma.discount.delete({ where: { id } });
    }
    async incrementUsedCount(id) {
        return this.prisma.discount.update({
            where: { id },
            data: {
                usedCount: { increment: 1 }
            }
        });
    }
};
exports.DiscountsService = DiscountsService;
exports.DiscountsService = DiscountsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DiscountsService);
//# sourceMappingURL=discounts.service.js.map