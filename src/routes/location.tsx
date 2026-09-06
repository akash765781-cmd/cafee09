import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { LocationSection } from "@/components/LocationSection";
import { InfoStrip } from "@/components/InfoStrip";
import { CTASection } from "@/components/CTASection";

const title = "Dining & Hours — UK 09";
const description =
  "Visit UK 09 for fine dining, appetizing multicuisine menus, and comfortable ambiance. Open daily 10 AM–11 PM.";

export const Route = createFileRoute("/location")({
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
  component: LocationPage,
});

function LocationPage() {
  return (
    <>
      <PageHeader
        eyebrow="Dining"
        title="Experience UK 09"
        intro="Enjoy premium dine-in service, savory gourmet dishes, and private dining arrangements open daily 10 AM–11 PM."
      />
      <InfoStrip />
      <LocationSection />
      <CTASection />
    </>
  );
}
