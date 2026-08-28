import { useState, useEffect } from "react";
import {
  ShoppingBag,
  CheckCircle,
  User,
  Phone,
  MapPin,
  Loader2,
  Trash2,
  Minus,
  Plus,
  Clock,
  Search,
  XCircle,
  ChefHat,
  Bike,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import { business } from "@/lib/business";
import { Reveal } from "./Reveal";
import { useCart } from "@/lib/cart";
import { useOrders, Order } from "@/lib/orders";

interface OrderForm {
  name: string;
  phone: string;
  address: string;
}

interface FormErrors {
  name?: string;
  phone?: string;
  address?: string;
}

function validate(form: OrderForm): FormErrors {
  const errors: FormErrors = {};

  if (!form.name.trim()) {
    errors.name = "Name is required.";
  } else if (form.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters.";
  }

  const phoneClean = form.phone.replace(/\s/g, "");
  if (!phoneClean) {
    errors.phone = "Phone number is required.";
  } else if (!/^[6-9]\d{9}$/.test(phoneClean)) {
    errors.phone = "Enter a valid 10-digit Indian mobile number.";
  }

  if (!form.address.trim()) {
    errors.address = "Delivery address is required.";
  } else if (form.address.trim().length < 10) {
    errors.address = "Please enter a complete address (at least 10 characters).";
  }

  return errors;
}

const statusSteps = [
  { key: "Received", label: "Order Received", icon: Clock },
  { key: "Preparing", label: "Preparing", icon: ChefHat },
  { key: "Out for Delivery", label: "Out for Delivery", icon: Bike },
  { key: "Delivered", label: "Delivered", icon: CheckCircle },
];

export function OrderFormSection() {
  const { items, total, removeItem, updateQuantity, clearCart } = useCart();
  const { orders, addOrder, cancelOrder, deleteOrder, clearAllOrders } = useOrders();

  const [activeTab, setActiveTab] = useState<"order" | "track">("order");
  const [form, setForm] = useState<OrderForm>({ name: "", phone: "", address: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [isStoreClosed, setIsStoreClosed] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const closed = localStorage.getItem("uk09_store_closed") === "true";
      setIsStoreClosed(closed);
    }
  }, []);

  // Listen for admin-initiated cancellation notifications across tabs
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "uk09_admin_notifications" && e.newValue) {
        try {
          const notifications: { orderId: string; type: string; message: string; timestamp: number }[] =
            JSON.parse(e.newValue);
          // Find any new cancellation notifications we haven't processed yet
          const lastSeen = Number(localStorage.getItem("uk09_notifications_seen") || "0");
          const fresh = notifications.filter(
            (n) => n.type === "cancelled_by_admin" && n.timestamp > lastSeen
          );
          fresh.forEach((n) => {
            toast.error(n.message, {
              duration: 8000,
              description: `Order ID: ${n.orderId} — Please contact us at ${business.phoneDisplay} for assistance.`,
            });
          });
          if (fresh.length > 0) {
            localStorage.setItem("uk09_notifications_seen", String(Date.now()));
          }
        } catch {
          // ignore parse errors
        }
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const handleChange = (field: keyof OrderForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      const newErrors = validate({ ...form, [field]: value });
      setErrors((prev) => ({ ...prev, [field]: newErrors[field] }));
    }
  };

  const handleBlur = (field: keyof OrderForm) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const newErrors = validate(form);
    setErrors((prev) => ({ ...prev, [field]: newErrors[field] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isStoreClosed) {
      toast.error("We are currently closed for online orders. Please call us directly!");
      return;
    }

    setTouched({ name: true, phone: true, address: true });
    const newErrors = validate(form);
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast.error("Please fix the errors before placing your order.");
      return;
    }

    if (items.length === 0) {
      toast.error("Your cart is empty. Add items from the menu first!");
      return;
    }

    setSubmitting(true);

    // Simulate 1.5s loading animation as requested
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const newOrder = addOrder({
      name: form.name.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      items: [...items],
      total,
    });

    setSubmitting(false);
    setLastPlacedOrder(newOrder);
    clearCart();
    toast.success(`Order ${newOrder.id} placed! We will call you shortly.`);
  };

  const handleNewOrder = () => {
    setForm({ name: "", phone: "", address: "" });
    setErrors({});
    setTouched({});
    setLastPlacedOrder(null);
    setActiveTab("order");
  };

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

  return (
    <section className="py-12 md:py-20">
      <div className="shell max-w-5xl mx-auto">
        {/* Navigation Tabs */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex rounded-sm border border-border bg-card p-1">
            <button
              onClick={() => setActiveTab("order")}
              className={`flex items-center gap-2 px-6 py-3 text-xs font-bold uppercase tracking-[0.16em] transition-colors rounded-sm ${
                activeTab === "order"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <ShoppingBag className="size-4" />
              Place Order {items.length > 0 && `(${items.length})`}
            </button>
            <button
              onClick={() => setActiveTab("track")}
              className={`flex items-center gap-2 px-6 py-3 text-xs font-bold uppercase tracking-[0.16em] transition-colors rounded-sm ${
                activeTab === "track"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Clock className="size-4" />
              Track & Cancel Order {orders.length > 0 && `(${orders.length})`}
            </button>
          </div>
        </div>

        {/* TAB 1: ORDER / CHECKOUT */}
        {activeTab === "order" && (
          <>
            {lastPlacedOrder ? (
              <Reveal className="mx-auto max-w-lg text-center py-8">
                <CheckCircle className="mx-auto size-16 text-primary" strokeWidth={1.5} />
                <h2 className="mt-6 font-display text-4xl font-extrabold uppercase tracking-tight">
                  Order Confirmed!
                </h2>
                <p className="mt-2 text-xs uppercase tracking-widest text-primary font-bold">
                  Order ID: {lastPlacedOrder.id}
                </p>
                <p className="mt-4 text-muted-foreground leading-relaxed text-sm">
                  Thank you, <span className="text-foreground font-semibold">{lastPlacedOrder.name}</span>! Your order request has been received. Our team will call you at{" "}
                  <span className="text-primary font-semibold">{lastPlacedOrder.phone}</span> shortly to confirm.
                </p>

                <div className="mt-6 rounded-sm border border-border bg-card p-5 text-left text-sm text-muted-foreground space-y-2">
                  <p className="font-semibold text-foreground text-xs uppercase tracking-wider mb-3">Order Summary</p>
                  {lastPlacedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-xs">
                      <span>{item.quantity}x {item.name} {item.portion && `(${item.portion})`}</span>
                      <span className="text-foreground font-medium">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-border flex justify-between font-bold text-foreground text-sm">
                    <span>Total Amount</span>
                    <span className="text-primary">₹{lastPlacedOrder.total}</span>
                  </div>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => setActiveTab("track")}
                    className="inline-flex items-center justify-center min-h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 text-xs uppercase tracking-[0.16em] transition-colors rounded-sm"
                  >
                    Track Order
                  </button>
                  <button
                    onClick={handleNewOrder}
                    className="inline-flex items-center justify-center min-h-12 border border-border hover:border-primary hover:text-primary px-8 text-xs font-semibold uppercase tracking-[0.16em] transition-colors rounded-sm"
                  >
                    Place Another Order
                  </button>
                </div>
              </Reveal>
            ) : (
              <div className="grid gap-12 lg:grid-cols-12">
                {/* Left: Process Guide & Direct Contact */}
                <div className="lg:col-span-5">
                  <Reveal>
                    <p className="eyebrow">Fresh & Quick</p>
                    <h2 className="mt-4 text-[clamp(2rem,5vw,3.5rem)] uppercase leading-none font-display font-extrabold">
                      Place Your<br />Order
                    </h2>
                    <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                      Review your selected items and fill in your contact details below to place your order with UK 09.
                    </p>

                    <div className="mt-8 space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-card text-xs font-bold text-primary">
                          1
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-foreground">Select Menu Items</p>
                          <p className="mt-0.5 text-xs text-muted-foreground">Add your favorite dishes from our digital menu.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-card text-xs font-bold text-primary">
                          2
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-foreground">Provide Delivery Info</p>
                          <p className="mt-0.5 text-xs text-muted-foreground">Enter your name, 10-digit mobile number, and address.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-card text-xs font-bold text-primary">
                          3
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-foreground">Instant Call Confirmation</p>
                          <p className="mt-0.5 text-xs text-muted-foreground">Our staff will call you to confirm & dispatch your food.</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 rounded-sm border border-border/60 bg-card p-5">
                      <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-3">Prefer to Order via Call or WhatsApp?</p>
                      <a
                        href={business.phoneHref}
                        className="flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-colors"
                      >
                        <Phone className="size-4 text-primary shrink-0" />
                        {business.phoneDisplay}
                      </a>
                      <a
                        href={business.whatsappHref}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-colors"
                      >
                        <ShoppingBag className="size-4 text-primary shrink-0" />
                        WhatsApp Us Directly
                      </a>
                    </div>
                  </Reveal>
                </div>

                {/* Right: Cart Items & Delivery Form */}
                <div className="lg:col-span-7">
                  <Reveal>
                    {items.length === 0 ? (
                      <div className="rounded-sm border border-border bg-card p-12 text-center flex flex-col items-center justify-center">
                        <div className="size-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                          <ShoppingBag className="size-8 text-muted-foreground" />
                        </div>
                        <h3 className="font-display text-xl font-bold uppercase tracking-tight">Your Cart is Empty</h3>
                        <p className="mt-2 text-sm text-muted-foreground max-w-sm mb-6">
                          Looks like you haven't added any dishes yet. Browse our menu to add items!
                        </p>
                        <a
                          href="/menu"
                          className="inline-flex items-center justify-center min-h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 text-xs uppercase tracking-[0.16em] transition-colors rounded-sm"
                        >
                          Explore Menu
                        </a>
                      </div>
                    ) : (
                      <form
                        onSubmit={handleSubmit}
                        noValidate
                        className="rounded-sm border border-border bg-card p-6 md:p-8 space-y-6"
                      >
                        <div className="flex items-center justify-between border-b border-border pb-4">
                          <div className="flex items-center gap-2.5">
                            <ShoppingBag className="size-5 text-primary" />
                            <h3 className="font-display text-lg font-bold uppercase tracking-tight">Selected Items</h3>
                          </div>
                          <span className="text-xs text-muted-foreground font-semibold uppercase">{items.length} Items</span>
                        </div>

                        {/* Cart Items List */}
                        <div className="space-y-3 max-h-60 overflow-y-auto pr-1 hide-scrollbar">
                          {items.map((item) => (
                            <div key={item.id} className="flex items-center gap-3 py-2.5 border-b border-border/40 text-sm">
                              <div className="flex-1">
                                <p className="font-bold text-foreground">
                                  {item.name} {item.portion && <span className="text-xs font-normal text-muted-foreground">({item.portion})</span>}
                                </p>
                                <p className="text-xs text-primary font-semibold">₹{item.price}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="flex items-center border border-border rounded-sm overflow-hidden bg-background">
                                  <button
                                    type="button"
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    className="size-6 flex items-center justify-center hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                                  >
                                    <Minus className="size-3" />
                                  </button>
                                  <span className="w-7 text-center text-xs font-semibold">{item.quantity}</span>
                                  <button
                                    type="button"
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    className="size-6 flex items-center justify-center hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                                  >
                                    <Plus className="size-3" />
                                  </button>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeItem(item.id)}
                                  className="size-6 flex items-center justify-center rounded-sm hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                                  title="Remove"
                                >
                                  <Trash2 className="size-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="flex justify-between items-center bg-secondary/50 p-3.5 rounded-sm">
                          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Bill</span>
                          <span className="font-display text-xl font-bold text-primary">₹{total}</span>
                        </div>

                        {/* Customer Form */}
                        <div className="pt-4 border-t border-border space-y-4">
                          {isStoreClosed && (
                            <div className="p-4 rounded-sm border border-destructive bg-destructive/10 text-destructive text-xs flex items-center gap-2 mb-2">
                              <AlertTriangle className="size-4 shrink-0" />
                              <span>Notice: We are currently closed and not accepting online orders at this time. Please contact us directly by phone or try again later.</span>
                            </div>
                          )}

                          <div className="flex items-center gap-2 mb-1">
                            <User className="size-4 text-primary" />
                            <h4 className="font-display text-sm font-bold uppercase tracking-wider">Customer Details</h4>
                          </div>

                          {/* Name */}
                          <div>
                            <label htmlFor="order-name" className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                              Full Name <span className="text-primary">*</span>
                            </label>
                            <div className="relative">
                              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/50 pointer-events-none" />
                              <input
                                type="text"
                                id="order-name"
                                autoComplete="name"
                                value={form.name}
                                onChange={(e) => handleChange("name", e.target.value)}
                                onBlur={() => handleBlur("name")}
                                placeholder="e.g. Arjun Singh"
                                className={`w-full pl-10 pr-4 py-3 bg-background text-sm text-foreground placeholder:text-muted-foreground/50 rounded-sm border transition-colors focus:outline-none ${
                                  errors.name && touched.name
                                    ? "border-destructive focus:border-destructive"
                                    : "border-border focus:border-primary"
                                }`}
                              />
                            </div>
                            {errors.name && touched.name && (
                              <p className="mt-1 text-xs text-destructive">{errors.name}</p>
                            )}
                          </div>

                          {/* Phone */}
                          <div>
                            <label htmlFor="order-phone" className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                              Phone Number <span className="text-primary">*</span>
                            </label>
                            <div className="relative">
                              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/50 pointer-events-none" />
                              <input
                                type="tel"
                                id="order-phone"
                                autoComplete="tel"
                                value={form.phone}
                                onChange={(e) => handleChange("phone", e.target.value)}
                                onBlur={() => handleBlur("phone")}
                                placeholder="e.g. 9876543210"
                                maxLength={10}
                                className={`w-full pl-10 pr-4 py-3 bg-background text-sm text-foreground placeholder:text-muted-foreground/50 rounded-sm border transition-colors focus:outline-none ${
                                  errors.phone && touched.phone
                                    ? "border-destructive focus:border-destructive"
                                    : "border-border focus:border-primary"
                                }`}
                              />
                            </div>
                            {errors.phone && touched.phone && (
                              <p className="mt-1 text-xs text-destructive">{errors.phone}</p>
                            )}
                          </div>

                          {/* Address */}
                          <div>
                            <label htmlFor="order-address" className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                              Delivery Address <span className="text-primary">*</span>
                            </label>
                            <div className="relative">
                              <MapPin className="absolute left-3.5 top-3.5 size-4 text-muted-foreground/50 pointer-events-none" />
                              <textarea
                                id="order-address"
                                autoComplete="street-address"
                                value={form.address}
                                onChange={(e) => handleChange("address", e.target.value)}
                                onBlur={() => handleBlur("address")}
                                placeholder="House no., Street, Area, Landmark, Bathinda..."
                                rows={3}
                                className={`w-full pl-10 pr-4 py-3 bg-background text-sm text-foreground placeholder:text-muted-foreground/50 rounded-sm border transition-colors focus:outline-none resize-none ${
                                  errors.address && touched.address
                                    ? "border-destructive focus:border-destructive"
                                    : "border-border focus:border-primary"
                                }`}
                              />
                            </div>
                            {errors.address && touched.address && (
                              <p className="mt-1 text-xs text-destructive">{errors.address}</p>
                            )}
                          </div>

                          {/* Submit */}
                          <button
                            type="submit"
                            disabled={submitting || isStoreClosed}
                            className="w-full flex items-center justify-center gap-2.5 min-h-13 bg-primary hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed text-primary-foreground font-bold px-8 text-xs uppercase tracking-[0.18em] transition-colors rounded-sm"
                          >
                            {submitting ? (
                              <>
                                <Loader2 className="size-4 animate-spin" />
                                Processing Order…
                              </>
                            ) : (
                              <>
                                <ShoppingBag className="size-4" />
                                {isStoreClosed ? "Closed for Orders" : `Place Order (₹${total})`}
                              </>
                            )}
                          </button>
                        </div>
                      </form>
                    )}
                  </Reveal>
                </div>
              </div>
            )}
          </>
        )}

        {/* TAB 2: TRACK & CANCEL ORDER */}
        {activeTab === "track" && (
          <Reveal className="space-y-8">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between border-b border-border pb-6">
              <div>
                <h3 className="font-display text-2xl font-extrabold uppercase tracking-tight">
                  Track & Cancel Orders
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  View real-time progress or cancel active orders.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                {/* Search Bar */}
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search Order ID / Phone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-card text-xs text-foreground placeholder:text-muted-foreground/60 rounded-sm border border-border focus:border-primary focus:outline-none"
                  />
                </div>

                {orders.length > 0 && (
                  <button
                    onClick={() => {
                      if (confirm("Are you sure you want to clear all your order history?")) {
                        clearAllOrders();
                        toast.success("Order history cleared.");
                      }
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-destructive border border-border hover:border-destructive/40 rounded-sm transition-colors"
                    title="Clear all orders from your view"
                  >
                    <Trash2 className="size-3.5" />
                    Clear All
                  </button>
                )}
              </div>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="rounded-sm border border-border bg-card p-12 text-center">
                <Clock className="mx-auto size-12 text-muted-foreground/50 mb-3" />
                <h4 className="font-display text-lg font-bold uppercase">No Orders Found</h4>
                <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                  {searchQuery
                    ? "No orders matched your search query. Try typing your 10-digit mobile number or Order ID."
                    : "You haven't placed any orders yet."}
                </p>
                <button
                  onClick={() => setActiveTab("order")}
                  className="mt-6 inline-flex items-center justify-center min-h-11 bg-primary text-primary-foreground font-semibold px-6 text-xs uppercase tracking-wider rounded-sm hover:bg-primary/90 transition-colors"
                >
                  Place New Order
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredOrders.map((order) => {
                  const isCancelled = order.status === "Cancelled";

                  return (
                    <div
                      key={order.id}
                      className="rounded-sm border border-border bg-card p-6 space-y-6"
                    >
                      {/* Header */}
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
                          <p className="text-xs text-muted-foreground mt-1">
                            Placed at {order.createdAt} • Customer: {order.name} ({order.phone})
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="font-display text-lg font-bold text-primary">
                            ₹{order.total}
                          </span>
                          {!isCancelled && order.status !== "Delivered" && (
                            <button
                              onClick={() => setCancellingId(order.id)}
                              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-destructive hover:bg-destructive/10 border border-destructive/30 px-3 py-1.5 rounded-sm transition-colors"
                            >
                              <XCircle className="size-3.5" />
                              Cancel Order
                            </button>
                          )}
                          {(isCancelled || order.status === "Delivered") && (
                            <button
                              onClick={() => {
                                if (confirm(`Remove order ${order.id} from your view?`)) {
                                  deleteOrder(order.id);
                                  toast.success("Order record cleared from your device.");
                                }
                              }}
                              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive border border-border hover:border-destructive/30 px-2.5 py-1.5 rounded-sm transition-colors"
                              title="Delete this order record from your device"
                            >
                              <Trash2 className="size-3.5" />
                              Clear Record
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Cancellation Confirmation Modal / Alert Inline */}
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
                              Yes, Cancel
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
                          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                            Live Order Status
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
                                    <StepIcon className="size-4" />
                                  </div>
                                  <span className={`text-[11px] font-bold tracking-tight ${textClass}`}>
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
                        <div className="p-4 rounded-sm bg-destructive/10 text-destructive text-xs flex items-center gap-2">
                          <XCircle className="size-4 shrink-0" />
                          <span>This order was cancelled. No further charges or delivery will occur.</span>
                        </div>
                      )}

                      {/* Order Items */}
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
                        <div className="pt-2 border-t border-border/50 flex justify-between font-bold text-foreground">
                          <span>Address</span>
                          <span className="text-muted-foreground font-normal max-w-xs truncate">{order.address}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Reveal>
        )}
      </div>
    </section>
  );
}
