import { forwardRef, useCallback, type KeyboardEvent } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type BestSellingToggleProps = {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
  loading?: boolean;
  id?: string;
  ariaLabel?: string;
  ariaLabelledBy?: string;
};

export const BestSellingToggle = forwardRef<HTMLButtonElement, BestSellingToggleProps>(
  ({ checked, onChange, disabled = false, loading = false, id, ariaLabel, ariaLabelledBy }, ref) => {
    const isInteractive = !disabled && !loading;

    const handleToggle = useCallback(() => {
      if (isInteractive) {
        onChange();
      }
    }, [isInteractive, onChange]);

    const handleKeyDown = useCallback(
      (event: KeyboardEvent<HTMLButtonElement>) => {
        if (event.key === " " || event.key === "Enter") {
          event.preventDefault();
          handleToggle();
        }
      },
      [handleToggle],
    );

    return (
      <button
        ref={ref}
        type="button"
        id={id}
        role="switch"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-checked={checked}
  aria-disabled={!isInteractive ? "true" : undefined}
  aria-busy={loading ? "true" : undefined}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        disabled={!isInteractive}
        className={cn(
          "best-selling-toggle group relative inline-flex h-8 w-16 items-center justify-center rounded-full border border-white/10 bg-transparent p-1.5 transition",
          "focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          isInteractive ? "cursor-pointer hover:bg-muted/60" : "cursor-not-allowed opacity-70",
        )}
  data-disabled={!isInteractive ? "true" : undefined}
  data-loading={loading ? "true" : undefined}
  data-checked={checked ? "true" : undefined}
      >
        <span
          className={cn(
            "relative flex h-5 w-full items-center rounded-full border border-white/10 transition-colors",
            checked
              ? "bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-500 text-white"
              : "bg-slate-500/70 text-slate-900 dark:bg-slate-600/80 dark:text-slate-50",
            isInteractive && checked && "group-hover:from-emerald-400 group-hover:via-emerald-300 group-hover:to-emerald-400",
            isInteractive && !checked && "group-hover:bg-slate-500",
          )}
        >
          <span
            aria-hidden
            className="pointer-events-none absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-[0_3px_6px_rgba(15,23,42,0.35)] transition-all"
            style={{ left: checked ? "calc(100% - 1.25rem)" : "0.25rem" }}
          />
        </span>
        {loading && (
          <span className="absolute inset-0 flex items-center justify-center" aria-hidden>
            <Loader2 className="h-4 w-4 animate-spin text-current" />
          </span>
        )}
      </button>
    );
  },
);

BestSellingToggle.displayName = "BestSellingToggle";
