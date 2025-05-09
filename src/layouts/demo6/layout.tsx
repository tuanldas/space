import {ReactNode, useEffect, useState} from 'react';
import {Helmet} from 'react-helmet-async';
import {Outlet, useLocation} from 'react-router-dom';
import {MENU_SIDEBAR} from '@/config/menu.config';
import {useBodyClass} from '@/hooks/use-body-class';
import {useMenu} from '@/hooks/use-menu';
import {useIsMobile} from '@/hooks/use-mobile';
import {useSettings} from '@/providers/settings-provider';
import {Footer} from './components/footer';
import {Header} from './components/header';
import {Sidebar} from './components/sidebar';
import {Toolbar, ToolbarActions, ToolbarHeading} from './components/toolbar';
import {useOutletContext} from 'react-router';

interface ToolbarContextType {
    setToolbarActionContent: (content: ReactNode | null) => void;
}

const Demo6Layout = () => {
    const isMobile = useIsMobile();
    const {setOption} = useSettings();
    const {pathname} = useLocation();
    const {getCurrentItem} = useMenu(pathname);
    const item = getCurrentItem(MENU_SIDEBAR);
    const [toolbarActionContent, setToolbarActionContent] = useState<ReactNode | null>(null);

    useBodyClass(`
    [--header-height:60px]
    [--sidebar-width:270px]
    lg:overflow-hidden
    bg-muted!
  `);

    useEffect(() => {
        setOption('layout', 'demo6');
    }, [setOption]);

    return (
        <>
            <Helmet>
                <title>{item?.title}</title>
            </Helmet>

            <div className="flex grow">
                {!isMobile && <Sidebar/>}

                {isMobile && <Header/>}

                <div className="flex flex-col lg:flex-row grow pt-(--header-height) lg:pt-0">
                    <div
                        className="flex flex-col grow items-stretch rounded-xl bg-background border border-input lg:ms-(--sidebar-width) mt-0 lg:mt-[15px] m-[15px]">
                        <div className="flex flex-col grow kt-scrollable-y-auto [--kt-scrollbar-width:auto] pt-5">
                            <main className="grow" role="content">
                                <Toolbar>
                                    <ToolbarHeading/>
                                    <ToolbarActions>
                                        {toolbarActionContent}
                                    </ToolbarActions>
                                </Toolbar>

                                <Outlet context={{setToolbarActionContent} satisfies ToolbarContextType}/>
                            </main>

                            <Footer/>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export function useToolbar() {
    return useOutletContext<ToolbarContextType>();
}

export {Demo6Layout};
