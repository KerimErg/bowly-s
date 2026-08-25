import { BestSellers } from "@/components/home/best-sellers";
import { Hero } from "@/components/home/hero";
import { LocationsTeaser } from "@/components/home/locations-teaser";
import { NewsletterCta } from "@/components/home/newsletter-cta";
import { StoryTeaser } from "@/components/home/story-teaser";
import { Testimonials } from "@/components/home/testimonials";
import { WhyBowlys } from "@/components/home/why-bowlys";

/**
 * Page d'accueil.
 * L'ordre des sections suit le parcours voulu : donner envie (hero),
 * rassurer (piliers), faire saliver (carousel best-sellers), incarner
 * (histoire), rassurer encore (avis), situer (localisation), convertir (CTA).
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <WhyBowlys />
      <BestSellers />
      <StoryTeaser />
      <Testimonials />
      <LocationsTeaser />
      <NewsletterCta />
    </>
  );
}
