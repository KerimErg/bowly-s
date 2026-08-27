"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, X } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { Numero } from "@/components/shared/decor";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LIEN_COMMANDE, mainNav } from "@/lib/site";

/**
 * En-tête.
 *
 * CE QUI A CHANGÉ, ET POURQUOI
 * Avant : barre transparente en haut de page, puis fond translucide flouté au
 * défilement. Deux problèmes. D'abord c'est le motif d'en-tête par défaut de
 * toutes les interfaces récentes — le « verre dépoli » est devenu un tic.
 * Ensuite, avec un fond de page qui passe du brun au crème pendant la
 * descente, la couleur du texte n'avait plus AUCUNE valeur sûre : lisible en
 * haut, illisible au milieu.
 *
 * Maintenant : une BANDE DE PAPIER opaque, toujours crème, bordée d'encre en
 * bas. Elle est posée sur la page comme un bandeau collé en haut d'une
 * affiche. Contraste garanti sur n'importe quel fond, plus aucun état à gérer,
 * et un vocabulaire cohérent avec le reste du site.
 *
 * Le menu mobile n'est pas un tiroir mais un plein écran typographique.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const [ouvert, setOuvert] = React.useState(false);

  /* Le panneau se referme à chaque navigation. Ajustement pendant le rendu
     plutôt que dans un effet : motif recommandé par React, et il évite une
     image intermédiaire avec le menu encore ouvert. */
  const [dernierChemin, setDernierChemin] = React.useState(pathname);
  if (pathname !== dernierChemin) {
    setDernierChemin(pathname);
    setOuvert(false);
  }

  /* Le défilement est bloqué tant que le plein écran est ouvert. */
  React.useEffect(() => {
    if (!ouvert) return;
    const precedent = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = precedent;
    };
  }, [ouvert]);

  /* Échap referme le panneau : attendu de tout ce qui se superpose. */
  React.useEffect(() => {
    if (!ouvert) return;
    const auClavier = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOuvert(false);
    };
    window.addEventListener("keydown", auClavier);
    return () => window.removeEventListener("keydown", auClavier);
  }, [ouvert]);

  return (
    <>
      <header className="border-encre bg-creme fixed inset-x-0 top-0 z-[120] border-b-2">
        <div className="bowly-wide flex h-[4.25rem] items-center justify-between gap-6">
          <Link
            href="/"
            aria-label="Bowly's — retour à l'accueil"
            className="focus-visible:outline-rouge-fonce transition-opacity duration-200 hover:opacity-75"
          >
            <Logo />
          </Link>

          <nav aria-label="Navigation principale" className="hidden xl:block">
            <ul className="flex items-center gap-1">
              {mainNav.map((item) => {
                const actif = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={actif ? "page" : undefined}
                      className={cn(
                        "relative px-4 py-2 text-sm font-bold transition-colors duration-200",
                        actif
                          ? "text-rouge-fonce"
                          : "text-encre-douce hover:text-encre",
                      )}
                    >
                      {item.label}
                      {/* Le trait actif est tracé au feutre, pas en filet. */}
                      {actif && (
                        <svg
                          viewBox="0 0 100 8"
                          preserveAspectRatio="none"
                          aria-hidden="true"
                          className="absolute inset-x-3 -bottom-0.5 h-1.5"
                        >
                          <path
                            d="M1,5 Q25,2 50,4.5 Q75,7 99,3.5"
                            fill="none"
                            stroke="var(--rouge)"
                            strokeWidth="3"
                            strokeLinecap="round"
                          />
                        </svg>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <Button asChild size="sm" className="hidden sm:inline-flex" data-curseur="Commander">
              <Link href={LIEN_COMMANDE}>Commander</Link>
            </Button>

            <button
              type="button"
              onClick={() => setOuvert((o) => !o)}
              aria-label={ouvert ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={ouvert}
              aria-controls="menu-plein-ecran"
              className="border-encre text-encre hover:bg-encre hover:text-creme flex size-11 items-center justify-center rounded-[var(--radius)] border-2 transition-colors duration-200 xl:hidden"
            >
              {ouvert ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
            </button>
          </div>
        </div>
      </header>

      {/* Plein écran typographique. `hidden` plutôt qu'un démontage : les liens
          gardent leur place dans l'ordre de tabulation et les lecteurs d'écran
          annoncent correctement l'état du bouton. */}
      <div
        id="menu-plein-ecran"
        hidden={!ouvert}
        className="bg-creme papier fixed inset-0 z-[110] overflow-y-auto xl:hidden"
      >
        <nav aria-label="Navigation mobile" className="bowly-container relative pt-24 pb-16">
          <ul className="flex flex-col">
            {mainNav.map((item, i) => (
              <li key={item.href} className="border-encre/15 border-b">
                <Link
                  href={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className={cn(
                    "group flex items-baseline justify-between gap-4 py-5 transition-colors duration-200",
                    pathname === item.href
                      ? "text-rouge-fonce"
                      : "text-encre hover:text-rouge-fonce",
                  )}
                >
                  <span className="poster-title">{item.label}</span>
                  <Numero className="text-xl" ton="rouge">
                    {String(i + 1).padStart(2, "0")}
                  </Numero>
                </Link>
              </li>
            ))}
          </ul>

          <Button asChild size="xl" className="mt-10 w-full" data-curseur="Commander">
            <Link href={LIEN_COMMANDE}>
              Commander
              <ArrowUpRight size={20} aria-hidden="true" />
            </Link>
          </Button>
        </nav>
      </div>
    </>
  );
}
