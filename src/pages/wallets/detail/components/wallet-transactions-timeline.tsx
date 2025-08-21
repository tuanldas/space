import { Fragment, useMemo } from 'react';
import { callApiGetWalletTransactions, IWalletTransactionItem } from '@/api/wallet';
import { formatMoney } from '@/utils/currency';
import { useQuery } from '@tanstack/react-query';
import { Bus, CreditCard, Ticket } from 'lucide-react';
import { useIntl } from 'react-intl';
import { useErrorHandler } from '@/hooks/use-error-handler';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ContentLoader } from '@/components/common/content-loader';

type TimelineAmount = {
    value: number;
    currency?: string;
};

type TimelineItem = {
    id: string;
    title: string;
    account: string;
    category: {
        name: string;
        icon?: 'transportation' | 'entertainment' | 'other';
    };
    amount: TimelineAmount;
    date: Date;
};

type TimelineDay = {
    label: string;
    items: TimelineItem[];
};

type TimelineMonth = {
    label: string;
    total: TimelineAmount;
    days: TimelineDay[];
};

function CategoryBadge({ name, icon }: { name: string; icon?: TimelineItem['category']['icon'] }) {
    const iconEl =
        icon === 'transportation' ? (
            <Bus size={14} className="me-1" />
        ) : icon === 'entertainment' ? (
            <Ticket size={14} className="me-1" />
        ) : (
            <CreditCard size={14} className="me-1" />
        );

    return (
        <Badge appearance="light" variant="outline" className="gap-1 text-xs">
            {iconEl}
            {name}
        </Badge>
    );
}

function parseIcon(type?: string): TimelineItem['category']['icon'] {
    if (!type) return 'other';
    if (type.toLowerCase().includes('transport')) return 'transportation';
    if (type.toLowerCase().includes('entertain')) return 'entertainment';
    return 'other';
}

function groupTransactions(
    data: IWalletTransactionItem[],
    currency: string,
    intl: ReturnType<typeof useIntl>,
): { today: TimelineDay | null; months: TimelineMonth[] } {
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const items: TimelineItem[] = data.map((tx) => {
        const date = new Date(tx.transaction_date);
        return {
            id: tx.id,
            title:
                tx.description || tx.category?.name || intl.formatMessage({ id: 'wallet.transaction.default_title' }),
            account: tx.wallet_id,
            category: {
                name: (tx.category?.name || '').toUpperCase(),
                icon: parseIcon(tx.category?.name),
            },
            amount: { value: Number(tx.amount), currency },
            date,
        };
    });

    const todayItems = items.filter((i) => i.date >= startOfToday);
    const todayLabel = intl.formatMessage({ id: 'common.today', defaultMessage: 'Today' }).toUpperCase();
    const todayDay: TimelineDay | null =
        todayItems.length > 0
            ? {
                  label: todayLabel,
                  items: todayItems.sort((a, b) => b.date.getTime() - a.date.getTime()),
              }
            : null;

    const byMonth = new Map<string, TimelineMonth>();
    items
        .filter((i) => i.date < startOfToday)
        .forEach((i) => {
            const monthLabel = intl.formatDate(i.date, {
                month: 'long',
                year: 'numeric',
            }) as string;
            const key = `${i.date.getFullYear()}-${i.date.getMonth()}`;
            if (!byMonth.has(key)) {
                byMonth.set(key, {
                    label: monthLabel,
                    total: { value: 0, currency },
                    days: [],
                });
            }
            const month = byMonth.get(key)!;

            const dayLabel = (
                intl.formatDate(i.date, {
                    weekday: 'short',
                    month: 'long',
                    day: 'numeric',
                }) as string
            ).toUpperCase();

            let day = month.days.find((d) => d.label === dayLabel);
            if (!day) {
                day = { label: dayLabel, items: [] };
                month.days.push(day);
            }

            day.items.push(i);
            month.total.value += i.amount.value;
        });

    const months = Array.from(byMonth.values()).map((m) => ({
        ...m,
        days: m.days
            .map((d) => ({
                ...d,
                items: d.items.sort((a, b) => b.date.getTime() - a.date.getTime()),
            }))
            .sort((a, b) => {
                const da = a.items[0]?.date?.getTime() ?? 0;
                const db = b.items[0]?.date?.getTime() ?? 0;
                return db - da;
            }),
    }));

    months.sort((a, b) => {
        const aTime = Math.max(...a.days.flatMap((d) => d.items.map((it) => it.date.getTime())));
        const bTime = Math.max(...b.days.flatMap((d) => d.items.map((it) => it.date.getTime())));
        return bTime - aTime;
    });

    return { today: todayDay, months };
}

export function WalletTransactionsTimeline({ walletId, currency = 'USD' }: { walletId: string; currency?: string }) {
    const intl = useIntl();
    const { handleError } = useErrorHandler();

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['wallet-transactions', walletId],
        queryFn: () => callApiGetWalletTransactions(walletId, { per_page: 50, page: 1 }),
        enabled: Boolean(walletId),
    });

    const grouped = useMemo(() => {
        const txs = data?.data || [];
        return groupTransactions(txs, currency, intl);
    }, [data, currency, intl]);

    if (isLoading) return <ContentLoader />;
    if (isError && error) {
        handleError(error, {
            title: intl.formatMessage({ id: 'common.error_loading' }),
        });
    }

    const renderDay = (day: TimelineDay) => (
        <div key={day.label} className="flex flex-col gap-3">
            <div className="text-xs font-semibold text-secondary-foreground uppercase">{day.label}</div>
            <div className="flex flex-col">
                {day.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 py-3 border-b border-border last:border-b-0">
                        <Checkbox className="mt-0.5" />
                        <div className="flex flex-col grow min-w-0">
                            <div className="flex items-center gap-2 min-w-0">
                                <a href="#" className="text-mono text-sm font-medium hover:text-primary truncate">
                                    {item.title}
                                </a>
                                <span className="text-xs text-secondary-foreground truncate">{item.account}</span>
                            </div>
                        </div>
                        <div className="shrink-0 flex items-center gap-3">
                            <CategoryBadge name={item.category.name} icon={item.category.icon} />
                            <span
                                className={
                                    'text-sm font-medium text-mono ' + (item.amount.value > 0 ? 'text-green-600' : '')
                                }
                            >
                                {item.amount.value < 0 ? '-' : item.amount.value > 0 ? '+' : ''}
                                {formatMoney(item.amount.value, item.amount.currency, {
                                    codePosition: 'suffix',
                                })}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="flex flex-col gap-7">
            {grouped.today && (
                <Fragment>
                    {renderDay(grouped.today)}
                    <div className="border-b border-input" />
                </Fragment>
            )}

            {grouped.months.map((month) => (
                <Fragment key={month.label}>
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-mono">{month.label}</h3>
                        <span className="text-lg font-semibold text-mono">
                            {month.total.value < 0 ? '-' : month.total.value > 0 ? '+' : ''}
                            {formatMoney(month.total.value, month.total.currency, {
                                codePosition: 'suffix',
                            })}
                        </span>
                    </div>
                    <div className="flex flex-col gap-4">{month.days.map((day) => renderDay(day))}</div>
                </Fragment>
            ))}
        </div>
    );
}
