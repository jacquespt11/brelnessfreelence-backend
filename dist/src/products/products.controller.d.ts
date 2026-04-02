import { ProductsService } from './products.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
export declare class ProductsController {
    private productsService;
    private cloudinaryService;
    constructor(productsService: ProductsService, cloudinaryService: CloudinaryService);
    findByShop(shopId: string, search?: string): Promise<({
        variants: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            price: number | null;
            stock: number;
        }[];
    } & {
        id: string;
        name: string;
        shopId: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        category: string | null;
        description: string | null;
        tags: string[];
        price: number;
        stock: number;
        images: string[];
        isService: boolean;
        durationMin: number | null;
        views: number;
    })[]>;
    findOne(id: string): Promise<{
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
        };
        variants: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            price: number | null;
            stock: number;
        }[];
    } & {
        id: string;
        name: string;
        shopId: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        category: string | null;
        description: string | null;
        tags: string[];
        price: number;
        stock: number;
        images: string[];
        isService: boolean;
        durationMin: number | null;
        views: number;
    }>;
    create(req: any, dto: CreateProductDto): Promise<{
        variants: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            price: number | null;
            stock: number;
        }[];
    } & {
        id: string;
        name: string;
        shopId: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        category: string | null;
        description: string | null;
        tags: string[];
        price: number;
        stock: number;
        images: string[];
        isService: boolean;
        durationMin: number | null;
        views: number;
    }>;
    update(id: string, req: any, dto: UpdateProductDto): Promise<{
        variants: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            price: number | null;
            stock: number;
        }[];
    } & {
        id: string;
        name: string;
        shopId: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        category: string | null;
        description: string | null;
        tags: string[];
        price: number;
        stock: number;
        images: string[];
        isService: boolean;
        durationMin: number | null;
        views: number;
    }>;
    remove(id: string, req: any): Promise<{
        id: string;
        name: string;
        shopId: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        category: string | null;
        description: string | null;
        tags: string[];
        price: number;
        stock: number;
        images: string[];
        isService: boolean;
        durationMin: number | null;
        views: number;
    }>;
    uploadImage(id: string, req: any, authReq: any): Promise<{
        variants: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            price: number | null;
            stock: number;
        }[];
    } & {
        id: string;
        name: string;
        shopId: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        category: string | null;
        description: string | null;
        tags: string[];
        price: number;
        stock: number;
        images: string[];
        isService: boolean;
        durationMin: number | null;
        views: number;
    }>;
    findAll(search?: string): Promise<({
        shop: {
            id: string;
            name: string;
            slug: string;
        };
        variants: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            price: number | null;
            stock: number;
        }[];
    } & {
        id: string;
        name: string;
        shopId: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        category: string | null;
        description: string | null;
        tags: string[];
        price: number;
        stock: number;
        images: string[];
        isService: boolean;
        durationMin: number | null;
        views: number;
    })[]>;
    adminUpdate(id: string, dto: UpdateProductDto): Promise<{
        id: string;
        name: string;
        shopId: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        category: string | null;
        description: string | null;
        tags: string[];
        price: number;
        stock: number;
        images: string[];
        isService: boolean;
        durationMin: number | null;
        views: number;
    }>;
    adminRemove(id: string): Promise<{
        id: string;
        name: string;
        shopId: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        category: string | null;
        description: string | null;
        tags: string[];
        price: number;
        stock: number;
        images: string[];
        isService: boolean;
        durationMin: number | null;
        views: number;
    }>;
}
