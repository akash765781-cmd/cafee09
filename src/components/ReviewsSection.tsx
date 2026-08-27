import { useState, useEffect } from "react";
import { Star, MessageSquarePlus } from "lucide-react";
import { toast } from "sonner";
import { business, reviewThemes } from "@/lib/business";
import { Reveal } from "./Reveal";

interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
}

const initialReviews: Review[] = [
  {
    id: "1",
    name: "Ramanpreet Singh",
    rating: 5,
    comment: "Undoubtedly one of the best family dining spots on Green City Road! The Paneer Butter Masala was super rich and perfectly spiced. Very friendly staff and cozy interior.",
    date: "2026-08-20",
  },
  {
    id: "2",
    name: "Karan Sharma",
    rating: 5,
    comment: "The Tandoori Chicken Tikka here is top-notch, highly recommend it. Prices are very reasonable for the portions and the atmosphere is excellent. Will definitely order again!",
    date: "2026-08-24",
  },
  {
    id: "3",
    name: "Mehak Kaur",
    rating: 5,
    comment: "Amazing experience! The Butter Chicken was delicious and the garlic naan was so soft. The service was prompt and the vibe is perfect for a weekend dinner with friends.",
    date: "2026-08-25",
  },
  {
    id: "4",
    name: "Rajesh Kumar",
    rating: 4,
    comment: "Great quality food, very neat and clean ambiance inside Hotel Green In. We ordered veg noodles and cheese chilli, both were flavorful. 4.5/5 overall.",
    date: "2026-08-26",
  },
];

export function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);

  // Hydrate from localStorage after mount to avoid SSR mismatch
  useEffect(() => {
    const saved = localStorage.getItem("uk09_reviews");
    if (saved) {
      try {
        setReviews(JSON.parse(saved));
      } catch {
        // ignore malformed data
      }
    }
  }, []);

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter your name.");
      return;
    }

    if (!comment.trim()) {
      toast.error("Please write a comment for your review.");
      return;
    }

    const newReview: Review = {
      id: Date.now().toString(),
      name: name.trim(),
      rating,
      comment: comment.trim(),
      date: new Date().toISOString().split("T")[0],
    };

    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);
    localStorage.setItem("uk09_reviews", JSON.stringify(updatedReviews));

    // Reset Form
    setName("");
    setComment("");
    setRating(5);

    toast.success("Review submitted! Thank you for your feedback.");
  };

  return (
    <section className="border-y border-border bg-card py-20 md:py-28">
      <div className="shell">
        {/* Header Summary */}
        <Reveal className="grid gap-10 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <p className="eyebrow">Reviews</p>
            <h2 className="mt-4 text-[clamp(2.25rem,6vw,4.5rem)] uppercase">
              Loved by Diners
              <br />
              in Bathinda
            </h2>
          </div>
          <div className="md:col-span-5">
            <div className="flex items-center gap-3">
              <span className="font-display text-5xl font-extrabold leading-none">{business.rating}</span>
              <span className="flex gap-0.5" aria-hidden="true">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} className="size-4 fill-primary text-primary" />
                ))}
              </span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              {business.rating} ★ · {business.reviewCount} Google reviews
            </p>
            <a
              href={business.mapsListingHref}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-block border-b border-primary pb-0.5 text-xs font-semibold uppercase tracking-[0.16em] text-primary"
            >
              View Google reviews
            </a>
          </div>
        </Reveal>

        {/* Highlights List */}
        <ul className="mt-14 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {reviewThemes.map((item, i) => (
            <Reveal as="li" key={item.theme} delay={i * 60} className="bg-card p-6 md:p-8">
              <p className="eyebrow text-primary text-[10px]">Recurring theme</p>
              <h3 className="mt-3 font-display text-xl font-bold uppercase tracking-tight">
                {item.theme}
              </h3>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{item.note}</p>
            </Reveal>
          ))}
        </ul>

        {/* Divider */}
        <div className="my-20 border-t border-border/60" />

        {/* Form and List Grid */}
        <div className="grid gap-16 lg:grid-cols-12">
          {/* Write a Review Form */}
          <div className="lg:col-span-5">
            <Reveal>
              <div className="flex items-center gap-3">
                <MessageSquarePlus className="size-6 text-primary" />
                <h3 className="font-display text-2xl font-bold uppercase tracking-tight">Write a Review</h3>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Your experience matters! Share your thoughts on our food, ambiance, and service.
              </p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                {/* Rating Selector */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                    Your Rating
                  </label>
                  <div className="flex gap-1.5">
                    {Array.from({ length: 5 }, (_, idx) => {
                      const starValue = idx + 1;
                      const isLit = hoverRating !== null ? starValue <= hoverRating : starValue <= rating;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setRating(starValue)}
                          onMouseEnter={() => setHoverRating(starValue)}
                          onMouseLeave={() => setHoverRating(null)}
                          className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
                          aria-label={`Rate ${starValue} stars`}
                        >
                          <Star
                            className={`size-8 transition-colors ${
                              isLit ? "fill-primary text-primary" : "text-muted-foreground/30 hover:text-muted-foreground/50"
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Name Input */}
                <div>
                  <label htmlFor="reviewer-name" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="reviewer-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full bg-background border border-border focus:border-primary px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 rounded-sm focus:outline-none transition-colors"
                  />
                </div>

                {/* Comment Textarea */}
                <div>
                  <label htmlFor="reviewer-comment" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    Review Details
                  </label>
                  <textarea
                    id="reviewer-comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Describe your dining or ordering experience..."
                    className="w-full bg-background border border-border focus:border-primary px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 rounded-sm focus:outline-none transition-colors h-36 resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full flex items-center justify-center min-h-12 bg-primary hover:bg-primary/95 text-primary-foreground font-semibold px-6 text-xs uppercase tracking-[0.16em] transition-colors rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  Submit Review
                </button>
              </form>
            </Reveal>
          </div>

          {/* Customer Reviews List */}
          <div className="lg:col-span-7">
            <Reveal>
              <h3 className="font-display text-2xl font-bold uppercase tracking-tight">Diner Feedback</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Read direct reviews and testimonials shared by customers who visited UK 09.
              </p>
            </Reveal>

            <div className="mt-8 space-y-6 max-h-[580px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-border/40 scrollbar-track-transparent">
              {reviews.length === 0 ? (
                <p className="text-sm text-muted-foreground py-8 text-center border border-dashed border-border rounded">
                  No reviews submitted yet. Be the first to write a review!
                </p>
              ) : (
                reviews.map((rev) => (
                  <Reveal key={rev.id} className="bg-background border border-border/80 hover:border-border p-6 rounded-sm transition-all duration-300">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="font-semibold text-foreground text-sm leading-tight">{rev.name}</h4>
                        <div className="flex gap-0.5 mt-1.5" aria-label={`${rev.rating} stars`}>
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star
                              key={i}
                              className={`size-3.5 ${
                                i < rev.rating ? "fill-primary text-primary" : "text-muted-foreground/20"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                        {rev.date}
                      </span>
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-muted-foreground/90 break-words">
                      {rev.comment}
                    </p>
                  </Reveal>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
