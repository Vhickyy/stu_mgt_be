import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './role.entity';
import { Repository } from 'typeorm';
import { Permission } from '../permission/permission.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private readonly roleRepo: Repository<Role>,
  ) {}

  async getRoles() {
    const roles = await this.roleRepo
      .createQueryBuilder('role')
      .leftJoin('role.admins', 'admin')
      .leftJoin('role.permissions', 'permission')
      .select(['role.id', 'role.name', 'role.description'])
      .addSelect('COUNT(DISTINCT admin.id)', 'adminCount')
      .addSelect('COUNT(DISTINCT permission.id)', 'permissionCount')
      .groupBy('role.id')
      .getRawMany();
    return { roles };
  }

  async getSingleRole(id: string) {
    const role = await this.roleRepo.findOne({
      where: { id },
      relations: {
        permissions: true,
        admins: true,
      },
    });
    if (!role) throw new NotFoundException(`No role for id - ${id}`);
    const groupedPermissions = role.permissions.reduce(
      (groups, permission) => {
        const resource =
          permission.resource[0].toUpperCase() + permission.resource.slice(1);

        if (!groups[resource]) {
          groups[resource] = [];
        }

        groups[resource].push(permission);

        return groups;
      },
      {} as Record<string, Permission[]>,
    );
    return {
      ...role,
      permissions: { ...groupedPermissions },
      permissionsCount: role.permissions.length,
    };
  }

  async findByName(name: string) {
    return this.roleRepo.findOne({
      where: { name },
    });
  }
}
