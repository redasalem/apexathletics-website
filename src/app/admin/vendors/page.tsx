'use client';

import { useAdminUsers } from '@/hooks/useAdmin';
import { Loader2, Store, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

export default function AdminVendorsPage() {
  const { data: vendors, isLoading, isError } = useAdminUsers('vendor');

  if (isLoading) return <div className="flex h-[60vh] items-center justify-center"><Loader2 className="w-10 h-10 text-primary-500 animate-spin" /></div>;
  if (isError || !vendors) return <div className="text-center text-error">Failed to load vendors</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex items-center gap-3">
        <Store className="w-8 h-8 text-primary-500" />
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Vendor Management</h2>
          <p className="text-textMuted mt-1">Review and manage seller accounts</p>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surfaceHighlight border-b border-border text-xs uppercase tracking-wider text-textMuted font-medium">
              <th className="p-4 rounded-tl-xl">Vendor Details</th>
              <th className="p-4">Joined</th>
              <th className="p-4 text-right rounded-tr-xl">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-sm">
            {vendors.map((vendor) => (
              <tr key={vendor._id} className="hover:bg-surfaceHighlight/50 transition-colors group">
                <td className="p-4">
                  <p className="font-semibold text-white">{vendor.name}</p>
                  <p className="text-xs text-textMuted">{vendor.email}</p>
                </td>
                <td className="p-4 text-textMuted">
                  {format(new Date(vendor.createdAt), 'MMM d, yyyy')}
                </td>
                <td className="p-4 text-right">
                  <Link 
                    href={`/admin/vendors/${vendor._id}`}
                    className="inline-flex items-center text-primary-500 hover:text-white transition-colors font-medium text-sm"
                  >
                    View Details <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </td>
              </tr>
            ))}
            {vendors.length === 0 && (
              <tr><td colSpan={3} className="p-8 text-center text-textMuted">No vendors found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
