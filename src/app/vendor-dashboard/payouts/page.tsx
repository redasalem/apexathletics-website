'use client';

import { useVendorPayoutStatus, useVendorOnboarding } from '@/hooks/useVendorConnect';
import { CreditCard, CheckCircle2, AlertCircle, Loader2, ArrowRight, Wallet, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

export default function VendorPayoutsPage() {
  const { data: status, isLoading: isStatusLoading } = useVendorPayoutStatus();
  const onboardMutation = useVendorOnboarding();

  const handleOnboard = () => {
    onboardMutation.mutate(undefined, {
      onSuccess: (url) => {
        window.location.href = url;
      },
      onError: () => {
        toast.error('Failed to start onboarding process');
      }
    });
  };

  if (isStatusLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black italic uppercase text-white tracking-tight mb-2">Payout Settings</h1>
        <p className="text-textMuted font-medium">Manage your Stripe Connect account and automated earnings.</p>
      </div>

      {status?.active ? (
        /* Status: ACTIVE */
        <div className="bg-primary-500/10 border border-primary-500/20 p-8 rounded-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
             <CheckCircle2 className="w-32 h-32 text-primary-500" />
          </div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
             <div className="w-20 h-20 rounded-2xl bg-primary-500 flex items-center justify-center shadow-lg shadow-primary-500/20">
                <Wallet className="w-10 h-10 text-white" />
             </div>
             <div>
                <h2 className="text-2xl font-black uppercase text-white mb-1">Payouts are Active</h2>
                <p className="text-primary-500/80 font-bold uppercase tracking-widest text-xs">Verified via Stripe Connect</p>
                <div className="mt-6 flex items-center gap-4">
                   <div className="flex items-center gap-2 px-3 py-1 bg-primary-500/20 rounded-full border border-primary-500/30">
                      <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
                      <span className="text-[10px] font-black uppercase tracking-tighter text-primary-500">Earnings Automated</span>
                   </div>
                </div>
             </div>
          </div>

          <div className="mt-8 pt-8 border-t border-primary-500/10 flex justify-end">
             <button 
               onClick={handleOnboard}
               className="text-white text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:text-primary-500 transition-colors"
             >
                Stripe Dashboard <ExternalLink className="w-4 h-4" />
             </button>
          </div>
        </div>
      ) : (
        /* Status: INCOMPLETE */
        <div className="bg-surface border border-white/10 p-8 rounded-3xl">
          <div className="flex flex-col md:flex-row items-start gap-8">
             <div className="w-20 h-20 rounded-2xl bg-surfaceHighlight flex items-center justify-center flex-shrink-0">
                <CreditCard className="w-10 h-10 text-textMuted" />
             </div>
             <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-primary-500" />
                  <h2 className="text-xl font-black uppercase text-white">Setup Payouts</h2>
                </div>
                <p className="text-textMuted text-sm leading-relaxed mb-8">
                  To receive automated payments for your sales, you must link your bank account via Stripe Connect. This ensures secure, fast, and compliant payouts.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                   <div className="bg-background/50 border border-white/5 p-4 rounded-xl">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-textMuted mb-1">Fee structure</h4>
                      <p className="text-sm font-bold text-white">Standard Platform Fees Apply</p>
                   </div>
                   <div className="bg-background/50 border border-white/5 p-4 rounded-xl">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-textMuted mb-1">Transfer schedule</h4>
                      <p className="text-sm font-bold text-white">Rolling 2-day payouts</p>
                   </div>
                </div>

                <button 
                  onClick={handleOnboard}
                  disabled={onboardMutation.isPending}
                  className="btn-primary w-full md:w-auto px-10 py-4 flex items-center justify-center gap-3 group"
                >
                  {onboardMutation.isPending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Connect with Stripe <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
             </div>
          </div>
        </div>
      )}

      {/* FAQs / Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="p-6 bg-surfaceHighlight/30 rounded-2xl border border-white/5">
            <h4 className="text-xs font-black uppercase tracking-widest text-white mb-2">Security</h4>
            <p className="text-[10px] text-textMuted leading-normal">Your banking details are never stored on Apex servers. Everything is handled securely by Stripe.</p>
         </div>
         <div className="p-6 bg-surfaceHighlight/30 rounded-2xl border border-white/5">
            <h4 className="text-xs font-black uppercase tracking-widest text-white mb-2">Verification</h4>
            <p className="text-[10px] text-textMuted leading-normal">Stripe may require ID verification to comply with &quot;Know Your Customer&quot; (KYC) regulations.</p>
         </div>
         <div className="p-6 bg-surfaceHighlight/30 rounded-2xl border border-white/5">
            <h4 className="text-xs font-black uppercase tracking-widest text-white mb-2">Support</h4>
            <p className="text-[10px] text-textMuted leading-normal">Questions about your payouts? Contact our vendor support team or visit the Stripe help center.</p>
         </div>
      </div>

    </div>
  );
}
