<p align="center">
  <img src="https://img.shields.io/badge/Status-Production_Ready-00C853?style=for-the-badge&logo=vercel" alt="Status"/>
  <img src="https://img.shields.io/badge/Next.js-14-000000?style=for-the-badge&logo=next.js" alt="Next.js"/>
  <img src="https://img.shields.io/badge/Express-5-000000?style=for-the-badge&logo=express" alt="Express"/>
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb" alt="MongoDB"/>
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Stripe-Connect-008CDD?style=for-the-badge&logo=stripe" alt="Stripe"/>
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge" alt="License"/>
</p>

<h1 align="center">🏆 Apex Athletics</h1>
<p align="center">
  <em>A premium, multi-vendor sports e-commerce platform connecting athletes with independent sports brands worldwide.</em>
</p>

<p align="center">
  <a href="#overview">Overview</a> •
  <a href="#architecture">Architecture</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#deployment">Deployment</a> •
  <a href="#repositories">Repositories</a>
</p>

---

## 📋 Overview

Apex Athletics is a full-stack, multi-vendor marketplace purpose-built for the sports and athletic equipment industry. The platform enables independent vendors to create storefronts, manage inventory, and process payments, while providing athletes with a curated, high-performance shopping experience.

**Live Demo:** [apexathletics.vercel.app](https://apexathletics.vercel.app)  
**API Base:** [apexathletics-apis.vercel.app/api](https://apexathletics-apis.vercel.app/api)

### Core Capabilities

| Capability | Description |
|---|---|
| **Multi-Vendor Marketplace** | Independent vendor storefronts, dashboards, and product management |
| **Secure Payments** | Stripe Connect with split payouts, webhook verification, and idempotency |
| **Role-Based Access** | Admin, Vendor, and Customer roles with JWT-gated authorization |
| **Serverless Architecture** | Optimized for Vercel with global connection caching and cold-start mitigation |
| **Enterprise Security** | Helmet, CORS, rate limiting, NoSQL injection prevention, Zod validation |
| **Responsive Design** | Mobile-first, dark-themed UI with accessible components |

---

## 🏗 Architecture

```
                    ┌─────────────────────────────────────┐
                    │        Vercel Edge CDN               │
                    │      Next.js 14 App Router           │
                    └────────────────┬────────────────────┘
                                     │ HTTPS
                    ┌────────────────▼────────────────────┐
                    │       Express.js Backend API          │
                    │   (Vercel Serverless Functions)       │
                    └───┬────────────┬────────────┬────────┘
                        │            │            │
              ┌─────────▼──┐  ┌──────▼─────┐  ┌──▼──────────┐
              │ MongoDB    │  │ Redis Cloud │  │  Cloudinary  │
              │   Atlas    │  │  / Upstash  │  │  (Media CDN) │
              └────────────┘  └─────────────┘  └─────────────┘
                                    │
                              ┌─────▼─────┐
                              │   Resend   │
                              │   (Email)  │
                              └───────────┘
```

**Data Flow:** Client → Helmet/CORS → Rate Limiter → JWT Auth → Zod Validation → Controller → Service → MongoDB → Response

---

## 🛠 Tech Stack

| Layer | Frontend | Backend |
|---|---|---|
| **Framework** | Next.js 14 (App Router) | Express.js 5 |
| **Language** | TypeScript 5 | TypeScript 5 |
| **Database** | — | MongoDB Atlas (Mongoose ODM) |
| **Cache** | — | Redis Cloud / Upstash |
| **Auth** | JWT (httpOnly cookies) | JWT + bcryptjs |
| **Payments** | Stripe Elements | Stripe Connect + Webhooks |
| **Email** | — | Resend API |
| **Media** | Cloudinary (CDN) | Cloudinary (Upload API) |
| **Validation** | Zod + react-hook-form | Zod schemas |
| **Styling** | TailwindCSS 3 | — |
| **Deployment** | Vercel (Edge) | Vercel (Serverless) |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- pnpm 8+
- MongoDB Atlas account
- Redis Cloud / Upstash account (optional)
- Stripe account
- Resend account (for transactional emails)

### Quick Start

```bash
# Clone both repositories
git clone https://github.com/redasalem/apex-athletics-frontend.git
git clone https://github.com/redasalem/apexathletics-apis.git

# Backend setup
cd apexathletics-apis
cp .env.example .env
pnpm install
pnpm dev          # Starts at http://localhost:5000

# Frontend setup (in a new terminal)
cd apex-athletics-frontend
cp .env.example .env.local
pnpm install
pnpm dev          # Starts at http://localhost:3000
```

### Configuration

Both services require environment variables. See the individual README files for complete configuration:

- [Backend Environment Variables](./backend/README.md#-environment-variables)
- [Frontend Environment Variables](./frontend/README.md#-environment-variables)

---

## 📦 Deployment

### Backend (Vercel Serverless)

1. Push the backend repository to GitHub.
2. Import into Vercel — the `vercel.json` handles routing automatically.
3. Set all environment variables in the Vercel dashboard (see `.env.vercel.example`).
4. Deploy — the API is available at `https://your-project.vercel.app/api`.

### Frontend (Vercel Edge)

1. Push the frontend repository to GitHub.
2. Import into Vercel.
3. Set `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_SITE_URL` in the Vercel dashboard.
4. Deploy — the app is served from the global edge network.

**CI/CD:** Both repos have GitHub Actions pipelines that run lint, typecheck, and build on every push. Successful builds auto-deploy to Vercel.

---

## 📂 Repositories

| Component | Repository | Deployed URL |
|---|---|---|
| **Frontend** | [apex-athletics-frontend](https://github.com/redasalem/apex-athletics-frontend) | [apexathletics.vercel.app](https://apexathletics.vercel.app) |
| **Backend API** | [apexathletics-apis](https://github.com/redasalem/apexathletics-apis) | [apexathletics-apis.vercel.app](https://apexathletics-apis.vercel.app) |

---

## 🔒 Security

| Layer | Implementation |
|---|---|
| **HTTP Headers** | Helmet.js (CSP, HSTS, X-Frame-Options) |
| **Input Validation** | Zod schemas on every endpoint |
| **NoSQL Injection** | Custom sanitization middleware |
| **Rate Limiting** | express-rate-limit (global + auth-specific) |
| **Auth** | JWT in httpOnly cookies + bcrypt password hashing |
| **Webhooks** | Stripe signature verification with raw body |
| **CORS** | Strict origin whitelist via environment variable |
| **Dependencies** | Regular `pnpm audit` and automated Dependabot alerts |

---

## 📚 Documentation

| Document | Description |
|---|---|
| [Backend README](./backend/README.md) | Complete backend API documentation |
| [Frontend README](./frontend/README.md) | Frontend setup and architecture |
| [PRD](./backend/PRD.md) | Product Requirements Document |
| [API Reference](./backend/docs/API.md) | Full API endpoint reference |
| [Architecture](./backend/docs/SYSTEM_ARCHITECTURE.md) | System design and request lifecycle |
| [Security](./backend/docs/SECURITY.md) | Security posture and hardening |
| [Deployment](./backend/docs/DEPLOYMENT_FLOW.md) | CI/CD and deployment guide |
| [Environment](./backend/docs/ENVIRONMENT.md) | Environment variable reference |
| [Test Runbook](./frontend/qa/PRODUCTION_TEST_RUNBOOK.md) | Production QA test cases |

---

## 🤝 Contributing

1. Fork the relevant repository.
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit using conventional commits: `feat:`, `fix:`, `docs:`, `chore:`
4. Push and open a pull request.
5. Ensure CI passes (lint, typecheck, build).

---

## 📄 License

This project is licensed under the **MIT License**.

---

<p align="center">
  <sub>Built with ❤️ for the global sports community.</sub>
</p>
