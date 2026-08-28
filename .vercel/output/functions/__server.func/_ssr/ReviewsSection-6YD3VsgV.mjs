import { r as __toESM } from "../_runtime.mjs";
import { n as require_react, r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { i as reviewThemes, t as business } from "./business-DRQahRvE.mjs";
import { g as MessageSquarePlus, o as Star } from "../_libs/lucide-react.mjs";
import { n as Reveal } from "./CTASection-7wg4MTK-.mjs";
import { o as setReviewsServer, r as getReviewsServer } from "./db-BN3aOrq2.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ReviewsSection-6YD3VsgV.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var initialReviews = [
	{
		id: "1",
		name: "Ramanpreet Singh",
		rating: 5,
		comment: "Undoubtedly one of the best family dining spots on Green City Road! The Paneer Butter Masala was super rich and perfectly spiced. Very friendly staff and cozy interior.",
		date: "2026-08-20"
	},
	{
		id: "2",
		name: "Karan Sharma",
		rating: 5,
		comment: "The Tandoori Chicken Tikka here is top-notch, highly recommend it. Prices are very reasonable for the portions and the atmosphere is excellent. Will definitely order again!",
		date: "2026-08-24"
	},
	{
		id: "3",
		name: "Mehak Kaur",
		rating: 5,
		comment: "Amazing experience! The Butter Chicken was delicious and the garlic naan was so soft. The service was prompt and the vibe is perfect for a weekend dinner with friends.",
		date: "2026-08-25"
	},
	{
		id: "4",
		name: "Rajesh Kumar",
		rating: 4,
		comment: "Great quality food, very neat and clean ambiance inside Hotel Green In. We ordered veg noodles and cheese chilli, both were flavorful. 4.5/5 overall.",
		date: "2026-08-26"
	}
];
function ReviewsSection() {
	const [reviews, setReviews] = (0, import_react.useState)(initialReviews);
	(0, import_react.useEffect)(() => {
		const saved = localStorage.getItem("uk09_reviews");
		if (saved) try {
			setReviews(JSON.parse(saved));
		} catch {}
		const syncReviews = async () => {
			try {
				const serverReviews = await getReviewsServer();
				if (serverReviews && serverReviews.length > 0) {
					if (JSON.stringify(reviews) !== JSON.stringify(serverReviews)) {
						setReviews(serverReviews);
						localStorage.setItem("uk09_reviews", JSON.stringify(serverReviews));
					}
				}
			} catch (e) {
				console.error("Failed to sync reviews from server:", e);
			}
		};
		syncReviews();
		const interval = setInterval(syncReviews, 8e3);
		return () => clearInterval(interval);
	}, []);
	const [rating, setRating] = (0, import_react.useState)(5);
	const [hoverRating, setHoverRating] = (0, import_react.useState)(null);
	const [name, setName] = (0, import_react.useState)("");
	const [comment, setComment] = (0, import_react.useState)("");
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!name.trim()) {
			toast.error("Please enter your name.");
			return;
		}
		if (!comment.trim()) {
			toast.error("Please write a comment for your review.");
			return;
		}
		const updatedReviews = [{
			id: Date.now().toString(),
			name: name.trim(),
			rating,
			comment: comment.trim(),
			date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
		}, ...reviews];
		setReviews(updatedReviews);
		localStorage.setItem("uk09_reviews", JSON.stringify(updatedReviews));
		try {
			await setReviewsServer({ data: updatedReviews });
		} catch (e) {
			console.error("Failed to push review to server:", e);
		}
		setName("");
		setComment("");
		setRating(5);
		toast.success("Review submitted! Thank you for your feedback.");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "border-y border-border bg-card py-20 md:py-28",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "shell",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, {
					className: "grid gap-10 md:grid-cols-12 md:items-end",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "md:col-span-7",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "eyebrow",
							children: "Reviews"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "mt-4 text-[clamp(2.25rem,6vw,4.5rem)] uppercase",
							children: [
								"Loved by Diners",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
								"in Bathinda"
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "md:col-span-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-display text-5xl font-extrabold leading-none",
									children: business.rating
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "flex gap-0.5",
									"aria-hidden": "true",
									children: Array.from({ length: 5 }, (_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "size-4 fill-primary text-primary" }, i))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-3 text-sm text-muted-foreground",
								children: [
									business.rating,
									" ★ · ",
									business.reviewCount,
									" Google reviews"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: business.mapsListingHref,
								target: "_blank",
								rel: "noreferrer",
								className: "mt-4 inline-block border-b border-primary pb-0.5 text-xs font-semibold uppercase tracking-[0.16em] text-primary",
								children: "View Google reviews"
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-14 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-4",
					children: reviewThemes.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, {
						as: "li",
						delay: i * 60,
						className: "bg-card p-6 md:p-8",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "eyebrow text-primary text-[10px]",
								children: "Recurring theme"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mt-3 font-display text-xl font-bold uppercase tracking-tight",
								children: item.theme
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-xs leading-relaxed text-muted-foreground",
								children: item.note
							})
						]
					}, item.theme))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "my-20 border-t border-border/60" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-16 lg:grid-cols-12",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "lg:col-span-5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquarePlus, { className: "size-6 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-display text-2xl font-bold uppercase tracking-tight",
									children: "Write a Review"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-muted-foreground",
								children: "Your experience matters! Share your thoughts on our food, ambiance, and service."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								onSubmit: handleSubmit,
								className: "mt-8 space-y-6",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3",
										children: "Your Rating"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex gap-1.5",
										children: Array.from({ length: 5 }, (_, idx) => {
											const starValue = idx + 1;
											const isLit = hoverRating !== null ? starValue <= hoverRating : starValue <= rating;
											return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => setRating(starValue),
												onMouseEnter: () => setHoverRating(starValue),
												onMouseLeave: () => setHoverRating(null),
												className: "focus:outline-none transition-transform hover:scale-110 active:scale-95",
												"aria-label": `Rate ${starValue} stars`,
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: `size-8 transition-colors ${isLit ? "fill-primary text-primary" : "text-muted-foreground/30 hover:text-muted-foreground/50"}` })
											}, idx);
										})
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										htmlFor: "reviewer-name",
										className: "block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2",
										children: "Name"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										id: "reviewer-name",
										value: name,
										onChange: (e) => setName(e.target.value),
										placeholder: "Enter your name",
										className: "w-full bg-background border border-border focus:border-primary px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 rounded-sm focus:outline-none transition-colors"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										htmlFor: "reviewer-comment",
										className: "block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2",
										children: "Review Details"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
										id: "reviewer-comment",
										value: comment,
										onChange: (e) => setComment(e.target.value),
										placeholder: "Describe your dining or ordering experience...",
										className: "w-full bg-background border border-border focus:border-primary px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 rounded-sm focus:outline-none transition-colors h-36 resize-none"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "submit",
										className: "w-full flex items-center justify-center min-h-12 bg-primary hover:bg-primary/95 text-primary-foreground font-semibold px-6 text-xs uppercase tracking-[0.16em] transition-colors rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2",
										children: "Submit Review"
									})
								]
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "lg:col-span-7",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-2xl font-bold uppercase tracking-tight",
							children: "Diner Feedback"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted-foreground",
							children: "Read direct reviews and testimonials shared by customers who visited UK 09."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-8 space-y-6 max-h-[580px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-border/40 scrollbar-track-transparent",
							children: reviews.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground py-8 text-center border border-dashed border-border rounded",
								children: "No reviews submitted yet. Be the first to write a review!"
							}) : reviews.map((rev) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, {
								className: "bg-background border border-border/80 hover:border-border p-6 rounded-sm transition-all duration-300",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start justify-between gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
										className: "font-semibold text-foreground text-sm leading-tight",
										children: rev.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex gap-0.5 mt-1.5",
										"aria-label": `${rev.rating} stars`,
										children: Array.from({ length: 5 }, (_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: `size-3.5 ${i < rev.rating ? "fill-primary text-primary" : "text-muted-foreground/20"}` }, i))
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] uppercase tracking-wider font-semibold text-muted-foreground",
										children: rev.date
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-4 text-sm leading-relaxed text-muted-foreground/90 break-words",
									children: rev.comment
								})]
							}, rev.id))
						})]
					})]
				})
			]
		})
	});
}
//#endregion
export { ReviewsSection as t };
