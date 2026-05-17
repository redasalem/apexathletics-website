'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim().length >= 2) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="relative flex items-center w-full max-w-sm group"
    >
      <div className="absolute left-3 text-textMuted group-focus-within:text-primary-500 transition-colors">
        <Search className="w-4 h-4" />
      </div>
      <input 
        type="text"
        placeholder="Search products, gear, athletes..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full bg-surfaceHighlight border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm font-medium text-white placeholder:text-textMuted focus:outline-none focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/5 transition-all"
      />
      {query && (
        <button 
          type="button"
          onClick={() => setQuery('')}
          className="absolute right-3 text-textMuted hover:text-white min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Clear search"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </form>
  );
}
