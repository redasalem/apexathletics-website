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
    <Suspense fallback={<div className="flex justify-center p-20"><Loader2 className="w-10 h-10 animate-spin text-primary-500" /></div>}>
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
    <div className="min-h-[80vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="bg-surfaceHighlight p-4 rounded-full inline-block mx-auto mb-4">
          <KeyRound className="w-10 h-10 text-primary-500" />
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">Create new password</h2>
        <p className="mt-2 text-sm text-textMuted max-w-sm mx-auto">
          Choose a strong password to regain access to your Apex Sports account.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-surface border border-border py-8 px-4 shadow sm:rounded-2xl sm:px-10">
          {!token ? (
            <div className="text-center space-y-4">
              <p className="text-error">Reset token is missing or invalid.</p>
              <Link href="/forgot-password" className="btn-primary">
                Request a new link
              </Link>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label className="block text-sm font-medium text-white">New password</label>
                <div className="relative mt-2">
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    className="w-full p-3 pr-12 bg-background border border-border rounded-xl text-white placeholder-textMuted focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    placeholder="Enter a strong password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-textMuted hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-sm text-error">{errors.password.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-white">Confirm password</label>
                <div className="relative mt-2">
                  <input
                    {...register('confirmPassword')}
                    type={showConfirmPassword ? 'text' : 'password'}
                    className="w-full p-3 pr-12 bg-background border border-border rounded-xl text-white placeholder-textMuted focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    placeholder="Repeat your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-textMuted hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="mt-1 text-sm text-error">{errors.confirmPassword.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting || resetPassword.isPending}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all disabled:opacity-50"
              >
                {isSubmitting || resetPassword.isPending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Reset password <ArrowRight className="ml-2 w-4 h-4" />
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
