'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Loader2, ArrowRight, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { useForgotPassword } from '@/hooks/useAuth';
import { getErrorMessage } from '@/utils/errors';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const forgotPassword = useForgotPassword();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema)
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    try {
      await forgotPassword.mutateAsync(data.email);
      toast.success('If that email exists, a reset link was sent.');
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, 'Failed to process request'));
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="bg-surfaceHighlight p-4 rounded-full inline-block mx-auto mb-4">
          <Mail className="w-10 h-10 text-primary-500" />
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">Reset password</h2>
        <p className="mt-2 text-sm text-textMuted max-w-sm mx-auto">
          Enter the email address associated with your account and we&apos;ll send you a link to reset your password.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-surface border border-border py-8 px-4 shadow rounded-2xl sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="block text-sm font-medium text-white">Email address</label>
              <div className="mt-2">
                <input
                  {...register('email')}
                  type="email"
                  className="w-full p-3 bg-background border border-border rounded-xl text-white placeholder-textMuted focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  placeholder="you@example.com"
                />
                {errors.email && <p className="mt-1 text-sm text-error">{errors.email.message}</p>}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || forgotPassword.isPending}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all disabled:opacity-50"
            >
              {isSubmitting || forgotPassword.isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Send reset link <ArrowRight className="ml-2 w-4 h-4" />
                </>
              )}
            </button>
            
            <div className="text-center pt-2">
              <Link href="/login" className="font-medium text-sm text-textMuted hover:text-white transition-colors">
                Return to sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
