import { Navigate, Route, Routes } from 'react-router';
import { AuthLayout } from '@/layouts/auth';
import Login from '@/pages/auth/login.tsx';

const AuthPage = () => (
  <Routes>
    <Route element={<AuthLayout />}>
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<Navigate to="/error/404" />} />
    </Route>
  </Routes>
);

export { AuthPage };
