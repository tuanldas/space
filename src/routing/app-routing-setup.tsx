import { AuthRouting } from '@/auth/auth-routing';
import { RequireAuth } from '@/auth/require-auth';
import { ErrorRouting } from '@/errors/error-routing';
import { Demo6Layout } from '@/layouts/demo6/layout.tsx';
import { DashboardPage } from '@/pages/dashboard';
import { TransactionCategoriesPage } from '@/pages/transaction-categories';
import { UserManagementPage } from '@/pages/users';
import { WalletDetailPage, WalletsPage } from '@/pages/wallets';
import { Navigate, Route, Routes } from 'react-router';

export function AppRoutingSetup() {
    return (
        <Routes>
            <Route element={<RequireAuth />}>
                <Route element={<Demo6Layout />}>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/users" element={<UserManagementPage />} />
                    <Route path="/transaction-categories" element={<TransactionCategoriesPage />} />
                    <Route path="/wallets" element={<WalletsPage />} />
                    <Route path="/wallets/:id" element={<WalletDetailPage />} />
                </Route>
            </Route>
            <Route path="error/*" element={<ErrorRouting />} />
            <Route path="auth/*" element={<AuthRouting />} />
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
}
