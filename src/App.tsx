import { BrowserRouter, useRoutes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { DataProvider } from "@/providers/data-provider";
import { appRoutes } from "@/routes";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
    },
  },
});

function AppRoutes() {
  return useRoutes(appRoutes);
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <DataProvider>
        <BrowserRouter>
          <AppRoutes />
          <Toaster
            position="top-center"
            toastOptions={{
              className: "rounded-xl border border-border bg-card text-foreground shadow-lift",
            }}
          />
        </BrowserRouter>
      </DataProvider>
    </QueryClientProvider>
  );
}
