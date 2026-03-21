import { ReservationsService } from './reservations.service';
import { CreateReservationDto, UpdateReservationStatusDto } from './dto/reservation.dto';
export declare class ReservationsController {
    private reservationsService;
    constructor(reservationsService: ReservationsService);
    create(shopId: string, dto: CreateReservationDto): Promise<{
        productId: string;
        customerName: string;
        quantity: number;
        status: string;
        id: string;
        shopId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findMyShopReservations(req: any): Promise<({
        product: {
            name: string;
            price: number;
            images: string[];
        };
    } & {
        productId: string;
        customerName: string;
        quantity: number;
        status: string;
        id: string;
        shopId: string;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    updateStatus(id: string, req: any, dto: UpdateReservationStatusDto): Promise<{
        productId: string;
        customerName: string;
        quantity: number;
        status: string;
        id: string;
        shopId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string, req: any): Promise<{
        productId: string;
        customerName: string;
        quantity: number;
        status: string;
        id: string;
        shopId: string;
        createdAt: Date;
        updatedAt: Date;
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
        productId: string;
        customerName: string;
        quantity: number;
        status: string;
        id: string;
        shopId: string;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
}
