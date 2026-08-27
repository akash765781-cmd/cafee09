import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { ReviewsSection } from "@/components/ReviewsSection";
import { CTASection } from "@/components/CTASection";
import { business } from "@/lib/business";

const title = "Reviews — UK 09 Restaurant, Bathinda";
const description = `UK 09 holds a ${business.rating} star rating from ${business.reviewCount} Google reviews, with diners in Bathinda highlighting the food, atmosphere and service.`;

export const Route = createFileRoute("/reviews")({
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
  component: ReviewsPage,
});

function ReviewsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Reviews"
        title="Loved by Diners in Bathinda"
        intro={`${business.rating} ★ from ${business.reviewCount} Google reviews.`}
      />
      <ReviewsSection />
      <CTASection />
    </>
  );
}
