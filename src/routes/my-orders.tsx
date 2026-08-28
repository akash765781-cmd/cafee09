import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Clock,
  Search,
  Trash2,
  XCircle,
  ChefHat,
  Bike,
  CheckCircle,
  AlertTriangle,
  ShoppingBag,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import { useOrders, OrderStatus } from "@/lib/orders";
import { Reveal } from "@/components/Reveal";
import { CTASection } from "@/components/CTASection";

const title = "My Orders — UK 09 Restaurant, Bathinda";
const description =
  "View and track all your previous and active orders placed at UK 09 Restaurant, Bathinda.";

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
  const { customerOrders: orders, cancelOrder, deleteCustomerOrder, clearCustomerOrders } = useOrders();

  const [searchQuery, setSearchQuery] = useState("");
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const handleCancelOrderClick = (orderId: string) => {
    cancelOrder(orderId);
    setCancellingId(null);
    toast.error(`Order ${orderId} has been cancelled.`);
  };

  const handleClearHistory = () => {
    if (
      confirm(
        "Are you sure you want to clear your order history from this device? This will only remove history from your view."
      )
    ) {
      clearCustomerOrders();
      toast.success("Your order history has been cleared.");
    }
  };

  const filteredOrders = orders.filter(
    (o) =>
      o.id.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      o.phone.includes(searchQuery.trim()) ||
      o.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  return (
    <div className="pt-24 md:pt-28 pb-16 min-h-screen bg-background">
      <div className="shell max-w-5xl mx-auto space-y-8">
        {/* Header section */}
        <Reveal className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              <Link to="/order" className="hover:text-primary transition-colors flex items-center gap-1">
                <ArrowLeft className="size-3.5" />
                Back to Order Page
              </Link>
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-extrabold uppercase tracking-tight text-foreground">
              My Orders & History
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">
              Your previous order records are safely stored here on your device.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {orders.length > 0 && (
              <button
                onClick={handleClearHistory}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-muted-foreground hover:text-destructive border border-border hover:border-destructive/40 rounded-sm transition-colors"
                title="Clear order history from your device view"
              >
                <Trash2 className="size-3.5" />
                Clear My History
              </button>
            )}
            <Link
              to="/order"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-5 py-2.5 text-xs uppercase tracking-wider rounded-sm transition-colors"
            >
              <ShoppingBag className="size-3.5" />
              Place New Order
            </Link>
          </div>
        </Reveal>

        {/* Filter bar */}
        {orders.length > 0 && (
          <Reveal className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-card border border-border p-4 rounded-sm">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                placeholder="Search Order ID, Phone or Name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-background text-xs text-foreground placeholder:text-muted-foreground/60 rounded-sm border border-border focus:border-primary focus:outline-none"
              />
            </div>
            <p className="text-xs text-muted-foreground font-medium">
              Showing <span className="text-foreground font-bold">{filteredOrders.length}</span> of{" "}
              <span className="text-foreground font-bold">{orders.length}</span> orders
            </p>
          </Reveal>
        )}

        {/* Orders list */}
        {filteredOrders.length === 0 ? (
          <Reveal className="rounded-sm border border-border bg-card p-12 text-center my-8">
            <Clock className="mx-auto size-14 text-muted-foreground/40 mb-4" />
            <h2 className="font-display text-2xl font-bold uppercase tracking-tight">No Orders Found</h2>
            <p className="text-xs md:text-sm text-muted-foreground mt-2 max-w-md mx-auto">
              {searchQuery
                ? "No previous orders matched your search query. Try typing your Order ID or Phone number."
                : "You haven't saved any previous order records on this device yet."}
            </p>
            <div className="mt-6">
              <Link
                to="/order"
                className="inline-flex items-center justify-center min-h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 text-xs uppercase tracking-[0.16em] transition-colors rounded-sm"
              >
                Place New Order Now
              </Link>
            </div>
          </Reveal>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => {
              const isCancelled = order.status === "Cancelled";

              return (
                <Reveal
                  key={order.id}
                  className="rounded-sm border border-border bg-card p-6 space-y-6 hover:border-border/80 transition-colors"
                >
                  {/* Card Header */}
                  <div className="flex flex-wrap gap-4 items-center justify-between border-b border-border/60 pb-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-display text-xl font-bold text-foreground">
                          {order.id}
                        </span>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-sm border ${
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
                      <p className="text-xs text-muted-foreground mt-1">
                        Placed at <span className="text-foreground font-medium">{order.createdAt}</span> • Name: {order.name} ({order.phone})
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-[10px] uppercase font-semibold text-muted-foreground">Total Bill</p>
                        <span className="font-display text-xl font-bold text-primary">
                          ₹{order.total}
                        </span>
                      </div>

                      {!isCancelled && order.status !== "Delivered" && (
                        <button
                          onClick={() => setCancellingId(order.id)}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-destructive hover:bg-destructive/10 border border-destructive/30 px-3 py-1.5 rounded-sm transition-colors"
                        >
                          <XCircle className="size-3.5" />
                          Cancel
                        </button>
                      )}

                      {(isCancelled || order.status === "Delivered") && (
                        <button
                          onClick={() => {
                            if (confirm(`Remove order ${order.id} from your view?`)) {
                              deleteCustomerOrder(order.id);
                              toast.success("Order removed from your view.");
                            }
                          }}
                          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive border border-border hover:border-destructive/30 px-2.5 py-1.5 rounded-sm transition-colors"
                          title="Remove from your device view"
                        >
                          <Trash2 className="size-3.5" />
                          Clear
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Cancel Confirmation Banner */}
                  {cancellingId === order.id && (
                    <div className="rounded-sm border border-destructive/40 bg-destructive/5 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3 text-xs text-destructive font-medium">
                        <AlertTriangle className="size-5 shrink-0" />
                        <span>Are you sure you want to cancel order {order.id}?</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleCancelOrderClick(order.id)}
                          className="px-4 py-1.5 bg-destructive text-destructive-foreground font-semibold text-xs uppercase tracking-wider rounded-sm hover:bg-destructive/90 transition-colors"
                        >
                          Yes, Cancel Order
                        </button>
                        <button
                          onClick={() => setCancellingId(null)}
                          className="px-4 py-1.5 border border-border text-xs font-semibold uppercase tracking-wider rounded-sm hover:bg-secondary transition-colors"
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Status Step Progress Bar */}
                  {!isCancelled ? (
                    <div className="py-2">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-4">
                        Live Order Progress Status
                      </p>
                      <div className="grid grid-cols-4 gap-2 relative">
                        {statusSteps.map((step, idx) => {
                          const StepIcon = step.icon;
                          const isCurrent = order.status === step.key;
                          const isCompleted =
                            (order.status === "Preparing" && idx === 0) ||
                            (order.status === "Out for Delivery" && idx <= 1) ||
                            (order.status === "Delivered" && idx <= 3);

                          return (
                            <div key={step.key} className="flex flex-col items-center text-center">
                              <div
                                className={`size-10 rounded-full flex items-center justify-center transition-colors mb-2 border ${
                                  isCurrent
                                    ? "bg-primary text-primary-foreground border-primary ring-4 ring-primary/20 animate-pulse"
                                    : isCompleted
                                    ? "bg-primary/20 text-primary border-primary/40"
                                    : "bg-secondary text-muted-foreground border-border"
                                }`}
                              >
                                <StepIcon className="size-4" />
                              </div>
                              <span
                                className={`text-[10px] md:text-[11px] font-semibold tracking-tight ${
                                  isCurrent || isCompleted
                                    ? "text-foreground"
                                    : "text-muted-foreground"
                                }`}
                              >
                                {step.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 rounded-sm bg-destructive/10 text-destructive text-xs flex items-center gap-2">
                      <XCircle className="size-4 shrink-0" />
                      <span>This order was cancelled. No further charges or delivery will occur.</span>
                    </div>
                  )}

                  {/* Order Items & Receipt Summary */}
                  <div className="bg-secondary/30 p-4 rounded-sm space-y-2 text-xs">
                    <p className="font-semibold text-foreground uppercase tracking-wider text-[10px] mb-2">
                      Items Ordered ({order.items.length})
                    </p>
                    {order.items.map((item, i) => (
                      <div key={i} className="flex justify-between text-muted-foreground">
                        <span>
                          {item.quantity}x <span className="text-foreground">{item.name}</span>{" "}
                          {item.portion && `(${item.portion})`}
                        </span>
                        <span className="font-medium text-foreground">
                          ₹{item.price * item.quantity}
                        </span>
                      </div>
                    ))}
                    <div className="pt-2 border-t border-border/50 flex justify-between font-medium text-foreground">
                      <span className="text-muted-foreground text-[11px]">Delivery Address</span>
                      <span className="text-foreground text-[11px] max-w-sm truncate text-right">
                        {order.address}
                      </span>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-16">
        <CTASection />
      </div>
    </div>
  );
}
