import { Utensils, Calendar, ShoppingBag } from "lucide-react";
import { business } from "@/lib/business";
import { Reveal } from "./Reveal";
import { Link } from "@tanstack/react-router";

export function CTASection() {
  return (
    <section className="bg-cream py-20 text-cream-foreground md:py-28">
      <Reveal className="shell">
        <p className="eyebrow text-cream-foreground/60">Reserve &amp; Dine</p>
        <h2 className="mt-4 max-w-4xl text-[clamp(2.25rem,7vw,5.5rem)] uppercase">
          Your Table. Your People. Your Evening.
        </h2>
        <p className="mt-6 max-w-lg text-base leading-relaxed text-cream-foreground/75 md:text-lg">
          Join us at UK 09 and make your next dining experience unforgettable.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link
            to="/order"
            className="inline-flex min-h-13 items-center justify-center gap-2 bg-primary px-7 text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Calendar aria-hidden="true" className="size-4" />
            Reserve a Table
          </Link>
          <Link
            to="/menu"
            className="inline-flex min-h-13 items-center justify-center gap-2 border border-cream-foreground/25 px-7 text-xs font-semibold uppercase tracking-[0.18em] transition-colors hover:border-cream-foreground"
          >
            <Utensils aria-hidden="true" className="size-4" />
            Explore Full Menu
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
