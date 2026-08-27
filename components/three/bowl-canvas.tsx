"use client";

import * as React from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";

import { BowlRig } from "./bowl-rig";
import type { Qualite } from "@/lib/capacites";

/**
 * Le contexte WebGL et rien d'autre.
 *
 * Ce fichier est la seule frontière entre React et Three.js : il est importé
 * dynamiquement pour que le poids de Three ne parte jamais sur une machine
 * qui tombe en repli.
 */

/**
 * Suspend la boucle de rendu quand l'onglet passe en arrière-plan.
 *
 * Sans ça, un onglet oublié continue de faire tourner le GPU : c'est la
 * première cause de batterie vidée sur les sites à scène 3D. `useFrame` ne
 * tourne plus dès que `frameloop` passe à « never ».
 */
function useBoucleVisible(): "always" | "never" {
  const visible = React.useSyncExternalStore(
    (notifier) => {
      document.addEventListener("visibilitychange", notifier);
      return () => document.removeEventListener("visibilitychange", notifier);
    },
    () => !document.hidden,
    () => true,
  );

  return visible ? "always" : "never";
}

export function BowlCanvas({ qualite }: { qualite: Exclude<Qualite, "aucune"> }) {
  const frameloop = useBoucleVisible();
  const leger = qualite === "legere";

  return (
    <Canvas
      frameloop={frameloop}
      // Plafond de densité de pixels. Au-delà de 1,75 le gain est invisible
      // et le coût de remplissage explose sur les écrans à forte densité.
      dpr={leger ? 1 : [1, 1.75]}
      gl={{
        antialias: !leger,
        alpha: true,
        powerPreference: leger ? "low-power" : "high-performance",
        // Le contexte ne survit pas toujours à une mise en veille ; le
        // laisser échouer proprement vaut mieux qu'un écran noir.
        failIfMajorPerformanceCaveat: false,
      }}
      // La caméra est ensuite pilotée image par image par `BowlRig`.
      camera={{ position: [0, 3.5, 6.6], fov: 42, near: 0.1, far: 60 }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        // Exposition neutre. Au-dessus de 1, ACES sature les rouges et le
        // riz vire au rose : vérifié, c'était le cas à 1,15.
        gl.toneMappingExposure = 1.0;
      }}
      style={{ position: "absolute", inset: 0 }}
    >
      <BowlRig qualite={qualite} />
    </Canvas>
  );
}
