"use client";

import * as React from "react";

/**
 * Le pilote de la scène 3D.
 * ---------------------------------------------------------------------------
 * IDÉE DIRECTRICE
 * Le bowl n'est pas une illustration posée dans le hero : c'est un objet
 * unique, monté une seule fois, qui traverse toute la page. Le scroll ne fait
 * pas apparaître et disparaître des canvas — il déplace une caméra sur un
 * rail autour et à l'intérieur de ce même objet.
 *
 * D'où ce module : un état partagé, minuscule, lu à 60 images par seconde par
 * la boucle de rendu WebGL et écrit par le scroll, le pointeur et le
 * configurateur.
 *
 * POURQUOI PAS UN CONTEXTE REACT
 * Un contexte re-rendrait l'arbre à chaque pixel de scroll. Ici la boucle de
 * rendu lit un objet mutable directement dans `useFrame` : zéro rendu React
 * pendant le scroll. Les composants qui ont vraiment besoin de se redessiner
 * (le configurateur, l'indicateur d'acte) s'abonnent explicitement via
 * `useActe()` ou `useRecette()`, qui ne notifient qu'au changement réel.
 */

export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/** Ce que le configurateur compose, et que la scène 3D reflète. */
export type Recette = {
  base: string;
  proteine: string;
  sauce: string;
  toppings: string[];
  extras: string[];
};

export const RECETTE_INITIALE: Recette = {
  base: "riz",
  proteine: "crispy",
  sauce: "fumee",
  toppings: ["oignons"],
  extras: [],
};

/**
 * Les actes du parcours, en progression de scroll (0 → 1 sur toute la page).
 *
 * ⚠️ CES VALEURS SONT DES REPLIS, PAS LA VÉRITÉ.
 * Première version : des fractions codées en dur, calculées à la main depuis
 * la hauteur supposée des sections. Elles se sont désynchronisées dès la
 * première section ajoutée — la caméra était encore au fond du bowl alors que
 * la page affichait déjà la carte des plats. Une constante ne peut pas
 * connaître la hauteur réelle d'un bloc de texte, qui dépend de la police
 * chargée, de la largeur de l'écran et de la longueur des libellés.
 *
 * `calerActes()` les remplace donc par une MESURE du DOM au montage et à
 * chaque redimensionnement. Ce qui suit ne sert qu'avant la première mesure
 * et si les sections attendues sont absentes (autre page que l'accueil).
 */
export const ACTES: Record<Acte, [number, number]> = {
  portail: [0, 0.07],
  descente: [0.07, 0.36],
  atelier: [0.36, 0.46],
  sortie: [0.46, 1],
};

export type Acte = "portail" | "descente" | "atelier" | "sortie";

/**
 * Cale les actes sur la position réelle des sections.
 *
 * Chaque borne est la progression à laquelle le BAS de la section franchit le
 * HAUT de la fenêtre : l'instant où la section a fini d'être lue et sort de
 * l'écran. La caméra achève donc son mouvement pile quand le texte
 * correspondant disparaît.
 *
 * ⚠️ Ne pas confondre avec « le bas de la section atteint le bas de la
 * fenêtre » : c'est ce que faisait la première version, et pour une section
 * d'exactement une hauteur d'écran — le portail — les deux bornes tombaient
 * sur zéro. L'acte d'ouverture avait une durée nulle et la caméra sautait
 * directement à la descente dès le premier pixel de scroll.
 */
export function calerActes(sections: {
  portail: HTMLElement | null;
  descente: HTMLElement | null;
  atelier: HTMLElement | null;
}): void {
  const course = document.documentElement.scrollHeight - window.innerHeight;
  if (course <= 0) return;

  const finDe = (el: HTMLElement | null, repli: number) => {
    if (!el) return repli;
    const haut = el.getBoundingClientRect().top + window.scrollY;
    return clamp01((haut + el.offsetHeight) / course);
  };

  const finPortail = finDe(sections.portail, 0.07);
  const finDescente = Math.max(finPortail + 0.01, finDe(sections.descente, 0.36));
  const finAtelier = Math.max(finDescente + 0.01, finDe(sections.atelier, 0.46));

  ACTES.portail = [0, finPortail];
  ACTES.descente = [finPortail, finDescente];
  ACTES.atelier = [finDescente, finAtelier];
  ACTES.sortie = [finAtelier, 1];
}

export function acteDepuisProgression(p: number): Acte {
  if (p < ACTES.portail[1]) return "portail";
  if (p < ACTES.descente[1]) return "descente";
  if (p < ACTES.atelier[1]) return "atelier";
  return "sortie";
}

/* -------------------------------------------------------------------------- */
/*  L'état mutable                                                             */
/* -------------------------------------------------------------------------- */

type EtatScene = {
  /** Progression de scroll sur toute la page, 0 → 1. */
  progression: number;
  /** Pointeur normalisé -1 → 1 sur chaque axe, déjà lissé. */
  pointeurX: number;
  pointeurY: number;
  /** Cible du lissage : le pointeur brut. */
  cibleX: number;
  cibleY: number;
  /** Secondes écoulées depuis le montage — pilote l'animation d'entrée. */
  temps: number;
  /** Recette courante, reflétée par la scène. */
  recette: Recette;
  /** Vrai quand l'utilisateur a demandé moins d'animations. */
  mouvementReduit: boolean;
};

/**
 * Instance unique. Mutable et lue directement par `useFrame` : c'est
 * délibéré, et c'est la seule zone du projet où l'on s'autorise ça.
 */
export const scene: EtatScene = {
  progression: 0,
  pointeurX: 0,
  pointeurY: 0,
  cibleX: 0,
  cibleY: 0,
  temps: 0,
  recette: RECETTE_INITIALE,
  mouvementReduit: false,
};

