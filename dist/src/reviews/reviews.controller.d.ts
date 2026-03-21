import { ReviewsService } from './reviews.service';
export declare class ReviewsController {
    private readonly reviewsService;
    constructor(reviewsService: ReviewsService);
    getShopReviews(req: any): Promise<({
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
