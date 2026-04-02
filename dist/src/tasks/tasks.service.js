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
var TasksService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const prisma_service_1 = require("../prisma/prisma.service");
let TasksService = TasksService_1 = class TasksService {
    prisma;
    logger = new common_1.Logger(TasksService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async handleLicenseExpirations() {
        this.logger.debug('Running daily license expiration check...');
        const now = new Date();
        const expiredLicenses = await this.prisma.license.findMany({
            where: {
                endDate: { lt: now },
                status: { in: ['ACTIVE', 'WARNING'] },
            },
        });
        for (const license of expiredLicenses) {
            this.logger.log(`License ${license.id} (Shop ${license.shopId}) expired. GRACE_PERIOD.`);
            await this.prisma.license.update({
                where: { id: license.id },
                data: { status: 'GRACE_PERIOD' },
            });
            await this.prisma.notification.create({
                data: {
                    shopId: license.shopId,
                    type: 'license',
                    title: 'Licence expirée (Période de grâce)',
                    message: 'Votre abonnement a expiré. Votre boutique est passée en mode lecture seule.',
                }
            });
        }
        const fiveDaysAgo = new Date();
        fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
        const graceEndedLicenses = await this.prisma.license.findMany({
            where: {
                endDate: { lt: fiveDaysAgo },
                status: 'GRACE_PERIOD',
            },
        });
        for (const license of graceEndedLicenses) {
            this.logger.log(`License ${license.id} ended grace period. EXPIRED.`);
            await this.prisma.license.update({
                where: { id: license.id },
                data: { status: 'EXPIRED' },
            });
            await this.prisma.shop.update({
                where: { id: license.shopId },
                data: { status: 'suspended' },
            });
        }
        const next7Days = new Date();
        next7Days.setDate(next7Days.getDate() + 7);
        const warningLicenses = await this.prisma.license.findMany({
            where: {
                endDate: { gt: now, lte: next7Days },
                status: 'ACTIVE',
            },
        });
        for (const license of warningLicenses) {
            this.logger.log(`License ${license.id} entering WARNING period.`);
            await this.prisma.license.update({
                where: { id: license.id },
                data: { status: 'WARNING' },
            });
            await this.prisma.notification.create({
                data: {
                    shopId: license.shopId,
                    type: 'license',
                    title: 'Licence bientôt expirée',
                    message: `Votre abonnement expire d'ici 7 jours. Pensez à renouveler.`,
                }
            });
        }
    }
};
exports.TasksService = TasksService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_MIDNIGHT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TasksService.prototype, "handleLicenseExpirations", null);
exports.TasksService = TasksService = TasksService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TasksService);
//# sourceMappingURL=tasks.service.js.map