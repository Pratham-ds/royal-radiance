import { useState } from "react";
import { RefreshCw, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useSubscriptionMutations } from "@/hooks/useSubscriptions";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface Props {
  productId: string;
  productName: string;
  price: number;
}

const SubscribeBadge = ({ productId, productName, price }: Props) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { create } = useSubscriptionMutations();
  const [showModal, setShowModal] = useState(false);
  const [frequency, setFrequency] = useState<"30_days" | "60_days">("30_days");
  const [submitting, setSubmitting] = useState(false);

  const discountedPrice = Math.round(price * 0.9);

  const handleSubscribe = async () => {
    if (!user) {
      toast({ title: "Please sign in to subscribe" });
      navigate("/login");
      return;
    }
    setSubmitting(true);
    try {
      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + (frequency === "30_days" ? 30 : 60));
      await create.mutateAsync({
        user_id: user.id,
        product_id: productId,
        frequency,
        status: "active",
        discount_percent: 10,
        next_delivery_date: nextDate.toISOString().split("T")[0],
      });
      toast({ title: "Subscribed! 🎉", description: `${productName} will be auto-delivered every ${frequency === "30_days" ? "30" : "60"} days.` });
      setShowModal(false);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
    setSubmitting(false);
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-1.5 text-xs bg-accent/20 text-accent-foreground border border-accent/30 px-3 py-1.5 rounded-sm hover:bg-accent/30 transition-colors"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        Subscribe & Save 10%
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4" onClick={() => setShowModal(false)}>
          <div className="glass-card rounded-lg p-6 max-w-sm w-full gold-glow animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-heading text-lg font-bold">Subscribe & Save</h3>
              <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
            </div>

            <p className="text-sm text-foreground/70 mb-4">{productName}</p>

            <div className="flex items-baseline gap-2 mb-6">
              <span className="font-heading text-2xl font-bold text-primary">₹{discountedPrice}</span>
              <span className="text-sm text-muted-foreground line-through">₹{price}</span>
              <span className="text-xs text-accent-foreground bg-accent/20 px-1.5 py-0.5 rounded">10% OFF</span>
            </div>

            <div className="space-y-3 mb-6">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Delivery Frequency</p>
              {(["30_days", "60_days"] as const).map((f) => (
                <label key={f} className={`flex items-center gap-3 p-3 rounded-sm border cursor-pointer transition-all ${frequency === f ? "border-primary/50 bg-primary/5" : "border-border/30"}`}>
                  <input type="radio" name="freq" checked={frequency === f} onChange={() => setFrequency(f)} className="accent-primary" />
                  <span className="text-sm">{f === "30_days" ? "Every 30 Days" : "Every 60 Days"}</span>
                </label>
              ))}
            </div>

            <p className="text-[10px] text-muted-foreground mb-4">Cancel anytime from your dashboard. No penalties.</p>

            <button onClick={handleSubscribe} disabled={submitting} className="btn-luxury w-full py-3 rounded-sm text-sm tracking-[0.15em] disabled:opacity-50">
              {submitting ? "Processing..." : "Subscribe Now"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SubscribeBadge;
