import { useEffect, useRef, useState } from 'react';
import { isAuthenticated } from '@/utils/cookies';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { ScreenLoader } from '@/components/common/screen-loader';
import { useAuth } from './context/auth-context';

/**
 * Component to protect routes that require authentication.
 * If user is not authenticated, redirects to the login page.
 */
export const RequireAuth = () => {
    const { verify, loading: globalLoading } = useAuth();
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const verificationStarted = useRef(false);

    useEffect(() => {
        const checkAuth = async () => {
            if (!verificationStarted.current) {
                verificationStarted.current = true;
                try {
                    await verify();
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        checkAuth();
    }, [verify]);

    if (loading || globalLoading) {
        return <ScreenLoader />;
    }

    if (!isAuthenticated()) {
        const currentPath = location.pathname;
        const searchParams = location.search;
        const fullPath = searchParams ? `${currentPath}${searchParams}` : currentPath;

        return <Navigate to={`/auth/signin?next=${encodeURIComponent(fullPath)}`} replace />;
    }

    return <Outlet />;
};
