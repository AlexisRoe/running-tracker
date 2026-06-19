import { fetchUsers } from "@entities/user/api/user.api";
import type { UserTableState } from "@features/user-table/model/user-table.type";
import { useEffect, useState } from "react";

export function useUserTable(): UserTableState {
  const [state, setState] = useState<UserTableState>({
    users: [],
    isLoading: false,
    error: null,
  });

  useEffect(() => {
    setState((prev) => ({ ...prev, isLoading: true }));
    fetchUsers()
      .then((users) => setState({ users, isLoading: false, error: null }))
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : "Unknown error";
        setState({ users: [], isLoading: false, error: message });
      });
  }, []);

  return state;
}
