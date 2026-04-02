import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DiscountsService } from './discounts.service';
import { CreateDiscountDto, UpdateDiscountDto } from './dto/discount.dto';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { SubscriptionGuard } from '../auth/subscription.guard';

@Controller('discounts')
export class DiscountsController {
  constructor(private readonly discountsService: DiscountsService) {}

  // ── Public / Validation ────────────────────────────────────
  @Get('shop/:shopId/validate')
  async validateCode(
    @Param('shopId') shopId: string,
    @Query('code') code: string,
    @Query('total') total: string,
  ) {
    const cartTotal = parseFloat(total) || 0;
    return this.discountsService.validateCode(shopId, code, cartTotal);
  }

  // ── Shop Admin ──────────────────────────────────────────────
  @UseGuards(AuthGuard('jwt'), RolesGuard, SubscriptionGuard)
  @Roles('SHOP_ADMIN')
  @Get()
  findByShop(@Request() req: any) {
    return this.discountsService.findByShop(req.user.shopId);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard, SubscriptionGuard)
  @Roles('SHOP_ADMIN')
  @Post()
  create(@Request() req: any, @Body() createDiscountDto: CreateDiscountDto) {
    return this.discountsService.create(req.user.shopId, createDiscountDto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard, SubscriptionGuard)
  @Roles('SHOP_ADMIN')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Request() req: any,
    @Body() updateDiscountDto: UpdateDiscountDto,
  ) {
    return this.discountsService.update(id, req.user.shopId, updateDiscountDto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard, SubscriptionGuard)
  @Roles('SHOP_ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.discountsService.remove(id, req.user.shopId);
  }
}