/* -------------------------------------------------------------------------- */
/*  Abonnements (uniquement pour ce qui doit re-rendre)                        */
/* -------------------------------------------------------------------------- */

const abonnesActe = new Set<() => void>();
const abonnesRecette = new Set<() => void>();

let acteCourant: Acte = "portail";

/** Appelé par le suiveur de scroll. Ne notifie qu'au changement d'acte. */
export function setProgression(p: number): void {
  scene.progression = p;
  const suivant = acteDepuisProgression(p);
  if (suivant !== acteCourant) {
    acteCourant = suivant;
    for (const f of abonnesActe) f();
  }
}

export function setRecette(r: Recette): void {
  scene.recette = r;
  for (const f of abonnesRecette) f();
}

export function setPointeur(x: number, y: number): void {
  scene.cibleX = x;
  scene.cibleY = y;
}

/**
 * L'acte courant, sous forme d'état React.
 *
 * `useSyncExternalStore` plutôt qu'un `useState` + effet : pas de rendu
 * intermédiaire incohérent, et le rendu serveur reçoit « portail », l'acte
 * de départ, ce qui évite un saut à l'hydratation.
 */
export function useActe(): Acte {
  return React.useSyncExternalStore(
    (f) => {
      abonnesActe.add(f);
      return () => abonnesActe.delete(f);
    },
    () => acteCourant,
    () => "portail" as Acte,
  );
}

export function useRecette(): Recette {
  return React.useSyncExternalStore(
    (f) => {
      abonnesRecette.add(f);
      return () => abonnesRecette.delete(f);
    },
    () => scene.recette,
    () => RECETTE_INITIALE,
  );
}

/* -------------------------------------------------------------------------- */
/*  Utilitaires d'interpolation                                                */
/* -------------------------------------------------------------------------- */

/** Progression locale à l'intérieur d'un acte, 0 → 1. */
export function dansActe(p: number, acte: Acte): number {
  const [a, b] = ACTES[acte];
  return clamp01((p - a) / (b - a));
}

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/* -------------------------------------------------------------------------- */
/*  Couleur de fond, pilotée par le scroll                                     */
/* -------------------------------------------------------------------------- */

/**
 * Le fond de page, du kraft au crème.
 *
 * ⚠️ DEUX VERSIONS ONT ÉTÉ ESSAYÉES AVANT CELLE-CI.
 *   1. Fond presque noir partout. Retour client : « beaucoup trop noir ».
 *   2. Fond brun brûlé qui s'éclaircissait pendant la descente. Mieux, mais
 *      les deux premiers écrans — c'est-à-dire la première impression —
 *      restaient sombres.
 *
 * Version actuelle : le site est CLAIR de bout en bout. On part d'un kraft
 * légèrement plus soutenu et on s'éclaircit vers le crème, ce qui garde une
 * progression et un peu de profondeur sans jamais tomber dans le noir. Le seul
 * bloc réellement sombre du site est le pied de page.
 *
 * C'est aussi ce qui donne à la nourriture sa gourmandise : sur fond sombre un
 * plat est en vitrine, sur fond chaud il est sur une table.
 *
 * ⚠️ Ces valeurs doivent rester synchronisées avec `--carton` et `--creme`
 * dans `app/globals.css`. Elles sont écrites en clair ici parce que la boucle
 * de rendu WebGL en a besoin sous forme de nombres, soixante fois par seconde,
 * et que relire une variable CSS à chaque image coûterait un recalcul de style.
 */
const FOND_SOMBRE: [number, number, number] = [0xf2, 0xe2, 0xc9];
const FOND_CLAIR: [number, number, number] = [0xff, 0xf7, 0xec];

/** Fraction de la descente déjà éclaircie, 0 → 1. */
export function eclaircissement(p: number): number {
  return adoucir(clamp01(dansActe(p, "descente")));
}

/** Couleur de fond courante, en composantes 0 → 255. */
export function couleurFond(p: number): [number, number, number] {
  const t = eclaircissement(p);
  return [
    Math.round(lerp(FOND_SOMBRE[0], FOND_CLAIR[0], t)),
    Math.round(lerp(FOND_SOMBRE[1], FOND_CLAIR[1], t)),
    Math.round(lerp(FOND_SOMBRE[2], FOND_CLAIR[2], t)),
  ];
}

/** Courbe douce aux deux extrémités — évite les départs et arrêts secs. */
export const adoucir = (t: number) => t * t * (3 - 2 * t);

/**
 * Part de chaque acte consommée par le mouvement ; le reste est un maintien.
 *
 * Deux actes ne doivent pas étaler leur déplacement sur toute leur durée :
 *   atelier  le visiteur doit voir ce qu'il compose dès son arrivée sur le
 *            configurateur, pas une fois la section quittée ;
 *   sortie   elle couvre la moitié basse de la page — un recul réparti sur
 *            dix écrans donne un mouvement permanent et imperceptible
 *            derrière un texte qu'on lit, le pire des deux mondes.
 */
export const VITESSE_ACTES: Record<Acte, number> = {
  portail: 1,
  descente: 1,
  atelier: 0.25,
  sortie: 0.33,
};

/**
 * Avancement lissé d'un acte, 0 → 1.
 *
 * ⚠️ POINT UNIQUE DE VÉRITÉ pour la caméra ET pour le contenu du bowl.
 * Tant que les deux calculaient leur avancement chacun de leur côté, ils
 * dérivaient : la caméra était ressortie du bowl alors que les ingrédients
 * flottaient encore à trois unités au-dessus, et le bowl paraissait vide.
 */
export function avancement(p: number, acte: Acte): number {
  return adoucir(clamp01(dansActe(p, acte) / VITESSE_ACTES[acte]));
}
