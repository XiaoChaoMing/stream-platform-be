import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dtos/user/create-user.dto';

export interface IUserRepository {
  create(data: CreateUserDto): Promise<User>;
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  update(id: number, data: Partial<User>): Promise<User>;
  delete(id: number): Promise<void>;
}
