import {getCookie} from '@/utils/cookies';

export const isAuthenticated = () => {
    const auth = getCookie('access_token');
    return !!auth;
};

export function setupAxios(axios: any) {
    axios.defaults.headers.Accept = 'application/json';
    axios.defaults.withCredentials = true;
    axios.interceptors.request.use(
        (config: any) => {
            return config;
        },
        async (err: any) => await Promise.reject(err)
    );
}
