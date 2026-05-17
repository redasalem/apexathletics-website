import Link from 'next/link';
import { PackageX } from 'lucide-react';

export default function GlobalNotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
      <PackageX className="w-20 h-20 text-textMuted mb-6" />
      <h1 className="text-4xl font-black italic uppercase text-white mb-4">Page Not Found</h1>
      <p className="text-textMuted mb-8 max-w-md">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="btn-primary py-3 px-8 uppercase tracking-widest shadow-lg shadow-primary-500/20"
      >
        Back to Home
      </Link>
    </div>
  );
}
