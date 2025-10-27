import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";
import { ButtonProps, buttonVariants } from "@/components/ui/button";

const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
  <nav
    role="navigation"
    aria-label="pagination"
    // allow extra bottom padding on small screens so fixed UI (eg. floating buttons)
    // don't overlap pagination; also center the nav and allow horizontal scroll/wrap
    // Ensure pagination sits above fixed floating elements (like WhatsApp bubble)
    // We avoid forcing extra bottom padding here; the admin hides floating bubbles
    // so the extra padding is not required. Keep high z-index so it's above fixed UI.
    // Use a sensible max-width and padding so the pagination never flows beyond
    // the main content container. Keep it centered and above floating UI.
    className={cn("mx-auto w-full max-w-screen-lg px-4 relative z-60", className)}
    {...props}
  />
);
Pagination.displayName = "Pagination";

const PaginationContent = React.forwardRef<HTMLUListElement, React.ComponentProps<"ul">>(
  ({ className, ...props }, ref) => (
    // Allow wrapping on very small screens and provide graceful overflow when
    // necessary. This mirrors a robust pagination used by many frameworks
    // (Angular/Bootstrap): centered, compact, and responsive.
    <ul
      ref={ref}
      className={cn(
        // Prevent wrapping so pagination stays on a single line on small
        // screens; allow horizontal scrolling when content overflows.
        "flex flex-row flex-nowrap items-center gap-2 justify-center overflow-x-auto px-2 py-2",
        className,
      )}
      {...props}
    />
  ),
);
PaginationContent.displayName = "PaginationContent";

const PaginationItem = React.forwardRef<HTMLLIElement, React.ComponentProps<"li">>(({ className, ...props }, ref) => (
  // Inline-block ensures items respect container boundaries and wrap neatly
  // instead of causing unexpected overflow.
  <li ref={ref} className={cn("inline-block", className)} {...props} />
));
PaginationItem.displayName = "PaginationItem";

type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<ButtonProps, "size"> &
  React.ComponentProps<"a">;

/*
  Keep pagination link box dimensions stable between active/inactive states.
  The UI applied different button variants which could change border/padding
  and cause the row to reflow when toggling active state. To avoid layout
  shift we enforce a consistent box model:
    - fixed height (h-9)
    - minimum width so digits don't reflow
    - use box-border and border-2 on all links (inactive links use transparent border)
    - center content with flex
*/
const PaginationLink = ({ className, isActive, size = "icon", ...props }: PaginationLinkProps) => (
  <a
    aria-current={isActive ? "page" : undefined}
    className={cn(
      // preserve existing button styles but enforce stable sizing/layout
      buttonVariants({
        variant: isActive ? "outline" : "ghost",
        size,
      }),
      // stable layout helpers
      "h-9 min-w-[36px] flex items-center justify-center box-border border-2",
      // make inactive borders transparent so visual change doesn't affect layout
      !isActive && "border-transparent",
      className,
    )}
    {...props}
  />
);
PaginationLink.displayName = "PaginationLink";

const PaginationPrevious = ({ className, ...props }: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink aria-label="Go to previous page" size="default" className={cn("gap-1 pl-2.5", className)} {...props}>
    <ChevronLeft className="h-4 w-4" />
    <span>Previous</span>
  </PaginationLink>
);
PaginationPrevious.displayName = "PaginationPrevious";

const PaginationNext = ({ className, ...props }: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink aria-label="Go to next page" size="default" className={cn("gap-1 pr-2.5", className)} {...props}>
    <span>Next</span>
    <ChevronRight className="h-4 w-4" />
  </PaginationLink>
);
PaginationNext.displayName = "PaginationNext";

const PaginationEllipsis = ({ className, ...props }: React.ComponentProps<"span">) => (
  <span aria-hidden className={cn("flex h-9 w-9 items-center justify-center", className)} {...props}>
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
);
PaginationEllipsis.displayName = "PaginationEllipsis";

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};
