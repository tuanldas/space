import { TransactionCategory } from '@/api/transaction-categories';
import { PermissionCode } from '@/auth/lib/permission';

/**
 * Kiểm tra xem người dùng có quyền thao tác với danh mục (thông thường hoặc mặc định)
 * @param category Đối tượng danh mục giao dịch
 * @param hasPermissionFn Hàm kiểm tra quyền
 * @param requiredPermission Quyền cần kiểm tra
 * @returns Boolean cho biết người dùng có quyền hay không
 */
export const canManageCategoryWithPermission = (
    category: TransactionCategory,
    hasPermissionFn: (permission: string | string[]) => boolean,
    requiredPermission: PermissionCode,
): boolean => {
    // Danh mục thông thường hoặc có quyền quản lý danh mục mặc định
    const canManageDefault =
        !category.is_default || hasPermissionFn(PermissionCode.MANAGE_DEFAULT_TRANSACTION_CATEGORIES);

    // Kiểm tra quyền chung + quyền đặc biệt cho danh mục mặc định
    return hasPermissionFn(requiredPermission) && canManageDefault;
};

/**
 * Kiểm tra quyền chỉnh sửa danh mục
 */
export const canEditCategory = (
    category: TransactionCategory,
    hasPermissionFn: (permission: string | string[]) => boolean,
): boolean => {
    return canManageCategoryWithPermission(category, hasPermissionFn, PermissionCode.UPDATE_TRANSACTION_CATEGORIES);
};

/**
 * Kiểm tra quyền xóa danh mục
 */
export const canDeleteCategory = (
    category: TransactionCategory,
    hasPermissionFn: (permission: string | string[]) => boolean,
): boolean => {
    return canManageCategoryWithPermission(category, hasPermissionFn, PermissionCode.DELETE_TRANSACTION_CATEGORIES);
};

/**
 * Kiểm tra quyền khôi phục danh mục
 */
export const canRestoreCategory = (
    category: TransactionCategory,
    hasPermissionFn: (permission: string | string[]) => boolean,
): boolean => {
    return canManageCategoryWithPermission(category, hasPermissionFn, PermissionCode.RESTORE_TRANSACTION_CATEGORIES);
};

/**
 * Kiểm tra quyền xóa vĩnh viễn danh mục
 */
export const canForceDeleteCategory = (
    category: TransactionCategory,
    hasPermissionFn: (permission: string | string[]) => boolean,
): boolean => {
    return canManageCategoryWithPermission(
        category,
        hasPermissionFn,
        PermissionCode.FORCE_DELETE_TRANSACTION_CATEGORIES,
    );
};

/**
 * Kiểm tra nếu danh mục là mặc định và người dùng không có quyền quản lý
 * Hữu ích để vô hiệu hóa form
 */
export const isDefaultCategoryWithoutPermission = (
    category: TransactionCategory | undefined,
    hasPermissionFn: (permission: string | string[]) => boolean,
): boolean => {
    if (!category) return false;
    return category.is_default && !hasPermissionFn(PermissionCode.MANAGE_DEFAULT_TRANSACTION_CATEGORIES);
};
