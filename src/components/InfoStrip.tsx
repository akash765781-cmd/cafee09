import { business } from "@/lib/business";

const cells = [
  { label: "Open daily", value: business.hoursShort },
  { label: "Dine-in", value: "Available" },
  { label: "Location", value: `${business.city}, ${business.state}` },
  { label: "Call", value: business.phoneDisplay, href: business.phoneHref },
];

export function InfoStrip() {
  return (
    <section aria-label="Essential information" className="border-y border-border bg-card">
      <ul className="shell grid grid-cols-2 divide-border md:grid-cols-4 md:divide-x">
        {cells.map((cell, i) => (
          <li
            key={cell.label}
            className={`px-1 py-6 md:px-8 md:py-8 ${i % 2 === 0 ? "" : "border-l border-border md:border-l-0"} ${
              i < 2 ? "border-b border-border md:border-b-0" : ""
            } ${i % 2 === 1 ? "pl-5" : ""}`}
          >
            <p className="eyebrow">{cell.label}</p>
            {cell.href ? (
              <a
                href={cell.href}
                className="mt-2 block font-display text-lg font-bold tracking-tight transition-colors hover:text-primary md:text-xl"
              >
                {cell.value}
              </a>
            ) : (
              <p className="mt-2 font-display text-lg font-bold tracking-tight md:text-xl">
                {cell.value}
              </p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
