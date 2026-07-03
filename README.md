# 🏅 Apex Athletics - Frontend Web App

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![React Query](https://img.shields.io/badge/React_Query-FF4154?style=for-the-badge&logo=react-query&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-2EAD33?style=for-the-badge&logo=playwright&logoColor=white)

This is the Next.js Frontend for the Apex Athletics Multi-vendor Sports Marketplace.

## 🚀 Live Demo

- **Frontend Application**: [https://apexathletics-website.vercel.app](https://apexathletics-website.vercel.app)

## ✨ Core Features

- 🛒 **Multi-vendor Storefront**: Dynamic browsing of sports equipment and sportswear from multiple vendors.
- 📊 **Comprehensive Admin Dashboard**: Full UI control over users, products, orders, and platform statistics charts.
- 🏪 **Vendor Dashboard**: Dedicated space for vendors to onboard, list products, and view payouts.
- 🤝 **Seamless Onboarding**: Integrated UI flow for Stripe Express onboarding.
- 🔍 **Advanced Search & Filter**: Dynamic filtering by category, price, and pagination.
- 🚚 **Order Tracking**: Customer portal to track order statuses.

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Query
- **Testing**: Jest, Vitest, Playwright
- **Deployment**: Vercel

## 💻 Getting Started

Follow these steps to run the frontend application locally.

### Prerequisites
- Node.js (v20+)
- pnpm (`npm install -g pnpm`)
- The Backend API must be running locally (or you can point to the production API).

### Installation & Setup

1. **Install dependencies**
   ```bash
   pnpm install
   ```

2. **Set up environment variables**
   Duplicate `.env.example` to `.env.local` and configure your API URL:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```
   *(Change to the production API URL if you are not running the backend locally).*

3. **Start the development server**
   ```bash
   pnpm run dev
   ```

## 🔑 Test Accounts (Live & Local)

You can use the following seeded test accounts to explore the dashboards:

| Role | Email | Password |
|---|---|---|
| **Admin** | admin@apexathletics.com | Admin@123456 |
| **Vendor** | vendor1@apexathletics.com | Vendor@123456 |
| **Customer** | customer1@apexathletics.com | Customer@123456 |

## 🧪 Testing

The frontend incorporates Unit, Component, and End-to-End testing.

- **Unit Tests:** 5 tests (Hooks, Utility Functions)
- **Component Tests:** 6 tests (React components)
- **System/E2E Tests:** 4 tests (Playwright flows covering Auth, Browsing, and Production Health)

To run the frontend unit/component tests (Jest/Vitest):
```bash
pnpm run test
```

To run Playwright End-to-End tests:
```bash
pnpm dlx playwright test
```
