import { ICampaignItem } from '@/partials/cards';
import { toAbsoluteUrl, toBackendImageUrl } from '@/utils';

interface IWalletProps {
  icon: {
    id: string
  };
  iconSize?: string;
  logoDark?: string;
  title: string;
  description: string;
  statistics: ICampaignItem[];
  progress?: {
    variant: string;
    value: number;
  };
  url: string;
}

const WalletRow = ({
                     icon,
                     iconSize,
                     title,
                     description,
                     statistics,
                     url
                   }: IWalletProps) => {
  const renderItem = (statistic: ICampaignItem, index: number) => {
    return (
      <div
        key={index}
        className="flex flex-col gap-1.5 border border-dashed border-gray-300 rounded-md px-2.5 py-2"
      >
        <span className="text-gray-900 text-sm leading-none font-medium">{statistic.total}</span>
        <span className="text-gray-700 text-xs">{statistic.description}</span>
      </div>
    );
  };

  const addDefaultImg = (ev: any) => {
    ev.target.src = toAbsoluteUrl('/media/image.png');
  };
  return (
    <div className="card p-5 lg:p-7.5">
      <div className="flex items-center flex-wrap justify-between gap-5">
        <div className="flex items-center gap-3.5">
          <div className="flex items-center justify-center w-[50px]">
            {icon !== null ? (
              <img
                src={toBackendImageUrl(icon?.id)}
                className={`size-[${iconSize}] shrink-0`}
                alt=""
                onError={addDefaultImg}
              />
            ) : (
              <img
                src={toAbsoluteUrl('/media/image.png')}
                className={`size-[${iconSize}] shrink-0`}
                alt=""
              />
            )}
          </div>

          <div className="">
            <a href={url} className="text-lg font-medium text-gray-900 hover:text-primary">
              {title}
            </a>

            <div className="flex items-center text-sm text-gray-700">{description}</div>
          </div>
        </div>

        <div className="flex items-center flex-wrap justify-between gap-5 lg:gap-12">
          <div className="flex items-center flex-wrap gap-2 lg:gap-5">
            {statistics.map((statistic, index) => {
              return renderItem(statistic, index);
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export { WalletRow };
