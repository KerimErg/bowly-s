import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex w-fit items-center justify-center gap-1.5 rounded-full font-display text-[0.65rem] font-bold tracking-[0.18em] uppercase [&_svg]:size-3",
  {
    variants: {
      variant: {
        default: "bg-brand px-3 py-1 text-ink",
        outline: "border border-brand/50 px-3 py-1 text-brand",
        muted: "border border-cream/15 bg-cream/5 px-3 py-1 text-sand",
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
