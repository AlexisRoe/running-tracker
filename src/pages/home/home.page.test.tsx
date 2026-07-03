import { HomePage } from "@pages/home/home.page";
import { BUILD_INFO } from "@shared/build-info/build-info.const";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithProviders } from "../../test/render-with-providers";

describe("HomePage", () => {
  it("renders the build info", () => {
    renderWithProviders(<HomePage />);

    expect(
      screen.getByText(new RegExp(`${BUILD_INFO.appName} v${BUILD_INFO.version}`)),
    ).toBeInTheDocument();
  });
});
