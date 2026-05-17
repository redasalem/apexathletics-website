import { FileText } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 min-h-[70vh]">
      <div className="flex items-center gap-4 mb-8">
        <FileText className="w-10 h-10 text-primary-500" />
        <h1 className="text-4xl font-black italic uppercase text-white">Terms of Service</h1>
      </div>
      <div className="prose prose-invert prose-lg max-w-none text-textMuted">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        <p>Welcome to Apex Athletics. These Terms of Service govern your use of our website and services. By using our platform, you agree to these terms.</p>
        
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">1. General Conditions</h2>
        <p>We reserve the right to refuse service to anyone for any reason at any time. You understand that your content (not including credit card information), may be transferred unencrypted and involve transmissions over various networks.</p>
        
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">2. Vendor Responsibilities</h2>
        <p>Vendors on our platform are independent entities. While we strive to ensure the highest quality of service, Apex Athletics is not directly responsible for the fulfillment of orders placed with independent vendors, though we do provide buyer protection guarantees to ensure a safe shopping experience.</p>
        
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">3. Prohibited Uses</h2>
        <p>In addition to other prohibitions as set forth in the Terms of Service, you are prohibited from using the site or its content for any unlawful purpose, to solicit others to perform or participate in any unlawful acts, or to violate any international, federal, provincial or state regulations, rules, laws, or local ordinances.</p>
      </div>
    </div>
  );
}
