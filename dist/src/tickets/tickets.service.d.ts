import { PrismaService } from '../prisma/prisma.service';
import { CreateTicketDto, UpdateTicketStatusDto } from './dto/ticket.dto';
export declare class TicketsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(shopId: string, dto: CreateTicketDto): Promise<{
        id: string;
        shopId: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        type: string;
        subject: string;
    }>;
    findByShop(shopId: string): Promise<{
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
