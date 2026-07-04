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
    title: `${product.title} - Impeccable Athletics`,
    description: product.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${product.title} - Impeccable Athletics`,
      description: product.description,
      url: url,
      siteName: 'Impeccable Athletics',
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
      title: `${product.title} - Impeccable Athletics`,
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

  // Extract vendor info safely
  const vendorId = typeof product.vendor === 'string' ? product.vendor : product.vendor?._id;
  const vendorName = typeof product.vendor === 'string' ? 'Vendor Store' : (product.vendor?.storeName || 'Vendor Store');

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
        name: vendorName,
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
    <div className="bg-lacquer-black">
      <div className="max-w-[1320px] mx-auto px-6 py-12 md:py-16">
        <Link 
          href="/shop"
          className="inline-flex items-center gap-2 text-kinpaku-gold hover:text-champagne transition-colors mb-10 text-[0.72rem] font-mono uppercase tracking-[0.22em]"
        >
          ← Back to Collection
        </Link>

        <div className="flex flex-col md:flex-row gap-12 lg:gap-20">
          
          {/* Left Side: Images */}
          <div className="w-full md:w-[55%] flex-shrink-0">
            <ProductGallery images={product.images?.length ? product.images : [imageSrc]} title={product.title} />
          </div>

          {/* Right Side: Details */}
          <div className="w-full md:w-[45%] flex flex-col pt-2 lg:pt-6">
            <div className="mb-4">
              <span className="ks-section-eyebrow !mb-0">{product.category} {product.subcategory ? `• ${product.subcategory}` : ''}</span>
            </div>
            
            <h1 className="font-display text-5xl lg:text-7xl uppercase tracking-wider text-champagne mb-6 leading-none">
              {product.title}
            </h1>
            
            <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gold-hairline">
               <div className="flex items-center gap-1.5">
                 {[1,2,3,4,5].map(i => (
                   <Star 
                     key={i} 
                     className={`w-4 h-4 ${i <= Math.round(product.averageRating || 5) ? 'fill-kinpaku-gold text-kinpaku-gold' : 'text-gold-hairline'}`} 
                   />
                 ))}
                 <span className="text-[0.8rem] font-mono font-medium text-champagne ml-2">{product.averageRating?.toFixed(1) || '5.0'}</span>
                 <span className="text-[0.72rem] font-mono uppercase tracking-[0.22em] text-text-muted ml-3">({product.numReviews || 0} Reviews)</span>
               </div>
               <div className="w-px h-4 bg-gold-hairline" />
               {vendorId && (
                 <span className="text-[0.8rem] font-mono text-text-muted">
                    Sold by <Link href={`/vendor/${vendorId}`} className="text-kinpaku-gold hover:text-champagne transition-colors underline underline-offset-4">{vendorName}</Link>
                 </span>
               )}
            </div>

            <p className="text-3xl lg:text-4xl font-mono font-medium text-champagne tracking-tight mb-8">
              ${product.price.toFixed(2)}
            </p>

            <p className="text-text-muted text-[1.05rem] mb-12 leading-[1.8] max-w-lg">
              {product.description}
            </p>

            <AddToCartForm product={product} />

            {/* Social Proof & Guarantees */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-gold-hairline pt-10 mt-10">
               <div className="flex items-start gap-4">
                  <div className="p-2 border border-gold-hairline rounded-[2px] bg-lacquer-deep shrink-0">
                    <Truck className="w-4 h-4 text-kinpaku-gold" />
                  </div>
                  <div>
                     <h5 className="text-[0.95rem] font-medium text-champagne mb-1">Free Delivery</h5>
                     <p className="text-[0.85rem] text-text-muted leading-relaxed">On orders over $50.<br/>Arrives in 3-5 days.</p>
                  </div>
               </div>
               <div className="flex items-start gap-4">
                  <div className="p-2 border border-gold-hairline rounded-[2px] bg-lacquer-deep shrink-0">
                    <ShieldCheck className="w-4 h-4 text-kinpaku-gold" />
                  </div>
                  <div>
                     <h5 className="text-[0.95rem] font-medium text-champagne mb-1">Authentic</h5>
                     <p className="text-[0.85rem] text-text-muted leading-relaxed">Every item verified by Impeccable.</p>
                  </div>
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>

    {/* Reviews Section */}
    <div className="bg-lacquer-deep border-t border-gold-hairline">
      <div className="max-w-[1320px] mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          
          {/* Left: Review Stats & Form */}
          <div className="lg:col-span-1 space-y-10">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 border border-gold-hairline rounded-[2px] bg-lacquer-black">
                  <MessageSquare className="w-6 h-6 text-kinpaku-gold" />
                </div>
                <h2 className="font-display text-4xl uppercase text-champagne tracking-wider">Gear <span className="text-kinpaku-gold">Reviews</span></h2>
              </div>
              <p className="text-text-muted text-[0.95rem] leading-[1.8]">
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
    </div>
    </>
  );
}
