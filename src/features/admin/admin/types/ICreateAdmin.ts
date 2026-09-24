import { AdminProfile } from '../../admin_profile/entity/admin-profile.entity.dto';
import { Role } from '../../role/role.entity';

export interface ICreateAdmin {
  email: string;
  passwordHash: string;
  role: Role;
  profile: AdminProfile;
}
