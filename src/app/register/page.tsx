'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRegister } from '@/hooks/useAuth';
import Link from 'next/link';
import { Loader2, ArrowRight, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';

import { useState } from 'react';

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

/**
 * Extract a user-friendly error message from the API error response.
 * Handles rate-limiting (429), duplicate email (400/409), and generic errors.
 */
function getRegisterErrorMessage(err: unknown): string {
  if (!err || typeof err !== 'object') return 'Registration failed. Please try again.';

  const axiosErr = err as {
    response?: { status?: number; data?: { message?: string } };
    friendlyMessage?: string;
    message?: string;
    code?: string;
  };

  const status = axiosErr.response?.status;
  const serverMessage = axiosErr.response?.data?.message;

  // Rate limiting
  if (status === 429) {
    return serverMessage || 'Too many attempts. Please wait a few minutes and try again.';
  }

  // Duplicate email or validation error
  if (status === 400 || status === 409) {
    if (serverMessage?.toLowerCase().includes('already') || serverMessage?.toLowerCase().includes('exists') || serverMessage?.toLowerCase().includes('duplicate')) {
      return 'This email is already registered. Try signing in instead.';
    }
    return serverMessage || 'Invalid registration data. Please check your details.';
  }

  // Server error
  if (status && status >= 500) {
    return 'Our servers are having issues. Please try again in a moment.';
  }

  // Network / timeout
  if (axiosErr.code === 'ECONNABORTED' || axiosErr.code === 'ERR_NETWORK') {
    return 'Connection error. Please check your internet and try again.';
  }

  // Fallback: use server message, friendly message, or generic
  return serverMessage || axiosErr.friendlyMessage || 'Registration failed. Please try again.';
}

export default function RegisterPage() {
  const router = useRouter();
  const registerMutation = useRegister();
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'customer'
    }
  });

  const selectedRole = watch('role');
  const isSubmitting = registerMutation.isPending;

  const onSubmit = async (data: RegisterForm) => {
    // Clear previous feedback
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const resp = await registerMutation.mutateAsync(data);
      
      // Show inline success banner before redirect
      setSubmitSuccess(true);

      // Redirect based on role
      const role = resp.data?.role;
      if (role === 'vendor') router.replace('/vendor-dashboard');
      else router.replace('/account');
    } catch (err: unknown) {
      const errorMessage = getRegisterErrorMessage(err);
      setSubmitError(errorMessage);
      // Error displayed via inline banner below the form — no toast needed
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 px-6 lg:px-8 bg-lacquer-black">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h2 className="font-display text-5xl md:text-6xl text-champagne tracking-wider uppercase">Join <span className="text-kinpaku-gold">Impeccable</span></h2>
        <p className="mt-4 text-[1.02rem] text-text-muted">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-kinpaku-gold hover:text-champagne transition-colors underline underline-offset-4">
            Sign in instead
          </Link>
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-raised-lacquer border border-gold-hairline py-10 px-6 sm:rounded-[4px] sm:px-10 shadow-panel">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="label">Account Type</label>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <label className={`cursor-pointer ${isSubmitting ? 'pointer-events-none opacity-60' : ''}`}>
                  <input type="radio" value="customer" {...register('role')} className="peer sr-only" disabled={isSubmitting} />
                  <div className="text-center py-3 border border-gold-hairline rounded-[2px] text-text-muted peer-checked:bg-kinpaku-gold peer-checked:border-kinpaku-gold peer-checked:text-lacquer-deep transition-colors font-medium">Customer</div>
                </label>
                <label className={`cursor-pointer ${isSubmitting ? 'pointer-events-none opacity-60' : ''}`}>
                  <input type="radio" value="vendor" {...register('role')} className="peer sr-only" disabled={isSubmitting} />
                  <div className="text-center py-3 border border-gold-hairline rounded-[2px] text-text-muted peer-checked:bg-kinpaku-gold peer-checked:border-kinpaku-gold peer-checked:text-lacquer-deep transition-colors font-medium">Vendor</div>
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
                  disabled={isSubmitting}
                />
                {errors.name && <p className="mt-1.5 text-sm text-red-500 font-medium">{errors.name.message}</p>}
            </div>

            <div>
              <label className="label">Email address</label>
                <input
                  {...register('email')}
                  type="email"
                  className="input-field"
                  placeholder="you@example.com"
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
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

            {selectedRole === 'vendor' && (
              <>
                <div>
              <label className="label">Store Name</label>
                <input
                  {...register('storeName')}
                  type="text"
                  className="input-field"
                  placeholder="My Awesome Store"
                  disabled={isSubmitting}
                />
                    {errors.storeName && <p className="mt-1.5 text-sm text-red-500 font-medium">{errors.storeName.message}</p>}
                </div>

                <div>
              <label className="label">Store Description</label>
                <textarea
                  {...register('storeDescription')}
                  className="input-field min-h-[100px]"
                  placeholder="Tell us about your products..."
                  rows={3}
                  disabled={isSubmitting}
                />
                    {errors.storeDescription && <p className="mt-1.5 text-sm text-red-500 font-medium">{errors.storeDescription.message}</p>}
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="ks-button ks-button-primary w-full text-[1.18rem] mt-4"
            >
              {isSubmitting ? (
                <Loader2 className="w-6 h-6 animate-spin text-lacquer-deep" />
              ) : (
                <>
                  Create Account <ArrowRight className="ml-2 w-5 h-5" />
                </>
              )}
            </button>

            {/* ── Inline error banner ── */}
            {submitError && !isSubmitting && (
              <div className="flex items-start gap-3 p-4 rounded-[2px] border border-red-500/40 bg-red-500/10 text-red-400 text-sm animate-in fade-in slide-in-from-top-1 duration-200">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">{submitError}</p>
                  {submitError.includes('already registered') && (
                    <Link href="/login" className="text-kinpaku-gold hover:text-champagne underline underline-offset-2 mt-1 inline-block text-sm">
                      Go to Sign In →
                    </Link>
                  )}
                </div>
              </div>
            )}

            {/* ── Inline success banner ── */}
            {submitSuccess && (
              <div className="flex items-center gap-3 p-4 rounded-[2px] border border-green-500/40 bg-green-500/10 text-green-400 text-sm animate-in fade-in slide-in-from-top-1 duration-200">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <p className="font-medium">Account created! Redirecting…</p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
