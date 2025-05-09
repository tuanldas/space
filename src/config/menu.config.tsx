import {Image, LayoutGrid, Wallet} from 'lucide-react';
import {type MenuConfig} from './types';

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
    },
    {
        title: 'Icons.Icons',
        icon: Image,
        children: [
            {
                title: 'Icons.Wallet',
                icon: Image,
                path: '/icons/wallets',
            }
        ]
    }
];
