import { AuthService } from './auth.service';
declare class LoginDto {
    email: string;
    password: string;
}
declare class RegisterDto {
    email: string;
    password: string;
    name: string;
}
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(body: LoginDto): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            name: any;
            role: any;
            shopId: any;
        };
    }>;
    register(body: RegisterDto): Promise<{
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
    createUser(body: any): Promise<{
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
    updateUser(id: string, body: any): Promise<{
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
    getMe(req: any): Promise<{
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
export {};
