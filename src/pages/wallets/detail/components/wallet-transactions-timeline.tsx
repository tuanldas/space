import { useMemo } from 'react';
import { callApiGetWalletTransactions, IWalletTransactionItem } from '@/api/wallet';
import { useQuery } from '@tanstack/react-query';
import { useIntl } from 'react-intl';
import { useErrorHandler } from '@/hooks/use-error-handler';
import { ContentLoader } from '@/components/common/content-loader';
import { TimelineDay, TimelineMonth, TransactionsTimeline } from '@/components/transactions/transactions-timeline';

function parseIcon(type?: string): 'transportation' | 'entertainment' | 'other' {
    if (!type) return 'other';
    if (type.toLowerCase().includes('transport')) return 'transportation';
    if (type.toLowerCase().includes('entertain')) return 'entertainment';
    return 'other';
}

export function groupWalletTransactions(
    data: IWalletTransactionItem[],
    currency: string,
    intl: ReturnType<typeof useIntl>,
): { today: TimelineDay | null; months: TimelineMonth[] } {
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const items = data.map((tx) => {
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
            const monthLabel = intl.formatDate(i.date, { month: 'long', year: 'numeric' }) as string;
            const key = `${i.date.getFullYear()}-${i.date.getMonth()}`;
            if (!byMonth.has(key)) {
                byMonth.set(key, { label: monthLabel, total: { value: 0, currency }, days: [] });
            }
            const month = byMonth.get(key)!;

            const dayLabel = (
                intl.formatDate(i.date, { weekday: 'short', month: 'long', day: 'numeric' }) as string
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
            .map((d) => ({ ...d, items: d.items.sort((a, b) => b.date.getTime() - a.date.getTime()) }))
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
        return groupWalletTransactions(txs, currency, intl);
    }, [data, currency, intl]);

    if (isLoading) return <ContentLoader />;
    if (isError && error) {
        handleError(error, { title: intl.formatMessage({ id: 'common.error_loading' }) });
    }

    return <TransactionsTimeline grouped={grouped} />;
}
