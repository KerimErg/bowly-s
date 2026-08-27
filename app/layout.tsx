import type { Metadata, Viewport } from "next";
import { Anton, Inter } from "next/font/google";

import { BarreCommande } from "@/components/layout/barre-commande";
import { CurseurBowly } from "@/components/layout/curseur";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { branding } from "@/lib/assets";
import { siteConfig } from "@/lib/site";

import "./globals.css";

/**
 * Anton — une seule graisse, très condensée, très noire.
 *
 * C'est la voix qui crie : titres d'affiche, noms de bowls, chiffres. Elle
 * n'est jamais utilisée en dessous de 20 px, où elle deviendrait illisible.
 * Une seule graisse veut dire un seul fichier : moins de 40 ko sur le réseau
 * pour toute l'identité typographique du site.
 */
const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-anton",
  display: "swap",
});

/** Inter — la voix qui informe : tout le texte courant et l'interface. */
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
    "fast-food",
    "poulet croustillant",
    "street food",
    "fast casual",
    "Bowly's",
  ],
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [{ url: branding.og, width: 1200, height: 630, alt: siteConfig.tagline }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [branding.og],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#fff7ec",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${anton.variable} ${inter.variable}`}>
      <body className="bg-creme text-encre min-h-dvh antialiased">
        {/* Premier élément focusable de la page. */}
        <a
          href="#contenu"
          className="bg-jaune text-encre sr-only rounded-[var(--radius)] px-5 py-3 text-sm font-extrabold shadow-[4px_4px_0_var(--encre)] focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200]"
        >
          Aller au contenu principal
        </a>

        <CurseurBowly />
        <SiteHeader />
        <BarreCommande />
        <main id="contenu">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
