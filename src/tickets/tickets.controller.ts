import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { TicketsService } from './tickets.service';
import { CreateTicketDto, UpdateTicketStatusDto } from './dto/ticket.dto';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('SHOP_ADMIN')
  @Post()
  create(@Request() req: any, @Body() dto: CreateTicketDto) {
    return this.ticketsService.create(req.user.shopId, dto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('SHOP_ADMIN')
  @Get('me')
  findMyShopTickets(@Request() req: any) {
    return this.ticketsService.findByShop(req.user.shopId);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('SUPER_ADMIN')
  @Get('admin/all')
  findAllGlobal() {
    return this.ticketsService.findAllGlobal();
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('SUPER_ADMIN')
  @Patch('admin/:id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateTicketStatusDto) {
    return this.ticketsService.updateStatus(id, dto);
  }
}
