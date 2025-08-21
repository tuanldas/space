'use client';

import { JSX, useCallback, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { Link, useLocation } from 'react-router-dom';
import { MENU_SIDEBAR_COMPACT } from '@/config/menu.config';
import { MenuConfig, MenuItem } from '@/config/types';
import { cn } from '@/lib/utils';
import { useMenuPermission } from '@/hooks/use-menu-permission.ts';
import {
    AccordionMenu,
    AccordionMenuClassNames,
    AccordionMenuGroup,
    AccordionMenuItem,
    AccordionMenuSub,
    AccordionMenuSubContent,
    AccordionMenuSubTrigger,
} from '@/components/ui/accordion-menu';

export function SidebarMenuPrimary() {
    const { pathname } = useLocation();
    const intl = useIntl();

    const t = (id?: string) => (id ? intl.formatMessage({ id, defaultMessage: id }) : '');

    // Memoize matchPath to prevent unnecessary re-renders
    const matchPath = useCallback(
        (path: string): boolean => path === pathname || (path.length > 1 && pathname.startsWith(path)),
        [pathname],
    );

    const { filterMenuByPermission } = useMenuPermission();

    const filteredMenu = useMemo(() => {
        return filterMenuByPermission(MENU_SIDEBAR_COMPACT);
    }, [filterMenuByPermission]);

    // Global classNames for consistent styling
    const classNames: AccordionMenuClassNames = {
        root: 'space-y-2.5 px-3.5',
        group: 'gap-px',
        label: 'uppercase text-xs font-medium text-muted-foreground/70 pt-2.25 pb-px',
        separator: '',
        item: 'h-9 hover:bg-transparent border border-transparent text-accent-foreground hover:text-mono data-[selected=true]:text-mono data-[selected=true]:bg-background data-[selected=true]:border-border data-[selected=true]:font-medium',
        sub: '',
        subTrigger:
            'h-9 hover:bg-transparent border border-transparent text-accent-foreground hover:text-mono data-[selected=true]:text-mono data-[selected=true]:bg-background data-[selected=true]:border-border data-[selected=true]:font-medium',
        subContent: 'py-0',
        indicator: '',
    };

    const buildMenu = (items: MenuConfig): JSX.Element[] => {
        return items.map((item: MenuItem, index: number) => {
            if (!item.heading && !item.disabled) {
                return buildMenuItemRoot(item, index);
            } else {
                return <></>;
            }
        });
    };

    const buildMenuItemRoot = (item: MenuItem, index: number): JSX.Element => {
        if (item.children) {
            return (
                <AccordionMenuSub key={index} value={item.path || `root-${index}`}>
                    <AccordionMenuSubTrigger className="text-sm font-medium">
                        {item.icon && <item.icon data-slot="accordion-menu-icon" />}
                        <span data-slot="accordion-menu-title">{t(item.title as string)}</span>
                    </AccordionMenuSubTrigger>
                    <AccordionMenuSubContent
                        type="single"
                        collapsible
                        parentValue={item.path || `root-${index}`}
                        className="ps-6"
                    >
                        <AccordionMenuGroup>{buildMenuItemChildren(item.children, 1)}</AccordionMenuGroup>
                    </AccordionMenuSubContent>
                </AccordionMenuSub>
            );
        } else {
            return (
                <AccordionMenuItem key={index} value={item.path || ''} className="text-sm font-medium">
                    <Link to={item.path || '#'}>
                        {item.icon && <item.icon data-slot="accordion-menu-icon" />}
                        <span data-slot="accordion-menu-title">{t(item.title as string)}</span>
                    </Link>
                </AccordionMenuItem>
            );
        }
    };

    const buildMenuItemChildren = (items: MenuConfig, level: number = 0): JSX.Element[] => {
        return items.map((item: MenuItem, index: number) => {
            if (!item.heading && !item.disabled) {
                return buildMenuItemChild(item, index, level);
            } else {
                return <></>;
            }
        });
    };

    const buildMenuItemChild = (item: MenuItem, index: number, level: number = 0): JSX.Element => {
        if (item.children) {
            return (
                <AccordionMenuSub key={index} value={item.path || `child-${level}-${index}`}>
                    <AccordionMenuSubTrigger className="text-[13px]">
                        {item.collapse ? (
                            <span className="text-muted-foreground">
                                <span className="hidden [[data-state=open]>span>&]:inline">
                                    {t(item.collapseTitle)}
                                </span>
                                <span className="inline [[data-state=open]>span>&]:hidden">{t(item.expandTitle)}</span>
                            </span>
                        ) : (
                            t(item.title as string)
                        )}
                    </AccordionMenuSubTrigger>
                    <AccordionMenuSubContent
                        type="single"
                        collapsible
                        parentValue={item.path || `child-${level}-${index}`}
                        className={cn('ps-4', !item.collapse && 'relative', !item.collapse && (level > 0 ? '' : ''))}
                    >
                        <AccordionMenuGroup>
                            {buildMenuItemChildren(item.children, item.collapse ? level : level + 1)}
                        </AccordionMenuGroup>
                    </AccordionMenuSubContent>
                </AccordionMenuSub>
            );
        } else {
            return (
                <AccordionMenuItem key={index} value={item.path || ''} className="text-[13px]">
                    <Link to={item.path || '#'}>{t(item.title as string)}</Link>
                </AccordionMenuItem>
            );
        }
    };

    return (
        <AccordionMenu type="single" selectedValue={pathname} matchPath={matchPath} collapsible classNames={classNames}>
            {buildMenu(filteredMenu)}
        </AccordionMenu>
    );
}
