'use client';

import { useAdminUsers } from '@/hooks/useAdmin';
import { Loader2, Users, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

export default function AdminCustomersPage() {
  const { data: customers, isLoading, isError } = useAdminUsers('customer');

  if (isLoading) return <div className="flex h-[60vh] items-center justify-center"><Loader2 className="w-10 h-10 text-primary-500 animate-spin" /></div>;
  if (isError || !customers) return <div className="text-center text-error">Failed to load customers</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex items-center gap-3">
        <Users className="w-8 h-8 text-primary-500" />
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Customer Base</h2>
          <p className="text-textMuted mt-1">Review active marketplace buyers</p>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surfaceHighlight border-b border-border text-xs uppercase tracking-wider text-textMuted font-medium">
              <th className="p-4 rounded-tl-xl">Customer Details</th>
              <th className="p-4">Joined</th>
              <th className="p-4 text-right rounded-tr-xl">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-sm">
            {customers.map((customer) => (
              <tr key={customer._id} className="hover:bg-surfaceHighlight/50 transition-colors group">
                <td className="p-4">
                  <p className="font-semibold text-white">{customer.name}</p>
                  <p className="text-xs text-textMuted">{customer.email}</p>
                </td>
                <td className="p-4 text-textMuted">
                  {format(new Date(customer.createdAt), 'MMM d, yyyy')}
                </td>
                <td className="p-4 text-right">
                  <Link 
                    href={`/admin/customers/${customer._id}`}
                    className="inline-flex items-center text-primary-500 hover:text-white transition-colors font-medium text-sm"
                  >
                    View Record <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr><td colSpan={3} className="p-8 text-center text-textMuted">No customers found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
