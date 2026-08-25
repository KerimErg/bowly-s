"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";

/* ---------------------------------------------------------------------------
 * 3D Coverflow Carousel — pièce maîtresse de la section « Nos best-sellers ».
 *
 * Contraintes respectées :
 *  - aucune dépendance d'icônes : les chevrons sont des SVG inline ;
 *  - palette pilotée par deux props (`backgroundColor`, `accentColor`) : le
 *    composant se pose sur la section claire, seules les cartes gardent un
 *    voile sombre, indispensable au texte en réserve sur la photo ;
 *  - navigation clavier (← →, Début/Fin), pointeur (drag/swipe) et pastilles ;
 *  - défilement automatique désactivé au survol, au focus, pendant un drag,
 *    quand l'onglet est masqué, ou si l'utilisateur a demandé moins d'animations.
 * ------------------------------------------------------------------------- */

export type CoverflowDish = {
  /** Petite étiquette au-dessus du titre (ex. « Best-seller »). */
  tag: string;
  /** Première ligne du titre, affichée en très gros. */
  titleLine1: string;
  /** Seconde ligne du titre, colorée avec l'accent de marque. */
  titleLine2: string;
  /** Description courte et appétissante (1 à 2 phrases). */
  desc: string;
  /** URL de la photo (Unsplash ou, plus tard, visuels de la marque). */
  img: string;
  /** Libellé du bouton d'action. */
  ctaText: string;
  /** Destination du bouton d'action. */
  ctaUrl: string;
  /**
   * Texte alternatif de la photo. Optionnel pour rester compatible avec la
   * structure de données d'origine ; à défaut, il est dérivé du titre.
   */
  alt?: string;
};

/**
 * Les 5 bowls signature Bowly's.
 *
 * TODO(contenu) : remplacer les photos Unsplash par la vraie production
 * photo de la marque, et les descriptions par les textes validés.
 */
export const defaultDishes: CoverflowDish[] = [
  {
    tag: "Best-seller",
    titleLine1: "The Crispy",
    titleLine2: "One",
    desc: "Poulet pané extra-croustillant, riz vinaigré, chou rouge mariné, cheddar fondu et sauce Bowly's fumée. Le bowl qui a lancé la maison.",
    img: "https://images.unsplash.com/photo-1604909052743-94e838986d24?w=800&auto=format&fit=crop&q=80",
    alt: "Bowl de poulet croustillant pané avec chou rouge et sauce crémeuse",
    ctaText: "Voir le menu",
    ctaUrl: "/menu",
  },
  {
    tag: "100 % végétal",
    titleLine1: "Green",
    titleLine2: "Garden",
    desc: "Pois chiches rôtis au cumin, boulgour, avocat, courgette grillée et sauce aux herbes fraîches. Végan, généreux, jamais triste.",
    img: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&auto=format&fit=crop&q=80",
    alt: "Bowl végétarien coloré aux pois chiches rôtis et jeunes pousses",
    ctaText: "Voir le menu",
    ctaUrl: "/menu",
  },
  {
    tag: "Poisson cru",
    titleLine1: "Saumon",
    titleLine2: "Poké",
    desc: "Saumon mariné soja-gingembre, riz vinaigré, mangue, avocat et sésame noir. Fraîcheur nette, sucré-salé maîtrisé.",
    img: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&auto=format&fit=crop&q=80",
    alt: "Pavé de saumon rosé sur un lit de céréales et d'herbes fraîches",
    ctaText: "Voir le menu",
    ctaUrl: "/menu",
  },
  {
    tag: "Haute protéine",
    titleLine1: "Power",
    titleLine2: "Protein",
    desc: "Double poulet grillé, quinoa, œuf mollet, haricots verts et betterave. Pensé pour les journées qui ne s'arrêtent jamais.",
    img: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&auto=format&fit=crop&q=80",
    alt: "Bowl protéiné composé de quinoa, œuf et légumes verts",
    ctaText: "Voir le menu",
    ctaUrl: "/menu",
  },
  {
    tag: "Édition épicée",
    titleLine1: "Hot Honey",
    titleLine2: "Crunch",
    desc: "Poulet croustillant glacé au miel pimenté, patate douce rôtie, pickles d'oignon rouge et oignons frits. Ça pique juste ce qu'il faut.",
    img: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=800&auto=format&fit=crop&q=80",
    alt: "Bowl relevé au piment garni de graines de sésame et d'oignons frits",
    ctaText: "Voir le menu",
    ctaUrl: "/menu",
  },
];

