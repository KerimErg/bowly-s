import * as React from "react";

import { Reveal } from "@/components/shared/reveal";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  /** Petite étiquette en capitales au-dessus du titre. */
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
  /** Niveau de titre — à ajuster pour garder une hiérarchie sémantique correcte. */
  as?: "h2" | "h3";
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  as: Tag = "h2",
}: SectionHeadingProps) {
  return (
    <Reveal
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? <p className="eyebrow mb-4">{eyebrow}</p> : null}
      <Tag className="text-display text-cream text-4xl sm:text-5xl lg:text-6xl">
        {title}
      </Tag>
      {description ? (
        <p className="text-muted-foreground mt-5 text-base leading-relaxed sm:text-lg">
          {description}
        </p>
      ) : null}
    </Reveal>
  );
}
