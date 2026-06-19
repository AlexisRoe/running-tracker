import type { User } from "@entities/user/model/user.type";

export interface UserTableState {
  users: User[];
  isLoading: boolean;
  error: string | null;
}
