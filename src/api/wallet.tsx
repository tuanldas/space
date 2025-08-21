import ApiCaller from '@/api/apiCaller.tsx';

export interface IWalletFormData {
    name: string;
    balance: string;
    currency: string;
}

export interface IWalletUpdateFormData {
    name: string;
    currency: string;
}

export interface IWalletDetail {
    id: string;
    name: string;
    description?: string;
    currency: string;
    balance: string | number;
    logo?: string;
}

export type WalletTransactionType = 'income' | 'expense' | 'transfer';

export interface IWalletTransactionCategory {
    name: string;
    type: WalletTransactionType;
    image?: string;
}

export interface IWalletTransactionItem {
    id: string;
    wallet_id: string;
    category_id?: string;
    created_by?: number;
    amount: string;
    transaction_date: string;
    transaction_type: WalletTransactionType;
    description?: string;
    category?: IWalletTransactionCategory;
}

export interface IPaginatedResponse<T> {
    current_page: number;
    data: T[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    next_page_url: string | null;
    path: string;
    per_page: number | string;
    prev_page_url: string | null;
    to: number;
    total: number;
}

export const callApiGetWallets = async ({ pageParam }: { pageParam: number }) => {
    const { data } = await new ApiCaller().setUrl(`/wallets?page=${pageParam}`).get();
    return data;
};

export const callApiGetSidebarWallets = async () => {
    const { data } = await new ApiCaller().setUrl('/wallets-sidebar').get();
    return data;
};

export const callApiGetWalletById = async (walletId: string) => {
    const { data } = await new ApiCaller().setUrl(`/wallets/${walletId}`).get();
    return (data?.data ?? null) as IWalletDetail | null;
};

export const callApiGetWalletTransactions = async (
    walletId: string,
    params?: {
        type?: WalletTransactionType;
        start?: string;
        end?: string;
        per_page?: number;
        page?: number;
    },
): Promise<IPaginatedResponse<IWalletTransactionItem>> => {
    const searchParams = new URLSearchParams();
    if (params?.type) searchParams.set('filter[type]', params.type);
    if (params?.start) searchParams.set('filter[date_between][start]', params.start);
    if (params?.end) searchParams.set('filter[date_between][end]', params.end);
    if (params?.per_page) searchParams.set('per_page', String(params.per_page));
    if (params?.page) searchParams.set('page', String(params.page));

    const query = searchParams.toString();
    const qs = query ? `?${query}` : '';
    const { data } = await new ApiCaller().setUrl(`/wallets/${walletId}/transactions${qs}`).get();
    return data?.data as IPaginatedResponse<IWalletTransactionItem>;
};

export const callApiCreateWallet = async (formData: IWalletFormData) => {
    const { data } = await new ApiCaller().setUrl('/wallets').post({ data: formData });
    return data;
};

export const callApiUpdateWallet = async (walletId: string, formData: IWalletUpdateFormData) => {
    const { data } = await new ApiCaller().setUrl(`/wallets/${walletId}`).put({ data: formData });
    return data;
};

export const callApiDeleteWallet = async (walletId: string) => {
    const { data } = await new ApiCaller().setUrl(`/wallets/${walletId}`).delete();
    return data;
};
