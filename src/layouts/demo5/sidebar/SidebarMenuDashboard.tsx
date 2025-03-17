import { KeenIcon, Menu, MenuItem, MenuLink, MenuTitle } from '@/components';

interface IMenuItem {
  title: string;
  path: string;
  icon: string;
  active?: boolean;
}

interface IDashboardMenuItem {
  title: string;
  children: IMenuItem[];
}

interface IDashboardMenuItems extends Array<IDashboardMenuItem> {
}

const SidebarMenuDashboard = () => {
  const menuItems: IDashboardMenuItems = [
    {
      title: '',
      children: [
        {
          title: 'API Setup',
          icon: 'setting',
          path: '/'
        }
      ]
    }
  ];

  return (
    <div className="flex flex-col gap-7.5 px-2.5">
      <Menu highlight={true} className="flex-col gap-5">
        {menuItems.map((heading, index) => (
          <div key={index} className="flex flex-col gap-px">
            <MenuItem>
              <div className="px-2 text-xs font-medium text-gray-600">{heading.title}</div>
            </MenuItem>

            {heading.children.map((item, index) => (
              <MenuItem key={index} className={item.active ? 'active' : ''}>
                <MenuLink
                  path={item.path}
                  className="py-2 px-2.5 gap-2 rounded-md border border-transparent menu-item-active:border-gray-200 menu-item-active:bg-light menu-link-hover:bg-light menu-link-hover:border-gray-200"
                >
                  <KeenIcon icon={item.icon} />
                  <MenuTitle
                    className="text-2sm text-gray-800 menu-item-active:font-medium menu-item-active:text-primary menu-link-hover:text-primary">
                    {item.title}
                  </MenuTitle>
                </MenuLink>
              </MenuItem>
            ))}
          </div>
        ))}
      </Menu>
    </div>
  );
};

export { SidebarMenuDashboard };
