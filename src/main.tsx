import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

/**
 * Initializes a React Query client instance for managing server state.
 */
const queryClient = new QueryClient();

/**
 * Renders the root React component (`App`) inside the StrictMode.
 * - Uses `StrictMode` to highlight potential problems in development.
 * - Wraps `App` with `QueryClientProvider` to enable React Query functionality.
 */
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>
);
