import { ShieldCheck } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 min-h-[70vh]">
      <div className="flex items-center gap-4 mb-8">
        <ShieldCheck className="w-10 h-10 text-primary-500" />
        <h1 className="text-4xl font-black italic uppercase text-white">Privacy Policy</h1>
      </div>
      <div className="prose prose-invert prose-lg max-w-none text-textMuted">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        <p>At Apex Athletics, we take your privacy seriously. This Privacy Policy describes how your personal information is collected, used, and shared when you visit or make a purchase from our marketplace.</p>
        
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">1. Information We Collect</h2>
        <p>We collect information you provide directly to us when you create an account, update your profile, use the interactive features of our services, participate in contests, promotions or surveys, request customer support or otherwise communicate with us.</p>
        
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">2. How We Use Your Information</h2>
        <p>We use the information we collect to operate our platform, facilitate vendor transactions, process your orders, improve our services, and communicate with you about products, services, and promotions.</p>
        
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">3. Information Sharing</h2>
        <p>We share your information with vendors on our platform only to the extent necessary to fulfill your orders. We do not sell your personal information to third parties. We may also share your information to comply with applicable laws and regulations.</p>
      </div>
    </div>
  );
}
