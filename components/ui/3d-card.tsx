"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------------------
 * Carte 3D — d'après le composant « 3D Card » d'Aceternity UI (copier-coller,
 * licence permissive). L'API publique est conservée telle quelle :
 * `CardContainer`, `CardBody`, `CardItem`, `useMouseEnter`.
 *
 * Trois adaptations pour ce projet :
 *  1. la perspective vient du jeton partagé `--perspective` (1600 px) au lieu
 *     de 1000 px, pour rester cohérente avec le carousel coverflow ;
 *  2. l'effet est réservé aux pointeurs fins et respecte
 *     `prefers-reduced-motion` — voir `useTiltEnabled` ci-dessous ;
 *  3. les props sont typées sans `any` ;
 *  4. le `py-8` du conteneur et le `h-96 w-96` figés de `CardBody` sont
 *     retirés, pour que la carte remplisse sa cellule de grille.
 *
 * ⚠️ Ne posez pas `overflow-hidden` sur `CardBody` : la propriété force
 * `transform-style: flat` et aplatirait toute la profondeur. Arrondissez
 * plutôt l'image dans son propre conteneur, qui est une feuille de l'arbre.
 * ------------------------------------------------------------------------- */

const MouseEnterContext = createContext<
  [boolean, React.Dispatch<React.SetStateAction<boolean>>] | undefined
>(undefined);

/** Suit une media query et renvoie son état courant. */
function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [query]);

  return matches;
}

/**
 * L'effet 3D est-il applicable ?
 *
 * Deux conditions, et la seconde n'est pas cosmétique : au doigt, Chromium
 * émet un `mousemove` synthétique après le tap mais aucun `mouseleave`. La
 * carte reste alors figée de travers (mesuré : rotateY -6,2° / rotateX 8,5°
 * après un tap dans un coin) jusqu'à ce qu'on touche ailleurs. On restreint
 * donc l'effet aux pointeurs fins, comme le reste du site.
 */
function useTiltEnabled() {
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  return finePointer && !reducedMotion;
}

export const CardContainer = ({
  children,
  className,
  containerClassName,
}: {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMouseEntered, setIsMouseEntered] = useState(false);
  const tiltEnabled = useTiltEnabled();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !tiltEnabled) return;
    const { left, top, width, height } =
      containerRef.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / 25;
    const y = (e.clientY - top - height / 2) / 25;
    containerRef.current.style.transform = `rotateY(${x}deg) rotateX(${-y}deg)`;
  };

  const handleMouseEnter = () => {
    if (!tiltEnabled) return;
    setIsMouseEntered(true);
  };

  const handleMouseLeave = () => {
    if (!containerRef.current) return;
    setIsMouseEntered(false);
    containerRef.current.style.transform = `rotateY(0deg) rotateX(0deg)`;
  };

  return (
    <MouseEnterContext.Provider value={[isMouseEntered, setIsMouseEntered]}>
      <div
        className={cn("flex items-center justify-center", containerClassName)}
        style={{ perspective: "var(--perspective)" }}
      >
        <div
          ref={containerRef}
          onMouseEnter={handleMouseEnter}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className={cn(
            "relative flex items-center justify-center transition-all duration-200 ease-linear",
            className,
          )}
          style={{ transformStyle: "preserve-3d" }}
        >
          {children}
        </div>
      </div>
    </MouseEnterContext.Provider>
  );
};

export const CardBody = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "[transform-style:preserve-3d] [&>*]:[transform-style:preserve-3d]",
        className,
      )}
    >
      {children}
    </div>
  );
};

type CardItemProps = {
  as?: React.ElementType;
  children: React.ReactNode;
  className?: string;
  translateX?: number | string;
  translateY?: number | string;
  translateZ?: number | string;
  rotateX?: number | string;
  rotateY?: number | string;
  rotateZ?: number | string;
} & Omit<React.HTMLAttributes<HTMLElement>, "children" | "className">;

export const CardItem = ({
  as: Tag = "div",
  children,
  className,
  translateX = 0,
  translateY = 0,
  translateZ = 0,
  rotateX = 0,
  rotateY = 0,
  rotateZ = 0,
  ...rest
}: CardItemProps) => {
  const ref = useRef<HTMLElement>(null);
  const [isMouseEntered] = useMouseEnter();
  const tiltEnabled = useTiltEnabled();

  const applyTransform = useCallback(() => {
    if (!ref.current) return;
    if (isMouseEntered && tiltEnabled) {
      ref.current.style.transform = `translateX(${translateX}px) translateY(${translateY}px) translateZ(${translateZ}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`;
    } else {
      ref.current.style.transform = `translateX(0px) translateY(0px) translateZ(0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)`;
    }
  }, [
    isMouseEntered,
    tiltEnabled,
    translateX,
    translateY,
    translateZ,
    rotateX,
    rotateY,
    rotateZ,
  ]);

  useEffect(() => {
    applyTransform();
  }, [applyTransform]);

  return (
    <Tag
      ref={ref}
      className={cn("transition duration-200 ease-linear", className)}
      {...rest}
    >
      {children}
    </Tag>
  );
};

export const useMouseEnter = () => {
  const context = useContext(MouseEnterContext);
  if (context === undefined) {
    throw new Error("useMouseEnter must be used within a MouseEnterProvider");
  }
  return context;
};
