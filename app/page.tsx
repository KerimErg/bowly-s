import { BestSellers } from "@/components/home/best-sellers";
import { FinalCta } from "@/components/home/final-cta";
import { Hero } from "@/components/home/hero";
import { LocationsTeaser } from "@/components/home/locations-teaser";
import { WhyBowlys } from "@/components/home/why-bowlys";

/**
 * Page d'accueil, volontairement courte.
 *
 * Cinq blocs, dont trois portés par la photo : donner faim (hero), quatre
 * raisons en une ligne (accroche), faire saliver (best-sellers), situer
 * (localisation), convertir (CTA).
 *
 * Retirés lors de la simplification : teaser « Notre histoire », avis clients
 * et formulaire newsletter — trois blocs de texte qui repoussaient la
 * nourriture vers le bas de page.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <WhyBowlys />
      <BestSellers />
      <LocationsTeaser />
      <FinalCta />
    </>
  );
}
