import {ReactNode} from 'react';
import {useLocation} from 'react-router-dom';
import {MENU_SIDEBAR} from '@/config/menu.config';
import {useMenu} from '@/hooks/use-menu';
import {Container} from '@/components/common/container';
import {FormattedMessage} from 'react-intl';

export interface ToolbarHeadingProps {
    title?: string | ReactNode;
    description?: string | ReactNode;
}

function Toolbar({children}: { children?: ReactNode }) {
    return (
        <div className="mb-5 lg:mb-7.5">
            <Container className="flex items-center justify-between flex-wrap gap-5">
                {children}
            </Container>
        </div>
    );
}

function ToolbarActions({children}: { children?: ReactNode }) {
    return <div className="flex items-center gap-2.5">{children}</div>;
}

const ToolbarHeading = ({title = ''}: ToolbarHeadingProps) => {
    const {pathname} = useLocation();
    const {getCurrentItem} = useMenu(pathname);
    const item = getCurrentItem(MENU_SIDEBAR);

    return (
        <div className="flex flex-col md:flex-row md:items-center flex-wrap gap-1 lg:gap-5">
            <h1 className="font-medium text-lg text-mono">
                {title ? title
                    : <FormattedMessage id={item?.title}/>
                }</h1>
        </div>
    );
};

export {Toolbar, ToolbarActions, ToolbarHeading};
