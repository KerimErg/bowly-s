import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Logo Bowly's — 100 % vectoriel, aucune image externe.
 *
 * Le « B » est dessiné en tracés SVG (et non en texte) pour trois raisons :
 *  - rendu identique quel que soit le chargement de la police ;
 *  - réutilisable tel quel pour le favicon (`app/icon.svg`) ;
 *  - net à toutes les tailles, du header au pied de page.
 *
 * Deux variantes : `full` (monogramme + mot-clé) et `mark` (monogramme seul).
 */

/** Tracé du « B » géométrique, viewBox 0 0 100 100, fill-rule evenodd. */
const B_PATH =
  "M20 14 C20 10.7 22.7 8 26 8 H52 C67.5 8 79 18.5 79 32.3 C79 40 75.3 46.6 69.2 50.2 C77.2 53.6 82.5 60.9 82.5 70 C82.5 84.4 70.2 94 53.6 94 H26 C22.7 94 20 91.3 20 88 Z " +
  "M36 24 H50 C55.5 24 59 27.5 59 32.5 C59 37.5 55.5 41 50 41 H36 Z " +
  "M36 57 H52 C58.5 57 62.5 61 62.5 67.5 C62.5 74 58.5 78 52 78 H36 Z";

type LogoMarkProps = React.ComponentProps<"svg"> & {
  /** Identifiant unique du dégradé — évite les collisions si le logo est monté plusieurs fois. */
  gradientId?: string;
};

/** Monogramme seul : pastille orange + « B » blanc en réserve. */
export function LogoMark({
  className,
  gradientId = "bowlys-mark",
  ...props
}: LogoMarkProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      role="img"
      aria-hidden="true"
      focusable="false"
      className={cn("size-10", className)}
      {...props}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ff8a4c" />
          <stop offset="55%" stopColor="#ff5a1f" />
          <stop offset="100%" stopColor="#e8440c" />
        </linearGradient>
      </defs>
      {/* Pastille « squircle » : rayon généreux pour l'aspect arrondi/gourmand. */}
      <rect
        x="0"
        y="0"
        width="100"
        height="100"
        rx="28"
        fill={`url(#${gradientId})`}
      />
      <path d={B_PATH} fill="#ffffff" fillRule="evenodd" />
    </svg>
  );
}

/** Monogramme « à plat » : « B » orange sur fond transparent (usages compacts). */
export function LogoGlyph({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 100 100"
      role="img"
      aria-hidden="true"
      focusable="false"
      className={cn("size-8", className)}
      {...props}
    >
      <path d={B_PATH} fill="currentColor" fillRule="evenodd" />
    </svg>
  );
}

type LogoProps = {
  variant?: "full" | "mark";
  className?: string;
  markClassName?: string;
  /** Masque le mot-clé sur petit écran tout en le gardant pour les lecteurs d'écran. */
  compactOnMobile?: boolean;
};

export function Logo({
  variant = "full",
  className,
  markClassName,
  compactOnMobile = false,
}: LogoProps) {
  if (variant === "mark") {
    return (
      <span className={cn("inline-flex items-center", className)}>
        <LogoMark className={markClassName} />
        <span className="sr-only">Bowly&apos;s</span>
      </span>
    );
  }

  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className={cn("size-10 shrink-0", markClassName)} />
      <span
        className={cn(
          "font-display text-cream text-2xl leading-none font-extrabold tracking-[-0.045em]",
          compactOnMobile && "sr-only sm:not-sr-only",
        )}
      >
        Bowly
        <span className="text-brand">&apos;s</span>
      </span>
    </span>
  );
}
