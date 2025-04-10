import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class WsAuthGuard implements CanActivate {
  private readonly logger = new Logger(WsAuthGuard.name);

  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const client: Socket = context.switchToWs().getClient();
      const token = this.extractTokenFromHeader(client);

      if (!token) {
        throw new WsException('Unauthorized access - No token provided');
      }

      try {
        const payload = await this.jwtService.verifyAsync(token);
        // Attach user to socket
        client['user'] = payload;
        return true;
      } catch {
        throw new WsException('Unauthorized access - Invalid token');
      }
    } catch (err) {
      this.logger.error(`WebSocket Authentication Error: ${err.message}`);
      throw new WsException('Unauthorized');
    }
  }

  private extractTokenFromHeader(client: Socket): string | undefined {
    // Try to get token from handshake auth
    const authToken = client.handshake?.auth?.token;
    if (authToken) return authToken;

    // Try to get token from handshake headers
    const authHeader = client.handshake?.headers?.authorization;
    if (!authHeader) return undefined;

    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : undefined;
  }
}
