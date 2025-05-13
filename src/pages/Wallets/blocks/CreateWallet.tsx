import {useEffect, useMemo, useState} from 'react';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {
    Dialog,
    DialogBody,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from '@/components/ui/select';
import {FormattedMessage, useIntl} from 'react-intl';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';


interface Props {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    availableIcons?: IconType[];
    onCreateSuccess?: () => void;
}

interface IconType {
    id: string | number;
    name: string;
    url: string;
}

interface FormValues {
    name: string;
    balance: string;
    currency: string;
    iconId: string | number;
}

const currencies = [
    {code: 'VND', name: 'Vietnamese Dong'},
    {code: 'USD', name: 'US Dollar'},
    {code: 'EUR', name: 'Euro'},
];

const MOCK_ICONS: IconType[] = [
    {id: 'icon-001', name: 'Piggy Bank', url: '/icons/piggy-bank.png'},
    {id: 'icon-002', name: 'Credit Card', url: '/icons/credit-card.svg'},
    {id: 'icon-003', name: 'Coin Stack', url: '/icons/coin-stack.png'},
    {id: 'icon-004', name: 'Briefcase', url: '/icons/briefcase.svg'},
];

const createValidationSchema = () => Yup.object({
    name: Yup.string()
        .trim()
        .required(''),
    balance: Yup.string()
        .test(
            'is-non-negative-number-or-empty',
            '',
            (value) => {
                if (value === undefined || value === null || value.trim() === '') return true;
                if (!/^\d*\.?\d*$/.test(value)) return false;
                const num = parseFloat(value);
                return !isNaN(num) && num >= 0;
            }
        ),
    currency: Yup.string()
        .required(''),
    iconId: Yup.mixed<string | number>()
        .defined()
        .required(''),
});


const CreateWallet = ({
                          isOpen,
                          onOpenChange,
                          availableIcons = MOCK_ICONS,
                          onCreateSuccess
                      }: Props) => {
    const intl = useIntl();
    const [apiError, setApiError] = useState<string | null>(null);

    const validationSchema = createValidationSchema();

    const formik = useFormik<FormValues>({
        initialValues: {
            name: '',
            balance: '',
            currency: '',
            iconId: '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values, {setSubmitting, resetForm}) => {
            setApiError(null);
            setSubmitting(true);

            const numericBalance = values.balance === '' ? 0 : parseFloat(values.balance);

            const apiPayload = {
                name: values.name.trim(),
                initial_balance: numericBalance,
                currency_code: values.currency,
                icon_id: values.iconId,
            };

            console.log('Submitting data:', apiPayload);

            try {

                await new Promise(resolve => setTimeout(resolve, 1000));

                console.log('Wallet created successfully!');
                resetForm();
                if (onCreateSuccess) {
                    onCreateSuccess();
                }
                onOpenChange(false);

            } catch (err: any) {
                console.error('Failed to create wallet:', err);
                const errorMessage = err?.response?.data?.message || err?.message || intl.formatMessage({id: 'Error.GenericServer'});
                setApiError(errorMessage);
            } finally {
                setSubmitting(false);
            }
        },
    });

    const selectedIconObject = useMemo(() => {
        return availableIcons.find(icon => String(icon.id) === String(formik.values.iconId));
    }, [formik.values.iconId, availableIcons]);

    useEffect(() => {
        if (!isOpen) {
            formik.resetForm();
            setApiError(null);
        }
    }, [isOpen]);

    const labelClasses = 'block text-sm font-medium leading-none text-gray-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-gray-300';

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            if (!open) {
                formik.resetForm();
                setApiError(null);
            }
            onOpenChange(open);
        }}>
            <DialogContent className="max-w-[500px] sm:max-w-md">
                <form onSubmit={formik.handleSubmit} noValidate>
                    <DialogHeader>
                        <DialogTitle><FormattedMessage id="wallets.create"/></DialogTitle>
                        <DialogDescription>
                            <FormattedMessage id="wallets.createDescription"
                                              defaultMessage="Enter the details for your new wallet."/>
                        </DialogDescription>
                    </DialogHeader>

                    <DialogBody className="py-4 grid gap-4">
                        {/* Name Field */}
                        <div className="grid gap-2">
                            <label htmlFor="wallet-name" className={labelClasses}>
                                <FormattedMessage id="Common.Name"/>
                            </label>
                            <Input
                                id="wallet-name"
                                {...formik.getFieldProps('name')}
                                placeholder={intl.formatMessage({
                                    id: 'Wallets.NamePlaceholder',
                                    defaultMessage: 'e.g., Personal Savings'
                                })}
                                disabled={formik.isSubmitting}
                                aria-invalid={formik.touched.name && !!formik.errors.name}
                                className={formik.touched.name && !!formik.errors.name ? 'border-red-500' : ''}
                            />
                            {/* Hiển thị lỗi validation */}
                            {formik.touched.name && formik.errors.name && (
                                <p className="text-sm text-red-600">{formik.errors.name}</p>
                            )}
                        </div>

                        {/* Balance Field */}
                        <div className="grid gap-2">
                            <label htmlFor="wallet-balance" className={labelClasses}>
                                <FormattedMessage id="Wallets.InitialBalance"/>
                            </label>
                            <Input
                                id="wallet-balance"
                                type="text"
                                inputMode="decimal"
                                {...formik.getFieldProps('balance')}
                                placeholder={intl.formatMessage({
                                    id: 'Wallets.BalancePlaceholder',
                                    defaultMessage: '0.00'
                                })}
                                disabled={formik.isSubmitting}
                                aria-invalid={formik.touched.balance && !!formik.errors.balance}
                                className={formik.touched.balance && !!formik.errors.balance ? 'border-red-500' : ''}
                            />
                            <p className="text-sm text-muted-foreground">
                                <FormattedMessage id="Common.OptionalField" defaultMessage="(Optional)"/>
                            </p>
                            {formik.touched.balance && formik.errors.balance && (
                                <p className="text-sm text-red-600">{formik.errors.balance}</p>
                            )}
                        </div>

                        {/* Currency Field */}
                        <div className="grid gap-2">
                            <label htmlFor="wallet-currency" className={labelClasses}>
                                <FormattedMessage id="Common.Currency"/>
                            </label>
                            <Select
                                value={formik.values.currency}
                                onValueChange={(value) => {
                                    formik.setFieldValue('currency', value);
                                    formik.setFieldTouched('currency', true, false);
                                }}
                                disabled={formik.isSubmitting}
                            >
                                <SelectTrigger
                                    id="wallet-currency"
                                    aria-invalid={formik.touched.currency && !!formik.errors.currency}
                                    className={formik.touched.currency && !!formik.errors.currency ? 'border-red-500' : ''}
                                >
                                    <SelectValue placeholder={intl.formatMessage({
                                        id: 'Wallets.SelectCurrency',
                                        defaultMessage: 'Select a currency'
                                    })}/>
                                </SelectTrigger>
                                <SelectContent>
                                    {currencies.map((curr) => (
                                        <SelectItem key={curr.code} value={curr.code}>
                                            {curr.code} - {curr.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {formik.touched.currency && formik.errors.currency && (
                                <p className="text-sm text-red-600">{formik.errors.currency}</p>
                            )}
                        </div>

                        {/* Icon Field */}
                        <div className="grid gap-2">
                            <label htmlFor="wallet-icon" className={labelClasses}>
                                <FormattedMessage id="Common.Icon"/>
                            </label>
                            <Select
                                value={formik.values.iconId ? String(formik.values.iconId) : ''}
                                onValueChange={(value) => {
                                    const idToSet = availableIcons.find(icon => String(icon.id) === value)?.id ?? value;
                                    formik.setFieldValue('iconId', idToSet);
                                    formik.setFieldTouched('iconId', true, false);
                                }}
                                disabled={formik.isSubmitting || !availableIcons || availableIcons.length === 0}
                            >
                                <SelectTrigger
                                    id="wallet-icon"
                                    aria-invalid={formik.touched.iconId && !!formik.errors.iconId}
                                    className={formik.touched.iconId && !!formik.errors.iconId ? 'border-red-500' : ''}
                                >
                                    <SelectValue placeholder={intl.formatMessage({
                                        id: 'Wallets.SelectIcon',
                                        defaultMessage: 'Select an icon'
                                    })}>
                                        {/* Hiển thị preview icon đã chọn */}
                                        {selectedIconObject && (
                                            <div className="flex items-center gap-2">
                                                <Avatar className="h-5 w-5">
                                                    <AvatarImage src={selectedIconObject.url}
                                                                 alt={selectedIconObject.name}/>
                                                    <AvatarFallback className="text-xs">
                                                        {selectedIconObject.name.substring(0, 1)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span>{selectedIconObject.name}</span>
                                            </div>
                                        )}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    {/* Hiển thị danh sách icons để chọn */}
                                    {availableIcons && availableIcons.length > 0 ? (
                                        availableIcons.map((icon) => (
                                            <SelectItem key={icon.id} value={String(icon.id)}>
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-6 w-6">
                                                        <AvatarImage src={icon.url} alt={icon.name}/>
                                                        <AvatarFallback className="text-xs">
                                                            {icon.name.substring(0, 1)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <span>{icon.name}</span>
                                                </div>
                                            </SelectItem>
                                        ))
                                    ) : (
                                        <SelectItem value="no-icons" disabled>
                                            <FormattedMessage id="Wallets.NoIconsAvailable"
                                                              defaultMessage="No icons available"/>
                                        </SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
                            {/* Hiển thị lỗi validation cho icon */}
                            {formik.touched.iconId && formik.errors.iconId && (
                                <p className="text-sm text-red-600">{formik.errors.iconId}</p>
                            )}
                        </div>

                        {/* Hiển thị lỗi từ API (nếu có) */}
                        {apiError && (
                            <p className="text-sm text-red-600 mt-2">{apiError}</p>
                        )}

                    </DialogBody>

                    <DialogFooter>
                        {/* Nút Hủy */}
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={formik.isSubmitting}
                        >
                            <FormattedMessage id="Common.Cancel" defaultMessage="Cancel"/>
                        </Button>
                        {/* Nút Tạo */}
                        <Button
                            type="submit"
                            disabled={formik.isSubmitting || !formik.isValid}
                        >
                            {formik.isSubmitting
                                ? <FormattedMessage id="Common.Creating" defaultMessage="Creating..."/>
                                : <FormattedMessage id="Common.Create" defaultMessage="Create"/>
                            }
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export {CreateWallet};
