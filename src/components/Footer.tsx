import { Link } from "@tanstack/react-router";
import { Wordmark } from "./Wordmark";
import { business, navLinks } from "@/lib/business";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background pb-28 pt-16 md:pb-16">
      <div className="shell grid gap-12 md:grid-cols-[1.4fr_1fr_1.4fr]">
        <div>
          <Link to="/" className="text-2xl" aria-label="UK 09 — home">
            <Wordmark />
          </Link>
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            Premier dine-in restaurant. Authentic cuisine &amp; hospitality, every day {business.hoursShort}.
          </p>
        </div>

        <nav aria-label="Footer">
          <h2 className="eyebrow">Navigate</h2>
          <ul className="mt-4 space-y-2.5">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="eyebrow">Services &amp; Hours</h2>
          <div className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <p>Dine-In • Takeaway • Online Orders</p>
            <p>Open daily {business.hoursFull}</p>
            <p className="text-xs uppercase tracking-wider text-primary font-bold">5.0 ★ Rated Dining Experience</p>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/order"
              className="border border-border px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] transition-colors hover:border-primary hover:text-primary"
            >
              Order Online
            </Link>
            <Link
              to="/menu"
              className="border border-border px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] transition-colors hover:border-primary hover:text-primary"
            >
              Digital Menu
            </Link>
          </div>
        </div>
      </div>

      <div className="shell mt-14 flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} UK 09. All rights reserved.</p>
        <p>Open daily {business.hoursFull}</p>
      </div>
    </footer>
  );
}
