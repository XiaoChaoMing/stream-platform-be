import { Module } from '@nestjs/common';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { RoleRepository } from '../repositories/role.repository';

@Module({
  imports: [PrismaModule],
  controllers: [], // Add RoleController when created
  providers: [
    PrismaService,
    {
      provide: 'IRoleRepository',
      useClass: RoleRepository, // Create this repository
    },
    // Add use cases when created
  ],
  exports: ['IRoleRepository'],
})
export class RoleModule {}
