'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLogin } from '@/hooks/useAuth';
import { getSafeRedirect } from '@/utils/navigation';
import Link from 'next/link';
import { Loader2, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { getErrorMessage } from '@/utils/errors';
import { useEffect, Suspense } from 'react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required')
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[80vh] flex justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
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
    <div className="min-h-[80vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h2 className="text-3xl font-extrabold text-white tracking-tight">Welcome back</h2>
        <p className="mt-2 text-sm text-textMuted">
          New to Apex?{' '}
          <Link href="/register" className="font-semibold text-primary-500 hover:text-white transition-colors">
            Create your free account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-surface border border-border py-8 px-4 shadow rounded-2xl sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="label">Email address</label>
              <input
                {...register('email')}
                type="email"
                className="input-field"
                placeholder="you@example.com"
              />
              {errors.email && <p className="text-error text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="label">Password</label>
              <input
                {...register('password')}
                type="password"
                className="input-field"
                placeholder="••••••••"
              />
              {errors.password && <p className="text-error text-xs mt-1">{errors.password.message}</p>}
            </div>

            <div className="flex items-center justify-end">
              <div className="text-sm">
                <Link href="/forgot-password" className="font-medium text-primary-500 hover:text-white transition-colors">
                  Forgot your password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="btn-primary w-full flex justify-center items-center py-3 text-sm"
            >
              {loginMutation.isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Sign in <ArrowRight className="ml-2 w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
