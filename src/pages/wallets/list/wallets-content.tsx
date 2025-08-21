import { useEffect, useState } from 'react';
import { callApiGetWallets } from '@/api/wallet';
import { CardWalletRow } from '@/pages/wallets';
import { formatMoney } from '@/utils/currency';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { useIntl } from 'react-intl';
import { useErrorHandler } from '@/hooks/use-error-handler';
import {
    createGetNextPageParam,
    extractPaginatedData,
    getAllItems,
    useErrorMessage,
} from '@/hooks/use-paginated-query';
import { useToolbar } from '@/providers/toolbar-provider';
import { Button } from '@/components/ui/button';
import { ContentLoader } from '@/components/common/content-loader';
import { AddWalletForm } from './components';

export interface IWalletApiItem {
    id: string;
    name: string;
    currency: string | undefined;
    description?: string;
    balance: string;
    logo?: string;
}

export interface IWalletsContentItem {
    id: string;
    logo: string;
    logoSize?: string;
    logoDark?: string;
    name: string;
    description: string;
    statistics: Array<{ total: string; description: string }>;
    progress?: {
        variant: string;
        value: number;
    };
    walletData: IWalletApiItem;
}

type IWalletsContentItems = Array<IWalletsContentItem>;

export function WalletsContent() {
    const intl = useIntl();
    const { handleError } = useErrorHandler();
    const errorMessage = useErrorMessage();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const { setToolbarActions, setToolbarTitle } = useToolbar();

    const { data, hasNextPage, fetchNextPage, isFetchingNextPage, isLoading, isError, error } = useInfiniteQuery({
        queryKey: ['wallets'],
        queryFn: async ({ pageParam = 1 }) => {
            const response = await callApiGetWallets({ pageParam });
            return extractPaginatedData<IWalletApiItem>(response, pageParam);
        },
        getNextPageParam: createGetNextPageParam(),
        initialPageParam: 1,
    });

    useEffect(() => {
        setToolbarTitle(null);
        setToolbarActions(
            <Button onClick={() => setIsFormOpen(true)} mode="icon" variant="primary">
                <Plus className="h-4 w-4 text-white" />
            </Button>,
        );
        return () => {
            setToolbarActions(null);
            setToolbarTitle(null);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const walletApiItems = getAllItems<IWalletApiItem>(data);

    const items: IWalletsContentItems = walletApiItems.map((wallet: IWalletApiItem) => ({
        id: wallet.id,
        name: wallet.name || '',
        description: wallet.description || '',
        logo: wallet.logo || '',
        logoSize: undefined,
        logoDark: undefined,
        statistics: [
            {
                description: intl.formatMessage({ id: 'wallet.balance' }),
                total: formatMoney(Number(wallet.balance) || 0, wallet.currency, {
                    codePosition: 'suffix',
                }),
            },
        ],
        progress: {
            variant: 'bg-primary',
            value: 100,
        },
        walletData: wallet,
    }));

    useEffect(() => {
        if (isError && error) {
            handleError(error, errorMessage('common.error_loading'));
        }
    }, [isError, error, handleError, errorMessage]);

    if (isLoading && items.length === 0) {
        return <ContentLoader />;
    }

    return (
        <div className="flex flex-col items-stretch gap-5 lg:gap-7.5">
            <div id="wallets_list">
                <div className="flex flex-col gap-3">
                    {items.length > 0 ? (
                        items.map((wallet, index) => (
                            <CardWalletRow
                                key={wallet.id || index}
                                id={wallet.id}
                                logo={wallet.logo}
                                logoSize={wallet.logoSize}
                                name={wallet.name}
                                description={wallet.description}
                                statistics={wallet.statistics}
                                progress={wallet.progress}
                                url={`/wallets/${wallet.id}`}
                                walletData={wallet.walletData}
                            />
                        ))
                    ) : (
                        <div className="text-center p-8 text-secondary-foreground">
                            {intl.formatMessage({ id: 'common.no_data' })}
                        </div>
                    )}
                </div>

                {hasNextPage && (
                    <div className="flex grow justify-center pt-5 lg:pt-7.5">
                        <Button
                            mode="link"
                            underlined="dashed"
                            onClick={() => fetchNextPage()}
                            disabled={isFetchingNextPage}
                        >
                            {isFetchingNextPage
                                ? intl.formatMessage({ id: 'common.loading_more' })
                                : intl.formatMessage({ id: 'common.load_more' })}
                        </Button>
                    </div>
                )}
            </div>

            <AddWalletForm isOpen={isFormOpen} onOpenChange={setIsFormOpen} />
        </div>
    );
}
