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
 * Transparent en haut de page (le hero passe dessous), puis fond opaque
 * flouté dès que l'on scrolle — même logique que les sites fast-casual US.
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

  /* Le menu mobile se referme à chaque navigation.
     Ajustement pendant le rendu (et non dans un effet) : c'est le motif
     recommandé par React pour réagir au changement d'une valeur externe. */
  const [lastPathname, setLastPathname] = React.useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setMenuOpen(false);
  }

  /* Empêche le scroll de l'arrière-plan quand le menu mobile est ouvert. */
  React.useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
        scrolled || menuOpen
          ? "border-b border-cream/10 bg-ink/85 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="bowly-container flex h-20 items-center justify-between gap-6">
        <Link
          href="/"
          aria-label="Bowly's — retour à l'accueil"
          className="rounded-lg transition-opacity duration-300 hover:opacity-85"
        >
          <Logo />
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
                      isActive
                        ? "text-brand"
                        : "text-cream/80 hover:text-cream",
                    )}
                  >
                    {item.label}
                    <span
                      aria-hidden="true"
                      className={cn(
                        "bg-brand absolute inset-x-4 -bottom-0.5 h-0.5 origin-left rounded-full transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
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
          {/* TODO(commande) : brancher sur la vraie plateforme de commande en ligne. */}
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link href="/menu">Commander</Link>
          </Button>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={menuOpen}
            aria-controls="menu-mobile"
            className="text-cream border-cream/20 hover:border-brand hover:text-brand flex size-11 items-center justify-center rounded-full border transition-colors duration-300 lg:hidden"
          >
            {menuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Panneau de navigation mobile */}
      <div
        id="menu-mobile"
        hidden={!menuOpen}
        className="bg-ink border-cream/10 border-t lg:hidden"
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
                      ? "text-brand"
                      : "text-cream hover:text-brand",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Button asChild size="lg" className="mt-6 w-full">
            <Link href="/menu">Commander</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
