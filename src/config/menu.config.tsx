import { type TMenuConfig } from '@/components/menu';

export const MENU_SIDEBAR: TMenuConfig = [
  {
    title: 'Dashboards',
    icon: 'element-11',
    children: [
      {
        title: 'Light Sidebar',
        path: '/'
      },
      {
        title: 'Dark Sidebar',
        path: '/dark-sidebar'
      }
    ]
  }
];

export const MENU_MEGA: TMenuConfig = [
  {
    title: 'Home',
    path: '/'
  }
];

export const MENU_ROOT: TMenuConfig = [
  {
    title: 'Public Profile',
    icon: 'profile-circle',
    rootPath: '/public-profile/',
    path: 'public-profile/profiles/default',
    childrenIndex: 2
  }
];
