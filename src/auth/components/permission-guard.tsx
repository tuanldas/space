import { ReactNode } from 'react';
import { usePermission } from '../hooks/use-permission';

interface PermissionGuardProps {
    permission: string | string[];
    children: ReactNode;
    fallback?: ReactNode;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({ permission, children, fallback = null }) => {
    const { hasPermission, isLoading } = usePermission();

    if (isLoading) {
        return <>{fallback}</>;
    }

    if (!hasPermission(permission)) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
};

interface RoleGuardProps {
    roleId: number | number[];
    children: ReactNode;
    fallback?: ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ roleId, children, fallback = null }) => {
    const { hasRole } = usePermission();

    if (!hasRole(roleId)) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
};
