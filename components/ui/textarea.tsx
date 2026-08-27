import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-line text-ink flex min-h-32 w-full rounded-xl border bg-white px-4 py-3 text-base transition-colors duration-200 outline-none",
        "placeholder:text-bone-faint",
        "hover:border-line-strong focus-visible:border-crisp focus-visible:ring-crisp/30 focus-visible:ring-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/30",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
