import { FileText } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 min-h-[70vh]">
      <div className="flex items-center gap-5 mb-10 pb-6 border-b border-gold-hairline">
        <FileText className="w-12 h-12 text-kinpaku-gold" />
        <h1 className="font-display text-5xl text-champagne uppercase tracking-wider">Terms of <span className="text-kinpaku-gold">Service</span></h1>
      </div>
      <div className="prose prose-invert prose-lg max-w-none text-text-muted prose-headings:font-display prose-headings:text-champagne prose-headings:uppercase prose-headings:tracking-wider prose-headings:font-normal prose-a:text-kinpaku-gold prose-strong:text-champagne">
        <p className="font-mono text-[0.85rem] uppercase tracking-wider mb-8">Last updated: {new Date().toLocaleDateString()}</p>
        <p>Welcome to Apex Athletics. These Terms of Service govern your use of our website and services. By using our platform, you agree to these terms.</p>
        
        <h2 className="text-3xl mt-12 mb-6 border-b border-white/5 pb-2">1. General Conditions</h2>
        <p>We reserve the right to refuse service to anyone for any reason at any time. You understand that your content (not including credit card information), may be transferred unencrypted and involve transmissions over various networks.</p>
        
        <h2 className="text-3xl mt-12 mb-6 border-b border-white/5 pb-2">2. Vendor Responsibilities</h2>
        <p>Vendors on our platform are independent entities. While we strive to ensure the highest quality of service, Apex Athletics is not directly responsible for the fulfillment of orders placed with independent vendors, though we do provide buyer protection guarantees to ensure a safe shopping experience.</p>
        
        <h2 className="text-3xl mt-12 mb-6 border-b border-white/5 pb-2">3. Prohibited Uses</h2>
        <p>In addition to other prohibitions as set forth in the Terms of Service, you are prohibited from using the site or its content for any unlawful purpose, to solicit others to perform or participate in any unlawful acts, or to violate any international, federal, provincial or state regulations, rules, laws, or local ordinances.</p>
      </div>
    </div>
  );
}
