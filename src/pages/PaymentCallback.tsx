import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/context/CartContext";
import { toast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

const PaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { items, removeFromCart } = useCart();
  const [status, setStatus] = useState<"verifying" | "success" | "failed">("verifying");

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

        setStatus("success");
        // Clear cart
        items.forEach((i) => removeFromCart(i.id));
        toast({ title: "Payment successful! 🎉", description: "Your order has been placed." });
      } catch {
        setStatus("failed");
      }
    };

    verify();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        {status === "verifying" && (
          <>
            <Loader2 className="w-16 h-16 text-primary mx-auto mb-4 animate-spin" />
            <h2 className="font-heading text-2xl font-bold mb-2">Verifying Payment...</h2>
            <p className="text-muted-foreground text-sm">Please wait while we confirm your payment.</p>
          </>
        )}
        {status === "success" && (
          <>
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="font-heading text-2xl font-bold mb-2">Payment Successful!</h2>
            <p className="text-muted-foreground text-sm mb-6">Your order has been placed and will be delivered soon.</p>
            <button onClick={() => navigate("/my-orders")} className="btn-luxury px-6 py-2.5 rounded-sm text-sm tracking-wider">
              View My Orders
            </button>
          </>
        )}
        {status === "failed" && (
          <>
            <XCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h2 className="font-heading text-2xl font-bold mb-2">Payment Failed</h2>
            <p className="text-muted-foreground text-sm mb-6">Something went wrong. Please try again or choose Cash on Delivery.</p>
            <button onClick={() => navigate("/checkout")} className="btn-luxury px-6 py-2.5 rounded-sm text-sm tracking-wider">
              Back to Checkout
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentCallback;
