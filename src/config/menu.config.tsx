import { type MenuConfig } from './types';

export const MENU_SIDEBAR: MenuConfig = [
  {
    title: 'Dashboards',
    // icon: 'element-11',
    children: [
      {
        title: 'Dashboards.Dashboards',
        // icon: 'element-11',
        path: '/'
      },
      {
        title: 'Wallets.Wallets',
        // icon: 'wallet',
        path: '/wallets'
      }
    ]
  }
];
