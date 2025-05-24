import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { SocketProvider } from '../../infrastructure/websocket/socket.provider';
import { StartLivestreamUseCase } from 'src/core/use-cases/livestream/start-livestarm.usecase';
import { GetFollowerUseCase } from 'src/core/use-cases/user/get-follower.use-case';
import { ILivestreamRepository } from 'src/core/domain/repositories.interface/livestream.repository.interface';
import { RedisCacheService } from '../../infrastructure/cache/redis-cache.service';

@Injectable()
export class StreamGateway implements OnModuleInit {
  private readonly STREAM_ROOM_KEY = 'stream:room:';
  private readonly STREAM_VIEWERS_KEY = 'stream:viewers:';

  constructor(
    @Inject('ILivestreamRepository')
    private readonly livestreamRepository: ILivestreamRepository,
    private readonly startLivestreamUseCase: StartLivestreamUseCase,
    private readonly getFollowerUseCase: GetFollowerUseCase,
    private readonly socketProvider: SocketProvider,
    private readonly redisCacheService: RedisCacheService,
  ) {}

  async onModuleInit() {
    try {
      await this.redisCacheService.checkConnection();
    } catch (error) {}
    
    this.subscribeToEvents();
  }

  async handleStartStream(streamData: any): Promise<any> {  
    console.log('handleStartStream', streamData);
    const { id, ...rest } = streamData;
    try {
      const stream = await this.startLivestreamUseCase.execute(id,rest.description, rest.title, rest.thumbnail_url,rest.stream_url, 'live');
      const roomId = `stream_${id}`;
      
      const followers = await this.getFollowerUseCase.execute(stream.user_id);
      followers.forEach(follower => {
        this.socketProvider.server.to(`user_${follower.user_id}`).emit('streamStarted', {
          streamId: stream.stream_id,
          userId: stream.user_id,
          title: stream.title,
          streamUrl: stream.stream_url,
          description: stream.description
        });
      });
      return {
        stream: stream,
        roomId: roomId
      };

    } catch (error) {
      throw error;
    }
  }

  async handleEndStream(streamData: any): Promise<void> {
    const { id, ...rest } = streamData;
    try {
      await this.startLivestreamUseCase.execute(id, rest.description, rest.title, rest.thumbnail_url, rest.stream_url, 'ended');
    } catch (error) {
      throw error;
    }
  }

  async handleJoinStream(streamId: number, userId: number, socketId: string): Promise<void> {
    try {
      const roomKey = `${this.STREAM_ROOM_KEY}${streamId}`;
      const viewersKey = `${this.STREAM_VIEWERS_KEY}${streamId}`;
      
      const currentRoomInfo = await this.redisCacheService.get<any>(roomKey);
      
      let roomInfo = currentRoomInfo || {
        streamId,
        viewers: [],
        startedAt: new Date().toISOString()
      };
      
      const viewerExists = roomInfo.viewers.some((viewer:any) => viewer.userId === userId);
      
      if (!viewerExists) {
        roomInfo.viewers.push({
          userId: userId,
          socketId: socketId,
          joinedAt: new Date().toISOString()
        });
        
        await this.redisCacheService.set(roomKey, roomInfo);
        await this.redisCacheService.set(viewersKey, roomInfo.viewers.length);
        
        this.socketProvider.server.to(`stream_${streamId}`).emit('viewerCountUpdated', {
          streamId: streamId.toString(),
          count: roomInfo.viewers.length
        });
      }
    } catch (error) {
      throw error;
    }
  }

  async handleLeaveStream(streamId: number, userId: number): Promise<void> {
    try {
      const roomKey = `${this.STREAM_ROOM_KEY}${streamId}`;
      const viewersKey = `${this.STREAM_VIEWERS_KEY}${streamId}`;
      
      const roomInfo = await this.redisCacheService.get<any>(roomKey);
      
      if (roomInfo) {
        roomInfo.viewers = roomInfo.viewers.filter((viewer: any) => viewer.userId !== userId);
        
        await this.redisCacheService.set(roomKey, roomInfo);
        await this.redisCacheService.set(viewersKey, roomInfo.viewers.length);

        const roomId = `stream_${streamId}`;
        this.socketProvider.server.to(roomId).emit('viewerCountUpdated', {
          streamId: streamId.toString(),
          count: roomInfo.viewers.length
        });

        if (roomInfo.viewers.length === 0) {
          const stream = await this.livestreamRepository.findById(streamId);
          if (stream.status !== 'live') {
            await this.redisCacheService.del(roomKey);
            await this.redisCacheService.del(viewersKey);
          }
        }
      }
    } catch (error) {
      throw error;
    }
  }

