import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex w-fit items-center justify-center gap-1.5 rounded-full text-[0.65rem] font-bold tracking-[0.18em] uppercase [&_svg]:size-3",
  {
    variants: {
      variant: {
        /* Texte encre sur aplat chaud : le blanc n'y tient pas le AA. */
        default: "bg-brand text-ink px-3 py-1",
        crisp: "bg-crisp text-ink px-3 py-1",
        outline: "border-line-strong text-bone-dim border px-3 py-1",
        muted: "bg-void-3 text-bone-dim px-3 py-1",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";
  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
