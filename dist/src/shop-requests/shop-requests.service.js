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
exports.ShopRequestsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const notifications_gateway_1 = require("../notifications/notifications.gateway");
const resend_1 = require("resend");
let ShopRequestsService = class ShopRequestsService {
    prisma;
    notifications;
    resend;
    constructor(prisma, notifications) {
        this.prisma = prisma;
        this.notifications = notifications;
        this.resend = new resend_1.Resend(process.env.RESEND_API_KEY || 're_mock_key');
    }
    async create(data) {
        if (!data.name || !data.email || !data.businessName) {
            throw new common_1.BadRequestException('Nom, email et nom de boutique sont requis.');
        }
        const request = await this.prisma.shopRequest.create({
            data: {
                name: data.name,
                email: data.email,
                phone: data.phone,
                businessName: data.businessName,
                details: data.details,
            },
        });
        this.notifications.notifySuperAdmins('shop_request_created', request);
        await this.prisma.notification.create({
            data: {
                title: 'Nouvelle Demande de Plateforme',
                message: `${data.name} (${data.email}) souhaite créer la boutique "${data.businessName}".`,
                type: 'system',
            }
        });
        try {
            if (process.env.RESEND_API_KEY) {
                await this.resend.emails.send({
                    from: 'Brelness Onboarding <onboarding@brelness.com>',
                    to: process.env.ADMIN_EMAIL || 'admin@brelness.com',
                    subject: `Nouvelle demande de plateforme : ${data.businessName}`,
                    html: `
            <h2>Nouvelle demande de création de boutique</h2>
            <p><strong>Nom :</strong> ${data.name}</p>
            <p><strong>Email :</strong> ${data.email}</p>
            <p><strong>Téléphone :</strong> ${data.phone || 'Non renseigné'}</p>
            <p><strong>Nom de la boutique :</strong> ${data.businessName}</p>
            <p><strong>Détails :</strong> ${data.details || 'Aucun'}</p>
            <br/>
            <p>Connectez-vous à votre tableau de bord Brelness pour gérer cette demande.</p>
          `,
                });
            }
            else {
                console.warn('RESEND_API_KEY manquant. E-mail non envoyé.');
            }
        }
        catch (e) {
            console.error("Erreur lors de l'envoi de l'email Resend:", e);
        }
        return request;
    }
    async findAll() {
        return this.prisma.shopRequest.findMany({
            orderBy: { createdAt: 'desc' }
        });
    }
    async updateStatus(id, status) {
        return this.prisma.shopRequest.update({
            where: { id },
            data: { status }
        });
    }
};
exports.ShopRequestsService = ShopRequestsService;
exports.ShopRequestsService = ShopRequestsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_gateway_1.NotificationsGateway])
], ShopRequestsService);
//# sourceMappingURL=shop-requests.service.js.map