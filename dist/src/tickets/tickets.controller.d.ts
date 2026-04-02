import { TicketsService } from './tickets.service';
import { CreateTicketDto, UpdateTicketStatusDto } from './dto/ticket.dto';
export declare class TicketsController {
    private readonly ticketsService;
    constructor(ticketsService: TicketsService);
    create(req: any, dto: CreateTicketDto): Promise<{
        id: string;
        shopId: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        type: string;
        subject: string;
    }>;
    findMyShopTickets(req: any): Promise<{
        id: string;
        shopId: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        type: string;
        subject: string;
    }[]>;
    findAllGlobal(): Promise<({
        shop: {
            id: string;
            email: string | null;
            name: string;
            phone: string | null;
            slug: string;
        };
    } & {
        id: string;
        shopId: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        type: string;
        subject: string;
    })[]>;
    updateStatus(id: string, dto: UpdateTicketStatusDto): Promise<{
        id: string;
        shopId: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        type: string;
        subject: string;
    }>;
}
