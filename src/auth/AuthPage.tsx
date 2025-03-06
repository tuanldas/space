import { Navigate, Route, Routes } from 'react-router';
import { AuthLayout } from '@/layouts/auth';
import Login from '@/pages/auth/login.tsx';
import { useAuthContext } from '@/auth/useAuthContext.ts';

const AuthPage = () => {
  const { isAuthenticated } = useAuthContext();

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/error/404" />} />
      </Route>
    </Routes>
  );
};

export { AuthPage };
