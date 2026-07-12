import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';

const signInWithPassword = vi.fn();
const push = vi.fn();
const refresh = vi.fn();
const signUp = vi.fn();

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: {
      signInWithPassword,
      signUp,
    },
  }),
}));

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock('@/i18n/navigation', () => ({
  useRouter: () => ({
    push,
    refresh,
  }),
}));

import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';

it('renders sign in form', () => {
  render(<SignInForm />);

  expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/password/i)).toBeInTheDocument();

  expect(screen.getByRole('button', { name: /signin/i })).toBeInTheDocument();
});
it('enter submit button', async () => {
  signInWithPassword.mockResolvedValue({});

  render(<SignInForm />);

  const user = userEvent.setup();

  await user.type(screen.getByLabelText(/email/i), 'test@test.com');
  await user.type(screen.getByLabelText(/password/i), '12345678');

  await user.click(screen.getByRole('button', { name: /signin/i }));

  expect(signInWithPassword).toHaveBeenCalledWith({
    email: 'test@test.com',
    password: '12345678',
  });
});

it('renders sign up form', () => {
  render(<SignUpForm />);

  expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/password/i)).toBeInTheDocument();

  expect(screen.getByRole('button', { name: /signup/i })).toBeInTheDocument();
});
it('submits sign up form', async () => {
  signUp.mockResolvedValue({});

  const user = userEvent.setup();

  render(<SignUpForm />);

  await user.type(screen.getByLabelText(/name/i), 'Kate');
  await user.type(screen.getByLabelText(/email/i), 'test@test.com');
  await user.type(screen.getByLabelText(/password/i), 'Password1!');

  await user.click(screen.getByRole('button', { name: /signup/i }));

  await waitFor(() => {
    expect(signUp).toHaveBeenCalledWith({
      email: 'test@test.com',
      password: 'Password1!',
      options: {
        data: {
          name: 'Kate',
        },
      },
    });
  });
});
