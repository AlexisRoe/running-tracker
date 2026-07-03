import { fetchUsers } from "@entities/user/api/user.api";
import { useUserTable } from "@features/user-table/model/use-user-table.hook";
import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@entities/user/api/user.api", () => ({
  fetchUsers: vi.fn(),
}));

const mockedFetchUsers = vi.mocked(fetchUsers);

describe("useUserTable", () => {
  it("starts loading and resolves to the fetched users", async () => {
    mockedFetchUsers.mockResolvedValue([{ id: "1", name: "Ada", email: "ada@example.com" }]);

    const { result } = renderHook(() => useUserTable());

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.users).toEqual([{ id: "1", name: "Ada", email: "ada@example.com" }]);
    expect(result.current.error).toBeNull();
    expect(mockedFetchUsers).toHaveBeenCalledTimes(1);
  });

  it("sets the error message when fetchUsers rejects with an Error", async () => {
    mockedFetchUsers.mockRejectedValue(new Error("network down"));

    const { result } = renderHook(() => useUserTable());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.users).toEqual([]);
    expect(result.current.error).toBe("network down");
  });

  it("falls back to 'Unknown error' when fetchUsers rejects with a non-Error", async () => {
    mockedFetchUsers.mockRejectedValue("boom");

    const { result } = renderHook(() => useUserTable());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.error).toBe("Unknown error");
  });
});
