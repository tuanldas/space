import { ReactElement } from 'react';
import { Navigate, Route, Routes } from 'react-router';

import { AuthPage } from '@/auth';
import { RequireAuth } from '@/auth/RequireAuth';
import { Demo5Layout } from '@/layouts/demo5';
import { ErrorsRouting } from '@/errors';
import Dashboard from '@/pages/dashboard';
import Wallets from '@/pages/wallets';

const AppRoutingSetup = (): ReactElement => {
  return (
    <Routes>
      <Route element={<RequireAuth />}>
        <Route element={<Demo5Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="wallets" element={<Wallets />} />
        </Route>
      </Route>
      <Route path="error/*" element={<ErrorsRouting />} />
      <Route path="auth/*" element={<AuthPage />} />
      <Route path="*" element={<Navigate to="/error/404" />} />
    </Routes>
  );
};

export { AppRoutingSetup };
