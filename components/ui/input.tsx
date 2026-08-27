import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "border-trait text-encre bg-beurre flex h-12 w-full rounded-xl border px-4 py-2 text-base transition-colors duration-200 outline-none",
        "placeholder:text-encre-faible",
        "hover:border-trait-fort focus-visible:border-rouge focus-visible:ring-crisp/30 focus-visible:ring-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/30",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
