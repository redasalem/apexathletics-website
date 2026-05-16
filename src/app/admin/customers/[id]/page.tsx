'use client';

import { useParams, useRouter } from 'next/navigation';
import { useAdminUserDetail } from '@/hooks/useAdmin';
import { ChevronLeft, Loader2, User, Mail, Calendar } from 'lucide-react';
import { format } from 'date-fns';

export default function AdminCustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { data: customer, isLoading, isError } = useAdminUserDetail(id);

  if (isLoading) return <div className="h-[60vh] flex items-center justify-center"><Loader2 className="w-10 h-10 text-primary-500 animate-spin" /></div>;
  if (isError || !customer) return <div className="text-center text-error mt-10">Customer not found.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4 border-b border-border pb-6">
        <button onClick={() => router.back()} className="p-2 bg-surfaceHighlight hover:bg-border rounded-full transition-colors">
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            Customer Record
          </h1>
          <p className="text-xs text-textMuted font-mono mt-1">ID: {customer._id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface border border-border p-6 rounded-xl space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center border border-blue-500/30">
              <User className="w-8 h-8 text-blue-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{customer.name}</h2>
              <span className="inline-block px-2 py-1 bg-surfaceHighlight text-xs font-semibold rounded-full mt-1 uppercase tracking-wider text-textMuted">{customer.role}</span>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-border">
            <div>
              <p className="text-xs uppercase tracking-wider text-textMuted font-medium mb-1 flex items-center gap-2"><Mail className="w-4 h-4" /> Email Access</p>
              <p className="text-white font-medium">{customer.email}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-textMuted font-medium mb-1 flex items-center gap-2"><Calendar className="w-4 h-4" /> Joined Platform</p>
              <p className="text-white">{format(new Date(customer.createdAt), 'MMMM d, yyyy')}</p>
            </div>
          </div>
        </div>

        <div className="bg-surface border border-border p-6 rounded-xl space-y-4">
          <h3 className="text-lg font-bold text-white border-b border-border pb-3">Administrative Actions</h3>
          <p className="text-sm text-textMuted">Account modification restrictions apply to active buyer ledgers.</p>
          
          <div className="pt-4 space-y-3">
            <button disabled className="w-full bg-warning/10 text-warning font-medium p-3 rounded-lg border border-warning/20 opacity-50 cursor-not-allowed">
              Ban Customer (Coming Soon)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
