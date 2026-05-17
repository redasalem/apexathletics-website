'use client';

import { useState, useEffect } from 'react';
import { useAuth, useUpdateProfile } from '@/hooks/useAuth';
import { User, Shield, Calendar, Loader2 } from 'lucide-react';
import Image from 'next/image';

export default function AccountProfilePage() {
  const { data: user, isLoading } = useAuth();
  const updateProfile = useUpdateProfile();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    avatar: '',
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: '',
        avatar: user.avatar || '',
      });
    }
  }, [user]);

  if (isLoading) return <div className="animate-pulse bg-white/5 h-64 rounded-xl" />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSubmit: { name: string; email: string; password?: string; avatar?: string } = { name: formData.name, email: formData.email };
    if (formData.password) dataToSubmit.password = formData.password;
    if (formData.avatar) dataToSubmit.avatar = formData.avatar;
    
    await updateProfile.mutateAsync(dataToSubmit);
    setIsEditing(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black italic uppercase tracking-tight text-white mb-2">Profile Overview</h2>
          <p className="text-textMuted">Manage your personal information and account settings.</p>
        </div>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="btn-primary px-6 py-2 text-sm tracking-widest uppercase"
          >
            Edit Profile
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="bg-background border border-border p-6 rounded-xl space-y-6">
          <div className="space-y-4 max-w-lg">
            <div>
              <label className="label">Avatar URL (Optional)</label>
              <input
                type="text"
                value={formData.avatar}
                onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                className="input-field"
                placeholder="https://example.com/avatar.jpg"
              />
            </div>
            <div>
              <label className="label">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="label">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="label">New Password (Optional)</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="input-field"
                placeholder="Leave blank to keep unchanged"
              />
            </div>
          </div>
          
          <div className="flex gap-4 pt-4 border-t border-border">
            <button 
              type="button" 
              onClick={() => setIsEditing(false)}
              className="px-6 py-2 rounded-xl font-bold text-sm text-textMuted hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={updateProfile.isPending}
              className="btn-primary px-8 py-2 text-sm min-w-[120px]"
            >
              {updateProfile.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Changes'}
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-background border border-border p-6 rounded-xl flex items-start gap-4 md:col-span-2">
            {user?.avatar ? (
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary-500 flex-shrink-0">
                <Image src={user.avatar} alt={user.name} width={64} height={64} className="object-cover w-full h-full" />
              </div>
            ) : (
              <div className="p-4 bg-primary-500/10 rounded-full flex-shrink-0">
                <User className="w-8 h-8 text-primary-500" />
              </div>
            )}
            <div className="pt-2">
              <p className="text-xl font-bold text-white">{user?.name}</p>
              <p className="text-textMuted text-sm">{user?.email}</p>
            </div>
          </div>

          <div className="bg-background border border-border p-6 rounded-xl flex items-start gap-4">
            <div className="p-3 bg-primary-500/10 rounded-lg">
              <Shield className="w-6 h-6 text-primary-500" />
            </div>
            <div>
              <p className="text-xs font-bold text-textMuted uppercase tracking-wider mb-1">Account Type</p>
              <p className="text-lg font-bold text-white capitalize">{user?.role}</p>
            </div>
          </div>

          <div className="bg-background border border-border p-6 rounded-xl flex items-start gap-4">
            <div className="p-3 bg-primary-500/10 rounded-lg">
              <Calendar className="w-6 h-6 text-primary-500" />
            </div>
            <div>
              <p className="text-xs font-bold text-textMuted uppercase tracking-wider mb-1">Member Since</p>
              <p className="text-lg font-bold text-white">2026</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
