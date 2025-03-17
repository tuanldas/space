import { useParams } from 'react-router-dom';
import { Fragment } from 'react';
import { Container } from '@/components/container';
import { WalletDetailContent } from '@/pages/WalletDetail/WalletDetailContent.tsx';

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