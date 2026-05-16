import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shop Premium Gear',
  description: 'Browse our collection of premium sports gear, athletic shoes, and sportswear from top independent vendors.',
  openGraph: {
    title: 'Shop Premium Gear | Apex Athletics',
    description: 'Browse our collection of premium sports gear, athletic shoes, and sportswear.',
  },
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
