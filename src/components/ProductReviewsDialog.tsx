import { Star, BadgeCheck, User, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ProductReviewsDialogProps {
  productId: string;
  productName: string;
  open: boolean;
  onClose: () => void;
}

interface Review {
  id: string;
  customer_name: string;
  rating: number;
  review_text: string;
  customer_photo_url: string | null;
  is_verified_purchase: boolean;
  created_at: string;
}

const ProductReviewsDialog = ({ productId, productName, open, onClose }: ProductReviewsDialogProps) => {
  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["product-reviews", productId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .eq("product_id", productId)
        .eq("is_approved", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Review[];
    },
    enabled: open && !!productId,
  });

  if (!open) return null;

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "0";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg max-h-[80vh] glass-card rounded-lg gold-glow overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-border/30 flex items-center justify-between shrink-0">
          <div>
            <h3 className="font-heading text-xl font-bold text-foreground">{productName}</h3>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-3.5 h-3.5 ${i < Math.round(Number(avgRating)) ? "fill-primary text-primary" : "fill-muted text-muted"}`} />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">{avgRating} · {reviews.length} Review{reviews.length !== 1 ? "s" : ""}</span>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center text-foreground/60 hover:text-primary transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Reviews list */}
        <div className="overflow-y-auto p-6 space-y-5 flex-1">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : reviews.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-8">No reviews yet for this product.</p>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="bg-muted/30 rounded-lg p-4 border border-border/20">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-primary/20 shrink-0">
                    {review.customer_photo_url ? (
                      <img src={review.customer_photo_url} alt={review.customer_name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <User className="w-5 h-5 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-heading text-sm font-semibold text-foreground truncate">{review.customer_name}</span>
                      {review.is_verified_purchase && (
                        <span className="flex items-center gap-0.5 text-[10px] text-primary bg-primary/10 px-1.5 py-0.5 rounded-full shrink-0">
                          <BadgeCheck className="w-3 h-3" /> Verified
                        </span>
                      )}
                    </div>
                    <div className="flex gap-0.5 mt-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < review.rating ? "fill-primary text-primary" : "fill-muted text-muted"}`} />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-foreground/70 leading-relaxed">{review.review_text}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductReviewsDialog;
