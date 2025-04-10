import { Injectable, Logger, UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { WsAuthGuard } from '../auth/guards/ws-auth.guard';
import { JwtService } from '@nestjs/jwt';

interface ProtectedEventData {
  type: string;
  payload: Record<string, unknown>;
}

@Injectable()
@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000', 'http://localhost'],
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
})
export class SocketProvider
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(SocketProvider.name);

  @WebSocketServer()
  server: Server;

  private connectedClients: Map<string, Socket> = new Map();
  private authenticatedClients: Set<string> = new Set();

  constructor(private readonly jwtService: JwtService) {
    this.logger.log('SocketProvider initialized');
  }

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway initialized');
    this.logger.log(`Server instance available: ${!!server}`);

    // Add error handling
    server.on('error', (err) => {
      this.logger.error('Socket server error:', err);
    });

    // Log when server starts listening
    server.on('listening', () => {
      this.logger.log('Socket server is listening');
    });
  }

  async handleConnection(client: Socket) {
    try {
      this.logger.log('New connection attempt...');
      this.logger.debug('Client handshake:', client.handshake);

      // Try to authenticate the client on connection
      const token = this.extractTokenFromHeader(client);
      if (token) {
        try {
          const payload = await this.jwtService.verifyAsync(token);
          client['user'] = payload;
          this.authenticatedClients.add(client.id);
          this.logger.log(`Client ${client.id} authenticated successfully`);
        } catch (authError) {
          this.logger.warn(
            `Invalid token from client ${client.id}: ${authError.message}`,
          );
        }
      }

      // Store client connection
      this.connectedClients.set(client.id, client);

      client.emit('connection', {
        status: 'connected',
        message: 'WebSocket connection established!',
        clientId: client.id,
        authenticated: this.authenticatedClients.has(client.id),
      });

      this.logger.log(`Client connected with id: ${client.id}`);
      this.logger.log(`Total connected clients: ${this.connectedClients.size}`);
      this.logger.log(
        `Total authenticated clients: ${this.authenticatedClients.size}`,
      );
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Connection error: ${errorMessage}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.connectedClients.delete(client.id);
    this.authenticatedClients.delete(client.id);
    this.logger.log(
      `Remaining connected clients: ${this.connectedClients.size}`,
    );
    this.logger.log(
      `Remaining authenticated clients: ${this.authenticatedClients.size}`,
    );
  }

  // Public endpoint - no auth required
  @SubscribeMessage('ping')
  handlePing(client: Socket) {
    this.logger.log(`Received ping from client: ${client.id}`);
    client.emit('pong', {
      status: 'ok',
      message: 'WebSocket is working!',
      timestamp: new Date().toISOString(),
      authenticated: this.authenticatedClients.has(client.id),
    });
  }

  // Protected endpoint - requires authentication
  @UseGuards(WsAuthGuard)
  @SubscribeMessage('protected-event')
  handleProtectedEvent(
    client: Socket,
    @MessageBody() data: ProtectedEventData,
  ) {
    const user = client['user'];
    this.logger.log(`Received protected event from user: ${user.id}`);

    client.emit('protected-response', {
      status: 'success',
      message: 'Protected event handled',
      user: user,
      data: data,
    });
  }

  private extractTokenFromHeader(client: Socket): string | undefined {
    const authToken = client.handshake?.auth?.token;
    if (authToken) return authToken;

    const authHeader = client.handshake?.headers?.authorization;
    if (!authHeader) return undefined;

    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : undefined;
  }

  // Utility method to get all connected clients
  getConnectedClients(): string[] {
    return Array.from(this.connectedClients.keys());
  }

  // Utility method to get all authenticated clients
  getAuthenticatedClients(): string[] {
    return Array.from(this.authenticatedClients);
  }

  // Utility method to emit to all clients
  emitToAll(event: string, payload: unknown): void {
    this.server.emit(event, payload);
  }

  // Utility method to emit to specific client
  emitToClient(clientId: string, event: string, payload: unknown): void {
    const client = this.connectedClients.get(clientId);
    if (client) {
      client.emit(event, payload);
    }
  }

  // Emit only to authenticated clients
  emitToAuthenticated(event: string, payload: unknown): void {
    this.authenticatedClients.forEach((clientId) => {
      const client = this.connectedClients.get(clientId);
      if (client) {
        client.emit(event, payload);
      }
    });
  }

  // Check if a client is authenticated
  isAuthenticated(clientId: string): boolean {
    return this.authenticatedClients.has(clientId);
  }
}
