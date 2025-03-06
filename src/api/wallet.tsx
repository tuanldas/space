import ApiCaller from '@/api/apiCaller.tsx';

export const callApiGetWallets = async ({ queryKey }: any) => {
  const [, page] = queryKey;
  const { data } = await new ApiCaller().setUrl(`/wallets?page=${page}`).get();
  return data;
};
