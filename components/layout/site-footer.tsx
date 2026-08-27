import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { SocialIcon } from "@/components/layout/social-icon";
import { Button } from "@/components/ui/button";
import {
  LIEN_COMMANDE,
  contactInfo,
  legalNav,
  mainNav,
  siteConfig,
  socialLinks,
} from "@/lib/site";

/**
 * Pied de page.
 *
 * Ce n'est pas une liste de liens, c'est le dernier plan du film : une
 * affiche pleine largeur, puis les liens en petit dessous. L'ordre compte —
 * on sort du site sur une image, pas sur un plan de site.
 *
 * Toutes les coordonnées viennent de `lib/site.ts` et affichent
 * `[À COMPLÉTER]` tant que les vraies informations n'existent pas. Aucune
 * n'est inventée pour « faire vrai ».
 */
export function SiteFooter() {
  const annee = new Date().getFullYear();

  return (
    <footer className="border-line bg-void relative overflow-hidden border-t">
      <div className="ember pointer-events-none absolute -bottom-1/3 left-1/2 h-[90vmin] w-[90vmin] -translate-x-1/2 rounded-full opacity-60 blur-3xl" />

      {/* --- L'affiche de sortie ------------------------------------------ */}
      <div className="bowly-wide relative pt-24 pb-16 md:pt-32">
        <p className="kicker text-bone-faint">Fin du parcours</p>
        <h2 className="poster text-bone mt-6">
          À BIENTÔT
          <br />
          <span className="text-brand">CHEZ BOWLY&apos;S.</span>
        </h2>

        <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center">
          <Button asChild size="xl" data-curseur="Commander">
            <Link href={LIEN_COMMANDE}>
              Commander
              <ArrowUpRight size={20} aria-hidden="true" />
            </Link>
          </Button>
          <Button asChild size="xl" variant="outline">
            <Link href="/menu">Voir la carte</Link>
          </Button>
        </div>
      </div>

      <div className="bowly-wide relative">
        <div className="hairline" />
      </div>

      {/* --- Les liens ----------------------------------------------------- */}
      <div className="bowly-wide relative grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <h3 className="kicker text-brand">Le site</h3>
          <ul className="mt-5 flex flex-col gap-3">
            <li>
              <Link
                href="/"
                className="text-bone-dim hover:text-bone text-sm transition-colors duration-300"
              >
                Accueil
              </Link>
            </li>
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-bone-dim hover:text-bone text-sm transition-colors duration-300"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="kicker text-brand">Suivre</h3>
          <ul className="mt-5 flex flex-col gap-3">
            {socialLinks.map((social) => (
              <li key={social.label}>
                {/* TODO(marque) : remplacer `#` par l'URL réelle du compte.
                    Ne jamais pointer vers un profil tiers pour meubler. */}
                <a
                  href={social.href}
                  className="text-bone-dim hover:text-bone group inline-flex items-center gap-2.5 text-sm transition-colors duration-300"
                >
                  <SocialIcon name={social.icon} />
                  {social.label}
                  <span className="text-bone-faint text-xs">{social.handle}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="kicker text-brand">Nous joindre</h3>
          <ul className="text-bone-dim mt-5 flex flex-col gap-3 text-sm">
            <li>
              <span className="text-bone-faint block text-xs">Adresse</span>
              {contactInfo.address}, {contactInfo.postalCode} {contactInfo.city}
            </li>
            <li>
              <span className="text-bone-faint block text-xs">Téléphone</span>
              {contactInfo.phone}
            </li>
            <li>
              <span className="text-bone-faint block text-xs">E-mail</span>
              {contactInfo.email}
            </li>
          </ul>
        </div>

        <div>
          <h3 className="kicker text-brand">Légal</h3>
          <ul className="mt-5 flex flex-col gap-3">
            {legalNav.map((item) => (
              <li key={item.label}>
                {/* Pages non rédigées : le lien reste inerte plutôt que de
                    mener à une 404. */}
                <span className="text-bone-faint text-sm">{item.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bowly-wide border-line text-bone-faint relative flex flex-col gap-3 border-t py-8 text-xs sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {annee} {siteConfig.name}. {siteConfig.shortPitch}
        </p>
        <p>
          Marque en construction — les informations marquées{" "}
          <span className="text-bone-dim">[À COMPLÉTER]</span> ne sont pas encore
          publiques.
        </p>
      </div>
    </footer>
  );
}
