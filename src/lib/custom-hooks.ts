import { useIntl } from 'react-intl';

/**
 * Hook custom để sử dụng i18n message trong các component
 * Hỗ trợ fallback khi key không tồn tại
 */
export function useMessage() {
    const intl = useIntl();

    /**
     * Format message theo key đã định nghĩa
     * @param id - Message ID
     * @param values - Optional replacement values
     * @returns Translated message
     */
    const t = (id: string, values?: Record<string, string | number | boolean | Date | null | undefined>) => {
        try {
            if (!id) return '';

            return intl.formatMessage({ id }, values);
        } catch (error) {
            // Log warning và trả về key để dễ debug
            console.warn(`[i18n] Missing translation key: ${id}`);
            return id;
        }
    };

    return { t };
}
