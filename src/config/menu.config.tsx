import {LayoutGrid, Wallet} from 'lucide-react';
import {type MenuConfig} from './types';

export const MENU_SIDEBAR: MenuConfig = [
    {
        title: 'Dashboards.Dashboards',
        icon: LayoutGrid,
        children: [
            {
                title: 'Dashboards.Dashboards',
                icon: LayoutGrid,
                path: '/'
            },
            {
                title: 'Wallets.Wallets',
                icon: Wallet,
                path: '/wallets'
            }
        ]
    }
];
export const MENU_ROOT: MenuConfig = [
    {
        title: 'Dashboards.Dashboards',
        icon: LayoutGrid,
        rootPath: '/',
        path: '/',
        childrenIndex: 1,
    },
];
export const MENU_SIDEBAR_COMPACT: MenuConfig = [
    {
        title: 'Dashboards.Dashboards',
        icon: LayoutGrid,
        path: '/',
    },
    {
        title: 'Wallets.Wallets',
        icon: Wallet,
        path: '/wallets'
    }
];
