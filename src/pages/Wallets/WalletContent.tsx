import { useInfiniteQuery } from '@tanstack/react-query';
import { callApiGetWallets } from '@/api/wallet.tsx';
import CardCampaignRowLoading from '@/partials/loading/CardCampaignRowLoading.tsx';
import { useEffect, useState } from 'react';
import { renderCurrency } from '@/utils';
import { FormattedMessage } from 'react-intl';
import { WalletRow } from '@/pages/Wallets/WalletRow.tsx';

interface ICampaignsContentItem {
  id: string;
  logo: string;
  logoSize?: string;
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

interface ICampaignsContentItems extends Array<ICampaignsContentItem> {
}

const WalletContent = () => {
  const [items, setItems] = useState<ICampaignsContentItems>([]);
  const { data, isLoading, error, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ['wallets'],
    queryFn: callApiGetWallets,
    initialPageParam: 1,
    getNextPageParam: (data) => {
      if (data.current_page < data.last_page) {
        return data.current_page + 1;
      }
    },
    getPreviousPageParam: (data) => {
      if (data.current_page > 1) {
        return data.current_page - 1;
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
            logo: item.icon,
            logoSize: '50px',
            title: item.name,
            description: renderCurrency(item.balance, item.currency),
            status: {
              variant: 'badge-success',
              label: item.type
            },
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
        logo={data.logo}
        logoSize={data.logoSize}
        title={data.title}
        description={data.description}
        status={data.status}
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
            {Array.from({ length: 10 }).map((_, index) => {
              return <CardCampaignRowLoading key={index} />;
            })}
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
            <button
              onClick={() => {
                fetchNextPage();
              }}
              className="btn btn-link"
            >
              <FormattedMessage id={'SHOW_MORE'} />
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};
export { WalletContent };
