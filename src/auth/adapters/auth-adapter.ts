import { callApiLogin } from '@/api/auth';

export const AuthAdapter = {
    async login(email: string, password: string): Promise<boolean> {
        console.log('AuthAdapter: Attempting login with email:', email);

        try {
            await callApiLogin({ email, password });

            console.log('AuthAdapter: Login successful, tokens stored in cookies');

            return true;
        } catch (error) {
            console.error('AuthAdapter: Login error:', error);
            throw error;
        }
    },
};
