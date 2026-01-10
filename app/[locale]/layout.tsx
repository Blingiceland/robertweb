import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Locale, locales, getTranslations, defaultLocale } from "@/lib/i18n";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Róbert Ragnarsson - Viðreisn",
    description: "Frambjóðandi til borgarstjórnar Reykjavíkur",
};

export function generateStaticParams() {
    return locales.map((locale) => ({ locale }));
}

interface LayoutProps {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
    const { locale: localeParam } = await params;
    // Validate and cast locale
    const locale: Locale = locales.includes(localeParam as Locale)
        ? (localeParam as Locale)
        : defaultLocale;
    const t = getTranslations(locale);

    return (
        <html lang={locale} suppressHydrationWarning>
            <body className={inter.className} suppressHydrationWarning>
                <Header locale={locale} t={t} />
                {children}
                <Footer locale={locale} t={t} />
            </body>
        </html>
    );
}
