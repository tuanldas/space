import { Navigate, Route, Routes } from 'react-router';
import { Login } from './pages/jwt';
import { AuthLayout } from '@/layouts/auth';

const AuthPage = () => (
  <Routes>
    <Route element={<AuthLayout />}>
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<Navigate to="/error/404" />} />
    </Route>
  </Routes>
);

export { AuthPage };
