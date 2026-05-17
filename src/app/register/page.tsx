'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRegister } from '@/hooks/useAuth';
import Link from 'next/link';
import { Loader2, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { getErrorMessage } from '@/utils/errors';
import { useEffect } from 'react';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must not exceed 128 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  role: z.enum(['customer', 'vendor']),
  storeName: z.string().optional(),
  storeDescription: z.string().optional()
}).refine(data => {
  if (data.role === 'vendor') {
    return !!data.storeName && data.storeName.trim().length > 0;
  }
  return true;
}, {
  message: 'Store name is required for vendors',
  path: ['storeName']
}).refine(data => {
  if (data.role === 'vendor') {
    return !!data.storeDescription && data.storeDescription.trim().length > 0;
  }
  return true;
}, {
  message: 'Store description is required for vendors',
  path: ['storeDescription']
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const registerMutation = useRegister();

  useEffect(() => {
    if (!registerMutation.isSuccess) return;
    const role = registerMutation.data?.data?.role;
    if (!role) return;
    if (role === 'vendor') router.replace('/vendor-dashboard');
    else router.replace('/account');
  }, [registerMutation.isSuccess, registerMutation.data, router]);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'customer'
    }
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: RegisterForm) => {
    try {
      const resp = await registerMutation.mutateAsync(data);
      toast.success(`Account created as ${data.role}!`);
      
      const role = resp.data?.role;
      if (role === 'vendor') router.replace('/vendor-dashboard');
      else router.replace('/account');
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, 'Failed to register account'));
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h2 className="text-3xl font-extrabold text-white tracking-tight">Join Apex Sports</h2>
        <p className="mt-2 text-sm text-textMuted">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-primary-500 hover:text-white transition-colors">
            Sign in instead
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-surface border border-border py-8 px-4 shadow sm:rounded-2xl sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="label">Account Type</label>
              <div className="grid grid-cols-2 gap-4">
                <label className="cursor-pointer">
                  <input type="radio" value="customer" {...register('role')} className="peer sr-only" />
                  <div className="text-center py-3 border border-border rounded-xl text-textMuted peer-checked:bg-primary-500/10 peer-checked:border-primary-500 peer-checked:text-primary-500 transition-colors font-medium">Customer</div>
                </label>
                <label className="cursor-pointer">
                  <input type="radio" value="vendor" {...register('role')} className="peer sr-only" />
                  <div className="text-center py-3 border border-border rounded-xl text-textMuted peer-checked:bg-primary-500/10 peer-checked:border-primary-500 peer-checked:text-primary-500 transition-colors font-medium">Vendor</div>
                </label>
              </div>
            </div>

            <div>
              <label className="label">Full Name</label>
                <input
                  {...register('name')}
                  type="text"
                  className="input-field"
                  placeholder="John Doe"
                />
                {errors.name && <p className="mt-1 text-sm text-error">{errors.name.message}</p>}
            </div>

            <div>
              <label className="label">Email address</label>
                <input
                  {...register('email')}
                  type="email"
                  className="input-field"
                  placeholder="you@example.com"
                />
                {errors.email && <p className="mt-1 text-sm text-error">{errors.email.message}</p>}
            </div>

            <div>
              <label className="label">Password</label>
                <input
                  {...register('password')}
                  type="password"
                  className="input-field"
                  placeholder="••••••••"
                />
                {errors.password && <p className="mt-1 text-sm text-error">{errors.password.message}</p>}
            </div>

            {selectedRole === 'vendor' && (
              <>
                <div>
              <label className="label">Store Name</label>
                <input
                  {...register('storeName')}
                  type="text"
                  className="input-field"
                  placeholder="My Awesome Store"
                />
                    {errors.storeName && <p className="mt-1 text-sm text-error">{errors.storeName.message}</p>}
                </div>

                <div>
              <label className="label">Store Description</label>
                <textarea
                  {...register('storeDescription')}
                  className="input-field"
                  placeholder="Tell us about your products..."
                  rows={3}
                />
                    {errors.storeDescription && <p className="mt-1 text-sm text-error">{errors.storeDescription.message}</p>}
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="btn-primary w-full"
            >
              {registerMutation.isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Create account <ArrowRight className="ml-2 w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
