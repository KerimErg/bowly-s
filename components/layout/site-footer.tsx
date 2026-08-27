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
    <footer className="border-trait-clair bg-braise relative overflow-hidden border-t">
      <div aria-hidden="true" className="trame trame-rouge pointer-events-none absolute inset-0 opacity-30" />

      {/* --- L'affiche de sortie ------------------------------------------ */}
      <div className="bowly-wide relative pt-24 pb-16 md:pt-32">
        <p className="kicker text-creme/50">Fin du parcours</p>
        <h2 className="poster text-creme mt-6">
          À BIENTÔT
          <br />
          <span className="text-rouge">CHEZ BOWLY&apos;S.</span>
        </h2>

        <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center">
          <Button asChild size="xl" data-curseur="Commander">
            <Link href={LIEN_COMMANDE}>
              Commander
              <ArrowUpRight size={20} aria-hidden="true" />
            </Link>
          </Button>
          <Button asChild size="xl" variant="outline-clair">
            <Link href="/menu">Voir la carte</Link>
          </Button>
        </div>
      </div>

      <div className="bowly-wide relative">
        <div className="bg-trait-clair h-px" />
      </div>

      {/* --- Les liens ----------------------------------------------------- */}
      <div className="bowly-wide relative grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <h3 className="kicker text-rouge">Le site</h3>
          <ul className="mt-5 flex flex-col gap-3">
            <li>
              <Link
                href="/"
                className="text-creme/70 hover:text-creme text-sm transition-colors duration-300"
              >
                Accueil
              </Link>
            </li>
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-creme/70 hover:text-creme text-sm transition-colors duration-300"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="kicker text-rouge">Suivre</h3>
          <ul className="mt-5 flex flex-col gap-3">
            {socialLinks.map((social) => (
              <li key={social.label}>
                {/* TODO(marque) : remplacer `#` par l'URL réelle du compte.
                    Ne jamais pointer vers un profil tiers pour meubler. */}
                <a
                  href={social.href}
                  className="text-creme/70 hover:text-creme group inline-flex items-center gap-2.5 text-sm transition-colors duration-300"
                >
                  <SocialIcon name={social.icon} />
                  {social.label}
                  <span className="text-creme/50 text-xs">{social.handle}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="kicker text-rouge">Nous joindre</h3>
          <ul className="text-creme/70 mt-5 flex flex-col gap-3 text-sm">
            <li>
              <span className="text-creme/50 block text-xs">Adresse</span>
              {contactInfo.address}, {contactInfo.postalCode} {contactInfo.city}
            </li>
            <li>
              <span className="text-creme/50 block text-xs">Téléphone</span>
              {contactInfo.phone}
            </li>
            <li>
              <span className="text-creme/50 block text-xs">E-mail</span>
              {contactInfo.email}
            </li>
          </ul>
        </div>

        <div>
          <h3 className="kicker text-rouge">Légal</h3>
          <ul className="mt-5 flex flex-col gap-3">
            {legalNav.map((item) => (
              <li key={item.label}>
                {/* Pages non rédigées : le lien reste inerte plutôt que de
                    mener à une 404. */}
                <span className="text-creme/50 text-sm">{item.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bowly-wide border-trait-clair text-creme/50 relative flex flex-col gap-3 border-t py-8 text-xs sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {annee} {siteConfig.name}. {siteConfig.shortPitch}
        </p>
        <p>
          Marque en construction — les informations marquées{" "}
          <span className="text-creme/70">[À COMPLÉTER]</span> ne sont pas encore
          publiques.
        </p>
      </div>
    </footer>
  );
}
