import Link from 'next/link';
import { PackageX } from 'lucide-react';

export default function ProductNotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
      <PackageX className="w-20 h-20 text-textMuted mb-6" />
      <h1 className="text-4xl font-black italic uppercase text-white mb-4">Product Not Found</h1>
      <p className="text-textMuted mb-8 max-w-md">The gear you&apos;re looking for doesn&apos;t exist or may have been removed by the vendor.</p>
      <Link 
        href="/shop" 
        className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 px-8 rounded-lg uppercase tracking-widest transition-colors shadow-lg shadow-primary-500/20"
      >
        Back to Catalog
      </Link>
    </div>
  );
}
