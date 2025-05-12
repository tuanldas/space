import {IconCard} from '@/pages/WalletIcons/common/icon-card.tsx';
import {Container} from '@/components/common/container.tsx';
import {FormattedMessage} from 'react-intl';
import {StoreClientProductDetailsSheet} from '@/pages/WalletIcons/sheets/product-details-sheet.tsx';
import {useEffect, useState} from 'react';
import {useInfiniteQuery} from '@tanstack/react-query';
import {callApiGetWalletIcons} from '@/api/icon.tsx';
import {Button} from '@/components/ui/button.tsx';

interface IContentItem {
    iconId: string;
}

type IContentItems = Array<IContentItem>;

const WalletIcons = () => {
    const [items, setItems] = useState<IContentItems>([]);
    const [open, setOpen] = useState(true);
    const {data, isLoading, error, fetchNextPage, hasNextPage} = useInfiniteQuery({
        queryKey: ['wallets'],
        queryFn: callApiGetWalletIcons,
        initialPageParam: 1,
        getNextPageParam: (data) => {
            if (data.current_page < data.last_page) {
                return data.current_page + 1;
            }
        }
    });

    useEffect(() => {
        if (!isLoading && data) {
            let convertData = [...items];
            data.pages.forEach((page) => {
                convertData = [...convertData, ...page.data.map((item: any) => {
                    return {iconId: item.id};
                })];
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
        return <IconCard key={index}
                         iconId={item.iconId}/>;
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
            <StoreClientProductDetailsSheet
                open={open}
                onOpenChange={() => setOpen(false)}
            />

            {hasNextPage ? (
                <div className="flex grow justify-center pt-5 lg:pt-7.5">
                    <Button
                        onClick={() => {
                            fetchNextPage();
                        }}
                        mode="link" underlined="dashed"
                    >
                        <FormattedMessage id={'SHOW_MORE'}/>
                    </Button>
                </div>
            ) : null}
        </Container>
    );
};

export {WalletIcons};
