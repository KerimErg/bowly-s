import * as React from "react";

import type { SocialIcon as SocialIconName } from "@/lib/site";

/**
 * Icônes de réseaux sociaux en SVG inline.
 * `lucide-react` ne fournit plus d'icônes de marque : on les dessine ici
 * plutôt que d'ajouter une dépendance pour quatre pictogrammes.
 */
const PATHS: Record<SocialIconName, React.ReactNode> = {
  instagram: (
    <>
      <rect x="2" y="2" width="20" height="20" rx="5.5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.6" cy="6.4" r="1.1" fill="currentColor" stroke="none" />
    </>
  ),
  tiktok: (
    <path d="M15.2 3.2c.5 2.3 1.9 3.8 4.1 4v3c-1.6.1-3-.4-4.2-1.3v5.9c0 3.5-2.6 5.9-5.7 5.9-3 0-5.4-2.4-5.4-5.4 0-3.2 2.7-5.7 6.1-5.3v3.1c-.3-.1-.7-.2-1.1-.2-1.4 0-2.5 1.1-2.5 2.5s1.1 2.5 2.5 2.5c1.4 0 2.6-1.1 2.6-2.7V3.2z" />
  ),
  facebook: (
    <path d="M14.5 8.6V6.9c0-.8.2-1.2 1.4-1.2h1.5V2.6h-2.5c-3 0-4 1.4-4 3.9v2.1H8.6v3.1h2.3V21h3.6v-9.3h2.5l.3-3.1z" />
  ),
  linkedin: (
    <>
      <rect x="2.5" y="2.5" width="19" height="19" rx="3" />
      <path d="M7 10v7.5M7 6.9v.1" />
      <path d="M11.5 17.5V10m0 2.8c0-1.6 1.1-2.8 2.6-2.8 1.5 0 2.6 1 2.6 3v5.3" />
    </>
  ),
};

export function SocialIcon({
  name,
  className,
}: {
  name: SocialIconName;
  className?: string;
}) {
  const filled = name === "tiktok" || name === "facebook";

  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill={filled ? "currentColor" : "none"}
      stroke={filled ? "none" : "currentColor"}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {PATHS[name]}
    </svg>
  );
}
