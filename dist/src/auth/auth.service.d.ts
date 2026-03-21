import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
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
    private issueToken;
    findAll(): Promise<({
        shop: {
            id: string;
            email: string | null;
            name: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            category: string;
            businessType: string;
            logo: string | null;
            banner: string | null;
            description: string | null;
            phone: string | null;
            address: string | null;
            facebook: string | null;
            instagram: string | null;
            twitter: string | null;
            tiktok: string | null;
        } | null;
    } & {
        id: string;
        email: string;
        password: string;
        name: string;
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
    }): Promise<{
        id: string;
        email: string;
        password: string;
        name: string;
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
        role: import("@prisma/client").$Enums.Role;
        shopId: string | null;
        status: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
