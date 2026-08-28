import { createFileRoute } from "@tanstack/react-router";
import { OrderFormSection } from "@/components/OrderFormSection";
import { CTASection } from "@/components/CTASection";

const title = "Order Online — UK 09 Restaurant, Bathinda";
const description =
  "Place and track your order online at UK 09. Fresh food delivered hot to your door in Bathinda.";

export const Route = createFileRoute("/order")({
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
  component: OrderPage,
});

function OrderPage() {
  return (
    <div className="pt-20 md:pt-24">
      <OrderFormSection />
      <CTASection />
    </div>
  );
}
