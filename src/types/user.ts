import { Settings } from "./settings";

export type UserRole = "SUPERADMIN" | "ADMIN" | "USER" | "TRIAL";

export interface User {
  id: string;
  username: string;
  email: string | null;
  phone: string | null;
  role: UserRole;
  settings: Settings;
}
