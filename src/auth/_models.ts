export interface AuthModel {
    access_token: string;
    refreshToken?: string;
    expires_in: number;
}

export interface UserModel {
    id: number;
    username: string;
    password: string | undefined;
    email: string;
    first_name: string;
    last_name: string;
    fullname?: string;
    occupation?: string;
    companyName?: string;
    phone?: string;
    roles?: number[];
    pic?: string;
}
