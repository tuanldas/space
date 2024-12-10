import { Fragment } from 'react';
import { Container } from '@/components';
import { Toolbar, ToolbarHeading, ToolbarPageTitle } from '@/partials/toolbar';

const Dashboard = () => {
  return (
    <>
      <Fragment>
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle text={'NFT'} />
            </ToolbarHeading>
          </Toolbar>
        </Container>
        <Container>{/*<NetworkNFTContent />*/}</Container>
      </Fragment>
    </>
  );
};

export default Dashboard;
