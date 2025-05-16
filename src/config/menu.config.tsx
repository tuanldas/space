import {Image, LayoutGrid, Wallet} from 'lucide-react';
import {type MenuConfig} from './types';

export const MENU_ROOT: MenuConfig = [
    {
        title: 'dashboards.dashboards',
        icon: LayoutGrid,
        rootPath: '/',
        path: '/',
        childrenIndex: 1,
    },
];
export const MENU_SIDEBAR_COMPACT: MenuConfig = [
    {
        title: 'dashboards.dashboards',
        icon: LayoutGrid,
        path: '/',
    },
    {
        title: 'wallets.wallets',
        icon: Wallet,
        path: '/wallets'
    },
    {
        title: 'icons.icons',
        icon: Image,
        children: [
            {
                title: 'icons.wallet',
                icon: Image,
                path: '/icons/wallets',
            }
        ]
    }
];
