import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Lock,
  User,
  Shield,
  TrendingUp,
  ShoppingBag,
  Clock,
  XCircle,
  MessageSquare,
  Trash2,
  CheckCircle,
  Eye,
  Settings,
  AlertTriangle,
  LogOut,
  RefreshCw,
  Info,
  Smartphone,
  Tablet,
  Monitor,
} from "lucide-react";
import { toast } from "sonner";
import { useAdminOrders, OrderStatus } from "@/lib/orders";
import { getReviewsServer, setReviewsServer, getStoreClosedServer, setStoreClosedServer, Review } from "@/lib/db";

const title = "Admin Panel — UK 09 Restaurant, Bathinda";
const description = "Secured dashboard for administrative management of UK 09.";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const { orders, updateOrderStatus, deleteOrder, clearAllOrders, cancelOrder } = useAdminOrders();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");

  // Reviews list read from localStorage
  const [reviews, setReviews] = useState<Review[]>([]);

  // Secret settings
  const [isStoreClosed, setIsStoreClosed] = useState(false);
  const [simulatedVisitors, setSimulatedVisitors] = useState(0);

  // Load state on mount
  useEffect(() => {
    // Check auth
    if (typeof window !== "undefined") {
      const logged = sessionStorage.getItem("uk09_admin_authenticated");
      if (logged === "true") {
        setIsAuthenticated(true);
      }

      // Check reviews from server
      getReviewsServer().then((serverReviews) => {
        if (serverReviews && serverReviews.length > 0) {
          setReviews(serverReviews);
          localStorage.setItem("uk09_reviews", JSON.stringify(serverReviews));
        } else {
          // Fallback to local
          const savedReviews = localStorage.getItem("uk09_reviews");
          if (savedReviews) {
            try { setReviews(JSON.parse(savedReviews)); } catch {}
          }
        }
      });

      // Check store status from server
      getStoreClosedServer().then((closed) => {
        setIsStoreClosed(closed);
        localStorage.setItem("uk09_store_closed", String(closed));
      });

      // Sim visitor count
      setSimulatedVisitors(Math.floor(124 + Math.random() * 800));
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameInput === "akashdeep" && passwordInput === "password") {
      setIsAuthenticated(true);
      sessionStorage.setItem("uk09_admin_authenticated", "true");
      toast.success("Welcome back, Akashdeep!");
      setAuthError("");
    } else {
      setAuthError("Invalid username or password.");
      toast.error("Access Denied");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("uk09_admin_authenticated");
    toast.info("Logged out successfully.");
  };

  const toggleStoreStatus = async () => {
    const nextState = !isStoreClosed;
    setIsStoreClosed(nextState);
    localStorage.setItem("uk09_store_closed", String(nextState));
    
    try {
      await setStoreClosedServer({ data: nextState });
      toast.success(
        nextState
          ? "Store status set to CLOSED. Customers will see a warning."
          : "Store status set to OPEN."
      );
    } catch (e) {
      console.error("Failed to sync store status to server:", e);
      toast.error("Failed to sync status to server.");
    }
  };

  const handleDeleteReview = async (index: number) => {
    const updated = reviews.filter((_, idx) => idx !== index);
    setReviews(updated);
    localStorage.setItem("uk09_reviews", JSON.stringify(updated));
    
    try {
      await setReviewsServer({ data: updated });
      toast.success("Review deleted successfully.");
    } catch (e) {
      console.error("Failed to delete review on server:", e);
    }
  };

  const handleAdminCancelOrder = (orderId: string, customerName: string) => {
    if (!confirm(`Cancel order ${orderId} for ${customerName}? The customer will be notified.`)) return;
    cancelOrder(orderId);
    // Write a notification so the customer's browser tab picks it up via storage event
    const notifications = JSON.parse(localStorage.getItem("uk09_admin_notifications") || "[]");
    notifications.push({
      orderId,
      type: "cancelled_by_admin",
      message: `Your order ${orderId} has been cancelled by the restaurant. Please call us for more details.`,
      timestamp: Date.now(),
    });
    localStorage.setItem("uk09_admin_notifications", JSON.stringify(notifications));
    toast.success(`Order ${orderId} cancelled. Customer will be notified.`);
  };

  const handleResetReviews = async () => {
    if (confirm("Are you sure you want to reset all reviews to default settings?")) {
      localStorage.removeItem("uk09_reviews");
      setReviews([]);
      
      try {
        await setReviewsServer({ data: [] });
        toast.success("Reviews database reset.");
      } catch (e) {
        console.error("Failed to reset reviews on server:", e);
      }
    }
  };

  const handleResetOrders = () => {
    if (confirm("Are you sure you want to delete all order records? This cannot be undone.")) {
      clearAllOrders();
      toast.success("All order records cleared.");
    }
  };

  // Calculate statistics
  const placedOrdersCount = orders.length;
  const cancelledOrdersCount = orders.filter((o) => o.status === "Cancelled").length;
  const activeOrdersCount = orders.filter(
    (o) => o.status !== "Cancelled" && o.status !== "Delivered"
  ).length;

  const totalRevenue = orders
    .filter((o) => o.status !== "Cancelled")
    .reduce((acc, o) => acc + o.total, 0);

  const avgReviewRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : "5.0";

  // Render Login page if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-28 flex items-center justify-center bg-background px-4">
        <div className="w-full max-w-md bg-card border border-border rounded-sm p-8 shadow-xl">
          <div className="text-center mb-8">
            <div className="inline-flex size-14 items-center justify-center rounded-full bg-primary/10 border border-primary/20 text-primary mb-4">
              <Lock className="size-6" />
            </div>
            <h1 className="font-display text-2xl font-bold uppercase tracking-tight text-foreground">
              Admin Portal
            </h1>
            <p className="text-xs text-muted-foreground mt-2">
              Authentication required to view system configuration and order data.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label
                htmlFor="username"
                className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2"
              >
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/60" />
                <input
                  type="text"
                  id="username"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="e.g. akashdeep"
                  className="w-full pl-10 pr-4 py-3 bg-background text-sm text-foreground placeholder:text-muted-foreground/40 rounded-sm border border-border focus:border-primary focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2"
              >
                Password
              </label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/60" />
                <input
                  type="password"
                  id="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter administrator password"
                  className="w-full pl-10 pr-4 py-3 bg-background text-sm text-foreground placeholder:text-muted-foreground/40 rounded-sm border border-border focus:border-primary focus:outline-none"
                  required
                />
              </div>
            </div>

            {authError && <p className="text-xs text-destructive font-medium">{authError}</p>}

            <button
              type="submit"
              className="w-full flex items-center justify-center min-h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs uppercase tracking-widest rounded-sm transition-colors"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Render Admin Dashboard
  return (
    <div className="min-h-screen pt-24 pb-16 bg-background">
      <div className="shell max-w-6xl mx-auto space-y-10">
        {/* Header Dashboard Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <h1 className="font-display text-3xl font-extrabold uppercase tracking-tight text-foreground">
              UK 09 Management Dashboard
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              Administrator: Akashdeep • Live Data Panel
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-destructive border border-border hover:border-destructive px-4 py-2 rounded-sm transition-colors"
          >
            <LogOut className="size-4" />
            Logout
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card border border-border p-5 rounded-sm">
            <div className="flex justify-between items-start text-muted-foreground">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Sales</span>
              <TrendingUp className="size-4 text-emerald-500" />
            </div>
            <p className="text-2xl font-bold text-foreground mt-2">₹{totalRevenue}</p>
            <p className="text-[10px] text-muted-foreground mt-1">Excludes cancelled orders</p>
          </div>

          <div className="bg-card border border-border p-5 rounded-sm">
            <div className="flex justify-between items-start text-muted-foreground">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Orders</span>
              <ShoppingBag className="size-4 text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground mt-2">{placedOrdersCount}</p>
            <p className="text-[10px] text-muted-foreground mt-1">{activeOrdersCount} active delivery operations</p>
          </div>

          <div className="bg-card border border-border p-5 rounded-sm">
            <div className="flex justify-between items-start text-muted-foreground">
              <span className="text-xs font-semibold uppercase tracking-wider">Cancelled Orders</span>
              <XCircle className="size-4 text-destructive" />
            </div>
            <p className="text-2xl font-bold text-foreground mt-2">{cancelledOrdersCount}</p>
            <p className="text-[10px] text-muted-foreground mt-1">
              {placedOrdersCount > 0
                ? `${((cancelledOrdersCount / placedOrdersCount) * 100).toFixed(0)}% cancellation rate`
                : "0% cancellation rate"}
            </p>
          </div>

          <div className="bg-card border border-border p-5 rounded-sm">
            <div className="flex justify-between items-start text-muted-foreground">
              <span className="text-xs font-semibold uppercase tracking-wider">Customer Reviews</span>
              <MessageSquare className="size-4 text-amber-500" />
            </div>
            <p className="text-2xl font-bold text-foreground mt-2">{reviews.length}</p>
            <p className="text-[10px] text-muted-foreground mt-1">{avgReviewRating}/5.0 average score</p>
          </div>
        </div>

        {/* Orders Log & Status Control */}
        <div className="bg-card border border-border rounded-sm p-6 space-y-6">
          <div className="flex items-center gap-2.5 border-b border-border pb-4">
            <ShoppingBag className="size-5 text-primary" />
            <h2 className="font-display text-lg font-bold uppercase">Customer Orders Log</h2>
          </div>

          {orders.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-xs">
              No orders have been submitted yet. When customers order, data will populate here in real-time.
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-sm border border-border bg-background p-5 space-y-4 hover:border-primary/40 transition-colors"
                >
                  <div className="flex flex-wrap gap-4 items-center justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-display font-bold text-foreground">{order.id}</span>
                        <span className="text-xs text-muted-foreground">{order.createdAt}</span>
                        <span
                          className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm border ${
                            order.status === "Cancelled"
                              ? "bg-destructive/10 text-destructive border-destructive/20"
                              : order.status === "Delivered"
                              ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                              : "bg-primary/10 text-primary border-primary/20"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-foreground mt-1">
                        {order.name} • {order.phone}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">{order.address}</p>
                      {order.device && (
                        <div className="flex items-center gap-1.5 mt-2 text-[10px] font-bold uppercase tracking-wider bg-primary/5 text-primary border border-primary/10 px-2.5 py-1 rounded-sm w-fit">
                          {order.device.includes("Mobile") || order.device.includes("iPhone") ? (
                            <Smartphone className="size-3.5 text-primary" />
                          ) : order.device.includes("Tablet") || order.device.includes("iPad") ? (
                            <Tablet className="size-3.5 text-primary" />
                          ) : (
                            <Monitor className="size-3.5 text-primary" />
                          )}
                          <span>Order Source: {order.device}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Order Bill</p>
                        <p className="font-display font-bold text-primary">₹{order.total}</p>
                      </div>
                      <button
                        onClick={() => {
                          if (confirm(`Delete record for order ${order.id}?`)) {
                            deleteOrder(order.id);
                          }
                        }}
                        className="p-2 border border-border text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-sm transition-colors"
                        title="Delete order record permanently"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>

                  {/* Items list */}
                  <div className="bg-card border border-border/60 p-3 rounded-sm text-xs space-y-1">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-muted-foreground">
                        <span>
                          {item.quantity}x {item.name} {item.portion && `(${item.portion})`}
                        </span>
                        <span className="text-foreground font-medium">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  {/* Status controls */}
                  {order.status !== "Cancelled" && (
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2 items-center">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mr-2">
                          Set Status:
                        </span>
                        {(["Received", "Preparing", "Out for Delivery", "Delivered"] as OrderStatus[]).map(
                          (status) => (
                            <button
                              key={status}
                              onClick={() => updateOrderStatus(order.id, status)}
                              className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-sm transition-colors border ${
                                order.status === status
                                  ? "bg-primary text-primary-foreground border-primary"
                                  : "bg-card text-muted-foreground border-border hover:text-foreground hover:bg-secondary"
                              }`}
                            >
                              {status}
                            </button>
                          )
                        )}
                      </div>
                      {order.status !== "Delivered" && (
                        <div className="flex items-center gap-3 pt-1 border-t border-border/40">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                            Admin Action:
                          </span>
                          <button
                            onClick={() => handleAdminCancelOrder(order.id, order.name)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-sm border border-destructive/40 text-destructive hover:bg-destructive hover:text-white transition-colors"
                          >
                            <XCircle className="size-3.5" />
                            Cancel Order & Notify Customer
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reviews Manager & Secret Settings Grid */}
        <div className="grid md:grid-cols-12 gap-6">
          {/* Reviews Log */}
          <div className="md:col-span-7 bg-card border border-border rounded-sm p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-2.5">
                <MessageSquare className="size-5 text-primary" />
                <h2 className="font-display text-lg font-bold uppercase">Customer Reviews Log</h2>
              </div>
              {reviews.length > 0 && (
                <button
                  onClick={handleResetReviews}
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive transition-colors"
                >
                  <RefreshCw className="size-3.5" />
                  Reset Database
                </button>
              )}
            </div>

            {reviews.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground text-xs">
                No user review records found. When customers write reviews, they will display here.
              </div>
            ) : (
              <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1 hide-scrollbar">
                {reviews.map((rev, index) => (
                  <div key={index} className="border-b border-border/50 pb-3 flex items-start gap-4">
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-foreground">{rev.name}</span>
                        <span className="text-[10px] text-muted-foreground">{rev.date}</span>
                      </div>
                      <div className="flex gap-0.5 text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i} className="text-xs">
                            {i < rev.rating ? "★" : "☆"}
                          </span>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {rev.comment || "(No comment written)"}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteReview(index)}
                      className="p-1.5 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded-sm transition-colors align-self-center"
                      title="Delete review record"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Secret Things Panel */}
          <div className="md:col-span-5 bg-card border border-border rounded-sm p-6 space-y-6">
            <div className="flex items-center gap-2.5 border-b border-border pb-4">
              <Settings className="size-5 text-primary" />
              <h2 className="font-display text-lg font-bold uppercase">Secret & System Settings</h2>
            </div>

            {/* Store Closed Mode */}
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                    Store Operation State
                  </h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Toggle to disable online checkouts.
                  </p>
                </div>
                <span
                  className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-sm ${
                    isStoreClosed
                      ? "bg-destructive/10 text-destructive border border-destructive/20"
                      : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                  }`}
                >
                  {isStoreClosed ? "Closed" : "Open"}
                </span>
              </div>

              <button
                onClick={toggleStoreStatus}
                className={`w-full flex items-center justify-center gap-2 min-h-11 font-bold text-xs uppercase tracking-wider rounded-sm transition-colors border ${
                  isStoreClosed
                    ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 border-emerald-500/30 hover:text-white"
                    : "bg-destructive/10 text-destructive hover:bg-destructive border-destructive/30 hover:text-white"
                }`}
              >
                {isStoreClosed ? "Open Store Operations" : "Close Store Operations"}
              </button>
            </div>

            {/* Simulators & Logs */}
            <div className="space-y-4 pt-4 border-t border-border">
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                Live Server Metas
              </h3>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-border/40 text-muted-foreground">
                  <span>Current Session Visitors</span>
                  <span className="font-bold text-foreground">{simulatedVisitors}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40 text-muted-foreground">
                  <span>DB Footprint (LocalStorage)</span>
                  <span className="font-bold text-foreground">
                    {(
                      (JSON.stringify(orders) + JSON.stringify(reviews)).length / 1024
                    ).toFixed(2)}{" "}
                    KB
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40 text-muted-foreground">
                  <span>Host IP Endpoint</span>
                  <span className="font-mono text-[10px] text-foreground">127.0.0.1:8080</span>
                </div>
              </div>
            </div>

            {/* Reset meta operations */}
            <div className="pt-4 border-t border-border space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                Database Purging
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleResetOrders}
                  className="flex items-center justify-center gap-1.5 min-h-10 text-[10px] font-bold uppercase tracking-wider border border-destructive/30 text-destructive hover:bg-destructive/10 rounded-sm transition-colors"
                >
                  <Trash2 className="size-3.5" />
                  Clear Orders
                </button>
                <button
                  onClick={handleResetReviews}
                  className="flex items-center justify-center gap-1.5 min-h-10 text-[10px] font-bold uppercase tracking-wider border border-destructive/30 text-destructive hover:bg-destructive/10 rounded-sm transition-colors"
                >
                  <Trash2 className="size-3.5" />
                  Clear Reviews
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
