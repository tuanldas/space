import {Fragment} from 'react';
import {WalletDetailContent} from '@/pages/WalletDetail/WalletDetailContent.tsx';
import {Container} from '@/components/common/container';

const WalletDetail = () => {
  return (
    <>
      <Fragment>
        <Container>
          <WalletDetailContent />
        </Container>
      </Fragment>
    </>
  );
};

export default WalletDetail;
