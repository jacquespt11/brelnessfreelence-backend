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
exports.SubscriptionGuard = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let SubscriptionGuard = class SubscriptionGuard {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user || user.role === 'SUPER_ADMIN')
            return true;
        if (request.method === 'GET' || request.method === 'OPTIONS')
            return true;
        if (request.url.includes('/tickets'))
            return true;
        if (!user.shopId) {
            throw new common_1.ForbiddenException('Aucune boutique associée à ce compte.');
        }
        const shop = await this.prisma.shop.findUnique({
            where: { id: user.shopId },
            include: {
                licenses: {
                    orderBy: { endDate: 'desc' },
                    take: 1
                }
            }
        });
        if (!shop)
            return false;
        if (shop.isManualOverride)
            return true;
        const currentLicense = shop.licenses[0];
        if (!currentLicense) {
            throw new common_1.ForbiddenException("Aucune licence valide. Mode lecture seule.");
        }
        if (currentLicense.status === 'GRACE_PERIOD' || currentLicense.status === 'EXPIRED') {
            throw new common_1.ForbiddenException("Période de grâce ou Expirée (Lecture Seule). Veuillez renouveler votre abonnement.");
        }
        return true;
    }
};
exports.SubscriptionGuard = SubscriptionGuard;
exports.SubscriptionGuard = SubscriptionGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SubscriptionGuard);
//# sourceMappingURL=subscription.guard.js.map