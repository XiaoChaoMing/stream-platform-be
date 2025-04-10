import { Comment } from '../entities/comment.entity';
import { CreateCommentDto } from '../dtos/comment/create-comment.dto';

export interface ICommentRepository {
  create(data: CreateCommentDto): Promise<Comment>;
  findById(id: number): Promise<Comment | null>;
  findByVideoId(videoId: number): Promise<Comment[]>;
  findByUserId(userId: number): Promise<Comment[]>;
  findReplies(commentId: number): Promise<Comment[]>;
  update(id: number, data: Partial<Comment>): Promise<Comment>;
  delete(id: number): Promise<void>;
}
