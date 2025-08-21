import { Fragment } from 'react';
import { formatMoney } from '@/utils/currency';
import { Bus, CreditCard, Ticket } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

export type TimelineAmount = {
    value: number;
    currency?: string;
};

export type TimelineItem = {
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

export type TimelineDay = {
    label: string;
    items: TimelineItem[];
};

export type TimelineMonth = {
    label: string;
    total: TimelineAmount;
    days: TimelineDay[];
};

export function CategoryBadge({ name, icon }: { name: string; icon?: TimelineItem['category']['icon'] }) {
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

function DaySection({ day }: { day: TimelineDay }) {
    return (
        <div className="flex flex-col gap-3">
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
}

export function TransactionsTimeline({ grouped }: { grouped: { today: TimelineDay | null; months: TimelineMonth[] } }) {
    return (
        <div className="flex flex-col gap-7">
            {grouped.today && (
                <Fragment>
                    <DaySection day={grouped.today} />
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
                    <div className="flex flex-col gap-4">
                        {month.days.map((day) => (
                            <DaySection key={day.label} day={day} />
                        ))}
                    </div>
                </Fragment>
            ))}
        </div>
    );
}
