import { useCallback } from 'react';
import { useIntl } from 'react-intl';

/**
 * Hook custom để sử dụng i18n message trong các component
 * Hỗ trợ fallback khi key không tồn tại
 */
export function useMessage() {
    const intl = useIntl();

    const t = useCallback(
        (id: string, values?: Record<string, string | number | boolean | Date | null | undefined>) => {
            try {
                if (!id) return '';
                return intl.formatMessage({ id }, values);
            } catch (error) {
                console.warn(`[i18n] Missing translation key: ${id}`);
                return id;
            }
        },
        [intl],
    );

    return { t };
}
