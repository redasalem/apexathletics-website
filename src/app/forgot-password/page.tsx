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
    <div className="min-h-[80vh] flex flex-col justify-center py-12 px-6 lg:px-8 bg-lacquer-black">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="border border-gold-hairline p-4 rounded-[2px] inline-block mx-auto mb-6 bg-lacquer-deep">
          <Mail className="w-8 h-8 text-kinpaku-gold" />
        </div>
        <h2 className="font-display text-5xl md:text-6xl text-champagne tracking-wider uppercase">Forgot <span className="text-kinpaku-gold">Password</span></h2>
        <p className="mt-4 text-[1.02rem] text-text-muted max-w-sm mx-auto">
          Enter the email address associated with your account and we&apos;ll send you a link to reset your password.
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-raised-lacquer border border-gold-hairline py-10 px-6 sm:rounded-[4px] sm:px-10 shadow-panel">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="label">Email address</label>
              <div className="mt-2">
                <input
                  {...register('email')}
                  type="email"
                  className="input-field"
                  placeholder="you@example.com"
                />
                {errors.email && <p className="mt-1.5 text-sm text-red-500 font-medium">{errors.email.message}</p>}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || forgotPassword.isPending}
              className="ks-button ks-button-primary w-full text-[1.18rem] mt-4"
            >
              {isSubmitting || forgotPassword.isPending ? (
                <Loader2 className="w-6 h-6 animate-spin text-lacquer-deep" />
              ) : (
                <>
                  Send reset link <ArrowRight className="ml-2 w-5 h-5" />
                </>
              )}
            </button>
            
            <div className="text-center pt-4">
              <Link href="/login" className="font-medium text-[0.95rem] text-text-muted hover:text-kinpaku-gold transition-colors">
                Return to sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
