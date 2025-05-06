import {createContext, Dispatch, SetStateAction, useContext} from 'react';
import {UserModel} from '@/auth/lib/models';

// Create AuthContext with types
export const AuthContext = createContext<{
    loading: boolean;
    setLoading: Dispatch<SetStateAction<boolean>>;
    currentUser: UserModel | undefined;
    isAuthenticated: boolean;
    setCurrentUser: Dispatch<SetStateAction<UserModel | undefined>>;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}>({
    loading: false,
    setLoading: () => {
    },
    login: async () => {
    },
    logout: () => {
    },
    currentUser: undefined,
    isAuthenticated: false,
    setCurrentUser: () => {
    },
});

// Hook definition
export function useAuth() {
    return useContext(AuthContext);
}
