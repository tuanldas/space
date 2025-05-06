import ApiCaller from '@/api/apiCaller.tsx';

export const callApiGetWallets = async ({ pageParam }: any) => {
  const { data } = await new ApiCaller().setUrl(`/wallets?page=${pageParam}`).get();
  return data;
};
