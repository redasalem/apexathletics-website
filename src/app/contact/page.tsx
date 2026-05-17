'use client';

import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16 min-h-[70vh]">
      <h1 className="text-4xl md:text-5xl font-black italic uppercase text-white mb-12 text-center">Contact Us</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Info */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-white mb-6">Get in Touch</h2>
          <p className="text-textMuted mb-8">
            Have questions about an order, our platform, or interested in becoming a vendor? Our support team is here to help you.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-primary-500/10 p-3 rounded-lg">
                <Mail className="w-6 h-6 text-primary-500" />
              </div>
              <div>
                <h3 className="font-bold text-white">Email Support</h3>
                <p className="text-textMuted">support@apexathletics.com</p>
                <p className="text-xs text-textMuted mt-1">We aim to respond within 24 hours.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="bg-primary-500/10 p-3 rounded-lg">
                <Phone className="w-6 h-6 text-primary-500" />
              </div>
              <div>
                <h3 className="font-bold text-white">Phone Support</h3>
                <p className="text-textMuted">+1 (800) 123-4567</p>
                <p className="text-xs text-textMuted mt-1">Mon-Fri, 9am - 6pm EST</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="bg-primary-500/10 p-3 rounded-lg">
                <MapPin className="w-6 h-6 text-primary-500" />
              </div>
              <div>
                <h3 className="font-bold text-white">Headquarters</h3>
                <p className="text-textMuted">123 Sports Ave, Suite 100<br/>New York, NY 10001<br/>United States</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Contact Form */}
        <div className="bg-surface border border-border p-8 rounded-2xl shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-6">Send a Message</h2>
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert('Thank you! Your message has been sent successfully.'); }}>
            <div>
              <label className="label">Name</label>
              <input type="text" required className="input-field" placeholder="John Doe" />
            </div>
            <div>
              <label className="label">Email</label>
              <input type="email" required className="input-field" placeholder="john@example.com" />
            </div>
            <div>
              <label className="label">Subject</label>
              <select className="input-field cursor-pointer">
                <option>General Inquiry</option>
                <option>Order Support</option>
                <option>Vendor Application</option>
                <option>Feedback</option>
              </select>
            </div>
            <div>
              <label className="label">Message</label>
              <textarea required className="input-field" rows={4} placeholder="How can we help you?"></textarea>
            </div>
            <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2 mt-6">
              <Send className="w-4 h-4" /> Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
