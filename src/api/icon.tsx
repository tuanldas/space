import ApiCaller from '@/api/apiCaller.tsx';

export const callApiGetWalletIcons = async ({pageParam}: any) => {
    const {data} = await new ApiCaller().setUrl(`/wallets/icons?page=${pageParam}`).get();
    return data;
};
