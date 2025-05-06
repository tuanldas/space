import {useCallback, useMemo} from 'react';
import {Link, useLocation} from 'react-router-dom';
import {
    AccordionMenu,
    AccordionMenuClassNames,
    AccordionMenuGroup,
    AccordionMenuItem,
    AccordionMenuLabel,
} from '@/components/ui/accordion-menu';
import {FormattedMessage} from 'react-intl';

interface MenuItem {
    title: string;
    path?: string;
    active?: boolean;
}

interface MenuLabel {
    label: string;
}

type MenuNode = MenuItem | MenuLabel;

export function SidebarMenuDashboard() {
    const {pathname} = useLocation();

    const menuItems = useMemo<MenuNode[]>(
        () => [
            {label: 'Menu'},
            {title: 'Dashboards.Dashboards', path: '/'},
        ],
        [],
    );

    const classNames: AccordionMenuClassNames = {
        root: 'space-y-1',
        label:
            'uppercase text-xs font-medium text-muted-foreground/80 mb-2 pb-0',
        item: 'h-8 hover:bg-background border-accent text-accent-foreground hover:text-primary data-[selected=true]:text-primary data-[selected=true]:bg-background data-[selected=true]:font-medium',
    };

    const matchPath = useCallback(
        (path: string): boolean =>
            path === pathname || (path.length > 1 && pathname.startsWith(path)),
        [pathname],
    );

    const memoizedMenu = useMemo(
        () => (
            <AccordionMenuGroup>
                {menuItems.map((item, index) =>
                    'label' in item ? (
                        <AccordionMenuLabel key={index}><FormattedMessage id={item.label}/></AccordionMenuLabel>
                    ) : (
                        <AccordionMenuItem
                            key={index}
                            value={item.path || `item-${index}`}
                            className="text-sm"
                        >
                            <Link to={item.path || '#'}><FormattedMessage id={item.title}/></Link>
                        </AccordionMenuItem>
                    ),
                )}
            </AccordionMenuGroup>
        ),
        [menuItems],
    );

    const buildMenu = () => {
        return (
            <AccordionMenu
                selectedValue={'/account/home/settings-sidebar'}
                matchPath={matchPath}
                type="single"
                collapsible
                classNames={classNames}
            >
                {memoizedMenu}
            </AccordionMenu>
        );
    };

    return (
        <div className="w-full space-y-1">
            {buildMenu()}
        </div>
    );
}
