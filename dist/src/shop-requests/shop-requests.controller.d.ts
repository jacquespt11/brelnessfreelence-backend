import { ShopRequestsService } from './shop-requests.service';
export declare class ShopRequestsController {
    private readonly shopRequestsService;
    constructor(shopRequestsService: ShopRequestsService);
    create(body: {
        name: string;
        email: string;
        phone?: string;
        businessName: string;
        details?: string;
    }): Promise<{
        id: string;
        email: string;
        name: string;
        phone: string | null;
        status: string;
        createdAt: Date;
        businessName: string;
        details: string | null;
    }>;
    findAll(): Promise<{
        id: string;
        email: string;
        name: string;
        phone: string | null;
        status: string;
        createdAt: Date;
        businessName: string;
        details: string | null;
    }[]>;
    updateStatus(id: string, body: {
        status: string;
    }): Promise<{
        id: string;
        email: string;
        name: string;
        phone: string | null;
        status: string;
        createdAt: Date;
        businessName: string;
        details: string | null;
    }>;
}
