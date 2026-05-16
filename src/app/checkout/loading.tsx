import { Loader2 } from 'lucide-react';

export default function CheckoutLoading() {
  return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
    </div>
  );
}
