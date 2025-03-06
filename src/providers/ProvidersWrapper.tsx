import { PropsWithChildren } from 'react';

import { AuthProvider } from '@/auth/providers/JWTProvider';
import { LayoutProvider, LoadersProvider, MenusProvider, SettingsProvider, TranslationProvider } from '@/providers';
import { HelmetProvider } from 'react-helmet-async';

const ProvidersWrapper = ({ children }: PropsWithChildren) => {
  return (
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
  );
};

export { ProvidersWrapper };
