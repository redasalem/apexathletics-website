'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { ArrowRight, KeyRound, Loader2, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { useResetPassword } from '@/hooks/useAuth';
import { getErrorMessage } from '@/utils/errors';

const resetPasswordSchema = z.object({
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must not exceed 128 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="flex justify-center p-20"><Loader2 className="w-10 h-10 animate-spin text-kinpaku-gold" /></div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const resetPassword = useResetPassword();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
  });

  useEffect(() => {
    if (!token) {
      toast.error('Reset token is missing or invalid');
    }
  }, [token]);

  const onSubmit = async (data: ResetPasswordForm) => {
    if (!token) return;

    try {
      await resetPassword.mutateAsync({ token, password: data.password });
      toast.success('Password reset successfully. Please sign in.');
      router.push('/login');
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, 'Failed to reset password'));
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 px-6 lg:px-8 bg-lacquer-black">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="border border-gold-hairline p-4 rounded-[2px] inline-block mx-auto mb-6 bg-lacquer-deep">
          <KeyRound className="w-8 h-8 text-kinpaku-gold" />
        </div>
        <h2 className="font-display text-5xl md:text-6xl text-champagne tracking-wider uppercase">Reset <span className="text-kinpaku-gold">Password</span></h2>
        <p className="mt-4 text-[1.02rem] text-text-muted max-w-sm mx-auto">
          Choose a strong password to regain access to your Impeccable account.
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-raised-lacquer border border-gold-hairline py-10 px-6 sm:rounded-[4px] sm:px-10 shadow-panel">
          {!token ? (
            <div className="text-center space-y-6">
              <p className="text-red-500 font-medium">Reset token is missing or invalid.</p>
              <Link href="/forgot-password" className="ks-button ks-button-secondary w-full text-[1.18rem]">
                Request a new link
              </Link>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label className="label">New password</label>
                <div className="relative mt-2">
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    className="input-field pr-12"
                    placeholder="Enter a strong password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-text-muted hover:text-champagne transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <p className="mt-1.5 text-sm text-red-500 font-medium">{errors.password.message}</p>}
              </div>

              <div>
                <label className="label">Confirm password</label>
                <div className="relative mt-2">
                  <input
                    {...register('confirmPassword')}
                    type={showConfirmPassword ? 'text' : 'password'}
                    className="input-field pr-12"
                    placeholder="Repeat your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-text-muted hover:text-champagne transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="mt-1.5 text-sm text-red-500 font-medium">{errors.confirmPassword.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting || resetPassword.isPending}
                className="ks-button ks-button-primary w-full text-[1.18rem] mt-4"
              >
                {isSubmitting || resetPassword.isPending ? (
                  <Loader2 className="w-6 h-6 animate-spin text-lacquer-deep" />
                ) : (
                  <>
                    Reset password <ArrowRight className="ml-2 w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
