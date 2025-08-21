import { Fragment, useEffect } from 'react';
import { useToolbar } from '@/providers/toolbar-provider';
import { Container } from '@/components/common/container';

export function DashboardPage() {
    const { setToolbarTitle } = useToolbar();

    useEffect(() => {
        setToolbarTitle('sidebar.home');
    }, [setToolbarTitle]);

    return (
        <Fragment>
            <Container>{/* page content */}</Container>
        </Fragment>
    );
}
