"use client";

import * as React from "react";

/**
 * Détection des capacités du navigateur.
 *
 * POURQUOI `useSyncExternalStore` PLUTÔT QU'UN EFFET
 * Le réflexe est d'écrire `useState(false)` puis un `useEffect` qui détecte et
 * appelle `setState`. Ça marche, mais ça produit un rendu supplémentaire à
 * chaque montage et React le signale désormais comme une erreur
 * (`react-hooks/set-state-in-effect`) : un effet sert à synchroniser React
 * AVEC un système externe, pas à recopier l'état de ce système dans React.
 *
 * `useSyncExternalStore` est fait exactement pour ça : on lui donne de quoi
 * s'abonner et de quoi lire, il gère le reste — y compris le rendu serveur,
 * où l'on renvoie toujours la valeur la plus prudente.
 */

/* -------------------------------------------------------------------------- */
/*  Media queries                                                              */
/* -------------------------------------------------------------------------- */

/**
 * Suit une media query et se met à jour quand elle change.
 *
 * Le suivi n'est pas un détail : un utilisateur peut activer « réduire les
 * animations » ou brancher une souris sur une tablette pendant la visite.
 * Une détection unique au montage laisserait l'interface dans le mauvais
 * mode jusqu'au rechargement.
 *
 * Au rendu serveur, la réponse est toujours `false` — donc pas de curseur
 * personnalisé, pas d'animation : le choix le plus sûr par défaut.
 */
export function useMediaQuery(query: string): boolean {
  const abonner = React.useCallback(
    (notifier: () => void) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", notifier);
      return () => mq.removeEventListener("change", notifier);
    },
    [query],
  );

  return React.useSyncExternalStore(
    abonner,
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/** Raccourcis nommés — évite de recopier la chaîne de la requête partout. */
export const useMouvementReduit = () => useMediaQuery("(prefers-reduced-motion: reduce)");
export const usePointeurFin = () => useMediaQuery("(pointer: fine)");

/* -------------------------------------------------------------------------- */
/*  Capacité graphique                                                         */
/* -------------------------------------------------------------------------- */

export type Qualite = "complete" | "legere" | "aucune";

/** `deviceMemory` n'est pas dans les types standards mais existe sur Chrome. */
type NavigateurEtendu = Navigator & { deviceMemory?: number };

/**
 * Résultat mémoïsé de la détection.
 *
 * Le test crée un contexte WebGL, ce qui n'est pas gratuit et consomme un des
 * rares contextes autorisés par le navigateur. Il ne doit donc s'exécuter
 * qu'une fois par chargement de page — d'où ce cache de module, indispensable
 * puisque `getSnapshot` peut être appelé à chaque rendu.
 */
let cache: Qualite | null = null;

function detecter(): Qualite {
  if (cache !== null) return cache;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    cache = "aucune";
    return cache;
  }

  const sonde = document.createElement("canvas");
  const gl = sonde.getContext("webgl2");
  if (!gl) {
    cache = "aucune";
    return cache;
  }
  // Libération immédiate : le contexte de test ne doit pas rester ouvert.
  gl.getExtension("WEBGL_lose_context")?.loseContext();

  const nav = navigator as NavigateurEtendu;
  const coeurs = nav.hardwareConcurrency ?? 4;
  const memoire = nav.deviceMemory ?? 4;
  const petitEcran = window.matchMedia("(max-width: 900px)").matches;

  cache = coeurs <= 4 || memoire <= 4 || petitEcran ? "legere" : "complete";
  return cache;
}

/**
 * Niveau de rendu 3D adapté à la machine.
 *
 * Le serveur renvoie toujours « aucune » : le HTML initial contient donc le
 * repli statique, et le canvas ne vient se poser par-dessus qu'après
 * l'hydratation, sur les machines qui le supportent. C'est ce qui garantit
 * qu'aucun octet de Three.js ne part vers un navigateur qui n'en veut pas.
 */
export function useQualite(): Qualite {
  return React.useSyncExternalStore(
    // Aucun abonnement : la décision est prise une fois et ne change plus.
    // En changer en cours de visite ferait clignoter toute la page.
    () => () => {},
    detecter,
    () => "aucune" as Qualite,
  );
}
