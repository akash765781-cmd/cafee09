import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Clock,
  Trash2,
  XCircle,
  ChefHat,
  Bike,
  CheckCircle,
  AlertTriangle,
  ShoppingBag,
  Search,
} from "lucide-react";
import { toast } from "sonner";
import { useOrders, OrderStatus } from "@/lib/orders";
import { Reveal } from "@/components/Reveal";
import { CTASection } from "@/components/CTASection";

const title = "My Orders — UK 09 Restaurant, Bathinda";
const description = "Track and manage your order history at UK 09 Restaurant, Bathinda.";

export const Route = createFileRoute("/my-orders")({
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
  component: MyOrdersPage,
});

const statusSteps = [
  { key: "Received", label: "Order Received", icon: Clock },
  { key: "Preparing", label: "Preparing", icon: ChefHat },
  { key: "Out for Delivery", label: "Out for Delivery", icon: Bike },
  { key: "Delivered", label: "Delivered", icon: CheckCircle },
];

function MyOrdersPage() {
  return (
    <div className="pt-20 md:pt-24">
      <MyOrdersSection />
      <CTASection />
    </div>
  );
}

function MyOrdersSection() {
  const { orders, cancelOrder, deleteOrder, clearAllOrders } = useOrders();
  const [searchQuery, setSearchQuery] = useState("");
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const handleCancelOrderClick = (orderId: string) => {
    cancelOrder(orderId);
    setCancellingId(null);
    toast.error(`Order ${orderId} has been cancelled.`);
  };

  const filteredOrders = orders.filter(
    (o) =>
      o.id.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      o.phone.includes(searchQuery.trim()) ||
      o.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  // Statistics
  const totalOrders = orders.length;
  const activeOrders = orders.filter(
    (o) => o.status !== "Cancelled" && o.status !== "Delivered"
  ).length;
  const totalSpent = orders
    .filter((o) => o.status !== "Cancelled")
    .reduce((acc, o) => acc + o.total, 0);

  return (
    <section className="py-12 md:py-20">
      <div className="shell max-w-5xl mx-auto space-y-10">
        {/* Header and Stats */}
        <Reveal className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-border pb-8">
          <div>
            <p className="eyebrow">Your History</p>
            <h1 className="mt-2 text-4xl font-extrabold uppercase tracking-tight font-display">
              My Orders
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Track active deliveries and review your previous order history.
            </p>
          </div>

          {totalOrders > 0 && (
            <div className="flex flex-wrap gap-4 text-xs font-semibold uppercase tracking-wider">
              <div className="bg-card border border-border px-4 py-3 rounded-sm">
                <span className="text-muted-foreground block text-[10px] mb-1">Total Orders</span>
                <span className="text-foreground text-sm font-bold">{totalOrders}</span>
              </div>
              <div className="bg-card border border-border px-4 py-3 rounded-sm">
                <span className="text-muted-foreground block text-[10px] mb-1">Active Deliveries</span>
                <span className="text-primary text-sm font-bold">{activeOrders}</span>
              </div>
              <div className="bg-card border border-border px-4 py-3 rounded-sm">
                <span className="text-muted-foreground block text-[10px] mb-1">Total Bills</span>
                <span className="text-foreground text-sm font-bold">₹{totalSpent}</span>
              </div>
            </div>
          )}
        </Reveal>

        {/* Search and Action Bar */}
        {orders.length > 0 && (
          <Reveal className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/60 pointer-events-none" />
              <input
                type="text"
                placeholder="Search Order ID / Name / Phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-card text-xs text-foreground placeholder:text-muted-foreground/50 rounded-sm border border-border focus:border-primary focus:outline-none transition-colors"
              />
            </div>

            <button
              onClick={() => {
                if (confirm("Are you sure you want to clear your local order history? This will only remove records from your device and will not cancel any orders or delete them from the restaurant admin panel.")) {
                  clearAllOrders();
                  toast.success("Order history cleared locally.");
                }
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-destructive border border-border hover:border-destructive/40 rounded-sm transition-colors bg-card cursor-pointer"
            >
              <Trash2 className="size-4" />
              Clear All History
            </button>
          </Reveal>
        )}

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <Reveal className="rounded-sm border border-border bg-card p-12 md:p-16 text-center max-w-lg mx-auto">
            <ShoppingBag className="mx-auto size-16 text-muted-foreground/45 mb-4" strokeWidth={1.5} />
            <h3 className="font-display text-xl font-bold uppercase tracking-tight">No Orders Found</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              {searchQuery
                ? "No matching orders were found. Try searching with a different keyword or phone number."
                : "You don't have any previous order history saved on this device. Place a new order online!"}
            </p>
            <div className="mt-8 flex justify-center">
              <a
                href="/menu"
                className="inline-flex items-center justify-center min-h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 text-xs uppercase tracking-[0.16em] transition-colors rounded-sm"
              >
                Go to Menu
              </a>
            </div>
          </Reveal>
        ) : (
          <Reveal className="space-y-6">
            {filteredOrders.map((order) => {
              const isCancelled = order.status === "Cancelled";

              return (
                <div
                  key={order.id}
                  className="rounded-sm border border-border bg-card p-6 space-y-6 hover:border-primary/20 transition-colors"
                >
                  {/* Card Header */}
                  <div className="flex flex-wrap gap-4 items-center justify-between border-b border-border/60 pb-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-display text-lg font-bold text-foreground">
                          {order.id}
                        </span>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-sm border ${
                            isCancelled
                              ? "bg-destructive/10 text-destructive border-destructive/30"
                              : order.status === "Delivered"
                              ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/30"
                              : "bg-primary/10 text-primary border-primary/30"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1.5">
                        Ordered at {order.createdAt} • Name: {order.name} ({order.phone})
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="font-display text-xl font-extrabold text-primary">
                        ₹{order.total}
                      </span>
                      {!isCancelled && order.status !== "Delivered" && (
                        <button
                          onClick={() => setCancellingId(order.id)}
                          className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-destructive hover:bg-destructive/10 border border-destructive/30 px-3 py-2 rounded-sm transition-colors bg-background cursor-pointer"
                        >
                          <XCircle className="size-3.5" />
                          Cancel
                        </button>
                      )}
                      {(isCancelled || order.status === "Delivered") && (
                        <button
                          onClick={() => {
                            if (confirm(`Remove order ${order.id} from your view?`)) {
                              deleteOrder(order.id);
                              toast.success("Order record removed locally.");
                            }
                          }}
                          className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground hover:text-destructive border border-border hover:border-destructive/30 px-3 py-2 rounded-sm transition-colors bg-background cursor-pointer"
                          title="Remove this record from your view"
                        >
                          <Trash2 className="size-3.5" />
                          Clear Record
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Cancel Confirmation */}
                  {cancellingId === order.id && (
                    <Reveal className="rounded-sm border border-destructive/40 bg-destructive/5 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3 text-xs text-destructive font-medium">
                        <AlertTriangle className="size-5 shrink-0" />
                        <span>Are you sure you want to cancel order {order.id}?</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleCancelOrderClick(order.id)}
                          className="px-4 py-2 bg-destructive text-destructive-foreground font-semibold text-xs uppercase tracking-wider rounded-sm hover:bg-destructive/90 transition-colors cursor-pointer"
                        >
                          Confirm Cancel
                        </button>
                        <button
                          onClick={() => setCancellingId(null)}
                          className="px-4 py-2 border border-border text-xs font-semibold uppercase tracking-wider rounded-sm hover:bg-secondary transition-colors cursor-pointer"
                        >
                          Dismiss
                        </button>
                      </div>
                    </Reveal>
                  )}

                  {/* Status Progress Tracker */}
                  {!isCancelled ? (
                    <div className="py-2">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-4">
                        Live Tracking
                      </p>
                      <div className="grid grid-cols-4 gap-2 relative">
                        {statusSteps.map((step, idx) => {
                          const StepIcon = step.icon;
                          const isCurrent = order.status === step.key;
                          const isCompleted =
                            (order.status === "Preparing" && idx === 0) ||
                            (order.status === "Out for Delivery" && idx <= 1) ||
                            (order.status === "Delivered" && idx <= 3);
                          const isDelivered = order.status === "Delivered";

                          let circleClass = "";
                          if (isCurrent) {
                            if (step.key === "Delivered") {
                              circleClass = "bg-emerald-500 text-white border-emerald-500 ring-4 ring-emerald-500/20";
                            } else {
                              circleClass = "bg-primary text-primary-foreground border-primary ring-4 ring-primary/20 animate-pulse";
                            }
                          } else if (isCompleted) {
                            if (step.key === "Delivered" || isDelivered) {
                              circleClass = "bg-emerald-500/20 text-emerald-500 border-emerald-500/40";
                            } else {
                              circleClass = "bg-primary/20 text-primary border-primary/40";
                            }
                          } else {
                            circleClass = "bg-secondary text-muted-foreground border-border";
                          }

                          let textClass = "";
                          if (isCurrent || isCompleted) {
                            if (step.key === "Delivered" || isDelivered) {
                              textClass = "text-emerald-500 font-bold";
                            } else {
                              textClass = "text-foreground font-bold";
                            }
                          } else {
                            textClass = "text-muted-foreground";
                          }

                          return (
                            <div key={step.key} className="flex flex-col items-center text-center">
                              <div className={`size-10 rounded-full flex items-center justify-center transition-colors mb-2 border ${circleClass}`}>
                                <StepIcon className="size-4.5" strokeWidth={isCurrent ? 2 : 1.5} />
                              </div>
                              <span className={`text-[10px] font-bold uppercase tracking-tight ${textClass}`}>
                                {step.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                      {order.status === "Delivered" && (
                        <div className="mt-4 p-4 rounded-sm bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs flex items-center gap-2.5 font-semibold uppercase tracking-wider">
                          <CheckCircle className="size-4 shrink-0 text-emerald-500" />
                          <span>Your order has been delivered successfully! Thank you for choosing UK 09.</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-4 rounded-sm bg-destructive/10 text-destructive text-xs flex items-center gap-2 border border-destructive/20">
                      <XCircle className="size-4 shrink-0" />
                      <span>This order was cancelled. No delivery will occur.</span>
                    </div>
                  )}

                  {/* Items Summary */}
                  <div className="bg-secondary/20 border border-border/40 p-4 rounded-sm space-y-3.5 text-xs">
                    <div>
                      <p className="font-bold text-foreground uppercase tracking-wider text-[10px] mb-2.5">
                        Selected Items ({order.items.length})
                      </p>
                      <div className="space-y-2">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex justify-between text-muted-foreground font-display">
                            <span>
                              {item.quantity}x <span className="text-foreground font-medium">{item.name}</span>{" "}
                              {item.portion && `(${item.portion})`}
                            </span>
                            <span className="font-semibold text-foreground">
                              ₹{item.price * item.quantity}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-border/50 flex flex-col gap-2 text-muted-foreground">
                      <div>
                        <span className="font-bold text-foreground uppercase tracking-wider text-[9px] block mb-1">
                          Delivery Address
                        </span>
                        <span className="text-xs text-foreground font-medium">{order.address}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </Reveal>
        )}
      </div>
    </section>
  );
}
