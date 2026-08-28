import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Plus } from "lucide-react";
import { toast } from "sonner";
import { menuCategories } from "@/lib/business";
import { useCart } from "@/lib/cart";
import { Reveal } from "./Reveal";

const parsePrice = (priceStr: string) => parseInt(priceStr.replace(/[^0-9]/g, ""), 10);

export function MenuSection({
  heading = "The Menu",
  intro = "The full menu is being digitised from the restaurant's own card. Item names, descriptions and prices appear here exactly as they are on it — nothing is filled in until then.",
  showCta = true,
}: {
  heading?: string;
  intro?: string;
  showCta?: boolean;
}) {
  const [active, setActive] = useState(menuCategories[0]?.id || "");
  const current = menuCategories.find((c) => c.id === active) ?? menuCategories[0] ?? { id: "empty", label: "Empty", items: [] };
  const { addItem } = useCart();

  return (
    <section id="menu" className="py-20 md:py-28">
      <div className="shell">
        <Reveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">Food</p>
            <h2 className="mt-4 text-[clamp(2.25rem,6vw,4.5rem)] uppercase">{heading}</h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground">{intro}</p>
        </Reveal>

        <div className="mt-12 -mx-5 overflow-x-auto px-5 hide-scrollbar md:mx-0 md:px-0">
          <div role="tablist" aria-label="Menu categories" className="flex min-w-max gap-8 border-b border-border">
            {menuCategories.map((cat) => {
              const isActive = cat.id === active;
              return (
                <button
                  key={cat.id}
                  role="tab"
                  type="button"
                  id={`tab-${cat.id}`}
                  aria-selected={isActive}
                  aria-controls={`panel-${cat.id}`}
                  onClick={() => setActive(cat.id)}
                  className={`relative -mb-px min-h-11 pb-3 text-sm font-semibold uppercase tracking-[0.16em] transition-colors ${
                    isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {cat.label}
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-0 bottom-0 h-0.5 origin-left bg-primary transition-transform ${
                      isActive ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        <div
          role="tabpanel"
          id={`panel-${current.id}`}
          aria-labelledby={`tab-${current.id}`}
          className="mt-10 grid gap-x-14 gap-y-8 md:grid-cols-2"
        >
          {current.items.map((item, i) => (
            <article key={i} className="border-b border-border pb-6">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-display text-lg font-bold uppercase tracking-tight">{item.name}</h3>
                <span
                  aria-hidden="true"
                  className="h-px flex-1 translate-y-[-2px] bg-border"
                />
                {item.price.includes("/") && (item.price.includes("H:") || item.price.includes("Half")) ? (
                  <div className="flex gap-2 text-xs font-semibold">
                    {item.price.split("/").map((part, index) => {
                      const isHalf = part.toLowerCase().includes("h");
                      const cleanPriceStr = part.replace(/[hf]:/gi, "").trim();
                      const priceNum = parsePrice(cleanPriceStr);
                      return (
                        <button 
                          key={index} 
                          onClick={() => {
                            addItem({
                              id: `${item.name}-${isHalf ? "Half" : "Full"}`,
                              name: item.name,
                              price: priceNum,
                              portion: isHalf ? "Half" : "Full"
                            });
                            toast.success(`Added ${isHalf ? "Half" : "Full"} ${item.name} to cart`);
                          }}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-secondary hover:bg-secondary/80 text-foreground text-[10px] tracking-wider uppercase border border-border/50 transition-colors group cursor-pointer"
                        >
                          <span className="text-muted-foreground group-hover:text-foreground transition-colors">{isHalf ? "Half" : "Full"}</span>
                          <span className="text-primary font-bold group-hover:text-primary transition-colors">{cleanPriceStr}</span>
                          <Plus className="size-3 text-muted-foreground group-hover:text-primary transition-colors" />
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <span className="font-display text-lg font-bold text-primary">{item.price}</span>
                    <button 
                      onClick={() => {
                        addItem({
                          id: item.name,
                          name: item.name,
                          price: parsePrice(item.price)
                        });
                        toast.success(`Added ${item.name} to cart`);
                      }}
                      className="inline-flex items-center justify-center size-7 rounded-sm bg-secondary hover:bg-secondary/80 border border-border/50 text-foreground transition-colors group cursor-pointer"
                      aria-label={`Add ${item.name} to cart`}
                    >
                      <Plus className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </button>
                  </div>
                )}
              </div>
              {item.description && (
                <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
              )}
            </article>
          ))}
        </div>

        <p className="mt-8 text-xs uppercase tracking-[0.16em] text-muted-foreground">
          Prices are in INR. Portion availability (Half / Full) as indicated.
        </p>

        {showCta && (
          <div className="mt-10">
            <Link
              to="/menu"
              className="group inline-flex min-h-13 items-center gap-2 border border-foreground/25 px-7 text-xs font-semibold uppercase tracking-[0.18em] transition-colors hover:border-primary hover:text-primary"
            >
              Explore full menu
              <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
