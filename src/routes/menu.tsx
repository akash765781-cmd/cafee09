import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { MenuSection } from "@/components/MenuSection";
import { CTASection } from "@/components/CTASection";

const title = "Menu — UK 09 Restaurant, Bathinda";
const description =
  "Browse the menu at UK 09, a dine-in restaurant in Bathinda, Punjab. Categories and prices are published directly from the restaurant's own menu.";

export const Route = createFileRoute("/menu")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MenuPage,
});

function MenuPage() {
  return (
    <>
      <PageHeader
        eyebrow="Bathinda • Dine-in"
        title="The Menu"
        intro="Browse our selection of authentic Punjabi dishes, starters, and beverages, published directly from our official menu card."
      />
      <MenuSection heading="By Category" showCta={false} intro="Pick a category to see our dishes. Every item and price is published directly from our printed menu." />
      <CTASection />
    </>
  );
}
