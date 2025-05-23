import {RequireAuth} from '@/auth/require-auth';
import {Navigate, Route, Routes} from 'react-router';
import {Demo5Layout as Layout} from '@/layouts/demo5/layout';
import {ErrorRouting} from '@/errors/error-routing.tsx';
import {AuthRouting} from '@/auth/auth-routing';
import Dashboard from '@/pages/Dashboard';
import Wallets from '@/pages/Wallets';
import WalletDetail from '@/pages/WalletDetail';

export function AppRoutingSetup() {
    return (
        <Routes>
            <Route element={<RequireAuth/>}>
                <Route element={<Layout/>}>
                    <Route path={'/'} element={<Dashboard/>}/>
                    <Route path="wallets" element={<Wallets />} />
                    <Route path="wallets/:walletId" element={<WalletDetail />} />
                </Route>
            </Route>
            <Route path="error/*" element={<ErrorRouting/>}/>
            <Route path="auth/*" element={<AuthRouting/>}/>
            <Route path="*" element={<Navigate to="/error/404"/>}/>
        </Routes>
    );
}
