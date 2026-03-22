import { ReservationsService } from './reservations.service';
import { CreateReservationDto, UpdateReservationStatusDto } from './dto/reservation.dto';
export declare class ReservationsController {
    private reservationsService;
    constructor(reservationsService: ReservationsService);
    create(shopId: string, dto: CreateReservationDto): Promise<{
        id: string;
        shopId: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        productId: string;
        customerName: string;
        customerPhone: string | null;
        customerEmail: string | null;
        quantity: number;
    }>;
    findMyShopReservations(req: any): Promise<({
        product: {
            name: string;
            price: number;
            images: string[];
        };
    } & {
        id: string;
        shopId: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        productId: string;
        customerName: string;
        customerPhone: string | null;
        customerEmail: string | null;
        quantity: number;
    })[]>;
    findMyShopCustomers(req: any): Promise<any[]>;
    updateStatus(id: string, req: any, dto: UpdateReservationStatusDto): Promise<{
        id: string;
        shopId: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        productId: string;
        customerName: string;
        customerPhone: string | null;
        customerEmail: string | null;
        quantity: number;
    }>;
    remove(id: string, req: any): Promise<{
        id: string;
        shopId: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        productId: string;
        customerName: string;
        customerPhone: string | null;
        customerEmail: string | null;
        quantity: number;
    }>;
    findAllGlobal(): Promise<({
        shop: {
            name: string;
            slug: string;
        };
        product: {
            name: string;
        };
    } & {
        id: string;
        shopId: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        productId: string;
        customerName: string;
        customerPhone: string | null;
        customerEmail: string | null;
        quantity: number;
    })[]>;
}
