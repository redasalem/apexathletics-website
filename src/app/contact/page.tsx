'use client';

import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16 min-h-[70vh]">
      <h1 className="font-display text-5xl md:text-6xl text-champagne uppercase tracking-wider mb-12 text-center">Contact <span className="text-kinpaku-gold">Us</span></h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Info */}
        <div className="space-y-8">
          <h2 className="font-display text-3xl text-champagne uppercase tracking-wider mb-6 border-b border-gold-hairline pb-4">Get in <span className="text-kinpaku-gold">Touch</span></h2>
          <p className="text-[0.95rem] text-text-muted mb-8 leading-relaxed">
            Have questions about an order, our platform, or interested in becoming a vendor? Our support team is here to help you.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-start gap-5">
              <div className="bg-lacquer-deep border border-gold-hairline p-3 rounded-full">
                <Mail className="w-6 h-6 text-kinpaku-gold" />
              </div>
              <div>
                <h3 className="font-mono text-[0.85rem] uppercase tracking-[0.1em] text-champagne mb-1">Email Support</h3>
                <p className="text-text-muted">support@apexathletics.com</p>
                <p className="text-[0.7rem] uppercase tracking-wider text-text-muted mt-1">We aim to respond within 24 hours.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-5">
              <div className="bg-lacquer-deep border border-gold-hairline p-3 rounded-full">
                <Phone className="w-6 h-6 text-kinpaku-gold" />
              </div>
              <div>
                <h3 className="font-mono text-[0.85rem] uppercase tracking-[0.1em] text-champagne mb-1">Phone Support</h3>
                <p className="text-text-muted">+1 (800) 123-4567</p>
                <p className="text-[0.7rem] uppercase tracking-wider text-text-muted mt-1">Mon-Fri, 9am - 6pm EST</p>
              </div>
            </div>
            
            <div className="flex items-start gap-5">
              <div className="bg-lacquer-deep border border-gold-hairline p-3 rounded-full">
                <MapPin className="w-6 h-6 text-kinpaku-gold" />
              </div>
              <div>
                <h3 className="font-mono text-[0.85rem] uppercase tracking-[0.1em] text-champagne mb-1">Headquarters</h3>
                <p className="text-[0.95rem] text-text-muted leading-relaxed">123 Sports Ave, Suite 100<br/>New York, NY 10001<br/>United States</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Contact Form */}
        <div className="bg-raised-lacquer border border-gold-hairline p-8 sm:rounded-[4px] shadow-panel">
          <h2 className="font-display text-3xl text-champagne uppercase tracking-wider mb-6">Send a Message</h2>
          <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); alert('Thank you! Your message has been sent successfully.'); }}>
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
            <button type="submit" className="ks-button ks-button-primary w-full flex items-center justify-center gap-2 mt-8">
              <Send className="w-4 h-4" /> Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
