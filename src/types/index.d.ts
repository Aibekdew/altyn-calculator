// src/types/index.d.ts

export interface UserManagementSerializer {
  id: number;
  username: string;
  role_read: "ADMIN" | "USER";
}
