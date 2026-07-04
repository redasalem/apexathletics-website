'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLogin } from '@/hooks/useAuth';
import { getSafeRedirect } from '@/utils/navigation';
import Link from 'next/link';
import { Loader2, ArrowRight, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { getErrorMessage } from '@/utils/errors';
import { useEffect, Suspense, useState } from 'react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required')
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[80vh] flex justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin text-kinpaku-gold" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = getSafeRedirect(searchParams.get('redirect'), '');
  const loginMutation = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('showSessionExpiredToast') === 'true') {
      toast.error('Your session has expired. Please sign in again.', { duration: 5000 });
      localStorage.removeItem('showSessionExpiredToast');
    }
  }, []);

  useEffect(() => {
    if (!loginMutation.isSuccess) return;
    const userData = loginMutation.data?.data;
    if (!userData) return;
    if (redirect) router.replace(redirect);
    else if (userData.role === 'admin') router.replace('/admin');
    else if (userData.role === 'vendor') router.replace('/vendor-dashboard');
    else router.replace('/account');
  }, [loginMutation.isSuccess, loginMutation.data, redirect, router]);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      const resp = await loginMutation.mutateAsync(data);
      toast.success('Login successful!');
      
      const role = resp.data?.role;
      if (redirect) {
        router.replace(redirect);
      } else {
        if (role === 'admin') router.replace('/admin');
        else if (role === 'vendor') router.replace('/vendor-dashboard');
        else router.replace('/account');
      }
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, 'Invalid credentials'));
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 px-6 lg:px-8 bg-lacquer-black">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h2 className="font-display text-5xl md:text-6xl text-champagne tracking-wider uppercase">Welcome <span className="text-kinpaku-gold">Back</span></h2>
        <p className="mt-4 text-[1.02rem] text-text-muted">
          New to Impeccable?{' '}
          <Link href="/register" className="font-medium text-kinpaku-gold hover:text-champagne transition-colors underline underline-offset-4">
            Create your free account
          </Link>
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-raised-lacquer border border-gold-hairline py-10 px-6 sm:rounded-[4px] sm:px-10 shadow-panel">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="label">Email address</label>
                <input
                  {...register('email')}
                  type="email"
                  className="input-field"
                  placeholder="you@example.com"
                />
                {errors.email && <p className="mt-1.5 text-sm text-red-500 font-medium">{errors.email.message}</p>}
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  className="input-field pr-12"
                  placeholder="••••••••"
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

            <div className="flex items-center justify-end">
              <div className="text-[0.85rem]">
                <Link href="/forgot-password" className="font-medium text-text-muted hover:text-kinpaku-gold transition-colors">
                  Forgot your password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="ks-button ks-button-primary w-full text-[1.18rem] mt-4"
            >
              {loginMutation.isPending ? (
                <Loader2 className="w-6 h-6 animate-spin text-lacquer-deep" />
              ) : (
                <>
                  Sign In <ArrowRight className="ml-2 w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
