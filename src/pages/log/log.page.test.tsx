import { LogPage } from "@pages/log/log.page";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithProviders } from "../../test/render-with-providers";

describe("LogPage", () => {
  it("renders the log page heading", () => {
    renderWithProviders(<LogPage />);

    expect(screen.getByText("Run Log")).toBeInTheDocument();
  });
});
