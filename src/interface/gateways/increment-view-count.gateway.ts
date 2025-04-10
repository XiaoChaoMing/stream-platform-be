import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { IVideoRepository } from '../../core/domain/repositories.interface/video.repository.interface';
import { SocketProvider } from '../../infrastructure/websocket/socket.provider';

@Injectable()
export class IncrementViewCountGateway implements OnModuleInit {
  private readonly logger = new Logger(IncrementViewCountGateway.name);

  constructor(
    @Inject('IVideoRepository')
    private readonly videoRepository: IVideoRepository,
    @Inject('SocketProvider')
    private readonly socketProvider: SocketProvider,
  ) {}

  onModuleInit() {
    this.subscribeToEvents();
    this.logger.log(
      'IncrementViewCountGateway initialized and subscribed to events',
    );
  }

  async handleIncrementViewCount(videoId: number): Promise<void> {
    try {
      this.logger.log(`Incrementing view count for video ${videoId}`);

      // Increment the view count
      await this.videoRepository.incrementViewCount(videoId);

      // Get the updated video
      const video = await this.videoRepository.findById(videoId);

      if (!video) {
        this.socketProvider.emitToAll('incrementViewCountResponse', {
          status: 'error',
          message: 'Video not found',
          videoId,
        });
        return;
      }

      // Emit to all connected clients
      this.socketProvider.emitToAll('incrementViewCountResponse', {
        status: 'success',
        videoId: video.video_id,
        viewCount: video.view_count,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      this.logger.error(`Error incrementing view count: ${error.message}`);
      this.socketProvider.emitToAll('incrementViewCountResponse', {
        status: 'error',
        message: 'Failed to increment view count',
        videoId,
      });
    }
  }

  async handleGetViewCount(videoId: number): Promise<void> {
    try {
      const video = await this.videoRepository.findById(videoId);

      if (!video) {
        this.socketProvider.emitToAll('getVideoViewCountResponse', {
          status: 'error',
          message: 'Video not found',
          videoId,
        });
        return;
      }

      this.socketProvider.emitToAll('getVideoViewCountResponse', {
        status: 'success',
        videoId: video.video_id,
        viewCount: video.view_count,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      this.logger.error(`Error getting view count: ${error.message}`);
      this.socketProvider.emitToAll('getVideoViewCountResponse', {
        status: 'error',
        message: 'Failed to get view count',
        videoId,
      });
    }
  }

  // Method to subscribe to socket events
  subscribeToEvents(): void {
    this.socketProvider.server.on('connection', (socket) => {
      socket.on('incrementViewCount', (videoId: number) => {
        this.handleIncrementViewCount(videoId);
      });

      socket.on('getVideoViewCount', (videoId: number) => {
        this.handleGetViewCount(videoId);
      });
    });
  }
}
