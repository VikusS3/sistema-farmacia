// app/providers.tsx
"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/react-query";
import { AuthProvider } from "./context/AuthContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </AuthProvider>
  );
}
