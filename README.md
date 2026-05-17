<p align="center">
  <img src="https://img.shields.io/badge/Status-Production_Ready-00C853?style=for-the-badge&logo=vercel" alt="Status"/>
  <img src="https://img.shields.io/badge/Next.js-14-000000?style=for-the-badge&logo=next.js" alt="Next.js"/>
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/TailwindCSS-3-06B6D4?style=for-the-badge&logo=tailwindcss" alt="TailwindCSS"/>
  <img src="https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel" alt="Vercel"/>
</p>

<h1 align="center">🏆 Apex Athletics — Frontend</h1>
<p align="center">
  <em>Premium multi-vendor sports marketplace built with Next.js 14 App Router.<br/>
  Server-side rendered · Edge-deployed · Mobile-first responsive design.</em>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#deployment">Deployment</a> •
  <a href="#environment-variables">Environment Variables</a>
</p>

---

## ✨ Features

| Capability | Description |
|---|---|
| **Multi-Vendor Storefronts** | Browse products from independent sports brands and vendors |
| **Server-Side Rendering** | SEO-optimized product pages with SSR and ISR |
| **Stripe Checkout Integration** | Secure client-side payment flow with Stripe Elements |
| **Real-Time Cart Sync** | Persistent cart across devices with optimistic updates |
| **Advanced Search & Filtering** | Full-text search, category filters, price range, size/color |
| **Responsive Design** | Mobile-first with dark mode throughout |
| **React Query Caching** | Automatic data fetching, caching, and background refetching |
| **Type-Safe Forms** | react-hook-form + Zod validation from frontend to backend |
| **Auth & Role Guarding** | Protected routes with Clerk integration |
| **Vendor Dashboards** | Analytics, product management, order fulfillment |
| **Admin Panel** | User management, order oversight, category and coupon administration |
| **Wishlist & Favorites** | Persisted wishlist across sessions |

---

## 🛠 Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Framework** | [Next.js 14](https://nextjs.org/) (App Router) | React meta-framework with SSR, ISR, and Edge |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) | Strict type safety across the entire codebase |
| **Styling** | [TailwindCSS 3](https://tailwindcss.com/) | Utility-first CSS with custom design system |
| **State & Data** | [@tanstack/react-query](https://tanstack.com/query) | Server state management, caching, optimistic updates |
| **Forms** | [react-hook-form](https://react-hook-form.com/) + [Zod](https://zod.dev/) | Performant forms with schema validation |
| **HTTP Client** | [Axios](https://axios-http.com/) | Typed API client with interceptors and auth flow |
| **Payments** | [Stripe Elements](https://stripe.com/elements) | Secure client-side card tokenization |
| **Icons** | [Lucide React](https://lucide.dev/) | Lightweight, consistent icon set |
| **Notifications** | [react-hot-toast](https://react-hot-toast.com/) | Toast notifications with dark mode |
| **Auth** | [JWT](https://jwt.io/) (httpOnly cookies) | Stateless authentication with role-based guards |
| **Deployment** | [Vercel](https://vercel.com/) | Edge CDN, automatic previews, zero-config HTTPS |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 20.x or later
- **pnpm** 8.x or later
- Backend API running locally or deployed

### Installation

```bash
# Clone the repository
git clone https://github.com/redasalem/apex-athletics-frontend.git
cd apex-athletics-frontend

# Install dependencies
pnpm install

# Configure environment variables
cp .env.example .env.local
# Edit .env.local with your API URL and keys
```

### Local Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). The app hot-reloads on file changes.

### Production Build

```bash
pnpm build      # Compile and optimize for production
pnpm start      # Run production server locally
```

---

## ☁️ Deployment

### Vercel (Recommended)

1. Import this repository in the [Vercel dashboard](https://vercel.com/new).
2. Configure the following environment variables:

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Production backend API URL (e.g., `https://apexathletics-apis.vercel.app/api`) |
| `NEXT_PUBLIC_SITE_URL` | Your frontend deployment URL (e.g., `https://apexathletics.vercel.app`) |

3. Deploy — Vercel handles builds, CDN, SSL, and automatic preview deployments for every PR.

### Manual / VPS

```bash
pnpm build
# Standalone output is in .next/standalone/
node .next/standalone/server.js
```

---

## 🔐 Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `NEXT_PUBLIC_API_URL` | **Yes** | `http://localhost:5000/api` | Backend API base URL |
| `NEXT_PUBLIC_SITE_URL` | **Yes** | — | Canonical site URL for SEO |
| `NEXT_PUBLIC_STRIPE_PUBLIC_KEY` | Yes | — | Stripe publishable key for Elements |

> **Required for CI/CD:** These variables must be set in the Vercel dashboard or GitHub Actions secrets. The production build will fail without them.

---

## 🏗️ Architecture & Key Decisions

### Data Fetching Pattern

All API communication flows through `axios` with `withCredentials: true` for cookie-based auth. The `@tanstack/react-query` library manages caching, background refetches, and optimistic updates:

```
Component → useQuery/useMutation → axios → Backend API
                ↓
        React Query Cache
                ↓
        Automatic Re-render
```

### Route Protection

The `middleware.ts` handles redirect logic. Protected routes check for a valid JWT cookie before rendering:

| Route | Access |
|---|---|
| `/account/*` | Authenticated users |
| `/admin/*` | Admin role only |
| `/vendor-dashboard/*` | Vendor role only |
| `/cart` | All users (local + synced cart) |

### Styling Architecture

Dark-first design system built on custom Tailwind tokens:

- `bg-background` (#0a0a0a) — main background
- `bg-surface` (#171717) — elevated cards and panels
- Primary red (#d80000) — accent color for CTAs
- Custom component classes (`btn-primary`, `input-field`, `label`) defined in `globals.css`

---

## 🧪 QA & Testing

A production test runbook is available at [`qa/PRODUCTION_TEST_RUNBOOK.md`](./qa/PRODUCTION_TEST_RUNBOOK.md) covering:

- Auth flow (register, login, logout, password reset)
- Product browsing (list, search, filter, detail)
- Cart operations (add, remove, quantity, persistence)
- Checkout (Stripe session creation, webhook flow)
- Vendor dashboard (product CRUD, order management)
- Admin panel (user/order/category/coupon management)

---

## 🤝 Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit changes: `git commit -m "feat: your feature description"`
4. Push to the branch: `git push origin feat/your-feature`
5. Open a pull request.

**Conventions:**
- Use `feat:`, `fix:`, `chore:`, `docs:` commit prefixes
- Run `pnpm build` and `pnpm exec tsc --noEmit` before submitting
- Follow existing component patterns and naming conventions

---

## 📄 License

This project is licensed under the **MIT License**.

---

<p align="center">
  <sub>Built with ❤️ for the Apex Athletics marketplace platform.</sub>
</p>
