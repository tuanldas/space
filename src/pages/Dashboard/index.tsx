import {Container} from '@/components/common/container';
import {Toolbar, ToolbarHeading, ToolbarPageTitle} from '@/partials/common/toolbar';
import {Fragment} from 'react';

const Dashboard = () => {
    return (
        <>
            <Fragment>
                <Container>
                    <Toolbar>
                        <ToolbarHeading>
                            <ToolbarPageTitle text={'Tổng quan'}/>
                        </ToolbarHeading>
                    </Toolbar>
                </Container>
                <Container>{/*<NetworkNFTContent />*/}</Container>
            </Fragment>
        </>
    );
};

export default Dashboard;
