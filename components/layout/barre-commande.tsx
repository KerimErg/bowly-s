"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { LIEN_COMMANDE } from "@/lib/site";

/**
 * Barre de commande persistante — mobile uniquement.
 *
 * Le site est une expérience longue : entre le premier écran et le pied de
 * page il y a une dizaine de hauteurs d'écran. Sans rappel permanent, le
 * bouton « Commander » disparaît pendant tout le parcours, et c'est
 * exactement là que l'envie se déclenche.
 *
 * Trois décisions :
 *  - elle n'apparaît qu'après le premier écran, pour ne pas polluer le
 *    portail dont c'est tout l'effet ;
 *  - elle est masquée sur la page de commande elle-même, où elle ne
 *    mènerait nulle part ;
 *  - `env(safe-area-inset-bottom)` : sans ça, la barre passe sous
 *    l'indicateur de navigation des iPhone récents et devient à moitié
 *    cliquable.
 *
 * Sur grand écran, l'en-tête reste visible en permanence et fait déjà ce
 * travail : dupliquer le bouton en bas serait redondant.
 */
export function BarreCommande() {
  const pathname = usePathname();
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const auScroll = () => setVisible(window.scrollY > window.innerHeight * 0.85);
    auScroll();
    window.addEventListener("scroll", auScroll, { passive: true });
    return () => window.removeEventListener("scroll", auScroll);
  }, []);

  if (pathname === LIEN_COMMANDE) return null;

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-[130] p-3 transition-all duration-500 ease-[var(--ease-out)] sm:hidden",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0",
      )}
      style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
    >
      <Link
        href={LIEN_COMMANDE}
        // `tabIndex={-1}` quand la barre est masquée : sinon le clavier
        // atteint un bouton invisible.
        tabIndex={visible ? undefined : -1}
        aria-hidden={!visible}
        className="bg-brand text-ink flex h-14 items-center justify-center gap-2 rounded-full text-base font-bold shadow-[var(--shadow-glow-brand)]"
      >
        Commander
        <ArrowUpRight size={19} aria-hidden="true" />
      </Link>
    </div>
  );
}
