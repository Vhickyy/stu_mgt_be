import { Permission } from 'src/features/admin/permission/permission.entity';
import { Role } from 'src/features/admin/role/role.entity';
import { DataSource, EntityManager } from 'typeorm';

export async function seedRbac(dataSource: DataSource) {
  await dataSource.transaction(async (manager: EntityManager) => {
    const permissionRepository = manager.getRepository(Permission);
    const roleRepository = manager.getRepository(Role);

    const permissions = [
      {
        name: 'students.read',
        resource: 'students',
        action: 'read',
        description: 'View students',
      },
      {
        name: 'students.update',
        resource: 'students',
        action: 'update',
        description: 'Update student information',
      },
      {
        name: 'students.delete',
        resource: 'students',
        action: 'delete',
        description: 'Delete students',
      },

      {
        name: 'admins.read',
        resource: 'admins',
        action: 'read',
        description: 'View administrators',
      },
      {
        name: 'admins.update',
        resource: 'admins',
        action: 'update',
        description: 'Update administrator information',
      },
      {
        name: 'admins.assign_role',
        resource: 'admins',
        action: 'assign_role',
        description: 'Assign roles to administrators',
      },
      {
        name: 'admins.deactivate',
        resource: 'admins',
        action: 'deactivate',
        description: 'Deactivate administrators',
      },

      {
        name: 'universities.read',
        resource: 'universities',
        action: 'read',
        description: 'View universities',
      },

      {
        name: 'departments.read',
        resource: 'departments',
        action: 'read',
        description: 'View departments',
      },

      {
        name: 'subscriptions.read',
        resource: 'subscriptions',
        action: 'read',
        description: 'View student subscriptions',
      },
    ];

    for (const permission of permissions) {
      await permissionRepository.upsert(permission, ['name']);
    }

    const allPermissions = await permissionRepository.find();

    const permissionMap = new Map(
      allPermissions.map((permission) => [permission.name, permission]),
    );

    const getPermission = (name: string): Permission => {
      const permission = permissionMap.get(name);

      if (!permission) {
        throw new Error(`Permission "${name}" was not found.`);
      }

      return permission;
    };

    const roles = [
      {
        name: 'SUPER_ADMIN',
        description: 'Full access to the StudentHub administration platform.',
        permissions: allPermissions,
      },

      {
        name: 'STUDENT_MANAGER',
        description: 'Manage student information and student accounts.',
        permissions: [
          getPermission('students.read'),
          getPermission('students.update'),
          getPermission('students.delete'),
        ],
      },

      {
        name: 'ADMIN_MANAGER',
        description: 'Manage administrators and their roles.',
        permissions: [
          getPermission('admins.read'),
          getPermission('admins.update'),
          getPermission('admins.assign_role'),
          getPermission('admins.deactivate'),
        ],
      },

      {
        name: 'CONTENT_MANAGER',
        description: 'Manage platform reference information.',
        permissions: [
          getPermission('universities.read'),
          getPermission('departments.read'),
        ],
      },
    ];

    for (const role of roles) {
      const existingRole = await roleRepository.findOne({
        where: {
          name: role.name,
        },
      });

      if (existingRole) {
        existingRole.description = role.description;
        existingRole.permissions = role.permissions;

        await roleRepository.save(existingRole);
        continue;
      }

      await roleRepository.save(
        roleRepository.create({
          name: role.name,
          description: role.description,
          permissions: role.permissions,
        }),
      );
    }

    console.log('RBAC seed completed successfully.');
  });
}
