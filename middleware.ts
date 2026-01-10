import { NextRequest, NextResponse } from 'next/server';

export const locales = ['is', 'en', 'pl'] as const;
export const defaultLocale = 'is';
export type Locale = (typeof locales)[number];

function getLocale(request: NextRequest): Locale {
    // Check if locale is in pathname
    const pathname = request.nextUrl.pathname;
    const pathnameLocale = locales.find(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );
    if (pathnameLocale) return pathnameLocale;

    // Default to Icelandic always
    return defaultLocale;
}

export function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    // Skip for API routes, static files, and admin
    if (
        pathname.startsWith('/api') ||
        pathname.startsWith('/_next') ||
        pathname.startsWith('/images') ||
        pathname.startsWith('/admin') ||
        pathname.includes('.')
    ) {
        return NextResponse.next();
    }

    // Check if pathname already has a locale
    const pathnameHasLocale = locales.some(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    if (pathnameHasLocale) return NextResponse.next();

    // Redirect to default locale
    const locale = getLocale(request);
    const newUrl = new URL(`/${locale}${pathname}`, request.url);
    return NextResponse.redirect(newUrl);
}

export const config = {
    matcher: ['/((?!_next|api|images|admin|.*\\..*).*)'],
};
