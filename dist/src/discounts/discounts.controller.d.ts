import { DiscountsService } from './discounts.service';
import { CreateDiscountDto, UpdateDiscountDto } from './dto/discount.dto';
export declare class DiscountsController {
    private readonly discountsService;
    constructor(discountsService: DiscountsService);
    validateCode(shopId: string, code: string, total: string): Promise<any>;
    findByShop(req: any): Promise<any>;
    create(req: any, createDiscountDto: CreateDiscountDto): Promise<any>;
    update(id: string, req: any, updateDiscountDto: UpdateDiscountDto): Promise<any>;
    remove(id: string, req: any): Promise<any>;
}
