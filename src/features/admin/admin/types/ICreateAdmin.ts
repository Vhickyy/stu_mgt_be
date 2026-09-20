import { AdminRole } from '../../enums/admin_role_enum';
import { Role } from '../../role/role.entity';

export interface ICreateAdmin {
  email: string;
  passwordHash: string;
  role: Role;
}
