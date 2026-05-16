# Apex Athletics Frontend

Next.js 14 frontend for the Apex Athletics multi-vendor e-commerce platform — deployed independently on Vercel or any Node.js-capable host.

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- pnpm 8+

### Installation
```bash
pnpm install
```

### Local Development
```bash
# 1. Copy and populate environment variables
cp .env.example .env.local

# 2. Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production Build
```bash
pnpm build    # Outputs to .next/ (standalone mode)
pnpm start    # Run production server locally
```

## ☁️ Deployment

### Vercel (Recommended)
1. Import this repository in [vercel.com/new](https://vercel.com/new).
2. Set environment variables in the Vercel dashboard:
   - `NEXT_PUBLIC_API_URL` → your backend API URL (e.g. `https://api.yourdomain.com/api`)
   - `NEXT_PUBLIC_STRIPE_PUBLIC_KEY` → your Stripe publishable key
3. Click **Deploy** — Vercel handles builds, CDN, and automatic preview deployments.

### Manual / VPS
```bash
pnpm build
# Standalone output is self-contained — copy .next/standalone to your server
node .next/standalone/server.js
```

## 🏗️ Architecture & Integrations
- **API Integration:** Communicates with the Express backend via `axios`. All data fetching uses `@tanstack/react-query` for caching, optimistic updates, and background refetching.
- **SEO & ISR:** Static pages leverage Incremental Static Regeneration (ISR). Dynamic pages (Checkout, Dashboards) are client-side or SSR depending on payload.
- **Styling:** TailwindCSS with a customised `tailwind.config.ts`.
- **Forms:** `react-hook-form` + `zod` for end-to-end type-safe validation.
- **Payments:** Stripe Elements on the client — card inputs are tokenised before reaching the backend.

## 🔐 Environment Variables
| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | ✅ | Base URL of the backend API |
| `NEXT_PUBLIC_STRIPE_PUBLIC_KEY` | ✅ | Stripe publishable key for client-side tokenisation |

See `.env.example` for a full template.
