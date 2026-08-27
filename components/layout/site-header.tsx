"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, X } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LIEN_COMMANDE, mainNav } from "@/lib/site";

/**
 * En-tête.
 *
 * Le site étant sombre de bout en bout, l'en-tête n'a plus qu'un axe de
 * variation : sa présence. Transparent tout en haut pour ne rien voler au
 * portail, il se condense en barre translucide dès le premier défilement.
 *
 * Le menu mobile n'est pas un tiroir mais un plein écran typographique :
 * c'est un des « moments d'affiche » de la charte, pas un pis-aller.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const [condense, setCondense] = React.useState(false);
  const [ouvert, setOuvert] = React.useState(false);

  React.useEffect(() => {
    const auScroll = () => setCondense(window.scrollY > 40);
    auScroll();
    window.addEventListener("scroll", auScroll, { passive: true });
    return () => window.removeEventListener("scroll", auScroll);
  }, []);

  /* Le panneau se referme à chaque navigation. Ajustement pendant le rendu
     plutôt que dans un effet : c'est le motif recommandé par React, et il
     évite une image intermédiaire avec le menu encore ouvert. */
  const [dernierChemin, setDernierChemin] = React.useState(pathname);
  if (pathname !== dernierChemin) {
    setDernierChemin(pathname);
    setOuvert(false);
  }

  /* Le défilement de la page est bloqué tant que le plein écran est ouvert,
     sinon on scrolle le contenu derrière le menu. */
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
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-[120] transition-all duration-500 ease-[var(--ease-out)]",
          condense || ouvert
            ? "bg-void/80 border-line border-b backdrop-blur-xl"
            : "border-b border-transparent",
        )}
      >
        <div className="bowly-wide flex h-[4.5rem] items-center justify-between gap-6">
          <Link
            href="/"
            aria-label="Bowly's — retour à l'accueil"
            className="rounded-lg transition-opacity duration-300 hover:opacity-80"
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
                        "relative rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-300",
                        actif ? "text-crisp" : "text-bone-dim hover:text-bone",
                      )}
                    >
                      {item.label}
                      <span
                        aria-hidden="true"
                        className={cn(
                          "bg-crisp absolute inset-x-4 -bottom-0.5 h-px origin-left transition-transform duration-300 ease-[var(--ease-out)]",
                          actif ? "scale-x-100" : "scale-x-0",
                        )}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <Button asChild size="sm" className="hidden sm:inline-flex" data-curseur="Commander">
              <Link href={LIEN_COMMANDE}>Commander</Link>
            </Button>

            <button
              type="button"
              onClick={() => setOuvert((o) => !o)}
              aria-label={ouvert ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={ouvert}
              aria-controls="menu-plein-ecran"
              className="border-line-strong text-bone hover:border-crisp hover:text-crisp flex size-11 items-center justify-center rounded-full border transition-colors duration-300 xl:hidden"
            >
              {ouvert ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
            </button>
          </div>
        </div>
      </header>

      {/* Plein écran typographique. `hidden` plutôt qu'un démontage : les
          liens gardent leur place dans l'ordre de tabulation du document et
          les lecteurs d'écran annoncent correctement l'état du bouton. */}
      <div
        id="menu-plein-ecran"
        hidden={!ouvert}
        className="bg-void/97 fixed inset-0 z-[110] overflow-y-auto backdrop-blur-2xl xl:hidden"
      >
        <div className="ember pointer-events-none absolute -top-32 -left-32 h-[70vmin] w-[70vmin] rounded-full blur-3xl" />

        <nav aria-label="Navigation mobile" className="bowly-container relative pt-28 pb-16">
          <ul className="flex flex-col">
            {mainNav.map((item, i) => (
              <li key={item.href} className="border-line border-b">
                <Link
                  href={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className={cn(
                    "group flex items-baseline justify-between gap-4 py-5 transition-colors duration-300",
                    pathname === item.href ? "text-crisp" : "text-bone hover:text-brand",
                  )}
                >
                  <span className="poster-title">{item.label}</span>
                  <span className="text-bone-faint font-mono text-xs">
                    0{i + 1}
                  </span>
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
