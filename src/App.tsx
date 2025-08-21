import { AuthProvider } from '@/auth/providers/auth-provider.tsx';
import { PermissionProvider } from '@/auth/providers/permission-provider.tsx';
import { AppRouting } from '@/routing/app-routing';
import { HelmetProvider } from '@dr.pogodin/react-helmet';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { LoadingBarContainer } from 'react-top-loading-bar';
import { ToolbarProvider } from '@/providers/toolbar-provider.tsx';
import { Toaster } from '@/components/ui/sonner';
import { I18nProvider } from './providers/i18n-provider';
import { ModulesProvider } from './providers/modules-provider';
import { QueryProvider } from './providers/query-provider';
import { SettingsProvider } from './providers/settings-provider';
import { ThemeProvider } from './providers/theme-provider';
import { TooltipsProvider } from './providers/tooltips-provider';

const { BASE_URL } = import.meta.env;

function App() {
    const queryClient = new QueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <PermissionProvider>
                    <SettingsProvider>
                        <ThemeProvider>
                            <I18nProvider>
                                <HelmetProvider>
                                    <TooltipsProvider>
                                        <ToolbarProvider>
                                            <QueryProvider>
                                                <LoadingBarContainer>
                                                    <BrowserRouter basename={BASE_URL}>
                                                        <Toaster />
                                                        <ModulesProvider>
                                                            <AppRouting />
                                                        </ModulesProvider>
                                                    </BrowserRouter>
                                                </LoadingBarContainer>
                                            </QueryProvider>
                                        </ToolbarProvider>
                                    </TooltipsProvider>
                                </HelmetProvider>
                            </I18nProvider>
                        </ThemeProvider>
                    </SettingsProvider>
                </PermissionProvider>
            </AuthProvider>
        </QueryClientProvider>
    );
}

export default App;
