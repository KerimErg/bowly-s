"use client";

import * as React from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";

import { cn } from "@/lib/utils";

type TiltCardProps = {
  children: React.ReactNode;
  className?: string;
  /** Amplitude maximale de rotation, en degrés. */
  maxTilt?: number;
  /** Élévation de la carte au survol, en pixels. */
  lift?: number;
  /** Rotation au repos, pour que la carte « flotte » même sans souris. */
  restTilt?: { x?: number; y?: number };
};

/**
 * Carte inclinable au survol de la souris.
 *
 * Le langage 3D du site est entièrement en transforms CSS, animées par des
 * ressorts Framer Motion — pas de WebGL. La perspective et la courbe viennent
 * des jetons partagés (`--perspective`, `--ease-float`), pour que ces cartes,
 * le hero et le carousel coverflow semblent filmés par le même objectif.
 *
 * Trois garde-fous :
 *  - `prefers-reduced-motion` désactive complètement le tilt ;
 *  - le tilt ne s'active que sur les pointeurs fins (souris), jamais au doigt,
 *    où il déclencherait une rotation parasite au moment du tap ;
 *  - la scène (`perspective`) est portée par le parent, pas par la carte, pour
 *    que toutes les cartes d'une grille partagent le même point de fuite.
 *
 * Le composant rend toujours une `div` : l'élément sémantique (`li`, `article`)
 * reste au parent, ce qui évite un tag polymorphe dont les types de `ref` et
 * de gestionnaires d'événements entrent en conflit.
 */
export function TiltCard({
  children,
  className,
  maxTilt = 7,
  lift = 10,
  restTilt,
}: TiltCardProps) {
  const reduceMotion = useReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);
  const [finePointer, setFinePointer] = React.useState(false);

  React.useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setFinePointer(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const active = finePointer && !reduceMotion;

  /* Position du curseur dans la carte, normalisée entre 0 et 1. */
  const pointerX = useMotionValue(0.5);
  const pointerY = useMotionValue(0.5);
  const hovered = useMotionValue(0);

  const spring = { stiffness: 180, damping: 20, mass: 0.5 };
  const smoothX = useSpring(pointerX, spring);
  const smoothY = useSpring(pointerY, spring);
  const smoothHover = useSpring(hovered, spring);

  const rotateY = useTransform(smoothX, [0, 1], [-maxTilt, maxTilt]);
  const rotateX = useTransform(smoothY, [0, 1], [maxTilt, -maxTilt]);
  const translateY = useTransform(smoothHover, [0, 1], [0, -lift]);
  const translateZ = useTransform(smoothHover, [0, 1], [0, 30]);

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!active) return;
    const bounds = ref.current?.getBoundingClientRect();
    if (!bounds) return;
    pointerX.set((event.clientX - bounds.left) / bounds.width);
    pointerY.set((event.clientY - bounds.top) / bounds.height);
  };

  const reset = () => {
    pointerX.set(0.5);
    pointerY.set(0.5);
    hovered.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={cn("preserve-3d", className)}
      style={
        active
          ? {
              rotateX,
              rotateY,
              y: translateY,
              z: translateZ,
              transformPerspective: 1600,
            }
          : restTilt && !reduceMotion
            ? { rotateX: restTilt.x ?? 0, rotateY: restTilt.y ?? 0 }
            : undefined
      }
      onPointerMove={handlePointerMove}
      onPointerEnter={() => active && hovered.set(1)}
      onPointerLeave={reset}
    >
      {children}
    </motion.div>
  );
}
