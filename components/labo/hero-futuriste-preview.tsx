"use client";

import * as React from "react";
import dynamic from "next/dynamic";

import { Hero } from "@/components/home/hero";

/* ---------------------------------------------------------------------------
 * Enveloppe de l'expérience « hero futuriste ».
 *
 * Trois garde-fous, dans cet ordre :
 *  1. le composant WebGPU n'est chargé qu'à la demande (`ssr: false`) — il
 *     tire environ 1,3 Mo de Three.js, hors du bundle des autres pages ;
 *  2. le support WebGPU est testé pour de vrai (`requestAdapter()`), et pas
 *     seulement par la présence de `navigator.gpu` : un adaptateur peut être
 *     refusé sur une carte graphique sur liste noire ;
 *  3. toute erreur au montage (init du renderer, chargement des textures)
 *     est rattrapée par une frontière d'erreur.
 *
 * Dans les trois cas de repli, c'est le hero statique actuel qui s'affiche —
 * jamais un écran vide. Il est aussi affiché pendant la détection, ce qui
 * évite un temps mort au chargement.
 * ------------------------------------------------------------------------- */

const HeroFuturistic = dynamic(
  () => import("@/components/ui/hero-futuristic").then((m) => m.HeroFuturistic),
  { ssr: false, loading: () => <Hero /> },
);

type Support = "detection" | "disponible" | "indisponible";

/** Surface minimale de l'API WebGPU dont on a besoin — évite d'ajouter
 *  `@webgpu/types` juste pour une détection de support. */
type ApiGpu = { requestAdapter: () => Promise<unknown | null> };

/** Frontière d'erreur : si le rendu 3D casse, on retombe sur le hero statique. */
class LimiteErreur extends React.Component<
  { children: React.ReactNode; secours: React.ReactNode; onErreur: (e: Error) => void },
  { enErreur: boolean }
> {
  state = { enErreur: false };

  static getDerivedStateFromError() {
    return { enErreur: true };
  }

  componentDidCatch(error: Error) {
    this.props.onErreur(error);
  }

  render() {
    return this.state.enErreur ? this.props.secours : this.props.children;
  }
}

export function HeroFuturistePreview() {
  const [support, setSupport] = React.useState<Support>("detection");
  const [messageErreur, setMessageErreur] = React.useState<string | null>(null);

  React.useEffect(() => {
    let annule = false;

    const detecter = async () => {
      const gpu = (navigator as Navigator & { gpu?: ApiGpu }).gpu;
      if (!gpu) {
        if (!annule) setSupport("indisponible");
        return;
      }
      try {
        const adaptateur = await gpu.requestAdapter();
        if (!annule) setSupport(adaptateur ? "disponible" : "indisponible");
      } catch {
        if (!annule) setSupport("indisponible");
      }
    };

    void detecter();
    return () => {
      annule = true;
    };
  }, []);

  return (
    <>
      {/* Bandeau de diagnostic : cette page n'existe que pour arbitrer. */}
      <div className="bg-ink text-cream fixed inset-x-0 top-20 z-[80] px-5 py-2 text-center text-xs">
        {support === "detection" && "Détection du support WebGPU…"}
        {support === "disponible" && !messageErreur && "WebGPU disponible — rendu 3D actif."}
        {support === "indisponible" &&
          "WebGPU indisponible sur ce navigateur — repli sur le hero statique."}
        {messageErreur && `Erreur au rendu 3D — repli sur le hero statique (${messageErreur})`}
      </div>

      {support === "disponible" && !messageErreur ? (
        <LimiteErreur secours={<Hero />} onErreur={(e) => setMessageErreur(e.message)}>
          <HeroFuturistic />
        </LimiteErreur>
      ) : (
        <Hero />
      )}
    </>
  );
}
