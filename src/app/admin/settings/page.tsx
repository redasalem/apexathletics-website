import { Wrench, Clock } from 'lucide-react';

export default function AdminSettingsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white">Platform Settings</h2>
        <p className="text-textMuted mt-1">Configure global marketplace variables and operational constraints.</p>
      </div>

      <div className="empty-state bg-surface border border-border rounded-xl">
        <div className="empty-state-icon">
          <Wrench className="w-10 h-10 text-primary-500" />
        </div>
        <h3 className="empty-state-title">Under Development</h3>
        <p className="empty-state-desc">
          Global commission rates, payout schedules, and automated email gateways will be configured here in a future release.
        </p>
        <div className="flex items-center gap-2 mt-6 text-xs text-textMuted bg-surfaceHighlight px-4 py-2 rounded-full">
          <Clock className="w-3.5 h-3.5" />
          <span>Estimated: Next Release</span>
        </div>
      </div>
    </div>
  );
}
