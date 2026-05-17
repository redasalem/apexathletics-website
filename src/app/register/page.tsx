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
        <div className="bg-surface border border-border py-8 px-4 shadow rounded-2xl sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="block text-sm font-medium text-white mb-2">Account Type</label>
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
              <label className="block text-sm font-medium text-white">Full Name</label>
              <div className="mt-2">
                <input
                  {...register('name')}
                  type="text"
                  className="w-full p-3 bg-background border border-border rounded-xl text-white placeholder-textMuted focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  placeholder="John Doe"
                />
                {errors.name && <p className="mt-1 text-sm text-error">{errors.name.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white">Email address</label>
              <div className="mt-2">
                <input
                  {...register('email')}
                  type="email"
                  className="w-full p-3 bg-background border border-border rounded-xl text-white placeholder-textMuted focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  placeholder="you@example.com"
                />
                {errors.email && <p className="mt-1 text-sm text-error">{errors.email.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white">Password</label>
              <div className="mt-2">
                <input
                  {...register('password')}
                  type="password"
                  className="w-full p-3 bg-background border border-border rounded-xl text-white placeholder-textMuted focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  placeholder="••••••••"
                />
                {errors.password && <p className="mt-1 text-sm text-error">{errors.password.message}</p>}
              </div>
            </div>

            {selectedRole === 'vendor' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-white">Store Name</label>
                  <div className="mt-2">
                    <input
                      {...register('storeName')}
                      type="text"
                      className="w-full p-3 bg-background border border-border rounded-xl text-white placeholder-textMuted focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      placeholder="My Awesome Store"
                    />
                    {errors.storeName && <p className="mt-1 text-sm text-error">{errors.storeName.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white">Store Description</label>
                  <div className="mt-2">
                    <textarea
                      {...register('storeDescription')}
                      className="w-full p-3 bg-background border border-border rounded-xl text-white placeholder-textMuted focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      placeholder="Tell us about your products..."
                      rows={3}
                    />
                    {errors.storeDescription && <p className="mt-1 text-sm text-error">{errors.storeDescription.message}</p>}
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all disabled:opacity-50"
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
