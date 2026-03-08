import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, Loader2, Package, MapPin, CreditCard, Calendar, Copy } from "lucide-react";
import { format, addDays } from "date-fns";

interface OrderDetails {
  id: string;
  customer_name: string;
  customer_email: string;
  phone: string | null;
  shipping_address: string | null;
  payment_method: string | null;
  items: Array<{ name: string; price: number; quantity: number }>;
  total: number;
  status: string;
  created_at: string | null;
}

const PaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { items, removeFromCart } = useCart();
  const { user } = useAuth();
  const [status, setStatus] = useState<"verifying" | "success" | "failed">("verifying");
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const verify = async () => {
      const paymentRequestId = searchParams.get("payment_request_id");
      const paymentId = searchParams.get("payment_id");

      if (!paymentRequestId || !paymentId) {
        setStatus("failed");
        return;
      }

      try {
        const { data, error } = await supabase.functions.invoke("instamojo-payment", {
          body: {
            action: "verify_payment",
            payment_request_id: paymentRequestId,
            payment_id: paymentId,
          },
        });

        if (error || !data?.success) {
          setStatus("failed");
          toast({ title: "Payment verification failed", variant: "destructive" });
          return;
        }

        // Fetch the latest order for this user
        if (user) {
          const { data: orderData } = await supabase
            .from("orders")
            .select("*")
            .eq("user_id", user.id)
            .eq("payment_method", "instamojo")
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();

          if (orderData) {
            setOrder(orderData as unknown as OrderDetails);
          }
        }

        setStatus("success");
        items.forEach((i) => removeFromCart(i.id));
        toast({ title: "Payment successful! 🎉", description: "Your order has been placed." });
      } catch {
        setStatus("failed");
      }
    };

    verify();
  }, [searchParams]);

  const copyOrderId = () => {
    if (order?.id) {
      navigator.clipboard.writeText(order.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const estimatedDelivery = order?.created_at
    ? format(addDays(new Date(order.created_at), 5), "dd MMM yyyy")
    : format(addDays(new Date(), 5), "dd MMM yyyy");

  return (
    <div className="min-h-screen bg-background py-12 px-4 md:px-6">
      <div className="container mx-auto max-w-2xl">
        {status === "verifying" && (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <Loader2 className="w-16 h-16 text-primary mx-auto mb-4 animate-spin" />
            <h2 className="font-heading text-2xl font-bold mb-2">Verifying Payment...</h2>
            <p className="text-muted-foreground text-sm">Please wait while we confirm your payment.</p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-6">
            {/* Success Header */}
            <div className="text-center mb-8">
              <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
              <h1 className="font-heading text-3xl font-bold mb-2">Order Confirmed!</h1>
              <p className="text-muted-foreground text-sm">
                Thank you for your purchase. Your order has been placed successfully.
              </p>
            </div>

            {/* Order ID */}
            {order && (
              <div className="glass-card rounded-lg p-5 text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Order ID</p>
                <div className="flex items-center justify-center gap-2">
                  <code className="text-sm font-mono text-primary break-all">{order.id}</code>
                  <button onClick={copyOrderId} className="text-muted-foreground hover:text-primary transition-colors" title="Copy Order ID">
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                {copied && <p className="text-xs text-emerald-500 mt-1">Copied!</p>}
              </div>
            )}

            {/* Order Items */}
            {order && (
              <div className="glass-card rounded-lg p-6">
                <h3 className="font-heading text-lg font-bold mb-4 flex items-center gap-2">
                  <Package className="w-4 h-4 text-primary" /> Items Ordered
                </h3>
                <div className="space-y-3">
                  {(order.items as Array<{ name: string; price: number; quantity: number }>).map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center py-2 border-b border-border/20 last:border-0">
                      <div>
                        <p className="text-sm font-semibold">{item.name}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-bold text-primary">₹{(item.price * item.quantity).toFixed(0)}</p>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center pt-4 mt-2 border-t border-border/30">
                  <span className="font-heading font-bold">Total Paid</span>
                  <span className="font-heading text-lg font-bold text-primary">₹{order.total}</span>
                </div>
              </div>
            )}

            {/* Delivery & Payment Info */}
            <div className="grid sm:grid-cols-2 gap-4">
              {order?.shipping_address && (
                <div className="glass-card rounded-lg p-5">
                  <h4 className="text-xs text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" /> Delivery Address
                  </h4>
                  <p className="text-sm">{order.shipping_address}</p>
                  {order.phone && <p className="text-xs text-muted-foreground mt-1">📞 +91 {order.phone}</p>}
                </div>
              )}

              <div className="glass-card rounded-lg p-5 space-y-3">
                <div>
                  <h4 className="text-xs text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5" /> Payment Method
                  </h4>
                  <p className="text-sm font-semibold">Paid Online (Instamojo)</p>
                </div>
                <div>
                  <h4 className="text-xs text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" /> Estimated Delivery
                  </h4>
                  <p className="text-sm font-semibold">{estimatedDelivery}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                onClick={() => navigate("/my-orders")}
                className="btn-luxury flex-1 py-3 rounded-sm text-sm tracking-[0.15em]"
              >
                Track My Orders
              </button>
              <button
                onClick={() => navigate("/")}
                className="flex-1 py-3 rounded-sm text-sm tracking-wider border border-border/50 text-foreground hover:bg-muted/50 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}

        {status === "failed" && (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <XCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h2 className="font-heading text-2xl font-bold mb-2">Payment Failed</h2>
            <p className="text-muted-foreground text-sm mb-6">Something went wrong. Please try again or choose Cash on Delivery.</p>
            <button onClick={() => navigate("/checkout")} className="btn-luxury px-6 py-2.5 rounded-sm text-sm tracking-wider">
              Back to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentCallback;
