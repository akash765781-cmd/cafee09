import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { AboutSection } from "@/components/AboutSection";
import { Gallery } from "@/components/Gallery";
import { FoodFeature } from "@/components/FoodFeature";
import { CTASection } from "@/components/CTASection";

const title = "About UK 09 — Dine-in Restaurant in Bathinda";
const description =
  "UK 09 is a dine-in restaurant inside Hotel Green In on Green City Road, Bathinda — built around good food, a comfortable room and friendly service.";

export const Route = createFileRoute("/about")({
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
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="A Place to Eat, Relax & Stay Awhile"
        intro="A dine-in restaurant in Bathinda, open every day from 10 AM to 11 PM."
      />
      <AboutSection />
      <FoodFeature />
      <Gallery />
      <CTASection />
    </>
  );
}
