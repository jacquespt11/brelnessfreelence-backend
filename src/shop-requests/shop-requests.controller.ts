import { Controller, Post, Body, Get, Patch, Param, UseGuards } from '@nestjs/common';
import { ShopRequestsService } from './shop-requests.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Role } from '@prisma/client';

@ApiTags('shop-requests')
@Controller('shop-requests')
export class ShopRequestsController {
  constructor(private readonly shopRequestsService: ShopRequestsService) {}

  @ApiOperation({ summary: 'Soumettre une demande de création de boutique (Public)' })
  @Post()
  create(@Body() body: { name: string; email: string; phone?: string; businessName: string; details?: string }) {
    return this.shopRequestsService.create(body);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Lister toutes les demandes (Super Admin)' })
  @Get()
  findAll() {
    return this.shopRequestsService.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Mettre à jour le statut dune demande (Super Admin)' })
  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.shopRequestsService.updateStatus(id, body.status);
  }
}
