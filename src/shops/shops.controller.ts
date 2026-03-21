import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ShopsService } from './shops.service';
import { CreateShopDto, UpdateShopDto } from './dto/shop.dto';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('shops')
@Controller('shops')
export class ShopsController {
  constructor(private shopsService: ShopsService) {}

  // ── Public ───────────────────────────────────────────
  @ApiOperation({ summary: 'Get shop by slug (public, for subdomain routing)' })
  @Get('by-slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.shopsService.findBySlug(slug);
  }

  // ── Super Admin ──────────────────────────────────────
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all shops (SUPER_ADMIN)' })
  @ApiQuery({ name: 'search', required: false })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('SUPER_ADMIN')
  @Get()
  findAll(@Query('search') search?: string) {
    return this.shopsService.findAll(search);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get one shop by ID (SUPER_ADMIN)' })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('SUPER_ADMIN')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shopsService.findOne(id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a shop (SUPER_ADMIN)' })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('SUPER_ADMIN')
  @Post()
  create(@Body() dto: CreateShopDto) {
    return this.shopsService.create(dto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a shop (SUPER_ADMIN)' })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('SUPER_ADMIN')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateShopDto) {
    return this.shopsService.update(id, dto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Toggle shop status (SUPER_ADMIN)' })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('SUPER_ADMIN')
  @Patch(':id/toggle-status')
  toggleStatus(@Param('id') id: string) {
    return this.shopsService.toggleStatus(id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a shop (SUPER_ADMIN)' })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('SUPER_ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.shopsService.remove(id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Renew a shop license (SUPER_ADMIN)' })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('SUPER_ADMIN')
  @Post(':id/license/renew')
  renewLicense(@Param('id') id: string, @Body() body: any) {
    return this.shopsService.renewLicense(id, body.type, body.days);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel a shop license (SUPER_ADMIN)' })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('SUPER_ADMIN')
  @Post(':id/license/cancel')
  cancelLicense(@Param('id') id: string) {
    return this.shopsService.cancelLicense(id);
  }

  // ── Shop Admin ───────────────────────────────────────
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my shop (SHOP_ADMIN)' })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('SHOP_ADMIN')
  @Get('me/shop')
  getMyShop(@Request() req: any) {
    return this.shopsService.findMyShop(req.user.shopId);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update my shop (SHOP_ADMIN)' })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('SHOP_ADMIN')
  @Patch('me/shop')
  updateMyShop(@Request() req: any, @Body() dto: UpdateShopDto) {
    return this.shopsService.updateMyShop(req.user.shopId, dto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get shop analytics (SHOP_ADMIN)' })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('SHOP_ADMIN')
  @Get('me/analytics')
  getAnalytics(@Request() req: any, @Query('period') period?: string) {
    return this.shopsService.getAnalytics(req.user.shopId, period);
  }
}
