import interiorImg from "@/assets/interior.jpg";
import { business } from "@/lib/business";
import { Reveal } from "./Reveal";

export function AboutSection() {
  return (
    <section className="bg-cream py-20 text-cream-foreground md:py-28">
      <div className="shell grid items-center gap-12 md:grid-cols-12">
        <Reveal className="md:col-span-5">
          <div className="overflow-hidden">
            <img
              src={interiorImg}
              alt="Dining table set with linen, glassware and a candle under warm pendant light"
              width={1200}
              height={1504}
              loading="lazy"
              className="aspect-[4/5] w-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
        </Reveal>

        <Reveal delay={80} className="md:col-span-6 md:col-start-7">
          <p className="eyebrow text-cream-foreground/60">About UK 09</p>
          <h2 className="mt-4 text-[clamp(2rem,5vw,3.75rem)] uppercase">
            A Place to Eat,
            <br />
            Relax &amp; Stay Awhile
          </h2>
          <p className="mt-6 max-w-lg leading-relaxed text-cream-foreground/75">
            UK 09 is a dine-in restaurant in Bathinda built around enjoyable food, a comfortable
            atmosphere and friendly service.
          </p>
          <p className="mt-4 max-w-lg leading-relaxed text-cream-foreground/75">
            You'll find it on Green City Road — inside Hotel Green In, opposite Park View Resorts,
            National Colony. Doors open every day from {business.hoursFull}.
          </p>

          <dl className="mt-10 grid grid-cols-2 gap-6 border-t border-cream-foreground/15 pt-8 sm:grid-cols-3">
            <div>
              <dt className="eyebrow text-cream-foreground/55">Service</dt>
              <dd className="mt-1.5 font-display text-lg font-bold">Dine-in</dd>
            </div>
            <div>
              <dt className="eyebrow text-cream-foreground/55">Rating</dt>
              <dd className="mt-1.5 font-display text-lg font-bold">
                {business.rating} ★ · {business.reviewCount}
              </dd>
            </div>
            <div>
              <dt className="eyebrow text-cream-foreground/55">Hours</dt>
              <dd className="mt-1.5 font-display text-lg font-bold">{business.hoursShort}</dd>
            </div>
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
