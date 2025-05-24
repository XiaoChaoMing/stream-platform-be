import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository } from '../../domain/repositories.interface/user.repository.interface';

@Injectable()
export class GetFollowerUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(userId: number): Promise<any[]> {
    const listFollowers = await this.userRepository.findFollowers(userId);
    if (!listFollowers) {
      return null;
    }
    return listFollowers;
  }
}
