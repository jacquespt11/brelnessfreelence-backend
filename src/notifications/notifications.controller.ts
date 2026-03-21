import { Controller, Get, Patch, Param, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { NotificationsService } from './notifications.service';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly service: NotificationsService) {}
  
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all notifications for the current user' })
  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll(@Request() req: any) {
     return this.service.findAll(req.user);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mark all notifications as read' })
  @UseGuards(AuthGuard('jwt'))
  @Patch('read-all')
  markAllAsRead(@Request() req: any) {
    return this.service.markAllAsRead(req.user);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mark a specific notification as read' })
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id/read')
  markAsRead(@Param('id') id: string) {
     return this.service.markAsRead(id);
  }
}
