import { createContext } from 'react';
import { Permission, PermissionCode, Role } from '../lib/permission';

export interface PermissionContextProps {
    isAuthenticated: boolean;
    roles: Role[];
    permissions: Permission[];
    permissionCodes: string[];
    hasPermission: (permissionCode: string | string[]) => boolean;
    hasRole: (roleId: number | number[]) => boolean;
    hasAnyPermission: (permissionCodes: string[]) => boolean;
    isLoading: boolean;
}

export const defaultPermissionContext: PermissionContextProps = {
    isAuthenticated: false,
    roles: [],
    permissions: [],
    permissionCodes: [],
    hasPermission: () => false,
    hasRole: () => false,
    hasAnyPermission: () => false,
    isLoading: false,
};

export const PermissionContext = createContext<PermissionContextProps>(defaultPermissionContext);
