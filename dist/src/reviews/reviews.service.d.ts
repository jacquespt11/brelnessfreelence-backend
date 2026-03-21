import { PrismaService } from '../prisma/prisma.service';
export declare class ReviewsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAllByShop(shopId: string): Promise<({
        product: {
            id: string;
            name: string;
            shopId: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            tags: string[];
            price: number;
            stock: number;
            images: string[];
        } | null;
    } & {
        id: string;
        shopId: string;
        status: string;
        createdAt: Date;
        productId: string | null;
        customerName: string;
        rating: number;
        comment: string | null;
    })[]>;
    toggleStatus(id: string): Promise<{
        id: string;
        shopId: string;
        status: string;
        createdAt: Date;
        productId: string | null;
        customerName: string;
        rating: number;
        comment: string | null;
    }>;
}
