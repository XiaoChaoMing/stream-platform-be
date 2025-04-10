import { Role } from '../entities/role.entity';
import { CreateRoleDto } from '../dtos/role/create-role.dto';

export interface IRoleRepository {
  create(data: CreateRoleDto): Promise<Role>;
  findById(id: number): Promise<Role | null>;
  findByName(name: string): Promise<Role | null>;
  findAll(): Promise<Role[]>;
  update(id: number, data: Partial<Role>): Promise<Role>;
  delete(id: number): Promise<void>;
}
