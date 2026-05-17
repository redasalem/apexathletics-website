'use client';

import { useAuth, useUpdateProfile } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import { Save, User, Store, Loader2 } from 'lucide-react';

export default function VendorSettings() {
  const { data: user, isLoading } = useAuth();
  const updateProfile = useUpdateProfile();
  const [storeName, setStoreName] = useState(user?.storeName || '');
  const [storeDescription, setStoreDescription] = useState(user?.storeDescription || '');
  const [message, setMessage] = useState('');

  useEffect(() => {
    setStoreName(user?.storeName || '');
    setStoreDescription(user?.storeDescription || '');
  }, [user?.storeDescription, user?.storeName]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    try {
      await updateProfile.mutateAsync({ storeName, storeDescription });
      setMessage('Settings saved successfully!');
    } catch {
      setMessage('Failed to save settings.');
    }
  };

  if (isLoading) return <div className="animate-pulse bg-surface h-96 rounded-xl border border-border" />;

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-3xl font-black italic uppercase tracking-tight text-white mb-2">Store Settings</h1>
        <p className="text-textMuted">Manage your vendor profile and public store information.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 bg-surface border border-border rounded-2xl p-6 sm:p-8">
        {message && (
          <div className={`p-4 rounded-xl text-sm font-bold ${message.includes('success') ? 'bg-success/10 text-success border border-success/20' : 'bg-error/10 text-error border border-error/20'}`}>
            {message}
          </div>
        )}

        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-border pb-2">
            <Store className="w-5 h-5 text-primary-500" />
            Store Information
          </h3>
          
          <div>
            <label className="block text-sm font-bold text-textMuted mb-2 uppercase tracking-wider">Store Name</label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500 transition-colors"
              placeholder="e.g. Elite Sports Gear"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-textMuted mb-2 uppercase tracking-wider">Store Description</label>
            <textarea
              value={storeDescription}
              onChange={(e) => setStoreDescription(e.target.value)}
              rows={4}
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500 transition-colors"
              placeholder="Tell customers about your brand..."
            />
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-border pb-2">
            <User className="w-5 h-5 text-primary-500" />
            Personal Information
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-textMuted mb-2 uppercase tracking-wider">Full Name</label>
              <input
                type="text"
                value={user?.name || ''}
                disabled
                className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-textMuted cursor-not-allowed opacity-70"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-textMuted mb-2 uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-textMuted cursor-not-allowed opacity-70"
              />
            </div>
          </div>
          <p className="text-xs text-textMuted italic">Personal information cannot be changed directly. Contact support if needed.</p>
        </div>

        <div className="pt-6 border-t border-border flex justify-end">
            <button
            type="submit"
            disabled={updateProfile.isPending}
            className="flex items-center gap-2 bg-primary-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-600 disabled:opacity-50 transition-all active:scale-95"
          >
            {updateProfile.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {updateProfile.isPending ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
