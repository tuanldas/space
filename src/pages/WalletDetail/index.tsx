import { useParams } from 'react-router-dom';
import { Fragment } from 'react';
import { WalletDetailContent } from '@/pages/WalletDetail/WalletDetailContent.tsx';
import { Container } from '@/components/common/container';

const WalletDetail = () => {
  const { walletId } = useParams();
  console.log(walletId);

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
