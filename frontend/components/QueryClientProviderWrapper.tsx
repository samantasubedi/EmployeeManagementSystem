"use client";
import React, { ReactNode, useMemo } from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const QueryClientProviderWrapper = ({ children }: { children: ReactNode }) => {
  const queryClient = useMemo(() => new QueryClient(), []);
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default QueryClientProviderWrapper;
