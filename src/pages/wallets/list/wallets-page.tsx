import { FC, Fragment } from 'react';
import { WalletsContent } from '@/pages/wallets';
import { Helmet } from '@dr.pogodin/react-helmet';
import { useIntl } from 'react-intl';
import { Container } from '@/components/common/container';

export const WalletsPage: FC = () => {
    const intl = useIntl();

    return (
        <Fragment>
            <Helmet>
                <title>{intl.formatMessage({ id: 'wallet.title' })}</title>
            </Helmet>
            <Container className="pt-5">
                <WalletsContent />
            </Container>
        </Fragment>
    );
};

export default WalletsPage;
