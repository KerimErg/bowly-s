import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "border-line text-ink flex h-12 w-full rounded-xl border bg-white px-4 py-2 text-base transition-colors duration-200 outline-none",
        "placeholder:text-ink-soft/70",
        "hover:border-ink/25 focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/35",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/30",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
