import { ICampaignItem, ICampaignProps } from '@/partials/cards';
import { toAbsoluteUrl } from '@/utils';

const WalletRow = ({
  logo,
  logoSize,
  logoDark,
  title,
  description,
  status,
  statistics,
  url
}: ICampaignProps) => {
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
            <img
              src={logo}
              className={`size-[${logoSize}] shrink-0`}
              alt=""
              onError={addDefaultImg}
            />
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

          <div className="flex justify-center w-20">
            <span className={`badge ${status.variant} badge-outline`}>{status.label}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export { WalletRow };
