import type { Metadata } from "next";

import { HeroFuturistePreview } from "@/components/labo/hero-futuriste-preview";

/**
 * Page de test du hero WebGPU — hors navigation, non indexée.
 * Le hero de l'accueil n'est pas touché tant que cette expérience n'est pas
 * validée. Pour l'abandonner : supprimer `app/labo/`, `components/labo/` et
 * `components/ui/hero-futuristic.*`, puis désinstaller three, @react-three/fiber
 * et @react-three/drei.
 */
export const metadata: Metadata = {
  title: "Labo — hero futuriste",
  description: "Page de test interne du hero WebGPU. Non destinée au public.",
  robots: { index: false, follow: false },
};

export default function HeroFuturistePage() {
  return <HeroFuturistePreview />;
}
