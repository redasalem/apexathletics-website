/**
 * Maps a product/category string to a locally stored category image.
 * Covers all 3 real DB categories: Athletic Shoes, Sportswear, Sports Equipment.
 */
export const getCategoryImage = (category: string | undefined): string => {
  if (!category) return '/images/sports-equipment.jpg';

  const lowerCat = category.toLowerCase();

  // Athletic Shoes
  if (lowerCat.includes('shoe') || lowerCat.includes('athletic shoe') || lowerCat.includes('sneaker') || lowerCat.includes('boot')) {
    return '/images/athletic-shoes.jpg';
  }

  // Sportswear
  if (lowerCat.includes('sportswear') || lowerCat.includes('apparel') || lowerCat.includes('clothing') || lowerCat.includes('wear') || lowerCat.includes('jersey') || lowerCat.includes('fitness')) {
    return '/images/sportswear.jpg';
  }

  // Sports Equipment (default for anything else)
  if (lowerCat.includes('sport') || lowerCat.includes('equipment') || lowerCat.includes('ball') || lowerCat.includes('racket') || lowerCat.includes('gym') || lowerCat.includes('outdoor') || lowerCat.includes('bike') || lowerCat.includes('weight') || lowerCat.includes('yoga')) {
    return '/images/sports-equipment.jpg';
  }

  // Global fallback
  return '/images/sports-equipment.jpg';
};

/**
 * Optimizes image URL — injects Cloudinary quality/width transforms for
 * Cloudinary-hosted images, returns local paths unchanged.
 */
export const getOptimizedImageUrl = (url: string, width?: number, quality = 80): string => {
  if (!url) return getPlaceholderImage('product');

  // Cloudinary: inject quality and width transforms
  if (url.includes('res.cloudinary.com')) {
    // Insert w_ and q_ before /upload/
    const transforms = `w_${width || 800},q_${quality},f_auto`;
    if (url.includes('/upload/')) {
      return url.replace('/upload/', `/upload/${transforms}/`);
    }
    return url;
  }

  // External URLs (Unsplash, etc.) — return as-is
  if (url.startsWith('http') || url.startsWith('https')) {
    return url;
  }

  // Local paths must start with /
  if (url.startsWith('/')) {
    return url;
  }

  return getPlaceholderImage('product');
};

/**
 * Returns a type-safe fallback placeholder stored in /public/images/.
 */
export const getPlaceholderImage = (type: 'product' | 'vendor' | 'category' = 'product'): string => {
  switch (type) {
    case 'vendor':
      return '/images/vendor-placeholder.jpg';
    case 'category':
      return '/images/category-placeholder.jpg';
    case 'product':
    default:
      return '/images/product-placeholder.jpg';
  }
};

