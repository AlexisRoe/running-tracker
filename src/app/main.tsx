import { AppProviders } from "@app/providers/app-providers.component";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "@fontsource-variable/space-grotesk/index.css";
import "./styles/global.css";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

createRoot(rootElement).render(
  <StrictMode>
    <AppProviders />
  </StrictMode>,
);
