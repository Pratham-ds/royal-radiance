import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CartDrawer = () => {
  const { items, isOpen, closeCart, removeFromCart, updateQuantity, subtotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [checkingOut, setCheckingOut] = useState(false);

  if (!isOpen) return null;

  const handleCheckout = async () => {
    if (!user) {
      toast({ title: "Please sign in to checkout" });
      closeCart();
      navigate("/login");
      return;
    }

    setCheckingOut(true);
    try {
      const { error } = await supabase.from("orders").insert({
        user_id: user.id,
        customer_name: user.user_metadata?.full_name || user.email || "Customer",
        customer_email: user.email || "",
        items: items.map((i) => ({ name: i.name, price: i.price, quantity: i.quantity })),
        total: subtotal,
        status: "pending" as const,
      });
      if (error) throw error;

      // Clear cart
      items.forEach((i) => removeFromCart(i.id));
      toast({ title: "Order placed!", description: "Your royal order has been submitted." });
      closeCart();
    } catch (e: any) {
      toast({ title: "Checkout failed", description: e.message, variant: "destructive" });
    } finally {
      setCheckingOut(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-background/60 backdrop-blur-sm z-50" onClick={closeCart} />
      <div className="fixed top-0 right-0 h-full w-full max-w-md z-50 glass-card border-l border-border/30 animate-slide-in-right flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-border/30">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary" />
            <h2 className="font-heading text-lg font-bold">Your Cart</h2>
          </div>
          <button onClick={closeCart} className="text-foreground/50 hover:text-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="w-12 h-12 text-muted-foreground/30 mb-4" />
              <p className="font-heading text-lg text-foreground/50 mb-1">Your cart is empty</p>
              <p className="text-sm text-muted-foreground">Add something exquisite</p>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-20 h-20 rounded-sm overflow-hidden flex-shrink-0 bg-muted/30">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-heading text-sm font-semibold truncate">{item.name}</h4>
                    <p className="text-primary font-heading text-sm font-bold mt-1">${item.price.toFixed(2)}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center border border-border/50 rounded-sm">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2 py-1 text-foreground/50 hover:text-primary transition-colors">
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 py-1 text-foreground/50 hover:text-primary transition-colors">
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="text-xs text-muted-foreground hover:text-destructive transition-colors">
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-border/30 p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-muted-foreground uppercase tracking-wider">Subtotal</span>
              <span className="font-heading text-xl font-bold text-primary">${subtotal.toFixed(2)}</span>
            </div>
            <button
              onClick={handleCheckout}
              disabled={checkingOut}
              className="btn-luxury w-full py-3.5 rounded-sm text-sm tracking-[0.2em] gold-glow disabled:opacity-50"
            >
              {checkingOut ? "Processing..." : "Proceed to Checkout"}
            </button>
            <p className="text-[10px] text-center text-muted-foreground mt-3 tracking-wider">
              Taxes & shipping calculated at checkout
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
