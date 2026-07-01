'use client';

import { useState, useEffect } from 'react';
import { useAuth, useUpdateProfile } from '@/hooks/useAuth';
import { User, Shield, Calendar, Loader2, Eye, EyeOff } from 'lucide-react';
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
  const [showPassword, setShowPassword] = useState(false);

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

  if (isLoading) return <div className="animate-pulse bg-lacquer-deep h-64 rounded-[2px]" />;

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
      <div className="flex justify-between items-end pb-4 border-b border-gold-hairline">
        <div>
          <h2 className="font-display text-4xl text-champagne tracking-wider uppercase leading-none mb-2">Profile <span className="text-kinpaku-gold">Overview</span></h2>
          <p className="text-text-muted text-[0.95rem]">Manage your personal information and account settings.</p>
        </div>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="ks-button ks-button-secondary text-[0.85rem] px-6 py-2"
          >
            Edit Profile
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="bg-raised-lacquer border border-gold-hairline p-8 sm:rounded-[4px] space-y-6 shadow-panel">
          <div className="space-y-6 max-w-lg">
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
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="input-field pr-12"
                  placeholder="Leave blank to keep unchanged"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-text-muted hover:text-champagne transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex gap-4 pt-6 border-t border-gold-hairline">
            <button 
              type="button" 
              onClick={() => setIsEditing(false)}
              className="px-6 py-2 rounded-[2px] font-mono text-[0.85rem] uppercase tracking-wider text-text-muted hover:text-champagne transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={updateProfile.isPending}
              className="ks-button ks-button-primary min-w-[140px] text-[0.85rem] px-8 py-2"
            >
              {updateProfile.isPending ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Save Changes'}
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-raised-lacquer border border-gold-hairline p-8 sm:rounded-[4px] flex items-start gap-6 md:col-span-2 shadow-panel">
            {user?.avatar ? (
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-kinpaku-gold flex-shrink-0">
                <Image src={user.avatar} alt={user.name} width={80} height={80} className="object-cover w-full h-full" />
              </div>
            ) : (
              <div className="p-5 bg-lacquer-deep border border-gold-hairline rounded-full flex-shrink-0">
                <User className="w-10 h-10 text-kinpaku-gold" />
              </div>
            )}
            <div className="pt-2">
              <p className="font-display text-3xl text-champagne uppercase tracking-wider mb-1">{user?.name}</p>
              <p className="text-text-muted font-mono text-[0.9rem]">{user?.email}</p>
            </div>
          </div>

          <div className="bg-raised-lacquer border border-gold-hairline p-8 sm:rounded-[4px] flex items-start gap-5 shadow-panel">
            <div className="p-3 bg-lacquer-deep border border-gold-hairline rounded-full">
              <Shield className="w-6 h-6 text-kinpaku-gold" />
            </div>
            <div>
              <p className="text-[0.7rem] font-mono font-medium text-text-muted uppercase tracking-[0.2em] mb-1">Account Type</p>
              <p className="font-display text-2xl text-champagne capitalize tracking-wider">{user?.role}</p>
            </div>
          </div>

          <div className="bg-raised-lacquer border border-gold-hairline p-8 sm:rounded-[4px] flex items-start gap-5 shadow-panel">
            <div className="p-3 bg-lacquer-deep border border-gold-hairline rounded-full">
              <Calendar className="w-6 h-6 text-kinpaku-gold" />
            </div>
            <div>
              <p className="text-[0.7rem] font-mono font-medium text-text-muted uppercase tracking-[0.2em] mb-1">Member Since</p>
              <p className="font-display text-2xl text-champagne tracking-wider">2026</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
