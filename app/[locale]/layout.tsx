import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Locale, locales, getTranslations } from "@/lib/i18n";

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
    params: Promise<{ locale: Locale }>;
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
    const { locale } = await params;
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
