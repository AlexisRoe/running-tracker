import type { User } from "@entities/user/model/user.type";
import { httpClient } from "@shared/api/http-client";

export async function fetchUsers(): Promise<User[]> {
  const response = await httpClient.get<User[]>("/users");
  return response.data;
}
