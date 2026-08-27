"use client";

import * as React from "react";
import dynamic from "next/dynamic";

import Image from "next/image";

import { calerActes, setPointeur, setProgression, scene as pilote } from "@/lib/stage";
import { useQualite, type Qualite } from "@/lib/capacites";
import { visuelsBowls } from "@/lib/assets";

/**
 * La couche 3D du site.
 * ---------------------------------------------------------------------------
 * Un seul canvas, monté une fois, en `fixed` derrière toute la page. Les
 * sections HTML défilent par-dessus, sur fond transparent. C'est ce qui donne
 * la sensation d'un décor continu plutôt que d'une suite de blocs.
 *
 * TROIS NIVEAUX DE RENDU, décidés une fois au montage :
 *
 *   complete  WebGL2 + machine confortable   → scène entière
 *   legere    WebGL2 + machine modeste       → même scène, densité de pixels
 *                                              réduite et lampe d'appoint coupée
 *   aucune    pas de WebGL2, ou mouvement    → repli CSS, décrit plus bas
 *             réduit demandé
 *
 * LE REPLI N'EST PAS UN ÉCRAN VIDE. C'est la même composition — bowl centré,
 * halo chaud à gauche, halo froid à droite — construite avec l'illustration
 * SVG de la carte et deux dégradés. Un visiteur sans WebGL voit une page
 * finie, pas une page cassée.
 */

/**
 * Le canvas est chargé à part : Three.js pèse plusieurs centaines de kilo-
 * octets, et une machine qui tombe en repli ne doit jamais les télécharger.
 * `ssr: false` est obligatoire — WebGL n'existe pas au rendu serveur.
 */
const Canvas3D = dynamic(() => import("./bowl-canvas").then((m) => m.BowlCanvas), {
  ssr: false,
  loading: () => null,
});

/* -------------------------------------------------------------------------- */
/*  Repli CSS                                                                  */
/* -------------------------------------------------------------------------- */

function ReplitStatique() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="ember absolute top-[42%] left-[8%] h-[70vmin] w-[70vmin] -translate-y-1/2 rounded-full blur-3xl" />
      <div className="ember-cold absolute top-[24%] right-[6%] h-[52vmin] w-[52vmin] rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 aspect-square w-[min(74vmin,640px)] -translate-x-1/2 -translate-y-1/2">
        <Image
          src={visuelsBowls["the-og"].src}
          alt=""
          fill
          // Ce visuel est le premier grand élément affiché quand la 3D est
          // écartée : il porte le LCP, il ne doit pas être différé.
          priority
          sizes="(max-width: 900px) 74vw, 640px"
          className="object-contain opacity-90"
        />
      </div>
      <div className="from-void absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t to-transparent" />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Suiveur de scroll et de pointeur                                           */
/* -------------------------------------------------------------------------- */

/**
 * Alimente le pilote partagé.
 *
 * Le scroll est lu dans un `requestAnimationFrame` plutôt que directement
 * dans l'écouteur : lire `scrollY` sur chaque événement force le navigateur
 * à recalculer la mise en page (« layout thrashing ») et fait chuter le
 * défilement sur mobile.
 */
function useSuiveur(actif: boolean) {
  React.useEffect(() => {
    if (!actif) return;

    let frame = 0;
    let enAttente = false;

    const mesurer = () => {
      enAttente = false;
      const course = document.documentElement.scrollHeight - window.innerHeight;
      setProgression(course > 0 ? window.scrollY / course : 0);
    };

    /* Recalage des actes sur la hauteur réelle des sections. Refait à chaque
       redimensionnement : changer la largeur change le nombre de lignes des
       titres, donc la hauteur des blocs, donc les bornes. */
    const caler = () => {
      calerActes({
        portail: document.getElementById("portail"),
        descente: document.getElementById("descente"),
        atelier: document.getElementById("composer"),
      });
      mesurer();
    };

    const auScroll = () => {
      if (enAttente) return;
      enAttente = true;
      frame = window.requestAnimationFrame(mesurer);
    };

    const auPointeur = (e: PointerEvent) => {
      setPointeur(
        (e.clientX / window.innerWidth) * 2 - 1,
        -((e.clientY / window.innerHeight) * 2 - 1),
      );
    };

    // Le pointeur revient au centre quand il quitte la fenêtre, sinon la
    // caméra reste bloquée dans un coin.
    const auDepart = () => setPointeur(0, 0);

    caler();
    /* Les polices web changent la hauteur des titres en arrivant : sans ce
       second calage, les bornes restent celles du texte de repli. */
    if (document.fonts?.ready) void document.fonts.ready.then(caler);

    window.addEventListener("scroll", auScroll, { passive: true });
    window.addEventListener("resize", caler, { passive: true });
    window.addEventListener("pointermove", auPointeur, { passive: true });
    document.addEventListener("pointerleave", auDepart);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", auScroll);
      window.removeEventListener("resize", caler);
      window.removeEventListener("pointermove", auPointeur);
      document.removeEventListener("pointerleave", auDepart);
    };
  }, [actif]);
}

/* -------------------------------------------------------------------------- */

export function BowlScene() {
  /* Au rendu serveur et à la première image, `useQualite` renvoie « aucune » :
     le HTML initial contient donc le repli statique. Sur une machine capable,
     le vrai niveau arrive juste après l'hydratation et le canvas se pose
     par-dessus. Aucun octet de Three.js ne part vers un navigateur qui n'en
     veut pas. */
  const qualite = useQualite();
  const actif = qualite !== "aucune";

  /* Le pilote de la scène a besoin de savoir si l'on est en mode sobre : il en
     dépend pour couper la rotation continue et la parallaxe. On l'écrit hors
     rendu, dans un effet, parce que c'est un système externe à React. */
  React.useEffect(() => {
    pilote.mouvementReduit = !actif;
  }, [actif]);

  useSuiveur(actif);

  if (!actif) {
    return <ReplitStatique />;
  }

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
      {/* Ambiance peinte en CSS derrière le canvas : elle reste visible si le
          contexte WebGL est perdu en cours de route (onglet en arrière-plan
          trop longtemps, pilote graphique qui redémarre). */}
      <div className="ember absolute top-[46%] left-[4%] h-[64vmin] w-[64vmin] -translate-y-1/2 rounded-full opacity-70 blur-3xl" />
      <div className="ember-cold absolute top-[18%] right-[4%] h-[46vmin] w-[46vmin] rounded-full opacity-70 blur-3xl" />
      <Canvas3D qualite={qualite as Exclude<Qualite, "aucune">} />
      <div className="from-void/90 absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t to-transparent" />
    </div>
  );
}
