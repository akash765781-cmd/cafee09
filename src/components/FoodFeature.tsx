import featureImg from "@/assets/feature.jpg";
import { Reveal } from "./Reveal";

export function FoodFeature() {
  return (
    <section className="relative overflow-hidden">
      <div className="grain relative min-h-[70svh] md:min-h-[85svh]">
        <img
          src={featureImg}
          alt="Table spread of north Indian dishes including curries, grilled meats, rice and bread"
          width={1600}
          height={1008}
          loading="lazy"
          className="absolute inset-0 size-full object-cover"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-ink/65" />
        <div className="relative flex min-h-[70svh] items-center py-20 md:min-h-[85svh]">
          <Reveal className="shell">
            <p className="eyebrow">The table</p>
            <h2 className="mt-4 max-w-3xl text-[clamp(2.25rem,6.5vw,5rem)] uppercase">
              Made for cravings.
              <br />
              Made for sharing.
            </h2>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg">
              From casual meals to dinner with friends, UK 09 is designed around good food and an
              easygoing dining experience.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
