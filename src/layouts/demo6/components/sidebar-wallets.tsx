'use client';

import { Fragment } from 'react';
import { callApiGetSidebarWallets } from '@/api/wallet';
import { formatMoney } from '@/utils/currency';
import { useQuery } from '@tanstack/react-query';
import { ChevronDown } from 'lucide-react';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useErrorHandler } from '@/hooks/use-error-handler';
import {
    AccordionMenu,
    AccordionMenuClassNames,
    AccordionMenuItem,
    AccordionMenuSeparator,
    AccordionMenuSub,
    AccordionMenuSubContent,
    AccordionMenuSubTrigger,
} from '@/components/ui/accordion-menu';

interface Wallet {
    id: string;
    name: string;
    balance: number;
    currency: string;
}

interface Item {
    title: string;
    value: string;
    plus?: boolean;
    children: ItemChild[];
}

interface ItemChild {
    title: string;
    path: string;
    active?: boolean;
    balance?: string;
    currency?: string;
}

export function SidebarWallets() {
    const intl = useIntl();
    const { handleError } = useErrorHandler();

    const { data: apiWallets = [], isLoading } = useQuery<Wallet[]>({
        queryKey: ['sidebar-wallets'],
        queryFn: async () => {
            try {
                const response = await callApiGetSidebarWallets();
                return response.data || [];
            } catch (error) {
                handleError(error);
                return [];
            }
        },
        staleTime: 1000 * 60 * 5,
    });

    // Chuyển đổi dữ liệu API thành định dạng của menu
    const items: Item[] = [
        {
            title: intl.formatMessage({ id: 'my.wallets' }),
            value: 'my-wallets',
            children: apiWallets.map((wallet) => ({
                title: wallet.name,
                path: `/wallets/${wallet.id}`,
                balance: formatMoney(wallet.balance, wallet.currency, {
                    codePosition: 'suffix',
                }),
                currency: wallet.currency,
            })),
        },
    ];

    // Nếu không có dữ liệu và không đang tải, không hiển thị gì
    if (items[0].children.length === 0 && !isLoading) {
        return null;
    }

    const classNames: AccordionMenuClassNames = {
        root: 'flex flex-col w-full gap-1.5 px-3.5',
        group: 'gap-px',
        item: 'group h-9 hover:bg-transparent border border-transparent text-accent-foreground hover:text-primary hover:bg-background hover:border-border data-[selected=true]:text-primary data-[selected=true]:bg-background data-[selected=true]:border-border data-[selected=true]:font-medium',
        sub: '',
        subTrigger:
            'justify-between h-9 hover:bg-transparent border border-transparent text-accent-foreground hover:text-primary data-[selected=true]:text-primary data-[selected=true]:bg-background data-[selected=true]:border-border data-[selected=true]:font-medium [&_[data-slot=accordion-menu-sub-indicator]]:hidden',
        subContent: 'p-0',
        subWrapper: 'space-y-1.5',
        indicator: 'text-sm text-muted-foreground',
    };

    return (
        <>
            <AccordionMenu type="single" collapsible classNames={classNames} defaultValue="my-wallets">
                {items.map((item, index) => (
                    <Fragment key={index}>
                        <AccordionMenuSub value={item.value}>
                            <AccordionMenuSubTrigger>
                                <div className="flex items-center gap-2">
                                    <ChevronDown className={cn('text-sm')} />
                                    <span>{item.title}</span>
                                </div>
                            </AccordionMenuSubTrigger>
                            <AccordionMenuSubContent type="single" collapsible parentValue={item.value}>
                                {isLoading ? (
                                    <div className="py-2 px-3 text-sm text-muted-foreground">
                                        {intl.formatMessage({ id: 'common.loading' })}
                                    </div>
                                ) : (
                                    item.children.map((child, childIndex) => (
                                        <AccordionMenuItem
                                            key={childIndex}
                                            value={`wallet-${childIndex}`}
                                            className={cn(child.active && 'active')}
                                        >
                                            <Link
                                                to={child.path}
                                                className="flex items-center justify-between w-full px-2"
                                            >
                                                <span>{child.title}</span>
                                                {child.balance && (
                                                    <span className="text-sm text-muted-foreground">
                                                        {child.balance}
                                                    </span>
                                                )}
                                            </Link>
                                        </AccordionMenuItem>
                                    ))
                                )}
                            </AccordionMenuSubContent>
                        </AccordionMenuSub>
                        {index !== items.length - 1 && (
                            <AccordionMenuSeparator className="border-b border-input my-2 mx-1.5" />
                        )}
                    </Fragment>
                ))}
            </AccordionMenu>
        </>
    );
}
