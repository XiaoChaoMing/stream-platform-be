import { Profile } from '../entities/profile.entity';
import { CreateProfileDto } from '../dtos/profile/create-profile.dto';

export interface IProfileRepository {
  create(data: CreateProfileDto): Promise<Profile>;
  findByUserId(user_id: number): Promise<Profile | null>;
  update(id: number, data: Partial<Profile>): Promise<Profile>;
  delete(id: number): Promise<void>;
}
