import { PropsWithChildren, useState } from 'react';
import { AuthContext } from '@/auth/context/auth-context';
import { UserModel } from '@/auth/lib/models';
import { callApiLogin } from '@/api/auth.tsx';
import {isAuthenticated as checkAuthenticated} from '@/auth/_helpers.ts';

export function AuthProvider({ children }: PropsWithChildren) {
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<UserModel | undefined>();
    const [isAuthenticated, setIsAuthenticated] = useState(checkAuthenticated());

    const login = async (email: string, password: string) => {
        try {
            await callApiLogin({ email, password });
            setIsAuthenticated(true);
        } catch (error) {
            setIsAuthenticated(false);
            throw new Error(`Error ${error}`);
        }
    };

    const logout = () => {
        setIsAuthenticated(false);
        setCurrentUser(undefined);
    };

    return (
        <AuthContext.Provider
            value={{
                loading,
                setLoading,
                currentUser,
                setCurrentUser,
                isAuthenticated,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
