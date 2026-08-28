import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, Phone, X, ShoppingBag, ChevronDown } from "lucide-react";
import { Wordmark } from "./Wordmark";
import { business, navLinks } from "@/lib/business";
import { useCart } from "@/lib/cart";

export function Navbar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const overHero = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { itemCount } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const solid = scrolled || !overHero;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        solid ? "border-b border-border bg-background/92 backdrop-blur-sm" : "bg-transparent"
      }`}
    >
      <nav aria-label="Primary" className="shell flex h-16 items-center justify-between md:h-20">
        <Link to="/" className="text-xl md:text-2xl" aria-label="UK 09 — home">
          <Wordmark />
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.to}>
              {link.label === "Order" ? (
                <div className="relative group py-2">
                  <button className="flex items-center gap-1 text-sm font-medium tracking-wide text-muted-foreground transition-colors hover:text-foreground cursor-pointer">
                    Order <ChevronDown className="size-3.5 transition-transform group-hover:rotate-180" />
                  </button>
                  <div className="absolute top-full left-0 mt-1 w-48 bg-card border border-border rounded-sm shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 z-50 flex flex-col p-1">
                    <Link
                      to="/order"
                      search={{ tab: "order" }}
                      className="px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground hover:text-primary hover:bg-secondary rounded-sm transition-colors text-left"
                    >
                      Place Order
                    </Link>
                    <Link
                      to="/order"
                      search={{ tab: "track" }}
                      className="px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground hover:text-primary hover:bg-secondary rounded-sm transition-colors text-left"
                    >
                      Track &amp; Cancel Order
                    </Link>
                  </div>
                </div>
              ) : (
                <Link
                  to={link.to}
                  activeOptions={{ exact: link.to === "/" }}
                  activeProps={{ className: "text-foreground after:scale-x-100" }}
                  className="relative text-sm font-medium tracking-wide text-muted-foreground transition-colors after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-primary after:transition-transform hover:text-foreground hover:after:scale-x-100"
                >
                  {link.label}
                </Link>
              )}
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Link
            to="/order"
            className="relative hidden items-center gap-2 bg-secondary text-foreground border border-border px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] transition-colors hover:border-primary hover:text-primary md:inline-flex"
          >
            <ShoppingBag aria-hidden="true" className="size-3.5" />
            Order
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex size-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                {itemCount}
              </span>
            )}
          </Link>
          <a
            href={business.phoneHref}
            className="hidden items-center gap-2 bg-primary px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground transition-opacity hover:opacity-90 lg:inline-flex"
          >
            <Phone aria-hidden="true" className="size-3.5" />
            Call
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="inline-flex size-11 items-center justify-center border border-border text-foreground md:hidden"
          >
            {open ? <X aria-hidden="true" className="size-5" /> : <Menu aria-hidden="true" className="size-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div id="mobile-nav" className="border-t border-border bg-background md:hidden">
          <ul className="shell flex flex-col py-2">
            {navLinks.map((link) => (
              <li key={link.to}>
                {link.label === "Order" ? (
                  <div className="border-b border-border py-4">
                    <span className="block font-display text-2xl font-extrabold tracking-tight text-foreground/40 mb-2">
                      Order
                    </span>
                    <ul className="pl-4 border-l border-primary/50 my-1 space-y-2">
                      <li>
                        <Link
                          to="/order"
                          search={{ tab: "order" }}
                          activeProps={{ className: "text-primary" }}
                          className="block py-2 font-display text-xl font-bold tracking-tight text-muted-foreground hover:text-primary"
                        >
                          Place Order
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/order"
                          search={{ tab: "track" }}
                          activeProps={{ className: "text-primary" }}
                          className="block py-2 font-display text-xl font-bold tracking-tight text-muted-foreground hover:text-primary"
                        >
                          Track &amp; Cancel Order
                        </Link>
                      </li>
                    </ul>
                  </div>
                ) : (
                  <Link
                    to={link.to}
                    activeOptions={{ exact: link.to === "/" }}
                    activeProps={{ className: "text-primary" }}
                    className="block border-b border-border py-4 font-display text-2xl font-extrabold tracking-tight"
                  >
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
          <div className="shell grid grid-cols-2 gap-3 pb-5">
            <a
              href={business.phoneHref}
              className="flex min-h-12 items-center justify-center bg-primary text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground"
            >
              Call
            </a>
            <a
              href={business.directionsHref}
              target="_blank"
              rel="noreferrer"
              className="flex min-h-12 items-center justify-center border border-border text-xs font-semibold uppercase tracking-[0.16em]"
            >
              Directions
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
