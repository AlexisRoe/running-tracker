import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HomePage } from "@/pages/home.page";
import { renderWithProviders } from "@/test/render-with-providers";

describe("HomePage", () => {
  it("shows the dashboard title and a set-goal CTA when no goal is set", () => {
    renderWithProviders(<HomePage />);

    expect(screen.getByRole("heading", { name: "Dashboard" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Set a goal" })).toBeInTheDocument();
  });
});
