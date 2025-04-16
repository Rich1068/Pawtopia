// testUtils.ts

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import React from "react";

// Reusable wrapper for renderHook

export const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // optional: disable retry to simplify error tests
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
