import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/global.css";
import { AppProviders } from "@app/providers/app-providers.component";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

createRoot(rootElement).render(
  <StrictMode>
    <AppProviders />
  </StrictMode>,
);
