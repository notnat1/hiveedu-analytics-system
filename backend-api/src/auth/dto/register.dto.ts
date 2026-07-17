import { Role } from '../../users/role.enum.js';

export class RegisterDto {
  username!: string;
  password!: string;
  fullName!: string;
  role?: Role;
}
