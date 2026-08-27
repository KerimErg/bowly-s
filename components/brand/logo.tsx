import { cn } from "@/lib/utils";

/**
 * Logo Bowly's.
 *
 * Le symbole est un bowl vu de face : la coupe forme le contenant, la
 * contre-forme dessine un « B ». Il est tracé en chemins SVG et non en texte,
 * pour trois raisons :
 *  - rendu identique avant, pendant et après le chargement de la police ;
 *  - net à toutes les tailles, y compris en favicon 16 px ;
 *  - aucun risque qu'une substitution de police déforme la marque.
 *
 * Le liseré froid autour du symbole reprend le rim-light de la charte : c'est
 * le même geste que sur les illustrations de bowls et dans la scène 3D.
 */
export function Logo({
  className,
  avecTexte = true,
}: {
  className?: string;
  /** Le symbole seul suffit là où la place manque (barre mobile compacte). */
  avecTexte?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <svg
        viewBox="0 0 44 44"
        aria-hidden="true"
        focusable="false"
        className="size-9 shrink-0"
      >
        <defs>
          <linearGradient id="bowly-coupe" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--rouge-fonce)" />
            <stop offset="55%" stopColor="var(--rouge)" />
            <stop offset="100%" stopColor="var(--rouge-clair)" />
          </linearGradient>
          <linearGradient id="bowly-rim" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--jaune)" stopOpacity="0.95" />
            <stop offset="70%" stopColor="var(--jaune)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* La coupe */}
        <path
          d="M4 18h36c0 11.6-8.1 20-18 20S4 29.6 4 18Z"
          fill="url(#bowly-coupe)"
        />
        {/* Rim-light froid sur la lèvre droite */}
        <path
          d="M4 18h36c0 11.6-8.1 20-18 20S4 29.6 4 18Z"
          fill="none"
          stroke="url(#bowly-rim)"
          strokeWidth="1.6"
        />
        {/* Le « B » en réserve dans la coupe */}
        <path
          d="M15.4 21.2h6.9c2.9 0 4.7 1.4 4.7 3.6 0 1.4-.8 2.5-2.1 2.9v.1c1.6.4 2.6 1.6 2.6 3.2 0 2.6-2.1 4.2-5.5 4.2h-6.6V21.2Zm6.3 5.6c1.3 0 2.1-.6 2.1-1.6s-.7-1.6-2-1.6h-3v3.2h2.9Zm.3 5.7c1.5 0 2.3-.6 2.3-1.8 0-1.1-.9-1.7-2.4-1.7h-3.1v3.5h3.2Z"
          fill="var(--creme)"
        />
        {/* La vapeur : trois traits, le plus court au centre. */}
        <path
          d="M14 12.5c0-2.5 2.6-2.5 2.6-5M21.4 9.5c0-2.5 2.6-2.5 2.6-5M28.8 12.5c0-2.5 2.6-2.5 2.6-5"
          fill="none"
          stroke="var(--rouge-fonce)"
          strokeWidth="2.4"
          strokeLinecap="round"
          opacity="0.85"
        />
      </svg>

      {avecTexte && (
        <span className="text-encre font-poster text-2xl leading-none tracking-tight">
          BOWLY&apos;S
        </span>
      )}
    </span>
  );
}
