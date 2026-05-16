'use client';

import { useEffect, useMemo, useState } from 'react';
import OptimizedImage from './OptimizedImage';
import { getCategoryImage } from '@/utils/images';

interface ProductGalleryProps {
  images: string[];
  title: string;
}

export default function ProductGallery({ images, title }: ProductGalleryProps) {
  const safeImages = useMemo(() => {
    const filteredImages = images.filter(Boolean);
    return filteredImages.length ? filteredImages : [getCategoryImage('')];
  }, [images]);
  const [mainImage, setMainImage] = useState(safeImages[0]);

  useEffect(() => {
    setMainImage(safeImages[0]);
  }, [safeImages]);

  return (
    <div className="w-full flex flex-col">
      <div className="relative aspect-square rounded-3xl overflow-hidden border border-white/5 bg-surface/50">
        <OptimizedImage
          src={mainImage}
          alt={title}
          fallback={getCategoryImage('')}
          type="product"
          priority
          className="object-cover transition-opacity duration-300"
        />
      </div>

      {safeImages.length > 1 && (
        <div className="flex gap-4 mt-4 overflow-x-auto pb-2 snap-x scrollbar-hide">
          {safeImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setMainImage(img)}
              className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 snap-center ${
                mainImage === img ? 'border-primary-500 opacity-100' : 'border-white/10 opacity-60 hover:opacity-100'
              }`}
            >
              <OptimizedImage
                src={img}
                alt={`${title} thumbnail ${i}`}
                fallback={getCategoryImage('')}
                type="product"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
