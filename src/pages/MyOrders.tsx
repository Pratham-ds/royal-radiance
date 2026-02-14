import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Package, Truck, CheckCircle2, Clock, XCircle, MapPin, Phone, CreditCard, ChevronDown, ChevronUp } from "lucide-react";

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  status: "pending" | "shipped" | "delivered" | "cancelled";
  created_at: string | null;
  shipping_address: string | null;
  phone: string | null;
  payment_method: string | null;
  customer_name: string;
}

const statusConfig = {
  pending: { label: "Order Placed", icon: Clock, color: "text-yellow-500", bg: "bg-yellow-500/10", step: 1 },
  shipped: { label: "Shipped", icon: Truck, color: "text-blue-500", bg: "bg-blue-500/10", step: 2 },
  delivered: { label: "Delivered", icon: CheckCircle2, color: "text-green-500", bg: "bg-green-500/10", step: 3 },
  cancelled: { label: "Cancelled", icon: XCircle, color: "text-red-500", bg: "bg-red-500/10", step: 0 },
};

const paymentLabels: Record<string, string> = {
  cod: "Cash on Delivery",
  upi: "UPI Payment",
  card: "Credit / Debit Card",
};

const TrackingTimeline = ({ status }: { status: Order["status"] }) => {
  if (status === "cancelled") {
    return (
      <div className="flex items-center gap-2 mt-4 p-3 rounded-lg bg-red-500/10">
        <XCircle className="w-5 h-5 text-red-500" />
        <span className="text-sm text-red-500 font-semibold">Order Cancelled</span>
      </div>
    );
  }

  const steps = [
    { key: "pending", label: "Order Placed", icon: Package },
    { key: "shipped", label: "Shipped", icon: Truck },
    { key: "delivered", label: "Delivered", icon: CheckCircle2 },
  ];

  const currentStep = statusConfig[status].step;

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between relative">
        {/* Line */}
        <div className="absolute top-5 left-[10%] right-[10%] h-0.5 bg-border/50" />
        <div
          className="absolute top-5 left-[10%] h-0.5 bg-primary transition-all duration-500"
          style={{ width: `${Math.max(0, (currentStep - 1) * 40)}%` }}
        />

        {steps.map((step, idx) => {
          const done = currentStep > idx;
          const active = currentStep === idx + 1;
          return (
            <div key={step.key} className="flex flex-col items-center z-10 flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  done
                    ? "bg-primary text-primary-foreground"
                    : active
                    ? "bg-primary/20 text-primary border-2 border-primary"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <step.icon className="w-4 h-4" />
              </div>
              <span className={`text-[11px] mt-2 font-medium ${done || active ? "text-foreground" : "text-muted-foreground"}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const OrderCard = ({ order }: { order: Order }) => {
  const [expanded, setExpanded] = useState(false);
  const config = statusConfig[order.status];
  const items = Array.isArray(order.items) ? (order.items as OrderItem[]) : [];
  const date = order.created_at ? new Date(order.created_at) : null;

  return (
    <div className="glass-card rounded-lg overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/20 transition-colors"
      >
        <div className="flex items-center gap-4 min-w-0">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${config.bg}`}>
            <config.icon className={`w-5 h-5 ${config.color}`} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold truncate">
              {items.length} item{items.length !== 1 ? "s" : ""} · <span className="text-primary">₹{order.total}</span>
            </p>
            <p className="text-xs text-muted-foreground">
              {date ? date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}{" "}
              · <span className={config.color}>{config.label}</span>
            </p>
          </div>
        </div>
        {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>

      {expanded && (
        <div className="px-5 pb-5 space-y-4 animate-fade-in">
          {/* Tracking */}
          <TrackingTimeline status={order.status} />

          {/* Items */}
          <div className="mt-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Items</p>
            <div className="space-y-2">
              {items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span>
                    {item.name} <span className="text-muted-foreground">× {item.quantity}</span>
                  </span>
                  <span className="font-semibold">₹{(item.price * item.quantity).toFixed(0)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="grid sm:grid-cols-2 gap-3 pt-3 border-t border-border/30">
            {order.shipping_address && (
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Delivery Address</p>
                  <p className="text-xs">{order.shipping_address}</p>
                </div>
              </div>
            )}
            {order.phone && (
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Phone</p>
                  <p className="text-xs">+91 {order.phone}</p>
                </div>
              </div>
            )}
            {order.payment_method && (
              <div className="flex items-start gap-2">
                <CreditCard className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Payment</p>
                  <p className="text-xs">{paymentLabels[order.payment_method] || order.payment_method}</p>
                </div>
              </div>
            )}
          </div>

          <p className="text-[10px] text-muted-foreground text-right">
            Order ID: {order.id.slice(0, 8).toUpperCase()}
          </p>
        </div>
      )}
    </div>
  );
};

const MyOrders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchOrders = async () => {
      const { data } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (data) setOrders(data as unknown as Order[]);
      setLoading(false);
    };

    fetchOrders();

    // Realtime updates
    const channel = supabase
      .channel("my-orders")
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "orders", filter: `user_id=eq.${user.id}` }, (payload) => {
        setOrders((prev) => prev.map((o) => (o.id === payload.new.id ? { ...o, ...payload.new } as Order : o)));
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pt-24">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-24 px-4 md:px-6">
      <div className="container mx-auto max-w-2xl">
        <button onClick={() => navigate("/")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <h1 className="font-heading text-3xl md:text-4xl font-bold gold-gradient-text mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h2 className="font-heading text-xl font-bold mb-2">No orders yet</h2>
            <p className="text-muted-foreground text-sm mb-6">Your order history will appear here</p>
            <button onClick={() => navigate("/")} className="btn-luxury px-6 py-2.5 rounded-sm text-sm tracking-wider">
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
