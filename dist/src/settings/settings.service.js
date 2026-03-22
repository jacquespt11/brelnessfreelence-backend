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
exports.SettingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const notifications_gateway_1 = require("../notifications/notifications.gateway");
let SettingsService = class SettingsService {
    prisma;
    notifications;
    constructor(prisma, notifications) {
        this.prisma = prisma;
        this.notifications = notifications;
    }
    async getSettings() {
        let settings = await this.prisma.systemSettings.findFirst();
        if (!settings) {
            settings = await this.prisma.systemSettings.create({
                data: {}
            });
        }
        return settings;
    }
    async updateSettings(data) {
        const settings = await this.getSettings();
        const updated = await this.prisma.systemSettings.update({
            where: { id: settings.id },
            data
        });
        this.notifications.notifySuperAdmins('system_updated', updated);
        await this.prisma.notification.create({
            data: {
                title: 'Système Mis à Jour',
                message: 'Les paramètres de la plateforme ont été modifiés.',
                type: 'system',
            }
        });
        return updated;
    }
};
exports.SettingsService = SettingsService;
exports.SettingsService = SettingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_gateway_1.NotificationsGateway])
], SettingsService);
//# sourceMappingURL=settings.service.js.map