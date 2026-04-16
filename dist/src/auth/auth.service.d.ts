import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';
import { EmessService } from '../emess/emess.service';
export declare class AuthService {
    private prisma;
    private jwtService;
    private notifications;
    private emessService;
    constructor(prisma: PrismaService, jwtService: JwtService, notifications: NotificationsGateway, emessService: EmessService);
    register(email: string, password: string, name: string): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            name: any;
            role: any;
            shopId: any;
        };
    }>;
    login(email: string, password: string): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            name: any;
            role: any;
            shopId: any;
        };
    }>;
    issueToken(user: any): {
        access_token: string;
        user: {
            id: any;
            email: any;
            name: any;
            role: any;
            shopId: any;
        };
    };
    loginOrCreateGoogleUser(email: string, profile: any): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            name: any;
            role: any;
            shopId: any;
        };
    }>;
    findAll(): Promise<({
        shop: {
            id: string;
            email: string | null;
            name: string;
            phone: string | null;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            category: string;
            businessType: string;
            logo: string | null;
            banner: string | null;
            heroTitle: string | null;
            heroImages: string[];
            description: string | null;
            address: string | null;
            facebook: string | null;
            instagram: string | null;
            twitter: string | null;
            tiktok: string | null;
            isManualOverride: boolean;
        } | null;
    } & {
        id: string;
        email: string;
        password: string;
        name: string;
        phone: string | null;
        avatar: string | null;
        role: import("@prisma/client").$Enums.Role;
        shopId: string | null;
        status: string;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    createUser(data: {
        name: string;
        email: string;
        password?: string;
        shopId?: string;
        status?: string;
        phone?: string;
    }): Promise<{
        id: string;
        email: string;
        password: string;
        name: string;
        phone: string | null;
        avatar: string | null;
        role: import("@prisma/client").$Enums.Role;
        shopId: string | null;
        status: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateUser(id: string, data: {
        name?: string;
        email?: string;
        shopId?: string;
        status?: string;
        password?: string;
    }): Promise<{
        id: string;
        email: string;
        password: string;
        name: string;
        phone: string | null;
        avatar: string | null;
        role: import("@prisma/client").$Enums.Role;
        shopId: string | null;
        status: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    toggleUserStatus(id: string): Promise<{
        id: string;
        email: string;
        password: string;
        name: string;
        phone: string | null;
        avatar: string | null;
        role: import("@prisma/client").$Enums.Role;
        shopId: string | null;
        status: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteUser(id: string): Promise<{
        id: string;
        email: string;
        password: string;
        name: string;
        phone: string | null;
        avatar: string | null;
        role: import("@prisma/client").$Enums.Role;
        shopId: string | null;
        status: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getMe(id: string): Promise<{
        id: string;
        email: string;
        name: string;
        phone: string | null;
        avatar: string | null;
        role: import("@prisma/client").$Enums.Role;
        shopId: string | null;
        status: string;
    } | null>;
}
