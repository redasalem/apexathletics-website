import { Wrench } from 'lucide-react';

export default function AdminSettingsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white">Platform Settings</h2>
        <p className="text-textMuted mt-1">Configure global marketplace variables and operational constraints.</p>
      </div>

      <div className="bg-surface border border-border rounded-xl p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-surfaceHighlight rounded-full">
            <Wrench className="w-10 h-10 text-primary-500" />
          </div>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Coming Soon</h3>
        <p className="text-textMuted max-w-sm mx-auto">
          Global commission rates, payout schedules, and automated email gateways will be configured here in a future release.
        </p>
      </div>
    </div>
  );
}
