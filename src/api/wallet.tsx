import ApiCaller from '@/api/apiCaller.tsx';

export const callApiGetWallets = async ({pageParam}: { pageParam: number }) => {
    const {data} = await new ApiCaller().setUrl(`/wallets?page=${pageParam}`).get();
    return data;
};

export const callApiGetWalletDetail = async (walletId: string) => {
    const {data} = await new ApiCaller().setUrl(`/wallets/${walletId}`).get();
    return data;
};
