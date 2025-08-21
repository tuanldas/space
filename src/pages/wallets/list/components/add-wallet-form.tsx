import { useState } from 'react';
import { callApiCreateWallet, IWalletFormData } from '@/api/wallet';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { useForm, useWatch } from 'react-hook-form';
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
import CurrencyCombobox from './currency-combobox';

interface AddWalletFormProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

const AddWalletForm = ({ isOpen, onOpenChange }: AddWalletFormProps) => {
    const intl = useIntl();
    const { handleError } = useErrorHandler();
    const queryClient = useQueryClient();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [displayValue, setDisplayValue] = useState('');
    const [rawValue, setRawValue] = useState('0');

    const formSchema = z.object({
        name: z.string().min(1, {
            message: intl.formatMessage({ id: 'wallet.form.errors.name_required' }),
        }),
        balance: z.string().min(1, {
            message: intl.formatMessage({
                id: 'wallet.form.errors.initial_balance_required',
            }),
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
            name: '',
            balance: '0',
            currency: 'VND',
        },
    });

    const currency = useWatch({
        control: form.control,
        name: 'currency',
    });

    const formatCurrency = (value: string): string => {
        if (!value || isNaN(Number(value))) return value;

        try {
            return new Intl.NumberFormat(undefined, {
                style: 'decimal',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            }).format(Number(value));
        } catch {
            return value;
        }
    };

    const createWalletMutation = useMutation({
        mutationFn: (data: IWalletFormData) => callApiCreateWallet(data),
        onSuccess: () => {
            toast.success(intl.formatMessage({ id: 'wallet.form.success' }));
            queryClient.invalidateQueries({ queryKey: ['wallets'] });
            form.reset();
            setRawValue('0');
            setDisplayValue('0');
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
        const formData: IWalletFormData = {
            name: values.name,
            balance: rawValue,
            currency: values.currency,
        };
        createWalletMutation.mutate(formData);
    };

    return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="sm:max-w-md">
                <SheetHeader>
                    <SheetTitle>{intl.formatMessage({ id: 'wallet.add_new' })}</SheetTitle>
                    <SheetDescription>{intl.formatMessage({ id: 'wallet.form.description' })}</SheetDescription>
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
                                name="balance"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {intl.formatMessage({
                                                id: 'wallet.form.initial_balance',
                                            })}
                                        </FormLabel>
                                        <div className="relative">
                                            <FormControl>
                                                <Input
                                                    type="text"
                                                    inputMode="numeric"
                                                    placeholder="0"
                                                    value={displayValue}
                                                    onChange={(e) => {
                                                        const value = e.target.value.replace(/[^0-9]/g, '');

                                                        setRawValue(value || '0');
                                                        field.onChange(value || '0');

                                                        setDisplayValue(value ? formatCurrency(value) : '');
                                                    }}
                                                    onFocus={() => {
                                                        if (rawValue === '0') {
                                                            setDisplayValue('');
                                                        }
                                                    }}
                                                    onBlur={() => {
                                                        if (!rawValue || rawValue === '0') {
                                                            setRawValue('0');
                                                            setDisplayValue('0');
                                                        } else {
                                                            setDisplayValue(formatCurrency(rawValue));
                                                        }
                                                    }}
                                                />
                                            </FormControl>
                                            {currency && (
                                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
                                                    {currency}
                                                </div>
                                            )}
                                        </div>
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

export { AddWalletForm };
