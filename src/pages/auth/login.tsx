import { useState } from 'react';
import { useAuthContext } from '@/auth';
import { useNavigate } from 'react-router';
import { useLocation } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Alert, KeenIcon } from '@/components';
import { clsx } from 'clsx';
import { FormattedMessage, useIntl } from 'react-intl';

const initialValues = {
  email: '',
  password: ''
};

const Login = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';
  const [showPassword, setShowPassword] = useState(false);
  const intl = useIntl();

  const loginSchema = Yup.object().shape({
    email: Yup.string()
      .email(intl.formatMessage({ id: 'VALIDATE.EMAIL' }, { name: 'Email' }))
      .min(3, intl.formatMessage({ id: 'VALIDATE.MIN' }, { name: 'Email', min: 3 }))
      .required(intl.formatMessage({ id: 'VALIDATE.REQUIRED' }, { name: 'Email' })),
    password: Yup.string()
      .min(
        3,
        intl.formatMessage(
          { id: 'VALIDATE.MIN' },
          { name: intl.formatMessage({ id: 'AUTH.PASSWORD' }), min: 3 }
        )
      )
      .max(
        50,
        intl.formatMessage(
          { id: 'VALIDATE.MAX' },
          { name: intl.formatMessage({ id: 'AUTH.PASSWORD' }), max: 50 }
        )
      )
      .required(
        intl.formatMessage(
          { id: 'VALIDATE.REQUIRED' },
          { name: intl.formatMessage({ id: 'AUTH.PASSWORD' }) }
        )
      )
  });

  const formik = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);

      try {
        await login(values.email, values.password);

        navigate(from, { replace: true });
      } catch {
        setStatus(intl.formatMessage({ id: 'AUTH.THE_LOGIN_DETAILS_ARE_INCORRECT' }));
        setSubmitting(false);
      }
      setLoading(false);
    }
  });

  const togglePassword = (event: any) => {
    event.preventDefault();
    setShowPassword(!showPassword);
  };

  return (
    <div className="card max-w-[390px] w-full">
      <form
        className="card-body flex flex-col gap-5 p-10"
        onSubmit={formik.handleSubmit}
        noValidate
      >
        <div className="text-center mb-2.5">
          <h3 className="text-lg font-semibold text-gray-900 leading-none mb-2.5">
            <FormattedMessage id="AUTH.SIGN_IN" />
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="border-t border-gray-200 w-full"></span>
        </div>
        {formik.status && <Alert variant="danger">{formik.status}</Alert>}

        <div className="flex flex-col gap-1">
          <label className="form-label text-gray-900">Email</label>
          <label className="input">
            <input
              placeholder={intl.formatMessage(
                { id: 'AUTH.ENTER' },
                { name: intl.formatMessage({ id: 'AUTH.EMAIL' }) }
              )}
              autoComplete="off"
              {...formik.getFieldProps('email')}
              className={clsx('form-control', {
                'is-invalid': formik.touched.email && formik.errors.email
              })}
            />
          </label>
          {formik.touched.email && formik.errors.email && (
            <span role="alert" className="text-danger text-xs mt-1">
              {formik.errors.email}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between gap-1">
            <label className="form-label text-gray-900">
              <FormattedMessage id="AUTH.SIGN_IN" />
            </label>
          </div>
          <label className="input">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder={intl.formatMessage(
                { id: 'AUTH.ENTER' },
                { name: intl.formatMessage({ id: 'AUTH.PASSWORD' }) }
              )}
              autoComplete="off"
              {...formik.getFieldProps('password')}
              className={clsx('form-control', {
                'is-invalid': formik.touched.password && formik.errors.password
              })}
            />
            <button className="btn btn-icon" type={'button'} onClick={togglePassword}>
              <KeenIcon icon="eye" className={clsx('text-gray-500', { hidden: showPassword })} />
              <KeenIcon
                icon="eye-slash"
                className={clsx('text-gray-500', { hidden: !showPassword })}
              />
            </button>
          </label>
          {formik.touched.password && formik.errors.password && (
            <span role="alert" className="text-danger text-xs mt-1">
              {formik.errors.password}
            </span>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary flex justify-center grow"
          disabled={loading || formik.isSubmitting}
        >
          {loading ? 'Please wait...' : <FormattedMessage id="AUTH.SIGN_IN" />}
        </button>
      </form>
    </div>
  );
};

export default Login;
