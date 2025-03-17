import { Fragment } from 'react';
import { Helmet } from 'react-helmet-async';
import { Outlet, useLocation } from 'react-router';
import { useMenuCurrentItem } from '@/components/menu';
import { useMenus } from '@/providers';

import { Footer, Header, Navbar } from '../';
import { Sidebar } from '../sidebar';

const Main = () => {
  const { pathname } = useLocation();
  const { getMenuConfig } = useMenus();
  const menuConfig = getMenuConfig('primary');
  const menuItem = useMenuCurrentItem(pathname, menuConfig);

  return (
    <Fragment>
      <Helmet>
        <title>{menuItem?.title}</title>
      </Helmet>
      <div className="flex grow flex-col [[data-sticky-header=on]_&]:pt-[--tw-header-height]">
        <Header />
        <Navbar />
        <div className="w-full flex px-0 lg:ps-4">
          <Sidebar />

          <main className="flex flex-col grow">
            <Outlet />
            <Footer />
          </main>
        </div>
      </div>
    </Fragment>
  );
};

export { Main };
