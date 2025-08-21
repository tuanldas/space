import { useEffect, useState } from 'react';
import { callApiUpdateWallet, IWalletUpdateFormData } from '@/api/wallet';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';
import { toast } from 'sonner';
import * as z from 'zod';
import { useErrorHandler } from '@/hooks/use-error-handler';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { IWalletApiItem } from '../wallets-content';
import CurrencyCombobox from './currency-combobox';

interface EditWalletFormProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    wallet?: IWalletApiItem;
}

const EditWalletForm = ({ isOpen, onOpenChange, wallet }: EditWalletFormProps) => {
    const intl = useIntl();
    const { handleError } = useErrorHandler();
    const queryClient = useQueryClient();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const formSchema = z.object({
        name: z.string().min(1, {
            message: intl.formatMessage({ id: 'wallet.form.errors.name_required' }),
        }),
        currency: z.string().min(1, {
            message: intl.formatMessage({
                id: 'wallet.form.errors.currency_required',
            }),
        }),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: wallet?.name || '',
            currency: wallet?.currency || 'VND',
        },
    });

    useEffect(() => {
        if (wallet) {
            form.reset({
                name: wallet.name || '',
                currency: wallet.currency || 'VND',
            });
        }
    }, [wallet, form]);

    const updateWalletMutation = useMutation({
        mutationFn: (data: IWalletUpdateFormData) => {
            if (!wallet?.id) throw new Error(intl.formatMessage({ id: 'wallet.errors.id_required' }));
            return callApiUpdateWallet(wallet.id, data);
        },
        onSuccess: () => {
            toast.success(intl.formatMessage({ id: 'wallet.form.update_success' }));
            queryClient.invalidateQueries({ queryKey: ['wallets'] });
            onOpenChange(false);
            setIsSubmitting(false);
        },
        onError: (error) => {
            handleError(error, {
                title: intl.formatMessage({ id: 'wallet.form.error' }),
            });
            setIsSubmitting(false);
        },
    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        setIsSubmitting(true);
        const formData: IWalletUpdateFormData = {
            name: values.name,
            currency: values.currency,
        };
        updateWalletMutation.mutate(formData);
    };

    return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="sm:max-w-md">
                <SheetHeader>
                    <SheetTitle>{intl.formatMessage({ id: 'wallet.edit' })}</SheetTitle>
                    <SheetDescription>{intl.formatMessage({ id: 'wallet.form.edit_description' })}</SheetDescription>
                </SheetHeader>
                <div className="py-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{intl.formatMessage({ id: 'wallet.form.name' })}</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder={intl.formatMessage({
                                                    id: 'wallet.form.name_placeholder',
                                                })}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="currency"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{intl.formatMessage({ id: 'wallet.form.currency' })}</FormLabel>
                                        <FormControl>
                                            <CurrencyCombobox value={field.value} onChange={field.onChange} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </form>
                    </Form>
                </div>
                <SheetFooter>
                    <Button type="submit" onClick={form.handleSubmit(onSubmit)} disabled={isSubmitting}>
                        {isSubmitting
                            ? intl.formatMessage({ id: 'common.saving' })
                            : intl.formatMessage({ id: 'common.save' })}
                    </Button>
                    <SheetClose asChild>
                        <Button variant="outline">
                            <X className="mr-2 h-4 w-4" />
                            {intl.formatMessage({ id: 'common.cancel' })}
                        </Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
};

export { EditWalletForm };
