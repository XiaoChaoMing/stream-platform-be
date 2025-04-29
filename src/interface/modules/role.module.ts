import { Module } from '@nestjs/common';
import { RoleRepository } from '../repositories/role.repository';

@Module({
  imports: [],
  controllers: [], // Add RoleController when created
  providers: [
    {
      provide: 'IRoleRepository',
      useClass: RoleRepository, // Create this repository
    },
    // Add use cases when created
  ],
  exports: ['IRoleRepository'],
})
export class RoleModule {}
