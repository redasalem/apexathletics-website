import ProductGallery from '@/components/ProductGallery';
import Link from 'next/link';
import { Star, ShieldCheck, Truck, MessageSquare } from 'lucide-react';
import { getCategoryImage } from '@/utils/images';
import dynamic from 'next/dynamic';
import { Metadata } from 'next';

const ReviewList = dynamic(() => import('@/components/reviews/ReviewList'));
const ReviewForm = dynamic(() => import('@/components/reviews/ReviewForm'), { ssr: false });
import AddToCartForm from '@/components/AddToCartForm';
import { notFound } from 'next/navigation';

const API = () => process.env.NEXT_PUBLIC_API_URL || 'https://apexathletics-apis.vercel.app/api';

async function getProduct(id: string) {
  try {
    const res = await fetch(`${API()}/products/${id}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch { return null; }
}

async function getProductReviews(id: string) {
  try {
    const res = await fetch(`${API()}/products/${id}/reviews`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch { return []; }
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const product = await getProduct(params.id);
  if (!product) return { title: 'Product Not Found' };
  
  const url = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://apexathletics.com'}/product/${product._id}`;

  return {
    title: `${product.title} - Apex Athletics`,
    description: product.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${product.title} - Apex Athletics`,
      description: product.description,
      url: url,
      siteName: 'Apex Athletics',
      images: [
        {
          url: product.images?.[0] || getCategoryImage(product.category),
          width: 1200,
          height: 630,
          alt: product.title,
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.title} - Apex Athletics`,
      description: product.description,
      images: [product.images?.[0] || getCategoryImage(product.category)],
    }
  };
}

export default async function ProductDetailsPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);
  
  if (!product) {
    notFound();
  }

  const reviews = await getProductReviews(params.id);

  const imageSrc = product.images?.[0] || getCategoryImage(product.category);

  // JSON-LD Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: imageSrc,
    sku: product.sku || product._id,
    offers: {
      '@type': 'Offer',
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/product/${product._id}`,
      priceCurrency: 'USD',
      price: product.discountPrice || product.price,
      itemCondition: 'https://schema.org/NewCondition',
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: product.vendor?.storeName || 'Apex Vendor',
      },
    },
    ...(product.averageRating > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.averageRating.toFixed(1),
        reviewCount: product.numReviews,
      },
    }),
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': `${process.env.NEXT_PUBLIC_SITE_URL}`
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': 'Shop',
        'item': `${process.env.NEXT_PUBLIC_SITE_URL}/shop`
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': product.category,
        'item': `${process.env.NEXT_PUBLIC_SITE_URL}/shop?category=${encodeURIComponent(product.category)}`
      },
      {
        '@type': 'ListItem',
        'position': 4,
        'name': product.title,
        'item': `${process.env.NEXT_PUBLIC_SITE_URL}/product/${product._id}`
      }
    ]
  };

  return (
    <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
    />
    <div className="max-w-7xl mx-auto px-6 py-12">
      <Link 
        href="/shop"
        className="inline-flex items-center gap-2 text-textMuted hover:text-white transition-colors mb-8 text-sm font-bold uppercase tracking-widest"
      >
        ← Back to Shop
      </Link>

      <div className="flex flex-col md:flex-row gap-12 lg:gap-20">
        
        {/* Left Side: Images */}
        <div className="w-full md:w-1/2 flex-shrink-0">
        <ProductGallery images={product.images?.length ? product.images : [imageSrc]} title={product.title} />
        </div>

        {/* Right Side: Details */}
        <div className="w-full md:w-1/2 flex flex-col pt-2 lg:pt-10">
          <div className="mb-2">
            <span className="text-xs font-black uppercase text-textMuted tracking-[0.2em]">{product.category} • {product.subcategory}</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black italic uppercase tracking-tight text-white mb-4 leading-tight">
            {product.title}
          </h1>
          
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/5">
             <div className="flex items-center gap-1">
               {[1,2,3,4,5].map(i => (
                 <Star 
                   key={i} 
                   className={`w-4 h-4 ${i <= Math.round(product.averageRating || 5) ? 'fill-primary-500 text-primary-500' : 'text-white/10'}`} 
                 />
               ))}
               <span className="text-xs font-bold text-white ml-2">{product.averageRating?.toFixed(1) || '5.0'}</span>
               <span className="text-[10px] uppercase font-black tracking-widest text-textMuted ml-3">({product.numReviews || 0} Reviews)</span>
             </div>
             <div className="w-px h-4 bg-white/10" />
             <span className="text-sm text-textMuted font-medium italic">
                Sold by <Link href={`/vendor/${product.vendor?._id}`} className="text-primary-500 hover:underline font-bold not-italic">{product.vendor?.storeName || 'Apex Vendor'}</Link>
             </span>
          </div>

          <p className="text-xl lg:text-3xl font-black text-primary-500 italic mb-8">${product.price.toFixed(2)}</p>

          <p className="text-textMuted text-base mb-10 leading-relaxed max-w-lg">
            {product.description}
          </p>

          <AddToCartForm product={product} />

          {/* Social Proof & Guarantees */}
          <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-8">
             <div className="flex items-start gap-3">
                <Truck className="w-5 h-5 text-textMuted mt-0.5" />
                <div>
                   <h5 className="text-sm font-bold text-white mb-1">Free Delivery</h5>
                   <p className="text-xs text-textMuted">On orders over $50. Arrives in 3-5 days.</p>
                </div>
             </div>
             <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-textMuted mt-0.5" />
                <div>
                   <h5 className="text-sm font-bold text-white mb-1">Authenticity Guaranteed</h5>
                   <p className="text-xs text-textMuted">Every item verified by Apex Athletics.</p>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>

    {/* Reviews Section */}
    <div className="max-w-7xl mx-auto px-6 py-24 border-t border-white/5">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        
        {/* Left: Review Stats & Form */}
        <div className="lg:col-span-1 space-y-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <MessageSquare className="w-6 h-6 text-primary-500" />
              <h2 className="text-2xl font-black italic uppercase text-white tracking-tight">Gear Reviews</h2>
            </div>
            <p className="text-textMuted text-sm leading-relaxed">
              Tested by athletes, for athletes. Read what our community thinks about this {product.category.toLowerCase()} gear.
            </p>
          </div>

          <ReviewForm productId={product._id} />
        </div>

        {/* Right: Review List */}
        <div className="lg:col-span-2">
           <ReviewList reviews={reviews} />
        </div>

      </div>
    </div>
    </>
  );
}
