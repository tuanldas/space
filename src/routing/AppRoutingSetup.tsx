import { ReactElement } from 'react';
import { Navigate, Route, Routes } from 'react-router';

import { AuthPage } from '@/auth';
import { RequireAuth } from '@/auth/RequireAuth';
import { Demo5Layout as Layout } from '@/layouts/demo5';
import { ErrorsRouting } from '@/errors';
import WalletDetail from '@/pages/WalletDetail';
import Dashboard from '@/pages/Dashboard';
import Wallets from '@/pages/Wallets';

const AppRoutingSetup = (): ReactElement => {
  return (
    <Routes>
      <Route element={<RequireAuth />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="wallets" element={<Wallets />} />
          <Route path="wallets/:walletId" element={<WalletDetail />} />
        </Route>
      </Route>
      <Route path="error/*" element={<ErrorsRouting />} />
      <Route path="auth/*" element={<AuthPage />} />
      <Route path="*" element={<Navigate to="/error/404" />} />
    </Routes>
  );
};

export { AppRoutingSetup };
