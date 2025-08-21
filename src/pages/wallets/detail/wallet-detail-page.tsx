import { FC, Fragment, useEffect } from 'react';
import { callApiGetWalletById, IWalletDetail } from '@/api/wallet';
import { Helmet } from '@dr.pogodin/react-helmet';
import { useQuery } from '@tanstack/react-query';
import { useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';
import { useErrorHandler } from '@/hooks/use-error-handler';
import { useToolbar } from '@/providers/toolbar-provider';
import { Card, CardContent } from '@/components/ui/card';
import { Container } from '@/components/common/container';
import { ContentLoader } from '@/components/common/content-loader';
import { WalletProfileSection, WalletTransactionsTimeline } from './components';

export const WalletDetailPage: FC = () => {
    const intl = useIntl();
    const { id } = useParams<{ id: string }>();
    const { handleError } = useErrorHandler();
    const { setToolbarTitle, setToolbarHidden } = useToolbar();

    const {
        data: wallet,
        isLoading,
        isError,
        error,
    } = useQuery<IWalletDetail | null>({
        queryKey: ['wallet', id],
        queryFn: async () => {
            if (!id) throw new Error(intl.formatMessage({ id: 'wallet.errors.id_required' }));
            return callApiGetWalletById(id);
        },
        enabled: Boolean(id),
    });

    useEffect(() => {
        if (isError && error) {
            handleError(error, {
                title: intl.formatMessage({ id: 'common.error_loading' }),
            });
        }
    }, [isError, error, handleError, intl]);

    useEffect(() => {
        const title = wallet?.name || intl.formatMessage({ id: 'wallet.title' });
        document.title = title;
        setToolbarTitle(null);
        setToolbarHidden(true);
        return () => {
            setToolbarTitle(null);
            setToolbarHidden(false);
        };
    }, [wallet?.name, intl, setToolbarTitle, setToolbarHidden]);

    return (
        <Fragment>
            <Helmet key={wallet?.name || 'wallet-detail-page'}>
                <title>{wallet?.name || intl.formatMessage({ id: 'wallet.title' })}</title>
            </Helmet>
            <Container>
                {isLoading || !wallet || !id ? (
                    <ContentLoader />
                ) : (
                    <Card>
                        <CardContent className="p-5 lg:p-7.5">
                            <div className="flex flex-col gap-5 lg:gap-7.5">
                                <WalletProfileSection wallet={wallet} />
                                <div className="border-b border-input" />
                                <WalletTransactionsTimeline walletId={id} currency={wallet.currency} />
                            </div>
                        </CardContent>
                    </Card>
                )}
            </Container>
        </Fragment>
    );
};

export default WalletDetailPage;
