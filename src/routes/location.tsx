import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { LocationSection } from "@/components/LocationSection";
import { InfoStrip } from "@/components/InfoStrip";
import { CTASection } from "@/components/CTASection";

const title = "Location & Hours — UK 09, Bathinda";
const description =
  "Find UK 09 on Green City Rd, inside Hotel Green In, opposite Park View Resorts, National Colony, Bathinda 151001. Open daily 10 AM–11 PM.";

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
        eyebrow="Visit"
        title="Where to Find UK 09"
        intro="Green City Rd, inside Hotel Green In, opposite Park View Resorts, National Colony, Bathinda, Punjab 151001."
      />
      <InfoStrip />
      <LocationSection />
      <CTASection />
    </>
  );
}
