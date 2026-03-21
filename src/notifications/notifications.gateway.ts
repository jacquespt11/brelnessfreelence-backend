import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*', // En production, restreindre aux domaines de la plateforme
  },
})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token || client.handshake.headers['authorization'];
      if (!token) throw new Error('No token provided');

      const payload = this.jwtService.verify(token.replace('Bearer ', ''));
      
      // On connection, join a room based on the user's role or shopId
      if (payload.role === 'SUPER_ADMIN') {
        client.join('super_admins');
      } else if (payload.role === 'SHOP_ADMIN' && payload.shopId) {
        client.join(`shop_${payload.shopId}`);
      }
      
      console.log(`Client connected: ${client.id} (User: ${payload.email})`);
    } catch (error) {
      console.error('Socket connection error:', error.message);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  // --- Utility methods to be called from other services ---

  notifyShopAdmin(shopId: string, event: string, data: any) {
    this.server.to(`shop_${shopId}`).emit(event, data);
  }

  notifySuperAdmins(event: string, data: any) {
    this.server.to('super_admins').emit(event, data);
  }

  // Exemple d'écoute d'un message client
  @SubscribeMessage('ping')
  handlePing(client: Socket, payload: any): string {
    return 'pong';
  }
}
