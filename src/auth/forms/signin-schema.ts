import { IntlShape } from 'react-intl';
import { z } from 'zod';

export const getSigninSchema = (intl?: IntlShape) => {
    return z.object({
        email: z
            .string()
            .email({
                message: intl
                    ? intl.formatMessage({ id: 'validation.email.invalid' })
                    : 'Please enter a valid email address.',
            })
            .min(1, {
                message: intl ? intl.formatMessage({ id: 'validation.email.required' }) : 'Email is required.',
            }),
        password: z.string().min(1, {
            message: intl ? intl.formatMessage({ id: 'validation.password.required' }) : 'Password is required.',
        }),
    });
};

export type SigninSchemaType = z.infer<ReturnType<typeof getSigninSchema>>;
