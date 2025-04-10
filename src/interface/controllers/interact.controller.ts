import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CreateLikeDto } from '../../core/domain/dtos/like/create-like.dto';
import { CreateCommentDto } from '../../core/domain/dtos/comment/create-comment.dto';
import { CreateLikeUseCase } from '../../core/use-cases/interact/like/create-like.use-case';
import { DeleteLikeUseCase } from '../../core/use-cases/interact/like/delete-like.use-case';
import { GetLikesUseCase } from '../../core/use-cases/interact/like/get-likes.use-case';
import { CreateCommentUseCase } from '../../core/use-cases/interact/comment/create-comment.use-case';
import { UpdateCommentUseCase } from '../../core/use-cases/interact/comment/update-comment.use-case';
import { DeleteCommentUseCase } from '../../core/use-cases/interact/comment/delete-comment.use-case';
import { GetCommentsUseCase } from '../../core/use-cases/interact/comment/get-comments.use-case';

@ApiTags('Interactions')
@ApiBearerAuth()
@Controller('interact')
export class InteractController {
  constructor(
    private readonly createLikeUseCase: CreateLikeUseCase,
    private readonly deleteLikeUseCase: DeleteLikeUseCase,
    private readonly getLikesUseCase: GetLikesUseCase,
    private readonly createCommentUseCase: CreateCommentUseCase,
    private readonly updateCommentUseCase: UpdateCommentUseCase,
    private readonly deleteCommentUseCase: DeleteCommentUseCase,
    private readonly getCommentsUseCase: GetCommentsUseCase,
  ) {}

  // Like endpoints
  @Post('like')
  @ApiOperation({ summary: 'Create a like' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Like created successfully',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input' })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Like already exists',
  })
  async createLike(@Body() createLikeDto: CreateLikeDto) {
    return await this.createLikeUseCase.execute(createLikeDto);
  }

  @Delete('like/:userId/:videoId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a like' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Like deleted successfully',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Like not found' })
  async deleteLike(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('videoId', ParseIntPipe) videoId: number,
  ) {
    await this.deleteLikeUseCase.execute(userId, videoId);
  }

  @Get('likes/video/:videoId')
  @ApiOperation({ summary: 'Get likes by video ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Likes retrieved successfully',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'No likes found' })
  async getLikesByVideo(@Param('videoId', ParseIntPipe) videoId: number) {
    return await this.getLikesUseCase.getByVideoId(videoId);
  }

  @Get('likes/user/:userId')
  @ApiOperation({ summary: 'Get likes by user ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Likes retrieved successfully',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'No likes found' })
  async getLikesByUser(@Param('userId', ParseIntPipe) userId: number) {
    return await this.getLikesUseCase.getByUserId(userId);
  }

  @Get('like/check/:userId/:videoId')
  @ApiOperation({ summary: 'Check if user liked a video' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Check completed successfully',
  })
  async checkUserLiked(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('videoId', ParseIntPipe) videoId: number,
  ) {
    return await this.getLikesUseCase.checkUserLiked(userId, videoId);
  }

  // Comment endpoints
  @Post('comment')
  @ApiOperation({ summary: 'Create a comment' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Comment created successfully',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input' })
  async createComment(@Body() createCommentDto: CreateCommentDto) {
    return await this.createCommentUseCase.execute(createCommentDto);
  }

  @Put('comment/:id')
  @ApiOperation({ summary: 'Update a comment' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Comment updated successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Comment not found',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input' })
  async updateComment(
    @Param('id', ParseIntPipe) id: number,
    @Body('content') content: string,
  ) {
    return await this.updateCommentUseCase.execute(id, content);
  }

  @Delete('comment/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a comment' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Comment deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Comment not found',
  })
  async deleteComment(@Param('id', ParseIntPipe) id: number) {
    await this.deleteCommentUseCase.execute(id);
  }

  @Get('comments/video/:videoId')
  @ApiOperation({ summary: 'Get comments by video ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Comments retrieved successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No comments found',
  })
  async getCommentsByVideo(@Param('videoId', ParseIntPipe) videoId: number) {
    return await this.getCommentsUseCase.getByVideoId(videoId);
  }

  @Get('comments/user/:userId')
  @ApiOperation({ summary: 'Get comments by user ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Comments retrieved successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No comments found',
  })
  async getCommentsByUser(@Param('userId', ParseIntPipe) userId: number) {
    return await this.getCommentsUseCase.getByUserId(userId);
  }

  @Get('comments/replies/:commentId')
  @ApiOperation({ summary: 'Get replies to a comment' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Replies retrieved successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No replies found',
  })
  async getCommentReplies(@Param('commentId', ParseIntPipe) commentId: number) {
    return await this.getCommentsUseCase.getReplies(commentId);
  }

  @Get('comment/:id')
  @ApiOperation({ summary: 'Get comment by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Comment retrieved successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Comment not found',
  })
  async getCommentById(@Param('id', ParseIntPipe) id: number) {
    return await this.getCommentsUseCase.getById(id);
  }
}
