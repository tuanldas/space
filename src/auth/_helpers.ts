import Cookies from 'js-cookie';

export const isAuthenticated = () => {
    const auth = Cookies.get('access_token');
    return !!auth;
};
