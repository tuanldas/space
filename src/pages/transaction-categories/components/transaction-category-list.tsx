import { useCallback, useEffect, useRef } from 'react';
import { deleteTransactionCategory, getTransactionCategories, TransactionCategory } from '@/api/transaction-categories';
import { usePermission } from '@/auth/hooks/use-permission';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, SquarePen, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useMessage } from '@/lib/custom-hooks';
import { useErrorHandler } from '@/hooks/use-error-handler';
import { createGetNextPageParam, extractPaginatedData, getAllItems, useErrorMessage } from '@/hooks/use-paginated-query';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { canDeleteCategory, canEditCategory } from '../helpers';

interface TransactionCategoryListProps {
    onEdit?: (category: TransactionCategory) => void;
}

const TransactionCategoryList = ({ onEdit }: TransactionCategoryListProps) => {
    const { t } = useMessage();
    const queryClient = useQueryClient();
    const { handleError } = useErrorHandler();
    const { hasPermission } = usePermission();
    const observerTarget = useRef<HTMLDivElement>(null);
    const errorMessage = useErrorMessage();

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, error } = useInfiniteQuery({
        queryKey: ['transactionCategories'],
        queryFn: async ({ pageParam = 1 }) => {
            const response = await getTransactionCategories({
                per_page: 10,
                page: pageParam,
            });
            return extractPaginatedData<TransactionCategory>(response, pageParam);
        },
        getNextPageParam: createGetNextPageParam<TransactionCategory>(),
        initialPageParam: 1,
    });

    const categories = getAllItems<TransactionCategory>(data);

    useEffect(() => {
        if (isError && error) {
            handleError(error, errorMessage('transaction_category.messages.error_loading'));
        }
    }, [isError, error, handleError, errorMessage]);

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

    const deleteMutation = useMutation({
        mutationFn: deleteTransactionCategory,
        onSuccess: () => {
            toast.success(t('transaction_category.messages.deleted'));
            queryClient.invalidateQueries({ queryKey: ['transactionCategories'] });
        },
        onError: (err) => {
            handleError(err, {
                title: t('transaction_category.messages.error_deleting'),
            });
        },
    });

    const handleDelete = (id: string, isDefault: boolean) => {
        const category = {
            id,
            is_default: isDefault,
        } as TransactionCategory;

        if (!canDeleteCategory(category, hasPermission)) {
            toast.error(t('transaction_category.messages.no_permission_default'));
            return;
        }

        deleteMutation.mutate(id);
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
        const showEditButton = onEdit && canEditCategory(category, hasPermission);
        const showDeleteButton = canDeleteCategory(category, hasPermission);

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
                        {showEditButton && (
                            <Button variant="ghost" onClick={() => onEdit(category)}>
                                <SquarePen />
                            </Button>
                        )}

                        {showDeleteButton && (
                            <Button
                                variant="ghost"
                                onClick={() => handleDelete(category.id, category.is_default)}
                                disabled={deleteMutation.isPending}
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
                {isLoading && categories.length === 0 ? (
                    <div className="flex justify-center p-10">Loading...</div>
                ) : (
                    <div className="grid gap-5">
                        {categories.length === 0 ? (
                            <div className="text-center p-6">
                                <p className="text-secondary-foreground">{t('transaction_category.messages.no_categories')}</p>
                            </div>
                        ) : (
                            <>
                                {categories.map((category: TransactionCategory) => renderItem(category))}

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

export { TransactionCategoryList };
