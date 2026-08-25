import type { Metadata, Viewport } from "next";
import { Inter, Poppins } from "next/font/google";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { siteConfig } from "@/lib/site";

import "./globals.css";

/** Poppins : sans-serif géométrique et arrondie — police des titres et du logo. */
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

/** Inter : texte courant, très lisible en petites tailles. */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "bowl",
    "poke bowl",
    "fast-food healthy",
    "fast casual",
    "restauration rapide premium",
    "Bowly's",
  ],
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0c0a09",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${poppins.variable} ${inter.variable}`}>
      <body className="bg-ink text-cream min-h-dvh antialiased">
        {/* Accessibilité : lien d'évitement, premier élément focusable de la page. */}
        <a
          href="#contenu"
          className="bg-brand focus:ring-cream sr-only rounded-full px-5 py-3 text-sm font-bold text-ink focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:ring-2"
        >
          Aller au contenu principal
        </a>

        <SiteHeader />
        <main id="contenu">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
