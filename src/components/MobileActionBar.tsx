import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MapPin, Phone, ShoppingBag } from "lucide-react";
import { business } from "@/lib/business";
import { useCart } from "@/lib/cart";
import { getStoreClosedServer } from "@/lib/db";

export function MobileActionBar() {
  const { itemCount } = useCart();
  const [isStoreClosed, setIsStoreClosed] = useState(false);

  useEffect(() => {
    getStoreClosedServer()
      .then((closed) => setIsStoreClosed(closed))
      .catch(() => {});

    const interval = setInterval(() => {
      getStoreClosedServer()
        .then((closed) => setIsStoreClosed(closed))
        .catch(() => {});
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-border bg-background/95 backdrop-blur-sm md:hidden">
      <a
        href={business.phoneHref}
        className="flex min-h-14 flex-col items-center justify-center gap-1 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground"
      >
        <Phone aria-hidden="true" className="size-4" />
        Call
      </a>
      <Link
        to="/menu"
        className="flex min-h-14 flex-col items-center justify-center gap-1 border-x border-border text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground"
      >
        <ShoppingBag aria-hidden="true" className="size-4" />
        Menu
      </Link>
      <Link
        to="/order"
        className={`relative flex min-h-14 flex-col items-center justify-center gap-1 border-r border-border text-[0.65rem] font-semibold uppercase tracking-[0.14em] transition-colors ${
          isStoreClosed
            ? "bg-destructive text-destructive-foreground"
            : "bg-primary text-primary-foreground"
        }`}
      >
        <div className="relative">
          <ShoppingBag aria-hidden="true" className="size-4" />
          {itemCount > 0 && !isStoreClosed && (
            <span className="absolute -top-1.5 -right-2 flex size-3.5 items-center justify-center rounded-full bg-foreground text-[8px] font-bold text-background">
              {itemCount}
            </span>
          )}
        </div>
        {isStoreClosed ? "Closed" : "Order"}
      </Link>
      <a
        href={business.directionsHref}
        target="_blank"
        rel="noreferrer"
        className="flex min-h-14 flex-col items-center justify-center gap-1 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground"
      >
        <MapPin aria-hidden="true" className="size-4" />
        Map
      </a>
    </div>
  );
}
