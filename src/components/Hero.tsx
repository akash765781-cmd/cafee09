import { Link } from "@tanstack/react-router";
import { ArrowRight, MapPin } from "lucide-react";
import heroImg from "@/assets/hero.jpg";
import { business } from "@/lib/business";

export function Hero() {
  return (
    <section className="grain relative flex min-h-[92svh] items-end overflow-hidden pb-14 pt-32 md:min-h-screen md:pb-20">
      <img
        src={heroImg}
        alt="Warmly lit restaurant dining room with set tables and amber pendant lighting"
        width={1920}
        height={1280}
        fetchPriority="high"
        className="absolute inset-0 size-full object-cover"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/35"
      />

      <div className="shell relative">
        <p className="eyebrow">
          {business.city} • Dining &amp; Food
        </p>
        <h1 className="mt-5 max-w-4xl text-[clamp(2.75rem,9vw,7rem)] uppercase">
          Good Food.
          <br />
          Great Vibe.{" "}
          <span className="text-primary">UK 09.</span>
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
          A welcoming dine-in destination in Bathinda for flavorful food, relaxed moments and time
          well spent with friends and family.
        </p>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            to="/menu"
            className="group inline-flex min-h-13 items-center justify-center gap-2 bg-primary px-7 text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground transition-opacity hover:opacity-90"
          >
            View menu
            <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <a
            href={business.directionsHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-13 items-center justify-center gap-2 border border-foreground/25 px-7 text-xs font-semibold uppercase tracking-[0.18em] transition-colors hover:border-foreground"
          >
            <MapPin aria-hidden="true" className="size-4" />
            Get directions
          </a>
        </div>

        <p className="mt-8 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Open daily • {business.hoursShort}
        </p>
      </div>
    </section>
  );
}
