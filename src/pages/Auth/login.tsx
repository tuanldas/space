import {useState} from 'react';
import {useAuth} from '@/auth/context/auth-context';
import {zodResolver} from '@hookform/resolvers/zod';
import {AlertCircle, Eye, EyeOff} from 'lucide-react';
import {useForm} from 'react-hook-form';
import {useNavigate, useSearchParams} from 'react-router-dom';
import {Button} from '@/components/ui/button';
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {Spinner} from '@/components/ui/spinners';
import {FormattedMessage, IntlShape, useIntl} from 'react-intl';
import {z} from 'zod';
import {Alert, AlertIcon, AlertTitle} from '@/components/ui/alert.tsx';

const getLoginSchema = (intl: IntlShape) => {
    const emailFieldName = 'Email';
    const passwordFieldName = intl.formatMessage({id: 'AUTH.PASSWORD'});

    return z.object({
        email: z
            .string()
            .min(1, {
                message: intl.formatMessage(
                    {id: 'VALIDATE.REQUIRED'},
                    {name: emailFieldName}
                ),
            })
            .email({
                message: intl.formatMessage(
                    {id: 'VALIDATE.EMAIL'},
                    {name: emailFieldName}
                ),
            })
            .min(3, {
                message: intl.formatMessage(
                    {id: 'VALIDATE.MIN'},
                    {name: emailFieldName, min: 3}
                ),
            }),

        password: z
            .string()
            .min(1, {
                message: intl.formatMessage(
                    {id: 'VALIDATE.REQUIRED'},
                    {name: passwordFieldName}
                ),
            })
            .min(3, {
                message: intl.formatMessage(
                    {id: 'VALIDATE.MIN'},
                    {name: passwordFieldName, min: 3}
                ),
            })
            .max(50, {
                message: intl.formatMessage(
                    {id: 'VALIDATE.MAX'},
                    {name: passwordFieldName, max: 50}
                ),
            }),

    });
};

const Login = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const {login} = useAuth();
    const intl = useIntl();
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const form = useForm({
        resolver: zodResolver(getLoginSchema(intl)),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    async function onSubmit(values: any) {
        setIsProcessing(true);
        setSubmitError(null);

        try {
            await login(values.email, values.password);
            const nextPath = searchParams.get('next') || '/';
            navigate(nextPath, {replace: true});
        } catch {
            setSubmitError(intl.formatMessage({id: 'AUTH.THE_LOGIN_DETAILS_ARE_INCORRECT'}));
        } finally {
            setIsProcessing(false);
        }
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="block w-full space-y-5"
            >
                <div className="text-center space-y-1 pb-3">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        <FormattedMessage id="AUTH.SIGN_IN"/>
                    </h1>
                </div>


                {submitError && (
                    <Alert
                        variant="destructive"
                        appearance="light"
                        onClose={() => setSubmitError(null)}
                    >
                        <AlertIcon>
                            <AlertCircle/>
                        </AlertIcon>
                        <AlertTitle>{submitError}</AlertTitle>
                    </Alert>
                )}
                <FormField
                    control={form.control}
                    name="email"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>{intl.formatMessage({id: 'AUTH.EMAIL'})}</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder={intl.formatMessage(
                                        {id: 'AUTH.ENTER'},
                                        {name: intl.formatMessage({id: 'AUTH.EMAIL'})}
                                    )}
                                    {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="password"
                    render={({field}) => (
                        <FormItem>
                            <div className="flex justify-between items-center gap-2.5">
                                <FormLabel>{intl.formatMessage({id: 'AUTH.PASSWORD'})}</FormLabel>
                            </div>
                            <div className="relative">
                                <Input
                                    placeholder={intl.formatMessage(
                                        {id: 'AUTH.ENTER'},
                                        {name: intl.formatMessage({id: 'AUTH.PASSWORD'})}
                                    )}
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
                                        <EyeOff className="text-muted-foreground"/>
                                    ) : (
                                        <Eye className="text-muted-foreground"/>
                                    )}
                                </Button>
                            </div>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full" disabled={isProcessing}>
                    {isProcessing ? (
                        <span className="flex items-center gap-2"><Spinner
                            className="h-4 w-4 animate-spin"/> <FormattedMessage id={'LOADING'}/>...</span>
                    ) : (
                        <FormattedMessage id="AUTH.SIGN_IN"/>
                    )}
                </Button>
            </form>
        </Form>
    );
};

export default Login;
