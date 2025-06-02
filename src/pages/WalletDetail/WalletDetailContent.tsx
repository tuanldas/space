import {Activity} from './components/activity';
import {Assets} from './components/assets';
import {useToolbar} from '@/layouts/demo6/layout.tsx';
import {useEffect} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {useQuery} from '@tanstack/react-query';
import {callApiGetWalletDetail} from '@/api/wallet.tsx';
import {toast} from 'sonner';
import {ContentLoader} from '@/components/common/content-loader.tsx';

const WalletDetailContent = () => {
    const {setToolbarTitle} = useToolbar();
    const {walletId} = useParams();
    const navigate = useNavigate();

    const {data: walletDetail, isLoading, error} = useQuery({
        queryKey: ['wallet', walletId],
        queryFn: () => callApiGetWalletDetail(walletId as string),
        enabled: !!walletId,
        retry: (failureCount, error: any) => {
            if (error?.response?.status === 404 || error?.response?.status === 403) {
                return false;
            }
            return failureCount < 3;
        }
    });

    useEffect(() => {
        if (walletDetail) {
            setToolbarTitle(walletDetail.name);
        } else {
            setToolbarTitle('Loading...');
        }
    }, [setToolbarTitle, walletDetail]);

    useEffect(() => {
        if (error) {
            const errorMessage = (error as any)?.response?.data?.message || 'Unknown error occurred';

            if ((error as any)?.response?.status === 404) {
                toast.error(errorMessage);
                navigate('/wallets');
            } else if ((error as any)?.response?.status === 403) {
                toast.error(errorMessage);
                navigate('/wallets');
            } else {
                toast.error(errorMessage);
            }
        }
    }, [error, navigate]);

    if (isLoading) {
        return <div className="flex grow justify-center pt-5 lg:pt-7.5">
            <ContentLoader/>
        </div>;
    }
    if (!walletDetail) {
        return null;
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-7.5">
            <div className="col-span-1">
                <div className="grid gap-5 lg:gap-7.5">
                    <Assets
                        balance={walletDetail.balance}
                        currency={walletDetail.currency}/>
                </div>
            </div>
            <div className="col-span-1 lg:col-span-2">
                <div className="flex flex-col gap-5 lg:gap-7.5">
                    <div className="flex flex-col gap-5 lg:gap-7.5">
                        <Activity/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export {WalletDetailContent};
