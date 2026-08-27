import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/Hero";
import { InfoStrip } from "@/components/InfoStrip";
import { MenuSection } from "@/components/MenuSection";
import { FoodFeature } from "@/components/FoodFeature";
import { AboutSection } from "@/components/AboutSection";
import { Gallery } from "@/components/Gallery";
import { ReviewsSection } from "@/components/ReviewsSection";
import { LocationSection } from "@/components/LocationSection";
import { CTASection } from "@/components/CTASection";
import { business } from "@/lib/business";

const title = "UK 09 — Restaurant in Bathinda, Punjab";
const description =
  "UK 09 is a dine-in restaurant on Green City Road, Bathinda. Good food, a cozy atmosphere and friendly service, open daily 10 AM–11 PM.";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: "UK 09",
  telephone: "+917657815775",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Green City Rd, inside Hotel Green In, opposite Park View Resorts, National Colony",
    addressLocality: "Bathinda",
    addressRegion: "Punjab",
    postalCode: "151001",
    addressCountry: "IN",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "10:00",
      closes: "23:00",
    },
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: business.rating,
    reviewCount: business.reviewCount,
  },
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(jsonLd) }],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <Hero />
      <InfoStrip />
      <MenuSection heading="Featured Menu" />
      <FoodFeature />
      <AboutSection />
      <Gallery />
      <ReviewsSection />
      <LocationSection />
      <CTASection />
    </>
  );
}
