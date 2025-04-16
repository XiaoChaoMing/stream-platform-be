import { Inject, Injectable } from '@nestjs/common';
import { ILivestreamRepository } from '../../domain/repositories.interface/livestream.repository.interface';

@Injectable()
export class DeleteLivestreamUseCase {
  constructor(
    @Inject('ILivestreamRepository')
    private readonly livestreamRepository: ILivestreamRepository,
  ) {}

  async execute(id: number): Promise<void> {
    await this.livestreamRepository.delete(id);
  }
}
