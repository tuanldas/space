import {Navigate, Outlet, useLocation} from 'react-router-dom';
import {ScreenLoader} from '@/components/common/screen-loader';
import {useAuth} from '@/auth/context/auth-context.ts';

/**
 * Component to protect routes that require authentication.
 * If user is not authenticated, redirects to the login page.
 */
export const RequireAuth = () => {
    const {isAuthenticated, loading} = useAuth();
    const location = useLocation();

    if (loading) {
        return <ScreenLoader/>;
    }

    return isAuthenticated ? (
        <Outlet/>
    ) : (
        <Navigate to="auth/login" state={{from: location}} replace/>
    );
};
