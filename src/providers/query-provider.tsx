import { ReactNode, useEffect, useState } from 'react';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { persistQueryClient } from '@tanstack/react-query-persist-client';

const QueryProvider = ({ children }: { children: ReactNode }) => {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                queryCache: new QueryCache({
                    onError: (error) => {
                        if (error.name === 'ForbiddenError') {
                            return;
                        }
                    },
                }),
                defaultOptions: {
                    queries: {
                        refetchOnWindowFocus: false,
                        retry: 3,
                        staleTime: 1000 * 60 * 5,
                    },
                },
            }),
    );

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const localStoragePersister = createSyncStoragePersister({
                storage: window.localStorage,
            });

            persistQueryClient({
                queryClient,
                persister: localStoragePersister,
                maxAge: 1000 * 60 * 60 * 24,
            });
        }
    }, [queryClient]);

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            <ReactQueryDevtools initialIsOpen={false} position="bottom" />
        </QueryClientProvider>
    );
};

export { QueryProvider };
