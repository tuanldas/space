import { useIntl } from 'react-intl';

export type PaginatedResult<T> = {
    items: T[];
    currentPage: number;
    lastPage: number | null;
};

export function extractPaginatedData<T>(
    response: unknown,
    pageParam: number = 1,
    perPage: number = 10,
): PaginatedResult<T> {
    const responseData: unknown = (response as { data?: unknown })?.data ?? response;

    let items: unknown = [];
    if (Array.isArray((responseData as { data?: unknown })?.data)) {
        items = (responseData as { data: unknown[] }).data;
    } else if (Array.isArray(responseData)) {
        items = responseData as unknown[];
    }

    const currentPage = (responseData as { current_page?: number })?.current_page ?? pageParam;
    const total = (responseData as { total?: number })?.total;
    const lastPage = (responseData as { last_page?: number })?.last_page ?? (total ? Math.ceil(total / perPage) : null);

    return {
        items: items as T[],
        currentPage,
        lastPage,
    };
}

export function createGetNextPageParam<T>() {
    return (lastPage: PaginatedResult<T>): number | undefined => {
        if (lastPage.lastPage === null) {
            return lastPage.items?.length > 0 ? lastPage.currentPage + 1 : undefined;
        }

        return lastPage.currentPage < lastPage.lastPage ? lastPage.currentPage + 1 : undefined;
    };
}

export function getAllItems<T>(data: { pages?: PaginatedResult<T>[] } | undefined): T[] {
    return data?.pages?.flatMap((page) => page.items) || [];
}

export function useErrorMessage() {
    const intl = useIntl();
    return (errorKey: string = 'common.error_loading') => ({
        title: intl.formatMessage({ id: errorKey }),
    });
}
