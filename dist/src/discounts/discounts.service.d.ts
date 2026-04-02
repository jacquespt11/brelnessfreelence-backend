import { PrismaService } from '../prisma/prisma.service';
import { CreateDiscountDto, UpdateDiscountDto } from './dto/discount.dto';
export declare class DiscountsService {
    private prisma;
    constructor(prisma: PrismaService);
    validateCode(shopId: string, code: string, cartTotal: number): Promise<any>;
    findByShop(shopId: string): Promise<any>;
    create(shopId: string, dto: CreateDiscountDto): Promise<any>;
    update(id: string, shopId: string, dto: UpdateDiscountDto): Promise<any>;
    remove(id: string, shopId: string): Promise<any>;
    incrementUsedCount(id: string): Promise<any>;
}
