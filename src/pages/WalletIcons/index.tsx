import {IconCard} from '@/pages/WalletIcons/common/icon-card.tsx';
import {Container} from '@/components/common/container.tsx';
import {FormattedMessage} from 'react-intl';
import {StoreClientProductDetailsSheet} from '@/pages/WalletIcons/sheets/wallet-icon-details.tsx';
import {useEffect, useState} from 'react';
import {InfiniteData, useInfiniteQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {callApiDeleteWalletIcons, callApiGetWalletIcons} from '@/api/icon.tsx';
import {Button} from '@/components/ui/button.tsx';
import {toast} from 'sonner';
import {Alert, AlertIcon, AlertTitle} from '@/components/ui/alert';
import {RiCheckboxCircleFill} from '@remixicon/react';
import {ContentLoader} from '@/components/common/content-loader.tsx';

interface IContentItem {
    iconId: string;
}

type IContentItems = Array<IContentItem>;

interface WalletIconPageResponse {
    data: any;
    current_page: number;
    last_page: number;
}

type InfiniteWalletIconData = InfiniteData<WalletIconPageResponse>;

const WalletIcons = () => {
    const queryClient = useQueryClient();
    const queryKey = ['wallets'];

    const [items, setItems] = useState<IContentItems>([]);
    const [open, setOpen] = useState(false);
    const [walletIconId, setWalletIconId] = useState<string | null>(null);
    const {data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage} = useInfiniteQuery({
        queryKey: queryKey,
        queryFn: callApiGetWalletIcons,
        initialPageParam: 1,
        getNextPageParam: (data) => {
            if (data.current_page < data.last_page) {
                return data.current_page + 1;
            }
        }
    });

    const deleteWalletIconMutation = useMutation<
        any,
        Error,
        string,
        { previousWallets?: InfiniteWalletIconData }
    >({
        mutationFn: (idToDelete) => callApiDeleteWalletIcons(idToDelete),
        onMutate: async (idToDelete) => {
            await queryClient.cancelQueries({queryKey: queryKey});
            const previousWallets = queryClient.getQueryData<InfiniteWalletIconData>(queryKey);

            queryClient.setQueryData<InfiniteWalletIconData>(queryKey, (oldData) => {
                if (!oldData) return undefined;

                toast.custom(
                    (t) => (
                        <Alert
                            variant="success"
                            icon="success"
                            close={true}
                            appearance={'outline'}
                            onClose={() => toast.dismiss(t)}
                        >
                            <AlertIcon>
                                <RiCheckboxCircleFill/>
                            </AlertIcon>
                            <AlertTitle>
                                <FormattedMessage
                                    id={'common.deleteSuccess'}
                                    values={{
                                        'item': <FormattedMessage id={'icons.wallet'}/>
                                    }}
                                />
                            </AlertTitle>
                        </Alert>
                    )
                );
                setOpen(!open);

                return {
                    ...oldData,
                    pages: oldData.pages.map(page => ({
                        ...page,
                        data: page.data.filter((icon: { id: string }) => icon.id !== idToDelete),
                    })),
                };
            });

            return {previousWallets};
        },
        onError: (err, idToDelete, context) => {
            if (context?.previousWallets) {
                queryClient.setQueryData(queryKey, context.previousWallets);
                setOpen(!open);
                setWalletIconId(null);
            }
            console.error(`Lỗi khi xóa Wallet Icon ID ${idToDelete}:`, err.message);
        },
        onSettled: () => {
            queryClient.invalidateQueries({queryKey: queryKey});
        },
    });

    useEffect(() => {
        if (!isLoading && data) {
            let convertData: any[] = [];
            data.pages.forEach((page) => {
                const contentData2 = page.data.map((item: any) => {
                    return {iconId: item.id};
                });
                convertData = [...convertData, ...contentData2];
            });
            setItems(convertData);
        }
    }, [isLoading, data]);

    useEffect(() => {
        if (error) {
            console.error('Đã có lỗi xảy ra khi lấy dữ liệu từ server');
        }
    }, [error]);

    const renderItem = (item: IContentItem, index: number) => {
        return <div
            key={item.iconId}
            onClick={() => {
                setOpen(true);
                setWalletIconId(item.iconId);
            }}>
            <IconCard key={index}
                      iconId={item.iconId}/>
        </div>;
    };

    const onDeleteWalletIcon = () => {
        if (walletIconId) {
            deleteWalletIconMutation.mutate(walletIconId);
        }
    };

    return (
        <Container>
            <div className="flex flex-col items-stretch gap-7">
                <div className="flex flex-wrap items-center gap-5 justify-between mt-3">
                    <h3 className="text-sm text-mono font-medium">
                        <FormattedMessage
                            id={'pagination.summary'}
                            values={{
                                start: 1,
                                end: 250,
                                total: 500,
                            }}
                        />
                    </h3>
                </div>

                <div
                    className={'grid sm:grid-cols-4 gap-5 mb-2'}
                >
                    {items.map((item, index) => {
                        return renderItem(item, index);
                    })}
                </div>
            </div>
            {
                walletIconId
                    ? <StoreClientProductDetailsSheet
                        open={open}
                        walletIconId={walletIconId}
                        onOpenChange={() => setOpen(!open)}
                        isPendingDelete={deleteWalletIconMutation.isPending}
                        onDeleteWalletIcon={onDeleteWalletIcon}
                    />
                    : null
            }

            {hasNextPage && !isLoading && !isFetchingNextPage ? (
                <div className="flex grow justify-center pt-5 lg:pt-7.5">
                    <Button
                        onClick={() => {
                            fetchNextPage();
                        }}
                        mode="link" underlined="dashed"
                    >
                        <FormattedMessage id={'common.showMore'}/>
                    </Button>
                </div>
            ) : null
            }

            {
                isLoading || isFetchingNextPage
                    ?
                    <div className="flex grow justify-center pt-5 lg:pt-7.5">
                        <ContentLoader/>
                    </div>
                    : null
            }
        </Container>
    );
};

export {WalletIcons};