export type Coverflow3DCarouselProps = {
  /** Contenu du carousel. Par défaut : les 5 bowls signature Bowly's. */
  dishes?: CoverflowDish[];
  /** Couleur d'accent (titres, étiquettes, CTA). Orange de marque par défaut. */
  accentColor?: string;
  /** Fond du composant. Noir premium par défaut. */
  backgroundColor?: string;
  /** Défilement automatique. */
  autoPlay?: boolean;
  /** Durée entre deux transitions automatiques, en millisecondes. */
  autoPlayInterval?: number;
  /** Libellé accessible du carousel. */
  ariaLabel?: string;
  className?: string;
};

/* --- Icônes inline (aucune dépendance externe) --------------------------- */

function ChevronLeftIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M15 18 9 12l6-6" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

/* --- Géométrie du coverflow ---------------------------------------------- */

/** Nombre de cartes visibles de chaque côté de la carte active. */
const VISIBLE_NEIGHBOURS = 2;
/** Distance de drag (px) à dépasser pour changer de carte. */
const DRAG_THRESHOLD = 60;

/**
 * Choisit une couleur de texte lisible sur la couleur d'accent.
 * Le blanc sur l'orange de marque ne plafonne qu'à 3,1:1 (sous le seuil AA de
 * 4,5:1) ; l'encre sombre atteint 6,4:1. On calcule donc la luminance relative
 * de l'accent plutôt que de figer une couleur, pour que le composant reste
 * correct quelle que soit la palette qu'on lui passe.
 */
function readableOn(color: string): string {
  const hex = color.trim().replace("#", "");
  const full =
    hex.length === 3
      ? hex
          .split("")
          .map((c) => c + c)
          .join("")
      : hex;
  if (full.length !== 6) return "#1c1310";

  const channel = (value: number) => {
    const srgb = value / 255;
    return srgb <= 0.03928 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4;
  };

  const luminance =
    0.2126 * channel(parseInt(full.slice(0, 2), 16)) +
    0.7152 * channel(parseInt(full.slice(2, 4), 16)) +
    0.0722 * channel(parseInt(full.slice(4, 6), 16));

  const contrastWithWhite = 1.05 / (luminance + 0.05);
  const contrastWithInk = (luminance + 0.05) / 0.0526;

  return contrastWithInk >= contrastWithWhite ? "#1c1310" : "#ffffff";
}

/** Ramène un décalage d'index au chemin le plus court sur l'anneau. */
function wrapOffset(offset: number, total: number): number {
  if (total === 0) return 0;
  let wrapped = offset;
  const half = total / 2;
  while (wrapped > half) wrapped -= total;
  while (wrapped < -half) wrapped += total;
  return wrapped;
}

