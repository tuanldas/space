import { usePermission } from '@/auth/hooks/use-permission';
import { MenuConfig, MenuItem } from '@/config/types';

export const useMenuPermission = () => {
    const { hasPermission } = usePermission();

    const hasMenuPermission = (item: MenuItem): boolean => {
        if (!item.permissions || item.permissions.length === 0) {
            return true;
        }

        return hasPermission(item.permissions);
    };

    const filterMenuByPermission = (items: MenuConfig): MenuConfig => {
        return items.filter((item) => {
            if (item.disabled || !hasMenuPermission(item)) {
                return false;
            }

            if (item.children && item.children.length > 0) {
                const filteredChildren = filterMenuByPermission(item.children);

                if (filteredChildren.length === 0) {
                    return false;
                }

                item.children = filteredChildren;
            }

            return true;
        });
    };

    return {
        hasMenuPermission,
        filterMenuByPermission,
    };
};
