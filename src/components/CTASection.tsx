import { MapPin, MessageCircle, Phone } from "lucide-react";
import { business } from "@/lib/business";
import { Reveal } from "./Reveal";

export function CTASection() {
  return (
    <section className="bg-cream py-20 text-cream-foreground md:py-28">
      <Reveal className="shell">
        <p className="eyebrow text-cream-foreground/60">Visit</p>
        <h2 className="mt-4 max-w-4xl text-[clamp(2.25rem,7vw,5.5rem)] uppercase">
          Your Table. Your People. Your Evening.
        </h2>
        <p className="mt-6 max-w-lg text-base leading-relaxed text-cream-foreground/75 md:text-lg">
          Drop by UK 09 in Bathinda and make your next meal part of the evening.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <a
            href={business.directionsHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-13 items-center justify-center gap-2 bg-primary px-7 text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground transition-opacity hover:opacity-90"
          >
            <MapPin aria-hidden="true" className="size-4" />
            Get directions
          </a>
          <a
            href={business.phoneHref}
            className="inline-flex min-h-13 items-center justify-center gap-2 border border-cream-foreground/25 px-7 text-xs font-semibold uppercase tracking-[0.18em] transition-colors hover:border-cream-foreground"
          >
            <Phone aria-hidden="true" className="size-4" />
            Call {business.phoneDisplay}
          </a>
          <a
            href={business.whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-13 items-center justify-center gap-2 px-2 text-xs font-semibold uppercase tracking-[0.18em] text-cream-foreground/70 transition-colors hover:text-cream-foreground"
          >
            <MessageCircle aria-hidden="true" className="size-4" />
            WhatsApp us
          </a>
        </div>
      </Reveal>
    </section>
  );
}
