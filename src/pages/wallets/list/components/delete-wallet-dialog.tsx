import { FC } from 'react';
import { callApiDeleteWallet } from '@/api/wallet';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useIntl } from 'react-intl';
import { toast } from 'sonner';
import { useErrorHandler } from '@/hooks/use-error-handler';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface DeleteWalletDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    walletId?: string;
    walletName?: string;
}

export const DeleteWalletDialog: FC<DeleteWalletDialogProps> = ({ isOpen, onOpenChange, walletId, walletName }) => {
    const intl = useIntl();
    const { handleError } = useErrorHandler();
    const queryClient = useQueryClient();

    const deleteWalletMutation = useMutation({
        mutationFn: () => {
            if (!walletId) throw new Error(intl.formatMessage({ id: 'wallet.errors.id_required' }));
            return callApiDeleteWallet(walletId);
        },
        onSuccess: () => {
            toast.success(intl.formatMessage({ id: 'wallet.delete_success' }));
            queryClient.invalidateQueries({ queryKey: ['wallets'] });
            onOpenChange(false);
        },
        onError: (error) => {
            handleError(error, {
                title: intl.formatMessage({ id: 'wallet.delete_error' }),
            });
        },
    });

    const handleConfirmDelete = () => {
        deleteWalletMutation.mutate();
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{intl.formatMessage({ id: 'wallet.delete_dialog.title' })}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {intl.formatMessage({ id: 'wallet.delete_dialog.description' }, { name: walletName })}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>{intl.formatMessage({ id: 'wallet.delete_dialog.cancel' })}</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleConfirmDelete}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        {intl.formatMessage({ id: 'wallet.delete_dialog.confirm' })}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteWalletDialog;
