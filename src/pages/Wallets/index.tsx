import { Fragment } from 'react';
import { Container } from '@/components';
import { WalletContent } from '@/pages/Wallets/WalletContent.tsx';

const Wallets = () => {
  return (
    <Fragment>
      <Container>
        <WalletContent />
      </Container>
    </Fragment>
  );
};

export default Wallets;
