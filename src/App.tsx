import {AppRouting} from '@/routing/app-routing';
import {HelmetProvider} from 'react-helmet-async';
import {BrowserRouter} from 'react-router-dom';
import {LoadingBarContainer} from 'react-top-loading-bar';
import {Toaster} from '@/components/ui/sonner';
import {AuthProvider} from './auth/providers/supabase-provider';
import {I18nProvider} from './providers/i18n-provider';
import {SettingsProvider} from './providers/settings-provider';
import {ThemeProvider} from './providers/theme-provider';
import {TooltipsProvider} from './providers/tooltips-provider';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {ReactQueryDevtools} from '@tanstack/react-query-devtools';

const {BASE_URL} = import.meta.env;
const helmetContext = {};

export function App() {
    const queryClient = new QueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <SettingsProvider>
                    <ThemeProvider>
                        <I18nProvider>
                            <HelmetProvider context={helmetContext}>
                                <TooltipsProvider>
                                    <LoadingBarContainer>
                                        <BrowserRouter basename={BASE_URL}>
                                            <Toaster/>
                                            <AppRouting/>
                                        </BrowserRouter>
                                    </LoadingBarContainer>
                                </TooltipsProvider>
                            </HelmetProvider>
                        </I18nProvider>
                    </ThemeProvider>
                </SettingsProvider>
            </AuthProvider>
            <ReactQueryDevtools initialIsOpen={false}/>
        </QueryClientProvider>
    );
}
