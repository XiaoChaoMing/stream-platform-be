import { Inject, Injectable } from '@nestjs/common';
import { ILivestreamRepository } from '../../domain/repositories.interface/livestream.repository.interface';

@Injectable()
export class DeleteAllLivestreamsByUserUseCase {
  constructor(
    @Inject('ILivestreamRepository')
    private readonly livestreamRepository: ILivestreamRepository,
  ) {}

  async execute(userId: number): Promise<void> {
    await this.livestreamRepository.deleteAllByUserId(userId);
  }
}
