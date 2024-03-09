import {Form, useActionData, useLoaderData} from '@remix-run/react';
import type {
  HydrogenComponentProps,
  HydrogenComponentSchema,
} from '@weaverse/hydrogen';
import {forwardRef, useState} from 'react';
import {Link} from '~/components';
import {getInputStyleClasses} from '~/lib/utils';

type ActionData = {
  formError?: string;
};

interface CustomerLoginProps extends HydrogenComponentProps {
  heading: string;
  signInButtonText: string;
  marginTop: number;
  marginBottom: number;
}

let CustomerLogin = forwardRef<HTMLElement, CustomerLoginProps>(
  (props, ref) => {
    let {heading, signInButtonText, marginTop, marginBottom, ...rest} = props;
    let {shopName} = useLoaderData<{shopName: string}>();
    let actionData = useActionData<ActionData>();
    let [nativeEmailError, setNativeEmailError] = useState<null | string>(null);
    let [nativePasswordError, setNativePasswordError] = useState<null | string>(
      null,
    );
    return (
      <section ref={ref} {...rest}>
        <div
          className="flex justify-center px-4"
          style={{
            marginTop: `${marginTop}px`,
            marginBottom: `${marginBottom}px`,
          }}
        >
          <div className="max-w-md w-full">
            <h1 className="text-4xl">{heading}</h1>
            {/* TODO: Add onSubmit to validate _before_ submission with native? */}
            <Form
              method="post"
              noValidate
              className="pt-6 pb-8 mt-4 mb-4 space-y-3"
            >
              {actionData?.formError && (
                <div className="flex items-center justify-center mb-6 bg-zinc-500">
                  <p className="m-4 text-s text-contrast">
                    {actionData.formError}
                  </p>
                </div>
              )}
              <div>
                <input
                  className={`mb-1 ${getInputStyleClasses(nativeEmailError)}`}
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="Email address"
                  aria-label="Email address"
                  // eslint-disable-next-line jsx-a11y/no-autofocus
                  autoFocus
                  onBlur={(event) => {
                    setNativeEmailError(
                      event.currentTarget.value.length &&
                        !event.currentTarget.validity.valid
                        ? 'Invalid email address'
                        : null,
                    );
                  }}
                />
                {nativeEmailError && (
                  <p className="text-red-500 text-xs">
                    {nativeEmailError} &nbsp;
                  </p>
                )}
              </div>

              <div>
                <input
                  className={`mb-1 ${getInputStyleClasses(
                    nativePasswordError,
                  )}`}
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Password"
                  aria-label="Password"
                  minLength={8}
                  required
                  // eslint-disable-next-line jsx-a11y/no-autofocus
                  autoFocus
                  onBlur={(event) => {
                    if (
                      event.currentTarget.validity.valid ||
                      !event.currentTarget.value.length
                    ) {
                      setNativePasswordError(null);
                    } else {
                      setNativePasswordError(
                        event.currentTarget.validity.valueMissing
                          ? 'Please enter a password'
                          : 'Passwords must be at least 8 characters',
                      );
                    }
                  }}
                />
                {nativePasswordError && (
                  <p className="text-red-500 text-xs">
                    {' '}
                    {nativePasswordError} &nbsp;
                  </p>
                )}
              </div>
              <div className="flex items-center justify-between">
                <button
                  className="bg-primary text-contrast rounded py-2 px-4 focus:shadow-outline block w-full"
                  type="submit"
                  disabled={!!(nativePasswordError || nativeEmailError)}
                >
                  {signInButtonText}
                </button>
              </div>
              <div className="flex justify-between items-center mt-8 border-t border-gray-300">
                <p className="align-baseline text-sm mt-6">
                  New to {shopName}? &nbsp;
                  <Link className="inline underline" to="/account/register">
                    Create an account
                  </Link>
                </p>
                <Link
                  className="mt-6 inline-block align-baseline text-sm text-primary/50"
                  to="/account/recover"
                >
                  Forgot password
                </Link>
              </div>
            </Form>
          </div>
        </div>
      </section>
    );
  },
);

export default CustomerLogin;

export let schema: HydrogenComponentSchema = {
  type: 'customer-login',
  title: 'Customer login',
  limit: 1,
  enabledOn: {
    pages: ['CUSTOMER'],
  },
  inspector: [
    {
      group: 'Customer login',
      inputs: [
        {
          type: 'text',
          name: 'heading',
          label: 'Heading',
          defaultValue: 'Sign in.',
          placeholder: 'Sign in.',
        },
        {
          type: 'text',
          name: 'signInButtonText',
          label: 'Sign in button text',
          defaultValue: 'Sign in',
          placeholder: 'Sign in',
        },
        {
          type: 'range',
          label: 'Top margin',
          name: 'marginTop',
          configs: {
            min: 24,
            max: 200,
            step: 4,
            unit: 'px',
          },
          defaultValue: 96,
        },
        {
          type: 'range',
          label: 'Bottom margin',
          name: 'marginBottom',
          configs: {
            min: 24,
            max: 200,
            step: 4,
            unit: 'px',
          },
          defaultValue: 96,
        },
      ],
    },
  ],
  toolbar: ['general-settings'],
};
