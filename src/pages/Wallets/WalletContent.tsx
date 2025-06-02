import {useEffect, useState} from 'react';
import {useInfiniteQuery} from '@tanstack/react-query';
import {callApiGetWallets} from '@/api/wallet';
import {WalletRow} from './WalletRow';
import {FormattedMessage} from 'react-intl';
import {renderCurrency} from '@/utils/data.ts';
import {Button} from '@/components/ui/button';

interface ICampaignsContentItem {
    id: string;
    icon: {
        id: string
    };
    iconSize?: string;
    logoDark?: string;
    title: string;
    description: string;
    status: {
        variant: string;
        label: string;
    };
    statistics: Array<{ total: string; description: string }>;
    progress: {
        variant: string;
        value: number;
    };
}

type ICampaignsContentItems = Array<ICampaignsContentItem>

const WalletContent = () => {
    const [items, setItems] = useState<ICampaignsContentItems>([]);
    const {data, isLoading, error, fetchNextPage, hasNextPage} = useInfiniteQuery({
        queryKey: ['wallets'],
        queryFn: callApiGetWallets,
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
                const pageData = page.data;
                const convertData2 = pageData.map((item: any) => {
                    return {
                        id: item.id,
                        icon: item.icon,
                        logoSize: '50px',
                        title: item.name,
                        description: renderCurrency(item.balance, item.currency),
                        statistics: []
                    };
                });
                convertData = [...convertData, ...convertData2];
            });
            setItems(convertData);
        }
    }, [isLoading, data]);

    useEffect(() => {
        if (error) {
            console.error('Đã có lỗi xảy ra khi lấy dữ liệu từ server');
        }
    }, [error]);

    const renderItem = (data: ICampaignsContentItem, index: number) => {
        return (
            <WalletRow
                icon={data.icon}
                iconSize={data.iconSize}
                title={data.title}
                description={data.description}
                statistics={[]}
                url={`/wallets/${data.id}`}
                key={index}
            />
        );
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-stretch gap-5 lg:gap-7.5">
                <div className="flex flex-wrap items-center gap-5 justify-between"></div>

                <div className={''} id="campaigns_list">
                    <div className="flex flex-col gap-5 lg:gap-7.5">
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div className="flex flex-col items-stretch gap-5 lg:gap-7.5">
            <div className="flex flex-wrap items-center gap-5 justify-between"></div>

            <div id="campaigns_list">
                <div className="flex flex-col gap-5 lg:gap-7.5 pb-5 lg:pb-7.5">
                    {items.map((data, index) => {
                        return renderItem(data, index);
                    })}
                </div>
                {hasNextPage ? (
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
                ) : null}
            </div>
        </div>
    );
};
export {WalletContent};
