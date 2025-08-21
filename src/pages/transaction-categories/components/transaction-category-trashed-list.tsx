import { useCallback, useEffect, useRef } from 'react';
import {
    forceDeleteTransactionCategory,
    getTrashedTransactionCategories,
    restoreTransactionCategory,
    TransactionCategory,
} from '@/api/transaction-categories';
import { usePermission } from '@/auth/hooks/use-permission';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, RefreshCw, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useMessage } from '@/lib/custom-hooks';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { canForceDeleteCategory, canRestoreCategory } from '../helpers';

const TransactionCategoryTrashedList = () => {
    const { t } = useMessage();
    const queryClient = useQueryClient();
    const observerTarget = useRef<HTMLDivElement>(null);
    const perPage = 10;
    const { hasPermission } = usePermission();

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, error } = useInfiniteQuery({
        queryKey: ['transactionCategoriesTrashed'],
        queryFn: async ({ pageParam = 1 }) => {
            try {
                const response = await getTrashedTransactionCategories({
                    per_page: perPage,
                    page: pageParam,
                });

                const raw = response.data as unknown;
                if (raw && typeof raw === 'object') {
                    const rawObj = raw as Record<string, unknown>;
                    const rawData = rawObj.data as unknown;
                    if (Array.isArray(rawData)) {
                        const total = (rawObj.total as number) ?? undefined;
                        const lastPage =
                            (rawObj.last_page as number | null) ?? (total ? Math.ceil(total / perPage) : null);

                        return {
                            categories: rawData as TransactionCategory[],
                            currentPage: (rawObj.current_page as number) ?? pageParam,
                            lastPage,
                        };
                    }
                }

                if (Array.isArray(raw)) {
                    return {
                        categories: raw as TransactionCategory[],
                        currentPage: pageParam,
                        lastPage: null,
                    };
                }

                console.error('Unexpected API response format:', response.data);
                return {
                    categories: [] as TransactionCategory[],
                    currentPage: pageParam,
                    lastPage: null,
                };
            } catch (err) {
                console.error('Error in query function:', err);
                throw err;
            }
        },
        getNextPageParam: (lastPage) => {
            if (lastPage.lastPage === null) {
                return lastPage.categories.length > 0 ? lastPage.currentPage + 1 : undefined;
            }

            return lastPage.currentPage < lastPage.lastPage ? lastPage.currentPage + 1 : undefined;
        },
        initialPageParam: 1,
    });

    const trashedCategories = data?.pages.flatMap((page) => page.categories) || [];

    const observerCallback = useCallback(
        (entries: IntersectionObserverEntry[]) => {
            const [entry] = entries;
            if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
            }
        },
        [fetchNextPage, hasNextPage, isFetchingNextPage],
    );

    useEffect(() => {
        const observer = new IntersectionObserver(observerCallback, {
            root: null,
            rootMargin: '0px',
            threshold: 0.1,
        });

        const target = observerTarget.current;
        if (target) {
            observer.observe(target);
        }

        return () => {
            if (target) {
                observer.unobserve(target);
            }
        };
    }, [observerCallback]);

    const restoreMutation = useMutation({
        mutationFn: restoreTransactionCategory,
        onSuccess: () => {
            toast.success(t('transaction_category.messages.restored'));
            queryClient.invalidateQueries({
                queryKey: ['transactionCategoriesTrashed'],
            });
            queryClient.invalidateQueries({ queryKey: ['transactionCategories'] });
        },
        onError: (err) => {
            console.error('Restore mutation error:', err);
            toast.error(t('transaction_category.messages.error_restoring'));
        },
    });

    const forceDeleteMutation = useMutation({
        mutationFn: forceDeleteTransactionCategory,
        onSuccess: () => {
            toast.success(t('transaction_category.messages.force_deleted'));
            queryClient.invalidateQueries({
                queryKey: ['transactionCategoriesTrashed'],
            });
        },
        onError: (err) => {
            console.error('Force delete mutation error:', err);
            toast.error(t('transaction_category.messages.error_deleting'));
        },
    });

    useEffect(() => {
        if (isError && error) {
            console.error('Query error:', error);
            toast.error(t('transaction_category.messages.error_loading'));
        }
    }, [isError, error, t]);

    const handleRestore = (id: string, isDefault: boolean) => {
        const category = {
            id,
            is_default: isDefault,
        } as TransactionCategory;

        if (!canRestoreCategory(category, hasPermission)) {
            toast.error(t('transaction_category.messages.no_permission_default'));
            return;
        }

        restoreMutation.mutate(id);
    };

    const handleForceDelete = (id: string, isDefault: boolean) => {
        const category = {
            id,
            is_default: isDefault,
        } as TransactionCategory;

        if (!canForceDeleteCategory(category, hasPermission)) {
            toast.error(t('transaction_category.messages.no_permission_default'));
            return;
        }

        if (window.confirm(t('transaction_category.messages.confirm_force_delete'))) {
            forceDeleteMutation.mutate(id);
        }
    };

    const getCategoryTypeColor = (type: string): 'primary' | 'secondary' | 'success' | 'warning' | 'info' | 'outline' | 'destructive' => {
        switch (type) {
            case 'income':
                return 'success';
            case 'expense':
                return 'destructive';
            case 'transfer':
                return 'warning';
            default:
                return 'secondary';
        }
    };

    const renderItem = (category: TransactionCategory) => {
        const showRestoreButton = canRestoreCategory(category, hasPermission);
        const showForceDeleteButton = canForceDeleteCategory(category, hasPermission);

        return (
            <div
                key={category.id}
                className="flex items-center justify-between border border-border rounded-xl gap-2 px-4 py-4 bg-secondary-clarity"
            >
                <div className="flex items-center gap-3.5">
                    <img
                        src={category.image}
                        className="w-10 h-10 shrink-0 object-cover rounded-md"
                        alt={category.name}
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://placehold.co/100x100?text=Image';
                        }}
                    />
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-mono mb-px">{category.name}</span>
                        <span className="text-sm text-secondary-foreground">{category.description}</span>
                    </div>
                </div>
                <div className="flex items-center gap-5">
                    <Badge variant={getCategoryTypeColor(category.type)} appearance="light">
                        {t(`transaction_category.types.${category.type}`)}
                    </Badge>
                    <div className="flex gap-0.5">
                        {showRestoreButton && (
                            <Button
                                variant="ghost"
                                onClick={() => handleRestore(category.id, category.is_default)}
                                disabled={restoreMutation.isPending}
                            >
                                <RefreshCw size={16} />
                            </Button>
                        )}

                        {showForceDeleteButton && (
                            <Button
                                variant="ghost"
                                onClick={() => handleForceDelete(category.id, category.is_default)}
                                disabled={forceDeleteMutation.isPending}
                            >
                                <Trash2 />
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <Card className="grow">
            <CardContent className="pt-6 lg:pb-7.5">
                {isLoading && trashedCategories.length === 0 ? (
                    <div className="flex justify-center p-10">Loading...</div>
                ) : (
                    <div className="grid gap-5">
                        {trashedCategories.length === 0 ? (
                            <div className="text-center p-6">
                                <p className="text-secondary-foreground">{t('transaction_category.messages.no_trashed_categories')}</p>
                            </div>
                        ) : (
                            <>
                                {trashedCategories.map((category: TransactionCategory) => renderItem(category))}

                                <div ref={observerTarget} className="py-4">
                                    {isFetchingNextPage && (
                                        <div className="flex items-center justify-center">
                                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                            <span className="ml-2 text-sm text-muted-foreground">{t('common.loading_more')}</span>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export { TransactionCategoryTrashedList };
