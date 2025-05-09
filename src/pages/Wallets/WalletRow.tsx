import {ICampaignItem} from '@/partials/cards';
import {toAbsoluteUrl, toBackendImageUrl} from '@/lib/helpers.ts';
import {Card} from '@/components/ui/card';
import {Link} from 'react-router';
import {Badge} from '@/components/ui/badge';

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
    status?: {
        variant?:
            | 'primary'
            | 'mono'
            | 'destructive'
            | 'secondary'
            | 'info'
            | 'success'
            | 'warning'
            | null
            | undefined;
        label: string;
    };
    url: string;
}

const WalletRow = ({
                       icon,
                       iconSize,
                       title,
                       description,
                       statistics,
                       status,
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
        if (!ev.target.dataset.defaultLoaded && ev.target.src !== toAbsoluteUrl('/media/image.png')) {
            ev.target.src = toAbsoluteUrl('/media/image.png');
            ev.target.dataset.defaultLoaded = 'true';
            ev.target.style.display = 'none';
        }
    };
    return (
        <Card className="p-5 lg:p-7.5">
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
                    <div>
                        <Link
                            to={url}
                            className="text-lg font-medium text-mono hover:text-primary"
                        >
                            {title}
                        </Link>
                        <div className="flex items-center text-sm text-secondary-foreground">
                            {description}
                        </div>
                    </div>
                </div>
                <div className="flex items-center flex-wrap justify-between gap-5 lg:gap-12">
                    <div className="flex items-center flex-wrap gap-2 lg:gap-5">
                        {statistics.map((statistic, index) => {
                            return renderItem(statistic, index);
                        })}
                    </div>
                    {
                        status
                            ? <div className="flex justify-center w-20">
                                <Badge size="lg" variant={status.variant} appearance="outline">
                                    {status.label}
                                </Badge>
                            </div>
                            : null
                    }
                </div>
            </div>
        </Card>
    );
};

export {WalletRow};
