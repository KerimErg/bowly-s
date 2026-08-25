import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { SocialIcon } from "@/components/layout/social-icon";
import { contactInfo, legalNav, mainNav, siteConfig, socialLinks } from "@/lib/site";

/**
 * Pied de page.
 *
 * Seule zone sombre du site en dehors des voiles photo : elle ferme la page
 * et fait ressortir l'orange. Pour la repasser en clair, remplacer `bg-night`
 * par `bg-sand` et les couleurs de texte par `text-ink` / `text-ink-soft`.
 *
 * Toutes les coordonnées viennent de `lib/site.ts` et affichent
 * `[À COMPLÉTER]` tant que les vraies informations n'ont pas été fournies.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-night text-cream">
      <div className="bowly-container grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4 lg:py-20">
        <div className="lg:col-span-1">
          <Logo tone="light" />
          <p className="text-cream font-display mt-5 max-w-xs text-xl font-bold tracking-tight">
            {siteConfig.shortPitch}
          </p>

          <ul className="mt-6 flex items-center gap-3">
            {socialLinks.map((social) => (
              <li key={social.label}>
                {/* TODO(marque) : remplacer `#` par l'URL réelle du compte. */}
                <a
                  href={social.href}
                  aria-label={`${social.label} — ${social.handle}`}
                  className="border-cream/25 text-cream hover:border-brand hover:bg-brand hover:text-ink flex size-10 items-center justify-center rounded-full border transition-colors duration-300"
                >
                  <SocialIcon name={social.icon} />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <nav aria-label="Navigation du pied de page">
          <h2 className="font-display text-brand text-xs font-bold tracking-[0.2em] uppercase">
            Le site
          </h2>
          <ul className="mt-5 flex flex-col gap-3">
            <li>
              <Link
                href="/"
                className="text-ink-dim hover:text-cream text-sm transition-colors duration-300"
              >
                Accueil
              </Link>
            </li>
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-ink-dim hover:text-cream text-sm transition-colors duration-300"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="font-display text-brand text-xs font-bold tracking-[0.2em] uppercase">
            Nous trouver
          </h2>
          <ul className="text-ink-dim mt-5 flex flex-col gap-4 text-sm">
            <li className="flex items-start gap-3">
              <MapPin size={16} className="text-brand mt-0.5 shrink-0" aria-hidden="true" />
              <span>
                {contactInfo.address}
                <br />
                {contactInfo.postalCode} {contactInfo.city}
              </span>
            </li>
            <li className="flex items-start gap-3">
              <Phone size={16} className="text-brand mt-0.5 shrink-0" aria-hidden="true" />
              <span>{contactInfo.phone}</span>
            </li>
            <li className="flex items-start gap-3">
              <Mail size={16} className="text-brand mt-0.5 shrink-0" aria-hidden="true" />
              <span>{contactInfo.email}</span>
            </li>
          </ul>
        </div>

        <nav aria-label="Informations légales">
          <h2 className="font-display text-brand text-xs font-bold tracking-[0.2em] uppercase">
            Informations légales
          </h2>
          <ul className="mt-5 flex flex-col gap-3">
            {legalNav.map((item) => (
              <li key={item.label}>
                {/* TODO(juridique) : créer la page et remplacer `#` par sa route. */}
                <a
                  href={item.href}
                  className="text-ink-dim hover:text-cream text-sm transition-colors duration-300"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="text-ink-dim mt-5 text-xs leading-relaxed">
            Pages à rédiger avant mise en ligne : {legalNav[0].note}
          </p>
        </nav>
      </div>

      <div className="border-cream/15 border-t">
        <div className="bowly-container text-ink-dim flex flex-col gap-2 py-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Bowly&apos;s. Tous droits réservés.</p>
          <p>
            Site de démonstration — visuels Unsplash, contenus et tarifs non
            contractuels.
          </p>
        </div>
      </div>
    </footer>
  );
}
