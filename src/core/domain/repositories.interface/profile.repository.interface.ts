import { Profile } from '../entities/profile.entity';
import { CreateProfileDto } from '../dtos/profile/create-profile.dto';
import { UpdateUserProfileDto } from '../dtos/profile/update-user-profile.dto';
import { User } from '../entities/user.entity';

export interface IProfileRepository {
  create(data: CreateProfileDto): Promise<Profile>;
  findByUserId(user_id: number): Promise<Profile | null>;
  update(id: number, data: Partial<Profile>): Promise<Profile>;
  delete(id: number): Promise<void>;
  
  // New method for updating both user and profile
  updateUserAndProfile(userId: number, data: UpdateUserProfileDto): Promise<{ user: User; profile: Profile }>;
}
