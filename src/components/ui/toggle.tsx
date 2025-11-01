import * as React from "react";
import * as TogglePrimitive from "@radix-ui/react-toggle";

import { cn } from "@/lib/utils";
import { toggleVariants, type ToggleVariantProps } from "./toggle-variants";

type ToggleProps = React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> & ToggleVariantProps;

const Toggle = React.forwardRef<React.ElementRef<typeof TogglePrimitive.Root>, ToggleProps>(
  ({ className, variant, size, ...props }, ref) => (
    <TogglePrimitive.Root ref={ref} className={cn(toggleVariants({ variant, size, className }))} {...props} />
  ),
);

Toggle.displayName = TogglePrimitive.Root.displayName;

export { Toggle };
export type { ToggleProps };
