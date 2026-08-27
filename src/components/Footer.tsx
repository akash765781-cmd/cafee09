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
            Restaurant in {business.city}, {business.state}. Dine-in, every day {business.hoursShort}.
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
          <h2 className="eyebrow">Visit &amp; contact</h2>
          <address className="mt-4 space-y-3 text-sm not-italic text-muted-foreground">
            <p className="max-w-sm">{business.address}</p>
            <p>
              <a href={business.phoneHref} className="text-foreground hover:text-primary">
                {business.phoneDisplay}
              </a>
            </p>
            <p>{business.plusCode}</p>
          </address>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={business.directionsHref}
              target="_blank"
              rel="noreferrer"
              className="border border-border px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] transition-colors hover:border-primary hover:text-primary"
            >
              Get directions
            </a>
            <a
              href={business.whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="border border-border px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] transition-colors hover:border-primary hover:text-primary"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>

      <div className="shell mt-14 flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} UK 09, Bathinda.</p>
        <p>Open daily {business.hoursFull}</p>
      </div>
    </footer>
  );
}
