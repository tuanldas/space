import { PropsWithChildren, useContext, useMemo } from 'react';
import { callApiGetUserProfile } from '@/api/auth';
import { isAuthenticated } from '@/utils/cookies';
import { useQuery } from '@tanstack/react-query';
import { AuthContext } from '../context/auth-context';
import { PermissionContext } from '../context/permission-context';
import { Role } from '../lib/permission';

export const PermissionProvider = ({ children }: PropsWithChildren) => {
    const { user } = useContext(AuthContext);

    const isAuth = useMemo(() => {
        return isAuthenticated() && !!user;
    }, [user]);

    // Sử dụng một query duy nhất để lấy profile, bao gồm cả roles và permissions
    const { data: profileData, isLoading: isLoadingProfile } = useQuery({
        queryKey: ['user-profile'],
        queryFn: async () => {
            if (!isAuth) return null;
            const response = await callApiGetUserProfile();
            return response.data || null;
        },
        enabled: isAuth,
    });

    // Dữ liệu đã xử lý
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

    // Kiểm tra xem user có permission được yêu cầu không
    const hasPermission = (permissionCode: string | string[]): boolean => {
        if (!isAuth || !permissionCodes) return false;

        if (Array.isArray(permissionCode)) {
            // Nếu là mảng, kiểm tra xem có tất cả permissions không
            return permissionCode.every((code) => permissionCodes.includes(code));
        }

        return permissionCodes.includes(permissionCode);
    };

    // Kiểm tra xem user có bất kỳ permission nào trong danh sách
    const hasAnyPermission = (permissionCodes: string[]): boolean => {
        if (!isAuth) return false;

        return permissionCodes.some((code) => hasPermission(code));
    };

    // Kiểm tra xem user có role được yêu cầu không
    const hasRole = (roleId: number | number[]): boolean => {
        if (!isAuth || !roles) return false;

        if (Array.isArray(roleId)) {
            // Nếu là mảng, kiểm tra xem có bất kỳ role nào không
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
