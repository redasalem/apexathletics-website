'use client';

import { useState } from 'react';
import { useAdminUsers } from '@/hooks/useAdmin';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, Plus, ShieldCheck, Search, Trash2, X, Check } from 'lucide-react';
import { toast } from 'react-hot-toast';
import backendApi from '@/lib/axios';
import { getErrorMessage } from '@/utils/errors';

export default function AdminManagementPage() {
  const { data: admins, isLoading, refetch } = useAdminUsers('admin');
  const { data: currentUser } = useAuth();
  const [isInviting, setIsInviting] = useState(false);
  const [inviteData, setInviteData] = useState({ name: '', email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Direct admin creation API (restricted to admins)
      await backendApi.post('/auth/admin-create', { ...inviteData, role: 'admin' });
      toast.success('Administrator successfully added');
      setIsInviting(false);
      setInviteData({ name: '', email: '', password: '' });
      refetch();
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, 'Failed to add administrator'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-primary-500 w-10 h-10" /></div>;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">Platform Governance</h2>
          <p className="text-textMuted">Manage core administrators and platform permissions.</p>
        </div>
        <button 
          onClick={() => setIsInviting(true)}
          className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all transform hover:scale-105 shadow-xl shadow-primary-500/20"
        >
          <Plus className="w-5 h-5" />
          Add Administrator
        </button>
      </div>

      {isInviting && (
        <div className="bg-surface border border-primary-500/20 p-8 rounded-3xl animate-in zoom-in-95 duration-300 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-primary-500"></div>
          <div className="flex items-center justify-between mb-8">
             <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-500/10 rounded-lg text-primary-500">
                   <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">Elevate New Admin</h3>
             </div>
             <button onClick={() => setIsInviting(false)} className="text-textMuted hover:text-white transition-colors">
                <X className="w-6 h-6" />
             </button>
          </div>

          <form onSubmit={handleInvite} className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="space-y-2">
                <label className="text-xs font-black text-textMuted uppercase tracking-widest">Full Name</label>
                <input 
                  required
                  value={inviteData.name}
                  onChange={e => setInviteData({ ...inviteData, name: e.target.value })}
                  placeholder="John Doe"
                  className="w-full bg-background border border-border rounded-xl px-5 py-4 text-white focus:border-primary-500 outline-none transition-all placeholder:text-textMuted/30"
                />
             </div>
             <div className="space-y-2">
                <label className="text-xs font-black text-textMuted uppercase tracking-widest">Email Address</label>
                <input 
                  required
                  type="email"
                  value={inviteData.email}
                  onChange={e => setInviteData({ ...inviteData, email: e.target.value })}
                  placeholder="admin@apexsports.com"
                  className="w-full bg-background border border-border rounded-xl px-5 py-4 text-white focus:border-primary-500 outline-none transition-all placeholder:text-textMuted/30"
                />
             </div>
             <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-black text-textMuted uppercase tracking-widest">Initial Password</label>
                <input 
                  required
                  type="password"
                  value={inviteData.password}
                  onChange={e => setInviteData({ ...inviteData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full bg-background border border-border rounded-xl px-5 py-4 text-white focus:border-primary-500 outline-none transition-all placeholder:text-textMuted/30"
                />
             </div>
             <div className="md:col-span-2 flex justify-end gap-4 mt-4 border-t border-border pt-8">
                <button type="button" onClick={() => setIsInviting(false)} className="px-8 py-3 rounded-xl font-bold text-sm text-textMuted hover:text-white transition-colors">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="bg-primary-500 hover:bg-primary-600 text-white px-10 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 shadow-lg shadow-primary-500/30">
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  Assign Admin Role
                </button>
             </div>
          </form>
        </div>
      )}

      <div className="bg-surface border border-border rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-border bg-surfaceHighlight/30 flex items-center justify-between">
           <h3 className="font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary-500" />
              Active Administrators
           </h3>
           <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-textMuted" />
              <input 
                placeholder="Search admins..." 
                className="bg-background border border-border rounded-full py-2 pl-9 pr-4 text-xs text-white focus:border-primary-500 outline-none transition-all w-64"
              />
           </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border text-xs font-black text-textMuted uppercase tracking-widest">
                <th className="px-8 py-5">Profile</th>
                <th className="px-8 py-5">Platform ID</th>
                <th className="px-8 py-5 text-right">Settings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {admins?.map((admin) => (
                <tr key={admin._id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-full bg-primary-500/10 flex items-center justify-center text-primary-500 font-bold border border-primary-500/20 uppercase">
                          {admin.name.charAt(0)}
                       </div>
                       <div>
                          <p className="font-bold text-white text-sm group-hover:text-primary-500 transition-colors">{admin.name}</p>
                          <p className="text-xs text-textMuted italic">{admin.email}</p>
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-[10px] font-mono text-textMuted bg-surfaceHighlight px-2.5 py-1 rounded-md border border-white/5 uppercase">{admin._id}</span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    {admin._id !== currentUser?._id && (
                      <button
                        onClick={async () => {
                          if (!window.confirm(`Remove admin ${admin.name}?`)) return;
                          try {
                            await backendApi.delete(`/admin/users/${admin._id}`);
                            toast.success('Admin removed');
                            refetch();
                          } catch (err) {
                            toast.error(getErrorMessage(err, 'Failed to remove admin'));
                          }
                        }}
                        className="p-2 text-textMuted hover:text-error hover:bg-error/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        title="Remove admin"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
