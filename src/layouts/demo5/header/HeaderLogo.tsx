import { Link, useLocation } from 'react-router-dom';
import { toAbsoluteUrl } from '@/utils';
import { useResponsive } from '@/hooks';
import { KeenIcon, Menu, MenuArrow, MenuIcon, MenuItem, MenuLink, MenuSub, MenuTitle, MenuToggle } from '@/components';

import { useDemo5Layout } from '..';
import { useLanguage } from '@/i18n';
import { useEffect, useState } from 'react';

interface IHeaderLogoTeam {
  title: string;
  icon: string;
  urlPartial: string;
  path: string;
}

interface IHeaderLogoTeams extends Array<IHeaderLogoTeam> {
}

interface IHeaderLogoItem {
  title: string;
  icon: string;
  path: string;
}

interface IHeaderLogoItems extends Array<IHeaderLogoItem> {
}

const items: IHeaderLogoItems = [
  {
    title: 'Account',
    icon: 'setting-2',
    path: '/'
  }
];

const HeaderLogo = () => {
  const desktopMode = useResponsive('up', 'lg');
  const { setMobileSidebarOpen } = useDemo5Layout();
  const { isRTL } = useLanguage();
  const { pathname } = useLocation();
  const [selectedMenuItem, setSelectedMenuItem] = useState(items[0]);

  useEffect(() => {
    items.forEach((item) => {
      if (item.path && pathname.includes(item.path)) {
        setSelectedMenuItem(item);
      }
    });
  }, [pathname]);

  const handleSidebarOpen = () => {
    setMobileSidebarOpen(true);
  };

  const teams: IHeaderLogoTeams = [
    {
      title: 'MetronicTeam',
      icon: 'profile-circle',
      urlPartial: '/public-profile/',
      path: '/public-profile/profiles/default'
    }
  ];

  return (
    <div className="flex items-center gap-2 lg:gap-5">
      <button
        type="button"
        onClick={handleSidebarOpen}
        className="btn btn-icon btn-light btn-clear btn-sm -ms-2 lg:hidden"
      >
        <KeenIcon icon="menu" />
      </button>

      <Link to="/">
        <img
          src={toAbsoluteUrl('/media/app/mini-logo-circle.svg')}
          className="dark:hidden min-h-[34px]"
          alt="logo"
        />
        <img
          src={toAbsoluteUrl('/media/app/mini-logo-circle-dark.svg')}
          className="hidden dark:inline-block min-h-[34px]"
          alt="logo"
        />
      </Link>

      {desktopMode && (
        <div className="lg:flex items-center">
          <Menu className="menu-default">
            <MenuItem
              toggle="dropdown"
              trigger="hover"
              dropdownProps={{
                placement: isRTL() ? 'bottom-end' : 'bottom-start',
                modifiers: [
                  {
                    name: 'offset',
                    options: {
                      offset: [0, 10] // [skid, distance]
                    }
                  }
                ]
              }}
            >
              <MenuToggle className="text-gray-900 text-sm font-medium">
                MetronicTeam
                <MenuArrow>
                  <KeenIcon icon="down" />
                </MenuArrow>
              </MenuToggle>
              <MenuSub className="menu-default w-48 py-2">
                {teams.map((team, index) => (
                  <MenuItem key={index}>
                    <MenuLink path={team.path}>
                      {team.icon && (
                        <MenuIcon>
                          <KeenIcon icon={team.icon} />
                        </MenuIcon>
                      )}
                      <MenuTitle>{team.title}</MenuTitle>
                    </MenuLink>
                  </MenuItem>
                ))}
              </MenuSub>
            </MenuItem>
          </Menu>

          <span className="text-sm text-gray-400 font-medium px-2.5 md:inline">/</span>

          <Menu className="menu-default">
            <MenuItem
              toggle="dropdown"
              trigger="hover"
              dropdownProps={{
                placement: isRTL() ? 'bottom-end' : 'bottom-start',
                modifiers: [
                  {
                    name: 'offset',
                    options: {
                      offset: [0, 10] // [skid, distance]
                    }
                  }
                ]
              }}
            >
              <MenuToggle className="text-gray-900 text-sm font-medium">
                {selectedMenuItem.title}
                <MenuArrow>
                  <KeenIcon icon="down" />
                </MenuArrow>
              </MenuToggle>
              <MenuSub className="menu-default w-48 py-2">
                {items.map((item, index) => (
                  <MenuItem key={index}>
                    <MenuLink path={item.path}>
                      {item.icon && (
                        <MenuIcon>
                          <KeenIcon icon={item.icon} />
                        </MenuIcon>
                      )}
                      <MenuTitle>{item.title}</MenuTitle>
                    </MenuLink>
                  </MenuItem>
                ))}
              </MenuSub>
            </MenuItem>
          </Menu>
        </div>
      )}
    </div>
  );
};

export { HeaderLogo };
