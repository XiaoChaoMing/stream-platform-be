import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { IRoleRepository } from '../../core/domain/repositories.interface/role.repository.interface';
import { Role } from '../../core/domain/entities/role.entity';
import { CreateRoleDto } from '../../core/domain/dtos/role/create-role.dto';

@Injectable()
export class RoleRepository implements IRoleRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateRoleDto): Promise<Role> {
    const role = await this.prisma.role.create({
      data,
    });
    return role;
  }

  async findById(role_id: number): Promise<Role | null> {
    return this.prisma.role.findUnique({
      where: { role_id },
    });
  }

  async findByName(role_name: string): Promise<Role | null> {
    return this.prisma.role.findUnique({
      where: { role_name },
    });
  }

  async findAll(): Promise<Role[]> {
    return this.prisma.role.findMany();
  }

  async update(role_id: number, data: Partial<Role>): Promise<Role> {
    return this.prisma.role.update({
      where: { role_id },
      data,
    });
  }

  async delete(role_id: number): Promise<void> {
    await this.prisma.role.delete({
      where: { role_id },
    });
  }
}
