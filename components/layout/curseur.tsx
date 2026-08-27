"use client";

import * as React from "react";

import { useMouvementReduit, usePointeurFin } from "@/lib/capacites";

/**
 * Curseur de marque.
 *
 * Un anneau qui suit le pointeur avec un léger retard, se dilate sur les
 * éléments interactifs et affiche un mot quand l'élément survolé en propose
 * un via `data-curseur="COMPOSER"`.
 *
 * TROIS GARDE-FOUS, tous nécessaires :
 *  1. pointeur fin uniquement — sur écran tactile il n'y a pas de curseur à
 *     augmenter, et le suivi resterait figé sur le dernier point touché ;
 *  2. mouvement réduit — un élément qui poursuit le pointeur est exactement
 *     ce que ce réglage sert à éviter ;
 *  3. le curseur système n'est JAMAIS masqué. Le remplacer entièrement casse
 *     les repères de la plupart des utilisateurs, et disparaît complètement
 *     si ce composant plante. L'anneau vient en plus, pas à la place.
 */
export function CurseurBowly() {
  const anneau = React.useRef<HTMLDivElement>(null);
  const [mot, setMot] = React.useState<string | null>(null);
  const [dilate, setDilate] = React.useState(false);

  /* Les deux conditions sont suivies en direct : brancher une souris sur une
     tablette, ou activer « réduire les animations » en cours de visite,
     bascule immédiatement l'anneau. */
  const pointeurFin = usePointeurFin();
  const mouvementReduit = useMouvementReduit();
  const actif = pointeurFin && !mouvementReduit;

  React.useEffect(() => {
    if (!actif) return;

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let cibleX = x;
    let cibleY = y;
    let frame = 0;

    const boucle = () => {
      // Suivi amorti : c'est le retard qui donne le poids. Sans lui,
      // l'anneau est collé au pointeur et n'apporte rien.
      x += (cibleX - x) * 0.18;
      y += (cibleY - y) * 0.18;
      if (anneau.current) {
        anneau.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      }
      frame = window.requestAnimationFrame(boucle);
    };

    const auMouvement = (e: PointerEvent) => {
      cibleX = e.clientX;
      cibleY = e.clientY;
    };

    const auSurvol = (e: PointerEvent) => {
      const cible = e.target;
      if (!(cible instanceof Element)) return;
      const porteur = cible.closest<HTMLElement>("[data-curseur]");
      const interactif = cible.closest("a, button, [role='button'], input, textarea, select");
      setMot(porteur?.dataset.curseur ?? null);
      setDilate(Boolean(porteur || interactif));
    };

    frame = window.requestAnimationFrame(boucle);
    window.addEventListener("pointermove", auMouvement, { passive: true });
    window.addEventListener("pointerover", auSurvol, { passive: true });

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", auMouvement);
      window.removeEventListener("pointerover", auSurvol);
    };
  }, [actif]);

  if (!actif) return null;

  return (
    <div
      ref={anneau}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[150] hidden lg:block"
      style={{ willChange: "transform" }}
    >
      <div
        className={[
          "flex items-center justify-center rounded-full border-2 transition-[width,height,background-color,border-color] duration-300 ease-[var(--ease-out)]",
          mot
            ? "bg-rouge border-encre h-20 w-20 border-2"
            : dilate
              ? "border-rouge bg-rouge/20 h-12 w-12"
              : "border-encre/45 h-6 w-6 bg-transparent",
        ].join(" ")}
      >
        {mot && (
          <span className="text-encre text-[0.6rem] font-extrabold tracking-[0.14em] uppercase">
            {mot}
          </span>
        )}
      </div>
    </div>
  );
}
