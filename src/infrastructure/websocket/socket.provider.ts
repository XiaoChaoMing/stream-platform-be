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
import { RedisCacheService } from '../cache/redis-cache.service';

interface ProtectedEventData {
  type: string;
  payload: Record<string, unknown>;
}

interface UserConnection {
  userId: string;
  socketId: string;
  authenticated: boolean;
  connectedAt: string;
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
  private readonly SOCKET_USER_KEY = 'socket:user:';  // For storing user -> socket mapping
  private readonly SOCKET_CONNECTIONS_KEY = 'socket:connections';  // For storing all active connections

  @WebSocketServer()
  server: Server;

  constructor(
    private readonly jwtService: JwtService,
    private readonly redisCacheService: RedisCacheService,
  ) {
    this.logger.log('SocketProvider initialized');
  }

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway initialized');
    this.logger.log(`Server instance available: ${!!server}`);

    server.on('error', (err) => {
      this.logger.error('Socket server error:', err);
    });

    server.on('listening', () => {
      this.logger.log('Socket server is listening');
    });
  }

  async handleConnection(client: Socket) {
    try {
      this.logger.log('New connection attempt...');
      this.logger.debug('Client handshake:', client.handshake);

      let userId: string | undefined;
      let authenticated = false;

      // Try to authenticate the client on connection
      const token = this.extractTokenFromHeader(client);
      if (token) {
        try {
          const payload = await this.jwtService.verifyAsync(token);
          client['user'] = payload;
          userId = payload.sub;
          authenticated = true;
          this.logger.log(`Client ${client.id} authenticated as user ${userId}`);
        } catch (authError) {
          this.logger.warn(
            `Invalid token from client ${client.id}: ${authError.message}`,
          );
        }
      }

      // Store connection info in Redis
      const connectionInfo: UserConnection = {
        userId: userId || 'anonymous',
        socketId: client.id,
        authenticated,
        connectedAt: new Date().toISOString(),
      };

      // Store individual connection
      await this.redisCacheService.set(
        `${this.SOCKET_USER_KEY}${client.id}`,
        connectionInfo,
      );

      // Add to connections set
      const connections = await this.getActiveConnections();
      connections.push(connectionInfo);
      await this.redisCacheService.set(this.SOCKET_CONNECTIONS_KEY, connections);

      // If authenticated, store user's socket mapping
      if (userId) {
        await this.redisCacheService.set(
          `${this.SOCKET_USER_KEY}${userId}`,
          client.id,
        );
      }

      client.emit('connection', {
        status: 'connected',
        message: 'WebSocket connection established!',
        clientId: client.id,
        authenticated,
      });

      this.logger.log(`Client connected with id: ${client.id}`);
      const activeConnections = await this.getActiveConnections();
      this.logger.log(`Total connected clients: ${activeConnections.length}`);
      this.logger.log(
        `Total authenticated clients: ${
          activeConnections.filter((conn) => conn.authenticated).length
        }`,
      );
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Connection error: ${errorMessage}`);
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    try {
      this.logger.log(`Client disconnecting: ${client.id}`);

      // Remove individual connection info
      await this.redisCacheService.delete(`${this.SOCKET_USER_KEY}${client.id}`);

      // Remove from connections set
      const connections = await this.getActiveConnections();
      const updatedConnections = connections.filter(
        (conn) => conn.socketId !== client.id,
      );
      await this.redisCacheService.set(
        this.SOCKET_CONNECTIONS_KEY,
        updatedConnections,
      );

      // If user was authenticated, remove user socket mapping
      if (client['user']?.id) {
        await this.redisCacheService.delete(
          `${this.SOCKET_USER_KEY}${client['user'].id}`,
        );
      }

      this.logger.log(`Client disconnected: ${client.id}`);
      this.logger.log(`Remaining connected clients: ${updatedConnections.length}`);
      this.logger.log(
        `Remaining authenticated clients: ${
          updatedConnections.filter((conn) => conn.authenticated).length
        }`,
      );
    } catch (error) {
      this.logger.error(`Error during disconnect: ${error.message}`);
    }
  }

  @SubscribeMessage('ping')
  handlePing(client: Socket) {
    this.logger.log(`Received ping from client: ${client.id}`);
    client.emit('pong', {
      status: 'ok',
      message: 'WebSocket is working!',
      timestamp: new Date().toISOString(),
      authenticated: client['user']?.id ? true : false,
    });
  }

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

  private async getActiveConnections(): Promise<UserConnection[]> {
    const connections = await this.redisCacheService.get<UserConnection[]>(
      this.SOCKET_CONNECTIONS_KEY,
    );
    return connections || [];
  }

  async getConnectedClients(): Promise<string[]> {
    const connections = await this.getActiveConnections();
    return connections.map((conn) => conn.socketId);
  }

  async getAuthenticatedClients(): Promise<string[]> {
    const connections = await this.getActiveConnections();
    return connections
      .filter((conn) => conn.authenticated)
      .map((conn) => conn.socketId);
  }

  async emitToAll(event: string, payload: unknown): Promise<void> {
    this.server.emit(event, payload);
  }

  async emitToClient(clientId: string, event: string, payload: unknown): Promise<void> {
    const client = this.server.sockets.sockets.get(clientId);
    if (client) {
      client.emit(event, payload);
    }
  }

  async emitToUser(userId: string, event: string, payload: unknown): Promise<void> {
    const socketId = await this.redisCacheService.get<string>(
      `${this.SOCKET_USER_KEY}${userId}`,
    );
    if (socketId) {
      await this.emitToClient(socketId, event, payload);
    }
  }

  async emitToAuthenticated(event: string, payload: unknown): Promise<void> {
    const connections = await this.getActiveConnections();
    const authenticatedSocketIds = connections
      .filter((conn) => conn.authenticated)
      .map((conn) => conn.socketId);

    for (const socketId of authenticatedSocketIds) {
      await this.emitToClient(socketId, event, payload);
    }
  }

  async isAuthenticated(clientId: string): Promise<boolean> {
    const connection = await this.redisCacheService.get<UserConnection>(
      `${this.SOCKET_USER_KEY}${clientId}`,
    );
    return connection?.authenticated || false;
  }

  async getUserSocket(userId: string): Promise<string | null> {
    return await this.redisCacheService.get<string>(
      `${this.SOCKET_USER_KEY}${userId}`,
    );
  }
}
