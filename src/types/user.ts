import { UUID } from 'crypto';

export type UserRole = 'SUPERADMIN' | 'ADMIN' | 'USER' | 'TRIAL';

export interface User {
  id: UUID;
  username: string;
  email: string | null;
  phone: string | null;
  role: UserRole;
}
