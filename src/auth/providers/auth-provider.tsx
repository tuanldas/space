import { PropsWithChildren, useEffect, useState } from 'react';
import { callApiGetUserProfile, callApiLogout } from '@/api/auth';
import { AuthAdapter } from '@/auth/adapters/auth-adapter';
import { AuthContext } from '@/auth/context/auth-context';
import { UserModel } from '@/auth/lib/models';
import { isAuthenticated, removeAllCookies } from '@/utils/cookies';

/**
 * AuthProvider cung cấp context quản lý xác thực cho toàn bộ ứng dụng
 */
export function AuthProvider({ children }: PropsWithChildren) {
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<UserModel | undefined>();
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        setIsAdmin(currentUser?.is_admin === true);
    }, [currentUser]);

    useEffect(() => {
        const checkCookieAuth = () => {
            verify().finally(() => {
                setLoading(false);
            });
        };

        checkCookieAuth();
    }, []);

    /**
     * Xác minh phiên hiện tại và lấy thông tin người dùng
     */
    const verify = async () => {
        const hasAuth = isAuthenticated();

        if (hasAuth) {
            try {
                const user = await getUser();
                if (user) {
                    setCurrentUser(user);
                    return;
                }
                setCurrentUser(undefined);
            } catch (error) {
                console.error('Verify error:', error);
                setCurrentUser(undefined);
            }
        } else {
            setCurrentUser(undefined);
        }
    };

    /**
     * Đăng nhập với email và mật khẩu
     */
    const login = async (email: string, password: string) => {
        try {
            await AuthAdapter.login(email, password);

            const user = await getUser();
            setCurrentUser(user || undefined);
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    /**
     * Lấy thông tin người dùng từ API
     */
    const getUser = async (): Promise<UserModel | null> => {
        try {
            if (!isAuthenticated()) {
                return null;
            }

            const response = await callApiGetUserProfile();
            const userData = response.data;

            return {
                id: userData.id || '',
                email: userData.email || '',
                email_verified: userData.email_verified || false,
                username: userData.username || '',
                first_name: userData.first_name || '',
                last_name: userData.last_name || '',
                fullname: userData.fullname || '',
                occupation: userData.occupation || '',
                company_name: userData.company_name || '',
                companyName: userData.company_name || '',
                phone: userData.phone || '',
                roles: Array.isArray(userData.roles) ? userData.roles : [1],
                pic: userData.pic || '',
                language: userData.language || 'en',
                is_admin: !!userData.is_admin,
            } as UserModel;
        } catch (error) {
            console.error('Error fetching user profile:', error);

            if (process.env.NODE_ENV === 'development') {
                return {
                    id: 'demo-id',
                    email: 'demo@example.com',
                    email_verified: true,
                    username: 'demo',
                    first_name: 'Demo',
                    last_name: 'User',
                    fullname: 'Demo User',
                    occupation: 'Developer',
                    company_name: 'Company',
                    companyName: 'Company',
                    phone: '',
                    roles: [1],
                    pic: '',
                    language: 'en',
                    is_admin: true,
                } as UserModel;
            }

            return null;
        }
    };

    /**
     * Đăng xuất người dùng hiện tại
     */
    const logout = async (): Promise<void> => {
        try {
            await callApiLogout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            removeAllCookies();
            setCurrentUser(undefined);
            window.location.href = '/auth/signin';
        }
    };

    return (
        <AuthContext.Provider
            value={{
                loading,
                setLoading,
                user: currentUser,
                setUser: setCurrentUser,
                login,
                register: async () => {
                    throw new Error('Not implemented');
                },
                requestPasswordReset: async () => {
                    throw new Error('Not implemented');
                },
                resetPassword: async () => {
                    throw new Error('Not implemented');
                },
                resendVerificationEmail: async () => {
                    throw new Error('Not implemented');
                },
                getUser,
                updateProfile: async () => {
                    throw new Error('Not implemented');
                },
                logout,
                verify,
                isAdmin,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
