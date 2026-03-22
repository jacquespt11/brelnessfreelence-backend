import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
export declare class ProductsService {
    private prisma;
    constructor(prisma: PrismaService);
    findByShop(shopId: string, search?: string): Promise<{
        description: string | null;
        name: string;
        price: number;
        stock: number;
        images: string[];
        id: string;
        shopId: string;
        status: string;
        tags: string[];
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        shop: {
            description: string | null;
            name: string;
            id: string;
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
            email: string | null;
            phone: string | null;
            address: string | null;
            facebook: string | null;
            instagram: string | null;
            twitter: string | null;
            tiktok: string | null;
        };
    } & {
        description: string | null;
        name: string;
        price: number;
        stock: number;
        images: string[];
        id: string;
        shopId: string;
        status: string;
        tags: string[];
        createdAt: Date;
        updatedAt: Date;
    }>;
    create(shopId: string, dto: CreateProductDto): Promise<{
        description: string | null;
        name: string;
        price: number;
        stock: number;
        images: string[];
        id: string;
        shopId: string;
        status: string;
        tags: string[];
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, shopId: string, dto: UpdateProductDto): Promise<{
        description: string | null;
        name: string;
        price: number;
        stock: number;
        images: string[];
        id: string;
        shopId: string;
        status: string;
        tags: string[];
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string, shopId: string): Promise<{
        description: string | null;
        name: string;
        price: number;
        stock: number;
        images: string[];
        id: string;
        shopId: string;
        status: string;
        tags: string[];
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(search?: string): Promise<({
        shop: {
            name: string;
            id: string;
            slug: string;
        };
    } & {
        description: string | null;
        name: string;
        price: number;
        stock: number;
        images: string[];
        id: string;
        shopId: string;
        status: string;
        tags: string[];
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    adminUpdate(id: string, dto: UpdateProductDto): Promise<{
        description: string | null;
        name: string;
        price: number;
        stock: number;
        images: string[];
        id: string;
        shopId: string;
        status: string;
        tags: string[];
        createdAt: Date;
        updatedAt: Date;
    }>;
    adminRemove(id: string): Promise<{
        description: string | null;
        name: string;
        price: number;
        stock: number;
        images: string[];
        id: string;
        shopId: string;
        status: string;
        tags: string[];
        createdAt: Date;
        updatedAt: Date;
    }>;
}
