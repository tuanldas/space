import {ReactNode, useEffect, useState} from 'react';
import {Helmet} from 'react-helmet-async';
import {Outlet, useLocation, useOutletContext} from 'react-router';
import {MENU_SIDEBAR} from '@/config/menu.config';
import {useBodyClass} from '@/hooks/use-body-class';
import {useMenu} from '@/hooks/use-menu';
import {useIsMobile} from '@/hooks/use-mobile';
import {useSettings} from '@/providers/settings-provider';
import {Footer} from './components/footer';
import {Header} from './components/header';
import {Navbar} from './components/navbar';
import {Sidebar} from './components/sidebar';
import {Toolbar, ToolbarActions, ToolbarHeading} from './components/toolbar';

interface ToolbarContextType {
    setToolbarActionContent: (content: ReactNode | null) => void;
}

const Demo5Layout = () => {
    const isMobile = useIsMobile();
    const {pathname} = useLocation();
    const {setOption} = useSettings();
    const {getCurrentItem} = useMenu(pathname);
    const item = getCurrentItem(MENU_SIDEBAR);
    const [toolbarActionContent, setToolbarActionContent] = useState<ReactNode | null>(null);

    useBodyClass(`
    [--header-height:54px]
    [--sidebar-width:200px]  
  `);

    useEffect(() => {
        setOption('layout', 'demo5');
        setOption('container', 'fluid');
    }, [setOption]);

    return (
        <>
            <Helmet>
                <title>{item?.title}</title>
            </Helmet>
            <div className="flex grow flex-col in-data-[sticky-header=on]:pt-(--header-height)">
                <Header/>

                <Navbar/>

                <div className="w-full flex px-0 lg:ps-4">
                    {!isMobile && <Sidebar/>}

                    <main className="flex flex-col grow">
                        {!pathname.includes('/public-profile/') && (
                            <Toolbar>
                                <ToolbarHeading/>
                                <ToolbarActions>
                                    {toolbarActionContent}
                                </ToolbarActions>
                            </Toolbar>
                        )}

                        <Outlet context={{setToolbarActionContent} satisfies ToolbarContextType}/>

                        <Footer/>
                    </main>
                </div>
            </div>
        </>
    );
};


export function useToolbar() {
    return useOutletContext<ToolbarContextType>();
}


export {Demo5Layout};
