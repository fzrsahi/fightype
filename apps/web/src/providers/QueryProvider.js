import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false,
            staleTime: 5 * 60 * 1000,
        },
    },
});
export const QueryProvider = ({ children }) => {
    return _jsx(QueryClientProvider, { client: queryClient, children: children });
};
