import { MantineProvider } from "@mantine/core";
import { render } from "@testing-library/react";
import type { ReactElement, ReactNode } from "react";
import { MemoryRouter } from "react-router";
import { theme } from "@/app/theme.config";

interface RenderWithProvidersOptions {
  route?: string;
}

export function renderWithProviders(ui: ReactElement, options: RenderWithProvidersOptions = {}) {
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <MantineProvider theme={theme}>
        <MemoryRouter initialEntries={[options.route ?? "/"]}>{children}</MemoryRouter>
      </MantineProvider>
    );
  }

  return render(ui, { wrapper: Wrapper });
}