export function Coverflow3DCarousel({
  dishes = defaultDishes,
  accentColor = "#ff5a1f",
  backgroundColor = "transparent",
  autoPlay = true,
  autoPlayInterval = 5200,
  ariaLabel = "Nos bowls best-sellers",
  className,
}: Coverflow3DCarouselProps) {
  const total = dishes.length;
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const [dragOffset, setDragOffset] = React.useState(0);
  const [isDragging, setIsDragging] = React.useState(false);
  const [cardWidth, setCardWidth] = React.useState(340);
  const [reduceMotion, setReduceMotion] = React.useState(false);

  const stageRef = React.useRef<HTMLDivElement>(null);
  const dragStartX = React.useRef<number | null>(null);

  const goTo = React.useCallback(
    (index: number) => {
      if (total === 0) return;
      setActiveIndex(((index % total) + total) % total);
    },
    [total],
  );

  const next = React.useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const prev = React.useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

  /* Préférence système « moins d'animations ». */
  React.useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  /* Largeur de carte adaptative : le coverflow doit rester lisible en mobile. */
  React.useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const measure = () => {
      const width = stage.clientWidth;
      /* Sur mobile la carte occupe une part plus large de l'écran : sinon le
         titre et la description ne tiennent pas dans la hauteur disponible. */
      const ratio = width < 640 ? 0.82 : 0.68;
      setCardWidth(Math.max(240, Math.min(width * ratio, 400)));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  /* Défilement automatique, suspendu dès qu'il pourrait gêner. */
  React.useEffect(() => {
    if (!autoPlay || paused || isDragging || reduceMotion || total <= 1) return;
    const timer = window.setInterval(next, autoPlayInterval);
    return () => window.clearInterval(timer);
  }, [autoPlay, autoPlayInterval, isDragging, next, paused, reduceMotion, total]);

  /* Pas d'animation en arrière-plan : on suspend quand l'onglet est masqué. */
  React.useEffect(() => {
    const onVisibility = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case "ArrowLeft":
        event.preventDefault();
        prev();
        break;
      case "ArrowRight":
        event.preventDefault();
        next();
        break;
      case "Home":
        event.preventDefault();
        goTo(0);
        break;
      case "End":
        event.preventDefault();
        goTo(total - 1);
        break;
      default:
        break;
    }
  };

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    dragStartX.current = event.clientX;
    setIsDragging(true);
    setDragOffset(0);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragStartX.current === null) return;
    setDragOffset(event.clientX - dragStartX.current);
  };

  const endDrag = () => {
    if (dragStartX.current === null) return;
    if (dragOffset <= -DRAG_THRESHOLD) next();
    else if (dragOffset >= DRAG_THRESHOLD) prev();
    dragStartX.current = null;
    setIsDragging(false);
    setDragOffset(0);
  };

  const onAccent = readableOn(accentColor);
  const spacing = cardWidth * 0.62;
  const transition = reduceMotion
    ? "none"
    : "transform 700ms cubic-bezier(0.22, 1, 0.36, 1), opacity 700ms cubic-bezier(0.22, 1, 0.36, 1), filter 700ms cubic-bezier(0.22, 1, 0.36, 1)";

  return (
    <div
      className={["relative w-full overflow-hidden", className].filter(Boolean).join(" ")}
      style={{ backgroundColor }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {/* Halo orange diffus, pour décoller le carousel du fond noir. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 h-[460px] w-[860px] max-w-none -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]"
        style={{ backgroundColor: accentColor, opacity: 0.16 }}
      />

      <div
        ref={stageRef}
        role="group"
        aria-roledescription="carrousel"
        aria-label={ariaLabel}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={endDrag}
        className="relative mx-auto flex h-[520px] w-full touch-pan-y items-center justify-center outline-none select-none sm:h-[560px] lg:h-[600px]"
        style={{ perspective: "1600px" }}
      >
        {dishes.map((dish, index) => {
          const offset = wrapOffset(index - activeIndex, total);
          const distance = Math.abs(offset);
          const isActive = distance === 0;

          if (distance > VISIBLE_NEIGHBOURS) return null;

          const dragShift = isDragging ? dragOffset * 0.35 : 0;
          const translateX = offset * spacing + dragShift;
          const rotateY = offset === 0 ? 0 : -Math.sign(offset) * 38;
          const scale = 1 - distance * 0.13;
          const translateZ = -distance * 170;
          /* Sur fond clair, une faible opacité rend les cartes fantomatiques :
             la profondeur vient de l'échelle, de l'ombre et d'un léger
             assombrissement, pas de la transparence. */
          const opacity = isActive ? 1 : distance === 1 ? 0.92 : 0.7;

          return (
            <article
              key={`${dish.titleLine1}-${dish.titleLine2}`}
              aria-roledescription="diapositive"
              aria-label={`${dish.titleLine1} ${dish.titleLine2} — ${index + 1} sur ${total}`}
              aria-hidden={!isActive}
              onClick={isActive ? undefined : () => goTo(index)}
              className="absolute top-1/2 left-1/2 overflow-hidden rounded-[28px] border shadow-[0_30px_70px_-25px_rgba(20,15,13,0.55)]"
              style={{
                width: cardWidth,
                height: cardWidth * 1.42,
                marginLeft: -cardWidth / 2,
                marginTop: (-cardWidth * 1.42) / 2,
                transform: `translate3d(${translateX}px, 0, ${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                transformStyle: "preserve-3d",
                transition: isDragging ? "none" : transition,
                opacity,
                zIndex: 100 - distance,
                filter: isActive ? "none" : "saturate(0.8) brightness(0.82)",
                borderColor: isActive ? accentColor : "rgba(20,15,13,0.12)",
                cursor: isActive ? "default" : "pointer",
              }}
            >
              <Image
                src={dish.img}
                alt={dish.alt ?? `${dish.titleLine1} ${dish.titleLine2}`}
                fill
                sizes="(max-width: 640px) 70vw, 400px"
                className="object-cover"
                draggable={false}
                priority={index === 0}
              />

              {/* Voile sombre : garantit le contraste du texte sur la photo. */}
              <div
                aria-hidden="true"
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(20,15,13,0.96) 6%, rgba(20,15,13,0.72) 38%, rgba(20,15,13,0.12) 78%)",
                }}
              />

              <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2.5 p-5 sm:gap-3 sm:p-7">
                <span
                  className="text-[0.62rem] font-bold tracking-[0.24em] uppercase sm:text-[0.68rem]"
                  style={{ color: accentColor }}
                >
                  {dish.tag}
                </span>

                <h3 className="text-[1.7rem] leading-[0.92] font-extrabold tracking-[-0.04em] text-white sm:text-[2.35rem]">
                  {dish.titleLine1}
                  <br />
                  <span style={{ color: accentColor }}>{dish.titleLine2}</span>
                </h3>

                {/* `line-clamp` : les descriptions restent dans la carte quelle
                    que soit leur longueur, y compris sur les petits écrans. */}
                <p className="line-clamp-3 text-xs leading-relaxed text-white/75 sm:text-sm">
                  {dish.desc}
                </p>

                {/* Le CTA n'existe que sur la carte active : les cartes de
                    profil sont assombries, leur bouton n'atteindrait pas le
                    contraste AA et n'a de toute façon aucune utilité (elles
                    sont `aria-hidden` et non focusables). */}
                {isActive ? (
                <Link
                  href={dish.ctaUrl}
                  aria-label={`${dish.ctaText} — ${dish.titleLine1} ${dish.titleLine2}`}
                  className="mt-1 inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-xs font-bold sm:px-5 sm:py-2.5 sm:text-sm transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-white"
                  style={{ backgroundColor: accentColor, color: onAccent }}
                  onClick={(event) => event.stopPropagation()}
                  draggable={false}
                >
                  {dish.ctaText}
                  <ArrowRightIcon />
                </Link>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>

      {/* Annonce du changement de carte pour les lecteurs d'écran. */}
      <p aria-live="polite" className="sr-only">
        {dishes[activeIndex]
          ? `${dishes[activeIndex].titleLine1} ${dishes[activeIndex].titleLine2}, ${activeIndex + 1} sur ${total}`
          : ""}
      </p>

      <div className="relative flex items-center justify-center gap-5 pt-2 pb-12">
        <button
          type="button"
          onClick={prev}
          aria-label="Bowl précédent"
          className="border-ink/15 text-ink hover:border-brand hover:bg-brand flex size-11 items-center justify-center rounded-full border-2 bg-transparent transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-3"
          style={{ outlineColor: accentColor }}
        >
          <ChevronLeftIcon />
        </button>

        <div className="flex items-center gap-2.5" role="tablist" aria-label="Choisir un bowl">
          {dishes.map((dish, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={`dot-${dish.titleLine1}-${dish.titleLine2}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={`Afficher ${dish.titleLine1} ${dish.titleLine2}`}
                onClick={() => goTo(index)}
                className="h-2 rounded-full transition-all duration-500 focus-visible:outline-2 focus-visible:outline-offset-3"
                style={{
                  width: isActive ? 34 : 8,
                  backgroundColor: isActive ? accentColor : "rgba(28,19,16,0.2)",
                  outlineColor: accentColor,
                }}
              />
            );
          })}
        </div>

        <button
          type="button"
          onClick={next}
          aria-label="Bowl suivant"
          className="border-ink/15 text-ink hover:border-brand hover:bg-brand flex size-11 items-center justify-center rounded-full border-2 bg-transparent transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-3"
          style={{ outlineColor: accentColor }}
        >
          <ChevronRightIcon />
        </button>
      </div>
    </div>
  );
}

export default Coverflow3DCarousel;
