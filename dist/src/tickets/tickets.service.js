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
exports.TicketsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let TicketsService = class TicketsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(shopId, dto) {
        return this.prisma.supportTicket.create({
            data: {
                shopId,
                type: dto.type,
                subject: dto.subject,
                description: dto.description,
            },
        });
    }
    async findByShop(shopId) {
        return this.prisma.supportTicket.findMany({
            where: { shopId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findAllGlobal() {
        return this.prisma.supportTicket.findMany({
            include: {
                shop: { select: { id: true, name: true, slug: true, email: true, phone: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async updateStatus(id, dto) {
        const ticket = await this.prisma.supportTicket.findUnique({ where: { id } });
        if (!ticket)
            throw new common_1.NotFoundException('Ticket introuvable');
        return this.prisma.supportTicket.update({
            where: { id },
            data: { status: dto.status },
        });
    }
};
exports.TicketsService = TicketsService;
exports.TicketsService = TicketsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TicketsService);
//# sourceMappingURL=tickets.service.js.map