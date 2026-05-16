import { Loader2 } from 'lucide-react';

export default function CartLoading() {
  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
    </div>
  );
}
