import { PropsWithChildren, useMemo } from 'react';
import { callApiGetUserProfile } from '@/api/auth';
import { isAuthenticated } from '@/utils/cookies';
import { useQuery } from '@tanstack/react-query';
import { PermissionContext } from '../context/permission-context';
import { Role } from '../lib/permission';

export const PermissionProvider = ({ children }: PropsWithChildren) => {
    const isAuth = useMemo(() => isAuthenticated(), []);

    const { data: profileData, isLoading: isLoadingProfile } = useQuery({
        queryKey: ['user-profile'],
        queryFn: async () => {
            if (!isAuth) return null;
            const response = await callApiGetUserProfile();
            return response.data || null;
        },
        enabled: isAuth,
    });

    const roles = useMemo(() => (isAuth && profileData?.roles ? profileData.roles : []), [isAuth, profileData]);

    const permissions = useMemo(
        () => (isAuth && profileData?.abilities ? profileData.abilities.map((code: string) => ({ code })) : []),
        [isAuth, profileData],
    );

    const permissionCodes = useMemo(
        () => (isAuth && profileData?.abilities ? profileData.abilities : []),
        [isAuth, profileData],
    );

    const loading = isLoadingProfile;

    const hasPermission = (permissionCode: string | string[]): boolean => {
        if (!isAuth || !permissionCodes) return false;

        if (Array.isArray(permissionCode)) {
            return permissionCode.every((code) => permissionCodes.includes(code));
        }

        return permissionCodes.includes(permissionCode);
    };

    const hasAnyPermission = (permissionCodes: string[]): boolean => {
        if (!isAuth) return false;

        return permissionCodes.some((code) => hasPermission(code));
    };

    const hasRole = (roleId: number | number[]): boolean => {
        if (!isAuth || !roles) return false;

        if (Array.isArray(roleId)) {
            return roleId.some((id) => roles.some((role: Role) => role.id === id));
        }

        return roles.some((role: Role) => role.id === roleId);
    };

    const value = {
        isAuthenticated: isAuth,
        roles,
        permissions,
        permissionCodes,
        hasPermission,
        hasRole,
        hasAnyPermission,
        isLoading: loading,
    };

    return <PermissionContext.Provider value={value}>{children}</PermissionContext.Provider>;
};
