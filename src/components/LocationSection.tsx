import { MapPin, Phone } from "lucide-react";
import { business } from "@/lib/business";
import { HoursCard } from "./HoursCard";
import { Reveal } from "./Reveal";

export function LocationSection({ withHours = true }: { withHours?: boolean }) {
  return (
    <section id="location" className="py-20 md:py-28">
      <div className="shell">
        <Reveal className="max-w-2xl">
          <p className="eyebrow">Find us</p>
          <h2 className="mt-4 text-[clamp(2.25rem,6vw,4.5rem)] uppercase">
            Green City Road,
            <br />
            Bathinda
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-12">
          <Reveal className="md:col-span-7">
            <div className="h-full border border-border bg-card p-2">
              <iframe
                title="Map showing UK 09 on Green City Road, Bathinda"
                src={business.mapEmbedSrc}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-80 w-full grayscale-[0.35] contrast-[1.05] md:h-full md:min-h-[26rem]"
              />
            </div>
          </Reveal>

          <div className="flex flex-col gap-6 md:col-span-5">
            <Reveal delay={60} className="border border-border bg-card p-7 md:p-9">
              <h3 className="font-display text-xl font-bold uppercase tracking-tight">UK 09</h3>
              <address className="mt-4 space-y-3 text-sm not-italic leading-relaxed text-muted-foreground">
                <p>{business.address}</p>
                <p className="text-xs uppercase tracking-[0.16em]">{business.plusCode}</p>
              </address>
              <div className="mt-7 flex flex-col gap-3">
                <a
                  href={business.directionsHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-13 items-center justify-center gap-2 bg-primary px-6 text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground transition-opacity hover:opacity-90"
                >
                  <MapPin aria-hidden="true" className="size-4" />
                  Get directions
                </a>
                <a
                  href={business.phoneHref}
                  className="inline-flex min-h-13 items-center justify-center gap-2 border border-foreground/25 px-6 text-xs font-semibold uppercase tracking-[0.18em] transition-colors hover:border-foreground"
                >
                  <Phone aria-hidden="true" className="size-4" />
                  Call {business.phoneDisplay}
                </a>
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
