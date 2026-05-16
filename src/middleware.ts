import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutePatterns = [
  { pattern: '/account/:path*', roles: ['customer'] },
  { pattern: '/admin/:path*', roles: ['admin'] },
  { pattern: '/vendor-dashboard/:path*', roles: ['vendor'] },
];

const customerOnlyRoutes = ['/cart', '/checkout', '/wishlist'];

const authPages = ['/login', '/register', '/forgot-password', '/reset-password'];

function getTokenCookie(request: NextRequest): string | undefined {
  return request.cookies.get('token')?.value;
}

function decodeTokenPayload(token: string): Record<string, unknown> | null {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    const decoded = JSON.parse(atob(payload));
    if (typeof decoded === 'object' && decoded !== null) {
      return decoded as Record<string, unknown>;
    }
    return null;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = getTokenCookie(request);
  const payload = token ? decodeTokenPayload(token) : null;
  const role = payload?.role as string | undefined;

  if (token && payload && authPages.includes(pathname)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (!token) {
    for (const { pattern } of protectedRoutePatterns) {
      const patternPath = '/' + pattern.split('/:')[0];
      if (pathname === patternPath || pathname.startsWith(patternPath + '/')) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
      }
    }

    if (customerOnlyRoutes.includes(pathname)) {
      return NextResponse.redirect(new URL(`/login?redirect=${encodeURIComponent(pathname)}`, request.url));
    }
  }

  // Enforce customer-only routes for non-customer roles
  if (token && payload && customerOnlyRoutes.includes(pathname) && role !== 'customer') {
    const dashboardMap: Record<string, string> = {
      admin: '/admin',
      vendor: '/vendor-dashboard',
      customer: '/account',
    };
    return NextResponse.redirect(new URL(dashboardMap[role || ''] || '/', request.url));
  }

  if (token && payload) {
    for (const { pattern, roles } of protectedRoutePatterns) {
      const patternPath = '/' + pattern.split('/:')[0];
      const matches = pathname === patternPath || pathname.startsWith(patternPath + '/');
      if (matches && role && !roles.includes(role as 'customer' | 'admin' | 'vendor')) {
        const dashboardMap: Record<string, string> = {
          admin: '/admin',
          vendor: '/vendor-dashboard',
          customer: '/account',
        };
        const destination = dashboardMap[role] || '/';
        return NextResponse.redirect(new URL(destination, request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/account/:path*',
    '/admin/:path*',
    '/vendor-dashboard/:path*',
    '/cart',
    '/checkout',
    '/wishlist',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
  ],
};
