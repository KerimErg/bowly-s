import type { Metadata } from "next";

import { Atelier } from "@/components/home/atelier";
import { PageHero } from "@/components/shared/page-hero";
import { BowlScene } from "@/components/three/bowl-scene";

export const metadata: Metadata = {
  title: "Composer son bowl",
  description:
    "Base, protéine, sauce, croustillant, extras : compose ton bowl et vois-le se construire.",
};

/**
 * Le configurateur, sur sa propre page.
 *
 * C'est le MÊME composant que sur l'accueil : une seule implémentation, donc
 * pas de version qui prend du retard sur l'autre. La scène 3D est montée ici
 * aussi — c'est la seule page intérieure qui la justifie, puisque tout
 * l'intérêt est de voir le bowl changer.
 *
 * ⚠️ La chorégraphie de caméra est calée sur les sections de l'accueil. Ici,
 * `#composer` est la seule section reconnue : les actes « portail » et
 * « descente » n'existent pas, la caméra reste donc sur le plan de l'atelier
 * du début à la fin — ce qui est exactement le cadrage voulu.
 */
export default function ComposerPage() {
  return (
    <>
      <BowlScene />
      <PageHero
        kicker="L'atelier"
        lignes={[
          <span key="1">Ton bowl.</span>,
          <span key="2" className="text-rouge-fonce">
            Tes règles.
          </span>,
        ]}
        chapo="Cinq étapes, une seule règle : le croustillant s'ajoute en dernier."
      />
      <Atelier />
    </>
  );
}
