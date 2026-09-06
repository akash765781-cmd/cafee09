import { Utensils, Calendar, ShoppingBag } from "lucide-react";
import { business } from "@/lib/business";
import { HoursCard } from "./HoursCard";
import { Reveal } from "./Reveal";
import { Link } from "@tanstack/react-router";
import interiorImg from "@/assets/interior.jpg";

export function LocationSection({ withHours = true }: { withHours?: boolean }) {
  return (
    <section id="location" className="py-20 md:py-28">
      <div className="shell">
        <Reveal className="max-w-2xl">
          <p className="eyebrow">Experience</p>
          <h2 className="mt-4 text-[clamp(2.25rem,6vw,4.5rem)] uppercase">
            Atmospheric Dining &amp; Hospitality
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-12">
          <Reveal className="md:col-span-7">
            <div className="relative h-full overflow-hidden border border-border bg-card">
              <img
                src={interiorImg}
                alt="UK 09 Dining Room"
                className="h-80 w-full object-cover grayscale-[0.2] contrast-[1.05] md:h-full md:min-h-[26rem]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent flex items-end p-6">
                <div className="space-y-1">
                  <span className="text-xs uppercase font-mono tracking-widest text-primary font-bold">
                    Dine-in • Events • Curated Tastings
                  </span>
                  <p className="text-lg font-bold text-foreground">
                    Reserve your table for lunch, evening dinners, and private gatherings.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          <div className="flex flex-col gap-6 md:col-span-5">
            <Reveal delay={60} className="border border-border bg-card p-7 md:p-9">
              <h3 className="font-display text-xl font-bold uppercase tracking-tight">UK 09</h3>
              <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
                <p>
                  Experience handcrafted recipes, artisanal parathas, savory Chinese delicacies, and rich main courses prepared fresh to order.
                </p>
                <p className="text-xs uppercase tracking-[0.16em] text-primary font-semibold">
                  Open Daily • Dine-in &amp; Takeaway
                </p>
              </div>
              <div className="mt-7 flex flex-col gap-3">
                <Link
                  to="/order"
                  className="inline-flex min-h-13 items-center justify-center gap-2 bg-primary px-6 text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground transition-opacity hover:opacity-90"
                >
                  <Calendar aria-hidden="true" className="size-4" />
                  Reserve a Table
                </Link>
                <Link
                  to="/menu"
                  className="inline-flex min-h-13 items-center justify-center gap-2 border border-foreground/25 px-6 text-xs font-semibold uppercase tracking-[0.18em] transition-colors hover:border-foreground"
                >
                  <Utensils aria-hidden="true" className="size-4" />
                  Explore Digital Menu
                </Link>
              </div>
            </Reveal>

            {withHours && (
              <Reveal delay={120}>
                <HoursCard />
              </Reveal>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
