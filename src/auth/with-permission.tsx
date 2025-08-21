import React, { ComponentType } from 'react';
import { Navigate, To } from 'react-router-dom';
import { ScreenLoader } from '@/components/common/screen-loader';
import { usePermission } from './hooks/use-permission';

interface WithPermissionProps {
    permission?: string | string[];
    redirectTo?: string;
    fallback?: React.ReactNode;
}

/**
 * HOC để bảo vệ component/route dựa trên quyền
 * @param WrappedComponent Component cần bảo vệ
 * @param permissionOrOptions Permission code hoặc options
 * @returns Wrapped component
 */
export function withPermission<P extends object>(
    WrappedComponent: ComponentType<P>,
    permissionOrOptions: string | string[] | WithPermissionProps,
) {
    const WithPermissionWrapper: React.FC<P> = (props) => {
        const permission =
            typeof permissionOrOptions === 'object' && !Array.isArray(permissionOrOptions)
                ? permissionOrOptions.permission
                : permissionOrOptions;

        const redirectTo: To =
            typeof permissionOrOptions === 'object' && !Array.isArray(permissionOrOptions)
                ? permissionOrOptions.redirectTo || '/error/unauthorized'
                : '/error/unauthorized';

        const fallback =
            typeof permissionOrOptions === 'object' && !Array.isArray(permissionOrOptions)
                ? permissionOrOptions.fallback
                : null;

        const { hasPermission, isAuthenticated, isLoading } = usePermission();

        if (isLoading) {
            return <ScreenLoader />;
        }

        // Nếu không cung cấp permission, chỉ kiểm tra đăng nhập
        if (!permission && !isAuthenticated) {
            return <Navigate to="/auth/signin" replace />;
        }

        // Kiểm tra quyền nếu có yêu cầu
        if (permission && !hasPermission(permission)) {
            if (fallback) {
                return <>{fallback}</>;
            }
            return <Navigate to={redirectTo} replace />;
        }

        return <WrappedComponent {...props} />;
    };

    return WithPermissionWrapper;
}

/**
 * HOC để bảo vệ component/route yêu cầu đăng nhập
 * @param WrappedComponent Component cần bảo vệ
 * @returns Wrapped component
 */
export function withAuth<P extends object>(WrappedComponent: ComponentType<P>) {
    return withPermission(WrappedComponent, {});
}