  async handleGetViewCount(streamId: number): Promise<void> {
    try {
      const viewersKey = `${this.STREAM_VIEWERS_KEY}${streamId}`;
      const viewerCount = await this.redisCacheService.get<number>(viewersKey) || 0;
      
      this.socketProvider.server.to(`stream_${streamId}`).emit('viewerCountUpdated', {
        streamId: streamId.toString(),
        count: viewerCount
      });
    } catch (error) {
      throw error;
    }
  }

  async getStreamRoomInfo(streamId: number): Promise<any> {
    try {
      const roomKey = `${this.STREAM_ROOM_KEY}${streamId}`;
      const viewersKey = `${this.STREAM_VIEWERS_KEY}${streamId}`;

      const room = this.socketProvider.server.sockets.adapter.rooms.get("stream_1");
      
      const [roomInfo, viewerCount] = await Promise.all([
        this.redisCacheService.get<any>(roomKey),
        this.redisCacheService.get<number>(viewersKey)
      ]);

      if (!roomInfo) {
        return {
          status: 404,
          message: 'Stream room not found'
        };
      }

      return {
        status: 200,
        data: {
          ...roomInfo,
          currentViewers: viewerCount || 0,
          room: room
        }
      };
    } catch (error) {
      return {
        status: 500,
        message: 'Internal server error'
      };
    }
  }

  subscribeToEvents(): void {
    this.socketProvider.server.on('connection', (socket) => {
      socket.on('startStream', async (data: any) => {
        const {roomId,stream} = await this.handleStartStream(data);
        socket.join(roomId);
        socket.emit('streamStarted',{
          message: 'Stream started',
          status: 200,
          stream: stream
        });
      });

      socket.on('endStream', async (data: any) => {
        try {
          await this.handleEndStream(data);
          const roomId = `stream_${data.id}`;
          // Notify all viewers that stream has ended
          this.socketProvider.server.to(roomId).emit('streamEnded', {
            message: 'Stream has ended',
            status: 200
          });
          socket.emit('streamEnded', {
            message: 'Stream ended',
            status: 200
          });
        } catch (error) {
          socket.emit('streamError', {
            message: 'Error ending stream',
            status: 500
          });
        }
      });

      socket.on('joinStream', async (data:{stream_id:number,user_id:number}) => {
        const stream = await this.livestreamRepository.findById(data.stream_id);
        if(stream.status === 'live') {
          const roomId = `stream_${data.stream_id}`;
          socket.join(roomId);
          await this.handleJoinStream(data.stream_id, data.user_id, socket.id);
        } else {
          socket.emit('streamError', {
            message: 'Stream is not live',
            status: 400
          });
        }
      });

      socket.on('getStreamRoomInfo', async (streamId: number) => {
        const response = await this.getStreamRoomInfo(streamId);
        socket.emit('streamRoomInfo', response);
      });

      socket.on('getVideoViewCount', (streamId: number) => {
        this.handleGetViewCount(streamId);
      });

      socket.on('leaveStream', async (data:{stream_id:number,user_id:number}) => {
        try {
          const roomId = `stream_${data.stream_id}`;
          socket.leave(roomId);
          await this.handleLeaveStream(data.stream_id, data.user_id);
          socket.emit('leftStream', {
            message: 'Successfully left the stream',
            status: 200
          });
        } catch (error) {
          socket.emit('streamError', {
            message: 'Error leaving stream',
            status: 500
          });
        }
      });

      socket.on('getViewerCount', async (streamId: string) => {
        try {
          const numericStreamId = parseInt(streamId);
          if (isNaN(numericStreamId)) {
            throw new Error('Invalid stream ID');
          }
          await this.handleGetViewCount(numericStreamId);
        } catch (error) {
          socket.emit('streamError', {
            message: 'Error getting viewer count',
            status: 500
          });
        }
      });

      // Handle socket disconnection
      socket.on('disconnect', async () => {
        try {
          // Find all rooms this socket is in
          const rooms = Array.from(socket.rooms);
          for (const room of rooms) {
            if (room.startsWith('stream_')) {
              const streamId = parseInt(room.replace('stream_', ''));
              // Find the user_id from Redis room info
              const roomKey = `${this.STREAM_ROOM_KEY}${streamId}`;
              const roomInfo = await this.redisCacheService.get<any>(roomKey);
              if (roomInfo) {
                const viewer = roomInfo.viewers.find((v: any) => v.socketId === socket.id);
                if (viewer) {
                  await this.handleLeaveStream(streamId, viewer.userId);
                }
              }
            }
          }
        } catch (error) {
          Logger.error('Error handling socket disconnect', error);
        }
      });

      // Handle stream end
      

      socket.emit('streamError', {
        message: 'Stream error',
        status: 400
      });
    });
  }
}
