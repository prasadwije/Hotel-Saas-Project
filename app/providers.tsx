"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
    // හැම රික්වෙස්ට් එකකදීම අලුත් ක්ලයන්ට් කෙනෙක් හැදෙන එක නවත්තන්න useState පාවිච්චි කරනවා
    const [queryClient] = useState(() => new QueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}