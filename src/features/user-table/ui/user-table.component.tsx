import type { User } from "@entities/user/model/user.type";
import { Alert, Loader, Stack } from "@mantine/core";

interface UserTableProps {
  users: User[];
  isLoading: boolean;
  error: string | null;
}

export function UserTable({ users, isLoading, error }: UserTableProps) {
  if (isLoading) return <Loader />;
  if (error) return <Alert color="red">{error}</Alert>;

  return (
    <Stack gap="xs">
      {users.map((user) => (
        <div key={user.id}>
          {user.name} — {user.email}
        </div>
      ))}
    </Stack>
  );
}
