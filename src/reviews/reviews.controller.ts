import { Controller, Get, Patch, Param, UseGuards, Request } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('SHOP_ADMIN')
  @Get('shop')
  getShopReviews(@Request() req: any) {
    return this.reviewsService.findAllByShop(req.user.shopId);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('SHOP_ADMIN')
  @Patch(':id/toggle-status')
  toggleStatus(@Param('id') id: string) {
    return this.reviewsService.toggleStatus(id);
  }
}
