import { Truck } from 'lucide-react';

export default function ShippingPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 min-h-[70vh]">
      <div className="flex items-center gap-5 mb-10 pb-6 border-b border-gold-hairline">
        <Truck className="w-12 h-12 text-kinpaku-gold" />
        <h1 className="font-display text-5xl text-champagne uppercase tracking-wider">Shipping <span className="text-kinpaku-gold">Policy</span></h1>
      </div>
      <div className="prose prose-invert prose-lg max-w-none text-text-muted prose-headings:font-display prose-headings:text-champagne prose-headings:uppercase prose-headings:tracking-wider prose-headings:font-normal prose-a:text-kinpaku-gold prose-strong:text-champagne prose-li:marker:text-kinpaku-gold">
        <p>Our vendors ship globally using trusted carriers to ensure your sports gear arrives safely and on time.</p>
        
        <h2 className="text-3xl mt-12 mb-6 border-b border-white/5 pb-2">1. Processing Time</h2>
        <p>Most orders are processed within 1-2 business days. Processing times may vary depending on the specific vendor and item availability. Custom or personalized items may require additional processing time.</p>
        
        <h2 className="text-3xl mt-12 mb-6 border-b border-white/5 pb-2">2. Shipping Rates & Delivery Estimates</h2>
        <p>Shipping charges for your order will be calculated and displayed at checkout. Delivery delays can occasionally occur.</p>
        <ul className="list-disc pl-6 space-y-2 mt-4 text-text-muted">
          <li><strong className="text-kinpaku-gold">Standard Shipping:</strong> 3-5 business days</li>
          <li><strong className="text-kinpaku-gold">Expedited Shipping:</strong> 2-3 business days</li>
          <li><strong className="text-kinpaku-gold">Overnight Shipping:</strong> 1-2 business days</li>
        </ul>
        
        <h2 className="text-3xl mt-12 mb-6 border-b border-white/5 pb-2">3. Multi-Vendor Orders</h2>
        <p>If you order items from multiple vendors, your items will arrive in separate packages. You will receive tracking information for each package separately once it has been dispatched by the respective vendor.</p>
      </div>
    </div>
  );
}
