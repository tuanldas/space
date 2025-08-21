import { formatMoney } from '@/utils/currency';
import { useIntl } from 'react-intl';

interface WalletProfileSectionProps {
    wallet: {
        id: string;
        name: string;
        currency: string;
        balance: string | number;
        logo?: string;
    };
}

export function WalletProfileSection({ wallet }: WalletProfileSectionProps) {
    const intl = useIntl();

    const statistics: Array<{ total: string; description: string }> = [
        {
            total: formatMoney(Number(wallet.balance) || 0, wallet.currency, {
                codePosition: 'suffix',
            }),
            description: intl.formatMessage({ id: 'wallet.balance' }),
        },
    ];

    const renderItem = (statistic: { total: string; description: string }, index: number) => {
        return (
            <div
                key={index}
                className="flex flex-col gap-1.5 px-2.75 py-2.25 border border-dashed border-input rounded-md"
            >
                <span className="text-mono text-sm leading-none font-medium">{statistic.total}</span>
                <span className="text-secondary-foreground text-xs">{statistic.description}</span>
            </div>
        );
    };

    return (
        <div className="flex flex-col gap-5 lg:gap-7.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2.5">
                        <h2 className="text-2xl font-semibold text-mono">{wallet.name}</h2>
                    </div>
                </div>
            </div>
            <div className="flex items-center flex-wrap gap-3 lg:gap-5">
                {statistics.map((statistic, index) => renderItem(statistic, index))}
            </div>
        </div>
    );
}
