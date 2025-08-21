import { createContext, Dispatch, SetStateAction, useContext } from 'react';
import { UserModel } from '../lib/models';

export interface AuthContextProps {
    loading: boolean;
    setLoading: Dispatch<SetStateAction<boolean>>;
    user: UserModel | undefined;
    setUser: Dispatch<SetStateAction<UserModel | undefined>>;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    verify: () => Promise<void>;
    getUser: () => Promise<UserModel | null>;

    // Các chức năng không sử dụng
    register: (
        email: string,
        firstName: string,
        lastName: string,
        password: string,
        password_confirmation: string,
    ) => Promise<void>;
    requestPasswordReset: (email: string) => Promise<void>;
    resetPassword: (password: string, password_confirmation: string, token: string) => Promise<void>;
    resendVerificationEmail: () => Promise<void>;
    updateProfile: (user: UserModel) => Promise<void>;
    isAdmin: boolean;
}

export const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export const useAuth = () => useContext(AuthContext);
