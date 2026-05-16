'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getOptimizedImageUrl, getPlaceholderImage } from '@/utils/images';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  fallback?: string;
  type?: 'product' | 'vendor' | 'category';
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * OptimizedImage — always uses next/image with fill.
 * The PARENT container must have: position:relative, defined width & height.
 * Provides loading skeleton, graceful error fallback, and Cloudinary transforms.
 */
export default function OptimizedImage({
  src,
  alt,
  className = '',
  priority = false,
  fallback,
  type = 'product',
  onLoad,
  onError,
}: OptimizedImageProps) {
  const defaultFallback = fallback || getPlaceholderImage(type);
  const [imgSrc, setImgSrc] = useState(() => getOptimizedImageUrl(src || defaultFallback));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setImgSrc(getOptimizedImageUrl(src || defaultFallback));
    setIsLoading(true);
  }, [src, defaultFallback]);

  const handleError = () => {
    if (imgSrc === defaultFallback) {
      setIsLoading(false);
      onError?.();
      return;
    }
    setImgSrc(defaultFallback);
    onError?.();
  };

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  return (
    <>
      {/* Shimmer skeleton shown while image loads */}
      {isLoading && (
        <div className="absolute inset-0 bg-surfaceHighlight animate-pulse" aria-hidden="true" />
      )}
      <Image
        src={imgSrc}
        alt={alt}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'} ${className}`}
        priority={priority}
        onError={handleError}
        onLoad={handleLoad}
      />
    </>
  );
}
