import { UserTable } from "@features/user-table/ui/user-table.component";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithProviders } from "../../../test/render-with-providers";

describe("UserTable", () => {
  it("renders a loader while isLoading is true", () => {
    const { container } = renderWithProviders(
      <UserTable users={[]} isLoading={true} error={null} />,
    );

    expect(container.querySelector(".mantine-Loader-root")).not.toBeNull();
  });

  it("renders an error alert when error is set", () => {
    renderWithProviders(<UserTable users={[]} isLoading={false} error="Something went wrong" />);

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("renders a row per user on success", () => {
    renderWithProviders(
      <UserTable
        users={[
          { id: "1", name: "Ada", email: "ada@example.com" },
          { id: "2", name: "Grace", email: "grace@example.com" },
        ]}
        isLoading={false}
        error={null}
      />,
    );

    expect(screen.getByText("Ada — ada@example.com")).toBeInTheDocument();
    expect(screen.getByText("Grace — grace@example.com")).toBeInTheDocument();
  });

  it("renders no user rows but does not crash for an empty user list", () => {
    renderWithProviders(<UserTable users={[]} isLoading={false} error={null} />);

    expect(screen.queryByText(/—/)).toBeNull();
  });
});
