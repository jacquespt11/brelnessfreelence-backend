import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto, UpdateReservationStatusDto } from './dto/reservation.dto';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('reservations')
@Controller('reservations')
export class ReservationsController {
  constructor(private reservationsService: ReservationsService) {}

  // ── Public (Customer making a booking) ─────────────────────
  @ApiOperation({ summary: 'Create a reservation (public)' })
  @Post('shop/:shopId')
  create(@Param('shopId') shopId: string, @Body() dto: CreateReservationDto) {
    return this.reservationsService.create(shopId, dto);
  }

  // ── Shop Admin ─────────────────────────────────────────────
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get incoming reservations (SHOP_ADMIN)' })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('SHOP_ADMIN')
  @Get('me')
  findMyShopReservations(@Request() req: any) {
    return this.reservationsService.findByShop(req.user.shopId);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update reservation status (SHOP_ADMIN)' })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('SHOP_ADMIN')
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Request() req: any,
    @Body() dto: UpdateReservationStatusDto,
  ) {
    return this.reservationsService.updateStatus(id, req.user.shopId, dto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete reservation (SHOP_ADMIN)' })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('SHOP_ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.reservationsService.remove(id, req.user.shopId);
  }

  // ── Super Admin ────────────────────────────────────────────
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List ALL reservations globally (SUPER_ADMIN)' })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('SUPER_ADMIN')
  @Get('admin/all')
  findAllGlobal() {
    return this.reservationsService.findAllGlobal();
  }
}
