import { AxiosError } from 'axios';
import { toast } from 'sonner';

interface ErrorHandlerOptions {
    showToast?: boolean;
    title?: string;
    toastVariant?: 'default' | 'destructive' | 'success';
    position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
    duration?: number;
}

export const useErrorHandler = () => {
    const handleError = (
        error: unknown,
        options: ErrorHandlerOptions = {
            showToast: true,
            toastVariant: 'destructive',
        },
    ) => {
        const { showToast = true, toastVariant = 'destructive', position = 'top-right', duration = 3000 } = options;

        if (error instanceof AxiosError && error.response?.status === 403) {
            if (showToast) {
                toast.error(`Không có quyền truy cập`, {
                    position,
                    duration,
                });
            }
            return false;
        }

        let errorMessage = 'Đã xảy ra lỗi';
        if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === 'string') {
            errorMessage = error;
        }

        if (showToast) {
            if (toastVariant === 'destructive') {
                toast.error(errorMessage, {
                    position,
                    duration,
                });
            } else if (toastVariant === 'success') {
                toast.success(errorMessage, {
                    position,
                    duration,
                });
            } else {
                toast(errorMessage, {
                    position,
                    duration,
                });
            }
        }

        return true;
    };

    return { handleError };
};
