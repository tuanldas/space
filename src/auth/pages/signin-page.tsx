import { useEffect, useState } from 'react';
import { useAuth } from '@/auth/context/auth-context';
import { isAuthenticated } from '@/utils/cookies';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { AlertCircle, Check, Eye, EyeOff, LoaderCircleIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Alert, AlertIcon, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { getSigninSchema, SigninSchemaType } from '../forms/signin-schema';

export function SignInPage() {
    const intl = useIntl();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { login } = useAuth();
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        if (isAuthenticated()) {
            const nextPath = searchParams.get('next') || '/';
            navigate(nextPath, { replace: true });
        }
    }, [navigate, searchParams]);

    useEffect(() => {
        const errorParam = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');

        if (errorParam) {
            setError(errorDescription || intl.formatMessage({ id: 'auth.error.unexpected' }));
        }
    }, [searchParams, intl]);

    const form = useForm<SigninSchemaType>({
        resolver: zodResolver(getSigninSchema(intl)),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    async function onSubmit(values: SigninSchemaType) {
        try {
            setIsProcessing(true);
            setError(null);

            console.log(intl.formatMessage({ id: 'auth.login.logging_attempt' }, { email: values.email }));

            if (!values.email.trim() || !values.password) {
                setError(intl.formatMessage({ id: 'auth.error.required_fields' }));
                return;
            }

            await login(values.email, values.password);
            const nextPath = searchParams.get('next') || '/';
            navigate(nextPath);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : String(err);
            console.error(intl.formatMessage({ id: 'auth.login.error' }, { error: errorMessage }));

            if (axios.isAxiosError(err as Error)) {
                const statusCode = (err as AxiosError).response?.status;

                switch (statusCode) {
                    case 400:
                    case 401:
                        setError(intl.formatMessage({ id: 'auth.error.invalid_credentials' }));
                        break;
                    case 403:
                        setError(intl.formatMessage({ id: 'auth.error.account_locked' }));
                        break;
                    case 422:
                        setError(intl.formatMessage({ id: 'auth.error.status_422' }));
                        break;
                    case 500:
                    case 502:
                    case 503:
                        setError(intl.formatMessage({ id: 'auth.error.server_error' }));
                        break;
                    default:
                        setError(intl.formatMessage({ id: 'auth.error.unexpected' }));
                }
            } else if (err instanceof Error && err.message.includes('network')) {
                setError(intl.formatMessage({ id: 'auth.error.network_error' }));
            } else {
                setError(intl.formatMessage({ id: 'auth.error.unexpected' }));
            }
        } finally {
            setIsProcessing(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="block w-full space-y-5">
                <div className="text-center space-y-1 pb-3">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        {intl.formatMessage({ id: 'auth.login.title' })}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        {intl.formatMessage({ id: 'auth.login.description' })}
                    </p>
                </div>

                {error && (
                    <Alert variant="destructive" appearance="light" onClose={() => setError(null)}>
                        <AlertIcon>
                            <AlertCircle />
                        </AlertIcon>
                        <AlertTitle>{error}</AlertTitle>
                    </Alert>
                )}

                {successMessage && (
                    <Alert appearance="light" onClose={() => setSuccessMessage(null)}>
                        <AlertIcon>
                            <Check />
                        </AlertIcon>
                        <AlertTitle>{successMessage}</AlertTitle>
                    </Alert>
                )}

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{intl.formatMessage({ id: 'auth.login.form.email' })}</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder={intl.formatMessage({
                                        id: 'auth.login.form.email_placeholder',
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
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <div className="flex justify-between items-center gap-2.5">
                                <FormLabel>{intl.formatMessage({ id: 'auth.login.form.password' })}</FormLabel>
                            </div>
                            <div className="relative">
                                <Input
                                    placeholder={intl.formatMessage({
                                        id: 'auth.login.form.password_placeholder',
                                    })}
                                    type={passwordVisible ? 'text' : 'password'}
                                    {...field}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    mode="icon"
                                    onClick={() => setPasswordVisible(!passwordVisible)}
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                >
                                    {passwordVisible ? (
                                        <EyeOff className="text-muted-foreground" />
                                    ) : (
                                        <Eye className="text-muted-foreground" />
                                    )}
                                </Button>
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full" disabled={isProcessing}>
                    {isProcessing ? (
                        <span className="flex items-center gap-2">
                            <LoaderCircleIcon className="h-4 w-4 animate-spin" />
                            {intl.formatMessage({ id: 'auth.login.form.loading' })}
                        </span>
                    ) : (
                        intl.formatMessage({ id: 'auth.login.form.submit' })
                    )}
                </Button>
            </form>
        </Form>
    );
}
