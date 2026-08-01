'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
import { Tag, Plus, Trash2, Edit2, CheckCircle2, XCircle, Loader2 } from 'lucide-react';

interface Coupon {
  _id: string;
  code: string;
  discountPercentage: number;
  maxUses: number;
  usedCount: number;
  expiryDate: string;
  isActive: boolean;
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [code, setCode] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState<number | ''>(15);
  const [maxUses, setMaxUses] = useState<number | ''>(100);
  const [expiryDate, setExpiryDate] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCoupons = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/admin/coupons');
      setCoupons(res.data.data || []);
    } catch {
      toast.error('Failed to load coupons');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleOpenModal = (coupon?: Coupon) => {
    if (coupon) {
      setEditingId(coupon._id);
      setCode(coupon.code);
      setDiscountPercentage(coupon.discountPercentage);
      setMaxUses(coupon.maxUses);
      setExpiryDate(new Date(coupon.expiryDate).toISOString().split('T')[0]);
      setIsActive(coupon.isActive);
    } else {
      setEditingId(null);
      setCode('');
      setDiscountPercentage(15);
      setMaxUses(100);
      setExpiryDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
      setIsActive(true);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !discountPercentage || !expiryDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setIsSubmitting(true);
      if (editingId) {
        await api.put(`/admin/coupons/${editingId}`, {
          discountPercentage,
          maxUses,
          expiryDate,
          isActive,
        });
        toast.success('Coupon updated successfully');
      } else {
        await api.post('/admin/coupons', {
          code,
          discountPercentage,
          maxUses,
          expiryDate,
          isActive,
        });
        toast.success('Coupon created successfully');
      }
      setIsModalOpen(false);
      fetchCoupons();
    } catch (err: unknown) {
      const errorMsg = (err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to save coupon';
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (coupon: Coupon) => {
    try {
      await api.put(`/admin/coupons/${coupon._id}`, {
        isActive: !coupon.isActive,
      });
      toast.success(`Coupon ${coupon.isActive ? 'deactivated' : 'activated'}`);
      fetchCoupons();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;
    try {
      await api.delete(`/admin/coupons/${id}`);
      toast.success('Coupon deleted');
      fetchCoupons();
    } catch {
      toast.error('Failed to delete coupon');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black italic uppercase text-white tracking-tight mb-1">Coupon Management</h1>
          <p className="text-textMuted font-medium text-sm">Create and manage promotional discount codes.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-bold rounded-xl uppercase tracking-wider text-xs hover:bg-primaryHover transition-all shadow-lg shadow-primary/20"
        >
          <Plus className="w-4 h-4" /> Create Coupon
        </button>
      </div>

      {/* Coupons Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xl">
        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : coupons.length === 0 ? (
          <div className="text-center p-12 text-textMuted">
            <Tag className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p className="font-medium">No promo coupons found. Click &quot;Create Coupon&quot; to add one.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-surface/50 text-textMuted uppercase tracking-wider text-[11px] font-bold">
                  <th className="py-4 px-6">Code</th>
                  <th className="py-4 px-6">Discount</th>
                  <th className="py-4 px-6">Usage</th>
                  <th className="py-4 px-6">Expiry</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50 text-sm">
                {coupons.map((coupon) => (
                  <tr key={coupon._id} className="hover:bg-cardHover/50 transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-white flex items-center gap-2">
                      <Tag className="w-4 h-4 text-primary" /> {coupon.code}
                    </td>
                    <td className="py-4 px-6 font-bold text-success">
                      {coupon.discountPercentage}% OFF
                    </td>
                    <td className="py-4 px-6 text-textMuted text-xs font-mono">
                      {coupon.usedCount} / {coupon.maxUses} used
                    </td>
                    <td className="py-4 px-6 text-textMuted text-xs">
                      {new Date(coupon.expiryDate).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleToggleStatus(coupon)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider transition-colors ${
                          coupon.isActive
                            ? 'bg-success/10 text-success border border-success/20'
                            : 'bg-error/10 text-error border border-error/20'
                        }`}
                      >
                        {coupon.isActive ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {coupon.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => handleOpenModal(coupon)}
                        className="p-2 text-textMuted hover:text-white hover:bg-surface rounded-lg transition-colors"
                        title="Edit Coupon"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(coupon._id)}
                        className="p-2 text-textMuted hover:text-error hover:bg-error/10 rounded-lg transition-colors"
                        title="Delete Coupon"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border w-full max-w-md rounded-2xl p-6 shadow-2xl">
            <h2 className="text-xl font-black uppercase italic text-white mb-4">
              {editingId ? 'Edit Coupon' : 'Create New Coupon'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-textMuted mb-1">Coupon Code</label>
                <input
                  type="text"
                  disabled={!!editingId}
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. SUMMER2026"
                  className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-white font-mono text-sm uppercase focus:outline-none focus:border-primary disabled:opacity-50"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-textMuted mb-1">Discount (%)</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={discountPercentage}
                    onChange={(e) => setDiscountPercentage(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-white font-bold text-sm focus:outline-none focus:border-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-textMuted mb-1">Max Uses</label>
                  <input
                    type="number"
                    min="1"
                    value={maxUses}
                    onChange={(e) => setMaxUses(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-white font-bold text-sm focus:outline-none focus:border-primary"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-textMuted mb-1">Expiry Date</label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary"
                  required
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-white cursor-pointer">
                  Active immediately
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-surface text-textMuted font-bold text-xs uppercase tracking-wider rounded-xl hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-primary text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-primaryHover flex items-center gap-2"
                >
                  {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {editingId ? 'Save Changes' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
