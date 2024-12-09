import { ReactElement } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { RequireAuth } from '@/auth';
import { Demo1Layout } from '@/layouts/demo1';
import { ErrorsRouting } from '@/errors';
import { AuthPage } from '@/auth/AuthPage.tsx';

const AppRoutingSetup = (): ReactElement => {
  return (
    <Routes>
      <Route path="error/*" element={<ErrorsRouting />} />
      <Route path="auth/*" element={<AuthPage />} />
      <Route path="*" element={<Navigate to="/error/404" />} />
    </Routes>
  );
};

export { AppRoutingSetup };
