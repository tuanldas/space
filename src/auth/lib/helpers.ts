import { isAuthenticated } from '@/utils/cookies';

/**
 * Kiểm tra xem người dùng đã đăng nhập hay chưa
 * bằng cách kiểm tra cookie access_token
 */
export function isUserAuthenticated(): boolean {
    return isAuthenticated();
}
