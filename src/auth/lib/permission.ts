// Types for permissions and roles system

export interface Role {
    id: number;
    name: string;
    description?: string;
    permissions?: Permission[];
}

export interface Permission {
    id: number;
    name: string;
    code: string;
    description?: string;
    group?: string;
}

// Định nghĩa các permission codes sẵn có trong hệ thống
export enum PermissionCode {
    // User Management
    VIEW_USERS = 'view-users',
    CREATE_USERS = 'create-users',
    UPDATE_USERS = 'update-users',
    DELETE_USERS = 'delete-users',

    // Role Management
    MANAGE_ROLES = 'manage-roles',

    // Settings
    MANAGE_SETTINGS = 'manage-settings',

    // Transaction Categories
    VIEW_TRANSACTION_CATEGORIES = 'view-transaction-categories',
    CREATE_TRANSACTION_CATEGORIES = 'create-transaction-categories',
    UPDATE_TRANSACTION_CATEGORIES = 'update-transaction-categories',
    DELETE_TRANSACTION_CATEGORIES = 'delete-transaction-categories',
    RESTORE_TRANSACTION_CATEGORIES = 'restore-transaction-categories',
    FORCE_DELETE_TRANSACTION_CATEGORIES = 'force-delete-transaction-categories',
    MANAGE_DEFAULT_TRANSACTION_CATEGORIES = 'manage-default-transaction-categories',

    // Wallet Management (keeping these from existing code but updating to kebab-case)
    VIEW_WALLETS = 'view-wallets',
    CREATE_WALLET = 'create-wallet',
    UPDATE_WALLET = 'update-wallet',
    DELETE_WALLET = 'delete-wallet',
}

// User với thông tin quyền
export interface AuthenticatedUser extends Omit<import('./models').UserModel, 'roles'> {
    roles: Role[];
    permissions: Permission[];
}
