"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { mainNav } from "@/lib/site";

/**
 * En-tête du site.
 *
 * Deux états, parce que le haut de page est une photo sombre alors que le
 * reste du site est crème :
 *  - en haut d'une page à hero photo : fond transparent, texte clair ;
 *  - dès qu'on scrolle (ou menu mobile ouvert) : fond crème, texte encre.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Le menu mobile se referme à chaque navigation. Ajustement pendant le
     rendu (et non dans un effet) : motif recommandé par React. */
  const [lastPathname, setLastPathname] = React.useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setMenuOpen(false);
  }

  /* Le header est transparent en haut de page. Le texte doit donc s'adapter
     à ce qu'il surplombe :
       - accueil : hero clair (photos flottantes sur crème) → texte encre ;
       - autres pages : `PageHero`, photo assombrie plein cadre → texte clair.
     À revoir si l'une de ces pages change de type d'en-tête. */
  const darkHeroBehind = pathname !== "/";

  /* `onLight` = le texte du header doit être en encre (fond crème opaque,
     ou hero clair de l'accueil). */
  const solid = scrolled || menuOpen;
  const onLight = solid || !darkHeroBehind;

  /* Les pages du labo testent des heros plein écran : le chrome du site y
     masquerait ce qu'on cherche à évaluer, et sa couleur de texte dépendrait
     d'un hero dont le type change selon le support WebGPU. */
  if (pathname.startsWith("/labo")) return null;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
        solid
          ? "border-line bg-cream/92 border-b backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="bowly-container flex h-20 items-center justify-between gap-6">
        <Link
          href="/"
          aria-label="Bowly&apos;s — retour à l&apos;accueil"
          className="rounded-lg transition-opacity duration-300 hover:opacity-85"
        >
          <Logo tone={onLight ? "dark" : "light"} />
        </Link>

        <nav aria-label="Navigation principale" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {mainNav.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "font-display relative rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-300",
                      onLight
                        ? isActive
                          ? "text-brand-ink"
                          : "text-ink/75 hover:text-ink"
                        : isActive
                          ? "text-brand"
                          : "text-cream/85 hover:text-cream",
                    )}
                  >
                    {item.label}
                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute inset-x-4 -bottom-0.5 h-0.5 origin-left rounded-full transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                        onLight ? "bg-brand-ink" : "bg-brand",
                        isActive ? "scale-x-100" : "scale-x-0",
                      )}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          {/* TODO(commande) : brancher sur la vraie plateforme de commande. */}
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link href="/menu">Je commande</Link>
          </Button>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={menuOpen}
            aria-controls="menu-mobile"
            className={cn(
              "flex size-11 items-center justify-center rounded-full border-2 transition-colors duration-300 lg:hidden",
              onLight
                ? "border-ink/15 text-ink hover:border-brand hover:text-brand-ink"
                : "border-cream/40 text-cream hover:border-cream",
            )}
          >
            {menuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Panneau de navigation mobile */}
      <div
        id="menu-mobile"
        hidden={!menuOpen}
        className="border-line bg-cream min-h-[calc(100dvh-5rem)] border-t lg:hidden"
      >
        <nav aria-label="Navigation mobile" className="bowly-container py-6">
          <ul className="flex flex-col gap-1">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className={cn(
                    "font-display block rounded-xl px-4 py-4 text-2xl font-extrabold tracking-tight transition-colors duration-300",
                    pathname === item.href
                      ? "text-brand-ink"
                      : "text-ink hover:text-brand-ink",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Button asChild size="lg" className="mt-6 w-full">
            <Link href="/menu">Je commande</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
