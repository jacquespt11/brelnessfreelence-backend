"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = __importStar(require("bcryptjs"));
const notifications_gateway_1 = require("../notifications/notifications.gateway");
let AuthService = class AuthService {
    prisma;
    jwtService;
    notifications;
    constructor(prisma, jwtService, notifications) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.notifications = notifications;
    }
    async register(email, password, name) {
        const existing = await this.prisma.user.findUnique({ where: { email } });
        if (existing)
            throw new common_1.ConflictException('Email déjà utilisé');
        const hashed = await bcrypt.hash(password, 10);
        const user = await this.prisma.user.create({
            data: { email, password: hashed, name },
        });
        return this.issueToken(user);
    }
    async login(email, password) {
        if (!email || !password) {
            throw new common_1.BadRequestException('Email et mot de passe sont requis');
        }
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user)
            throw new common_1.UnauthorizedException('Identifiants invalides');
        const valid = await bcrypt.compare(password, user.password);
        if (!valid)
            throw new common_1.UnauthorizedException('Identifiants invalides');
        return this.issueToken(user);
    }
    issueToken(user) {
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
            shopId: user.shopId,
        };
        return {
            access_token: this.jwtService.sign(payload),
            user: { id: user.id, email: user.email, name: user.name, role: user.role, shopId: user.shopId },
        };
    }
    async findAll() {
        return this.prisma.user.findMany({
            include: { shop: true },
            orderBy: { name: 'asc' }
        });
    }
    async createUser(data) {
        const existing = await this.prisma.user.findUnique({ where: { email: data.email } });
        if (existing)
            throw new common_1.ConflictException('Email déjà utilisé');
        const hashedPassword = await bcrypt.hash(data.password || 'password123', 10);
        const user = await this.prisma.user.create({
            data: {
                email: data.email,
                password: hashedPassword,
                name: data.name,
                shopId: data.shopId,
                status: data.status || 'active',
                role: 'SHOP_ADMIN',
            },
        });
        this.notifications.notifySuperAdmins('admin_created', user);
        await this.prisma.notification.create({
            data: {
                title: 'Nouvel Administrateur',
                message: `L'administrateur "${user.name}" a été ajouté.`,
                type: 'system',
            }
        });
        return user;
    }
    async updateUser(id, data) {
        if (data.email) {
            const existing = await this.prisma.user.findFirst({ where: { email: data.email, id: { not: id } } });
            if (existing)
                throw new common_1.ConflictException('Email déjà utilisé');
        }
        const updateData = {
            name: data.name,
            email: data.email,
            phone: data.phone,
            avatar: data.avatar,
            shopId: data.shopId,
            status: data.status,
        };
        if (data.password && data.password.trim() !== "") {
            updateData.password = await bcrypt.hash(data.password, 10);
        }
        return this.prisma.user.update({
            where: { id },
            data: updateData,
        });
    }
    async toggleUserStatus(id) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user)
            throw new common_1.BadRequestException('Utilisateur introuvable');
        return this.prisma.user.update({
            where: { id },
            data: { status: user.status === 'active' ? 'inactive' : 'active' },
        });
    }
    async deleteUser(id) {
        return this.prisma.user.delete({ where: { id } });
    }
    async getMe(id) {
        return this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                shopId: true,
                status: true,
                phone: true,
                avatar: true,
            }
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        notifications_gateway_1.NotificationsGateway])
], AuthService);
//# sourceMappingURL=auth.service.js.map