import { toast as sonnerToast } from 'sonner';

interface ToastOptions {
    title?: string;
    description?: string;
    type?: 'success' | 'info' | 'warning' | 'error' | 'default';
    variant?: 'default' | 'destructive';
    duration?: number;
    action?: {
        label: string;
        onClick: () => void;
    };
}

export function useToast() {
    const toast = ({ title, description, type = 'default', variant, duration, action, ...props }: ToastOptions) => {
        const mappedType = variant === 'destructive' ? 'error' : type;

        const toastFunction =
            mappedType === 'success'
                ? sonnerToast.success
                : mappedType === 'error'
                  ? sonnerToast.error
                  : mappedType === 'warning'
                    ? sonnerToast.warning
                    : mappedType === 'info'
                      ? sonnerToast.info
                      : sonnerToast;

        const toastOptions = {
            description,
            duration,
            ...(action ? { action } : {}),
            ...props,
        };

        return toastFunction(title, toastOptions);
    };

    return { toast };
}
