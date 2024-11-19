import { PropsWithChildren } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

import { AuthProvider } from '@/auth/providers/JWTProvider';
import {
  LayoutProvider,
  LoadersProvider,
  MenusProvider,
  SettingsProvider,
  SnackbarProvider,
  TranslationProvider
} from '@/providers';
import { HelmetProvider } from 'react-helmet-async';
import { ReactQueryDevtools } from 'react-query/devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 300000,
      cacheTime: 900000,
      refetchOnMount: false,
      refetchOnWindowFocus: true,
      refetchInterval: false,
      retry: 3,
      retryDelay: attempt => Math.min(1000 * 2 ** attempt, 30000)
    },
    mutations: {
      retry: 1
    }
  }
});
console.log(import.meta.env.MODE);

const ProvidersWrapper = ({ children }: PropsWithChildren) => {
  return (
    <QueryClientProvider client={queryClient}>
      <SnackbarProvider>
        <AuthProvider>
          <SettingsProvider>
            <TranslationProvider>
              <HelmetProvider>
                <LayoutProvider>
                  <LoadersProvider>
                    <MenusProvider>{children}</MenusProvider>
                  </LoadersProvider>
                </LayoutProvider>
              </HelmetProvider>
            </TranslationProvider>
          </SettingsProvider>
        </AuthProvider>
      </SnackbarProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export { ProvidersWrapper };
