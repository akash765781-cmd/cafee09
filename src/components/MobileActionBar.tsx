import { Link } from "@tanstack/react-router";
import { MapPin, Phone, ShoppingBag } from "lucide-react";
import { business } from "@/lib/business";

export function MobileActionBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-border bg-background/95 backdrop-blur-sm md:hidden">
      <a
        href={business.phoneHref}
        className="flex min-h-14 flex-col items-center justify-center gap-1 text-[0.6rem] font-semibold uppercase tracking-wider text-muted-foreground"
      >
        <Phone aria-hidden="true" className="size-3.5" />
        Call
      </a>
      <Link
        to="/menu"
        className="flex min-h-14 flex-col items-center justify-center gap-1 border-x border-border text-[0.6rem] font-semibold uppercase tracking-wider text-muted-foreground"
      >
        <ShoppingBag aria-hidden="true" className="size-3.5" />
        Menu
      </Link>
      <a
        href={business.directionsHref}
        target="_blank"
        rel="noreferrer"
        className="flex min-h-14 flex-col items-center justify-center gap-1 text-[0.6rem] font-semibold uppercase tracking-wider text-muted-foreground"
      >
        <MapPin aria-hidden="true" className="size-3.5" />
        Map
      </a>
    </div>
  );
}
