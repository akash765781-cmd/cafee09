import g1 from "@/assets/gallery-1.jpg";
import g2 from "@/assets/gallery-2.jpg";
import g3 from "@/assets/gallery-3.jpg";
import g4 from "@/assets/gallery-4.jpg";
import { Reveal } from "./Reveal";

const tandoori = {
  src: g1,
  alt: "Char-grilled tandoori chicken on a hot cast iron platter with lemon",
  w: 1200,
  h: 912,
};
const naan = {
  src: g2,
  alt: "Hands tearing fresh naan bread over a dark table by candlelight",
  w: 1008,
  h: 1200,
};
const drinks = {
  src: g3,
  alt: "Two chilled drinks with ice and lime on a dark counter",
  w: 1200,
  h: 912,
};
const curry = {
  src: g4,
  alt: "Creamy curry served in a copper bowl with coriander",
  w: 1200,
  h: 1200,
};

export function Gallery() {
  return (
    <section className="py-20 md:py-28">
      <div className="shell">
        <Reveal className="max-w-2xl">
          <p className="eyebrow">Atmosphere</p>
          <h2 className="mt-4 text-[clamp(2.25rem,6vw,4.5rem)] uppercase">More Than a Meal</h2>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground">
            A relaxed place to gather, eat well and enjoy the evening.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-4 md:grid-cols-12 md:gap-6">
          <Reveal className="md:col-span-7">
            <figure className="overflow-hidden">
              <img
                src={tandoori.src}
                alt={tandoori.alt}
                width={tandoori.w}
                height={tandoori.h}
                loading="lazy"
                className="aspect-[4/3] w-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </figure>
          </Reveal>
          <Reveal delay={60} className="md:col-span-5 md:mt-16">
            <figure className="overflow-hidden">
              <img
                src={naan.src}
                alt={naan.alt}
                width={naan.w}
                height={naan.h}
                loading="lazy"
                className="aspect-[4/5] w-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </figure>
          </Reveal>
          <Reveal delay={40} className="md:col-span-5 md:-mt-8">
            <figure className="overflow-hidden">
              <img
                src={curry.src}
                alt={curry.alt}
                width={curry.w}
                height={curry.h}
                loading="lazy"
                className="aspect-square w-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </figure>
          </Reveal>
          <Reveal delay={100} className="md:col-span-7">
            <figure className="overflow-hidden">
              <img
                src={drinks.src}
                alt={drinks.alt}
                width={drinks.w}
                height={drinks.h}
                loading="lazy"
                className="aspect-[16/10] w-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </figure>
          </Reveal>
        </div>

        <p className="mt-8 text-xs uppercase tracking-[0.16em] text-muted-foreground">
          Placeholder imagery — awaiting the restaurant's own photography.
        </p>
      </div>
    </section>
  );
}
