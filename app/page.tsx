import { Atelier } from "@/components/home/atelier";
import { Casting } from "@/components/home/casting";
import { Cinema } from "@/components/home/cinema";
import { Descente } from "@/components/home/descente";
import { Effet } from "@/components/home/effet";
import { NextBowl } from "@/components/home/next-bowl";
import { Partout } from "@/components/home/partout";
import { Portail } from "@/components/home/portail";
import { BowlScene } from "@/components/three/bowl-scene";

/**
 * Page d'accueil — le parcours complet.
 *
 * ⚠️ L'ORDRE ET LA HAUTEUR DES SECTIONS SONT LA CHORÉGRAPHIE.
 * La caméra 3D est pilotée par la progression de scroll globale, découpée en
 * actes dans `lib/stage.ts`. Ces bornes sont calées sur la hauteur des blocs
 * ci-dessous : un écran pour le portail, quatre pour la descente, environ un
 * et demi pour l'atelier. Déplacer une section ou changer sa hauteur sans
 * revenir dans `ACTES` désaligne la caméra du texte.
 *
 * Le récit :
 *   PORTAIL   on découvre un objet dans le noir, les ingrédients y tombent
 *   DESCENTE  la caméra plonge dedans, chaque couche traversée est une section
 *   ATELIER   on remonte en plan serré, le visiteur compose le bowl lui-même
 *   CASTING   les bowls existants, présentés comme des personnages
 *   CINÉMA    quatre plans plein cadre, un mot chacun — donner faim
 *   EFFET     l'ambition, sans un seul chiffre inventé
 *   PARTOUT   le mur social, en maquette assumée
 *   NEXT      le teasing des éditions limitées
 */
export default function HomePage() {
  return (
    <>
      <BowlScene />
      <Portail />
      <Descente />
      <Atelier />
      <Casting />
      <Cinema />
      <Effet />
      <Partout />
      <NextBowl />
    </>
  );
}
