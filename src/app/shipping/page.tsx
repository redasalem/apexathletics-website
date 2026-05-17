import { Truck } from 'lucide-react';

export default function ShippingPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 min-h-[70vh]">
      <div className="flex items-center gap-4 mb-8">
        <Truck className="w-10 h-10 text-primary-500" />
        <h1 className="text-4xl font-black italic uppercase text-white">Shipping Policy</h1>
      </div>
      <div className="prose prose-invert prose-lg max-w-none text-textMuted">
        <p>Our vendors ship globally using trusted carriers to ensure your sports gear arrives safely and on time.</p>
        
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">1. Processing Time</h2>
        <p>Most orders are processed within 1-2 business days. Processing times may vary depending on the specific vendor and item availability. Custom or personalized items may require additional processing time.</p>
        
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">2. Shipping Rates & Delivery Estimates</h2>
        <p>Shipping charges for your order will be calculated and displayed at checkout. Delivery delays can occasionally occur.</p>
        <ul className="list-disc pl-6 space-y-2 mt-4 text-white">
          <li><strong className="text-primary-500">Standard Shipping:</strong> 3-5 business days</li>
          <li><strong className="text-primary-500">Expedited Shipping:</strong> 2-3 business days</li>
          <li><strong className="text-primary-500">Overnight Shipping:</strong> 1-2 business days</li>
        </ul>
        
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">3. Multi-Vendor Orders</h2>
        <p>If you order items from multiple vendors, your items will arrive in separate packages. You will receive tracking information for each package separately once it has been dispatched by the respective vendor.</p>
      </div>
    </div>
  );
}
