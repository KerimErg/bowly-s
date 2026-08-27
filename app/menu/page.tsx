import type { Metadata } from "next";

import { Carte } from "@/components/menu/carte";
import { PageHero } from "@/components/shared/page-hero";

export const metadata: Metadata = {
  title: "La carte",
  description:
    "Sept bowls, cinq sauces maison, un croustillant ajouté en dernier. Découvrez la carte Bowly's.",
};

export default function MenuPage() {
  return (
    <>
      <PageHero
        kicker="La carte"
        lignes={[
          <span key="1">Sept bowls.</span>,
          <span key="2" className="text-rouge-fonce">
            Sept caractères.
          </span>,
        ]}
        chapo="Aucun n'a été conçu pour plaire à tout le monde. C'est le principe."
      />
      <Carte />
    </>
  );
}
