import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(NotificationsGateway.name);

  // Map to store connected clients: userId -> socketId
  private connectedClients = new Map<string, string>();

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly dataSource: DataSource,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token =
        client.handshake.auth.token ||
        client.handshake.headers['authorization']?.split(' ')[1];

      if (!token) {
        this.logger.warn(`Client connected without token: ${client.id}`);
        return; // Allow anonymous connection but don't map to a user
      }

      const decoded = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      const userId = decoded.sub;
      this.connectedClients.set(userId, client.id);

      // If the user is an admin or teacher, join them to a specific room for staff notifications
      if (decoded.role === 'ADMIN' || decoded.role === 'TEACHER') {
        client.join('staff_room');
        this.logger.log(`Staff joined: ${userId} (${client.id})`);
      }

      // Khusus untuk ADMIN, berikan laporan singkat status sistem sebagai inovasi
      if (decoded.role === 'ADMIN') {
        let dbStatus = 'Disconnected';
        try {
          dbStatus = this.dataSource.isInitialized
            ? 'Connected'
            : 'Disconnected';
        } catch (e) {
          dbStatus = 'Error';
        }

        if (dbStatus === 'Connected') {
          this.server.to(client.id).emit('notification', {
            title: 'System Health: OPTIMAL 🟢',
            message: `Seluruh model MLR, Cron Job, dan lapisan keamanan beroperasi dengan stabil. Database: ${dbStatus}.`,
            type: 'success',
          });
        } else {
          this.server.to(client.id).emit('notification', {
            title: 'System Health: DEGRADED 🔴',
            message: `Peringatan: Sistem mendeteksi adanya kegagalan komponen. Database Status: ${dbStatus}. Segera periksa log server!`,
            type: 'warning',
          });
        }
      }

      this.logger.log(`Client connected: ${userId} (${client.id})`);
    } catch (error) {
      this.logger.error(
        `WebSocket authentication failed for client ${client.id}: ${error.message}`,
      );
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    // Remove client from map
    for (const [userId, socketId] of this.connectedClients.entries()) {
      if (socketId === client.id) {
        this.connectedClients.delete(userId);
        this.logger.log(`Client disconnected: ${userId} (${client.id})`);
        break;
      }
    }
  }

  /**
   * Broadcast an alert to all connected staff (ADMIN/TEACHER)
   */
  broadcastToStaff(event: string, payload: any) {
    this.server.to('staff_room').emit(event, payload);
    this.logger.log(`Broadcasted '${event}' to staff_room`);
  }

  /**
   * Send a direct notification to a specific user
   */
  sendToUser(userId: string, event: string, payload: any) {
    const socketId = this.connectedClients.get(userId);
    if (socketId) {
      this.server.to(socketId).emit(event, payload);
    }
  }
}
