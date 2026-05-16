'use client';

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
}

export default function Pagination({ currentPage, totalPages, onPageChange, hasNextPage, hasPrevPage }: PaginationProps) {
  if (totalPages <= 1) return null;

  const canGoPrev = hasPrevPage ?? currentPage > 1;
  const canGoNext = hasNextPage ?? currentPage < totalPages;

  // Generate visible page numbers with ellipsis
  const getPageNumbers = () => {
    const pages: (number | '...')[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      
      if (currentPage > 3) pages.push('...');
      
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) pages.push(i);
      
      if (currentPage < totalPages - 2) pages.push('...');
      
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <nav className="flex items-center justify-center gap-1 sm:gap-2 mt-8" aria-label="Pagination">
      {/* First page */}
      <button
        onClick={() => onPageChange(1)}
        disabled={!canGoPrev}
        className="p-2 rounded-lg text-textMuted hover:text-white hover:bg-surfaceHighlight disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        aria-label="First page"
      >
        <ChevronsLeft className="w-4 h-4" />
      </button>

      {/* Previous */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!canGoPrev}
        className="p-2 rounded-lg text-textMuted hover:text-white hover:bg-surfaceHighlight disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        aria-label="Previous page"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {getPageNumbers().map((page, idx) =>
          page === '...' ? (
            <span key={`ellipsis-${idx}`} className="px-2 text-textMuted text-sm">…</span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`min-w-[36px] h-9 rounded-lg text-sm font-bold transition-all ${
                page === currentPage
                  ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20'
                  : 'text-textMuted hover:text-white hover:bg-surfaceHighlight'
              }`}
              aria-label={`Page ${page}`}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </button>
          )
        )}
      </div>

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!canGoNext}
        className="p-2 rounded-lg text-textMuted hover:text-white hover:bg-surfaceHighlight disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        aria-label="Next page"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Last page */}
      <button
        onClick={() => onPageChange(totalPages)}
        disabled={!canGoNext}
        className="p-2 rounded-lg text-textMuted hover:text-white hover:bg-surfaceHighlight disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        aria-label="Last page"
      >
        <ChevronsRight className="w-4 h-4" />
      </button>
    </nav>
  );
}
