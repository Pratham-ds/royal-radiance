import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Phone, CreditCard, Banknote, Smartphone, ShoppingBag, Cake } from "lucide-react";
import { useCheckBirthday } from "@/hooks/useBirthdayCoupons";

const paymentMethods = [
  { id: "cod", label: "Cash on Delivery", icon: Banknote, description: "Pay when your order arrives" },
  { id: "upi", label: "UPI Payment", icon: Smartphone, description: "GPay, PhonePe, Paytm" },
  { id: "card", label: "Credit / Debit Card", icon: CreditCard, description: "Visa, Mastercard, RuPay" },
];

const Checkout = () => {
  const { items, subtotal, removeFromCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const { data: birthdayData } = useCheckBirthday(user?.id);
  const [form, setForm] = useState({
    fullName: user?.user_metadata?.full_name || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    paymentMethod: "cod",
  });

  const shippingCharge = subtotal >= 999 ? 0 : 79;
  const birthdayDiscount = birthdayData?.isBirthday && birthdayData?.coupon
    ? Math.round(subtotal * (birthdayData.coupon.discount_percent / 100))
    : 0;
  const total = subtotal + shippingCharge - birthdayDiscount;

  const update = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ title: "Please sign in to place an order" });
      navigate("/login");
      return;
    }
    if (!form.fullName || !form.phone || !form.address || !form.city || !form.state || !form.pincode) {
      toast({ title: "Please fill all delivery details", variant: "destructive" });
      return;
    }
    if (form.phone.length < 10) {
      toast({ title: "Enter a valid phone number", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      const shippingAddress = `${form.address}, ${form.city}, ${form.state} - ${form.pincode}`;
      const { error } = await supabase.from("orders").insert({
        user_id: user.id,
        customer_name: form.fullName,
        customer_email: form.email || user.email || "",
        phone: form.phone,
        shipping_address: shippingAddress,
        payment_method: form.paymentMethod,
        items: items.map((i) => ({ name: i.name, price: i.price, quantity: i.quantity })),
        total,
        status: "pending" as const,
      });
      if (error) throw error;

      items.forEach((i) => removeFromCart(i.id));
      toast({ title: "Order placed successfully! 🎉", description: "You will receive confirmation shortly." });
      navigate("/");
    } catch (err: any) {
      toast({ title: "Order failed", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h2 className="font-heading text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground text-sm mb-6">Add products before checking out</p>
          <button onClick={() => navigate("/")} className="btn-luxury px-6 py-2.5 rounded-sm text-sm tracking-wider">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4 md:px-6">
      <div className="container mx-auto max-w-5xl">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <h1 className="font-heading text-3xl md:text-4xl font-bold gold-gradient-text mb-8">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left: Delivery Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact */}
              <div className="glass-card rounded-lg p-6">
                <h3 className="font-heading text-lg font-bold mb-4 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary" /> Contact Information
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wider">Full Name *</label>
                    <input required value={form.fullName} onChange={(e) => update("fullName", e.target.value)} className="w-full bg-muted/50 border border-border/50 rounded-sm px-3 py-2.5 text-sm text-foreground mt-1 focus:outline-none focus:border-primary/50" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wider">Email</label>
                    <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} className="w-full bg-muted/50 border border-border/50 rounded-sm px-3 py-2.5 text-sm text-foreground mt-1 focus:outline-none focus:border-primary/50" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs text-muted-foreground uppercase tracking-wider">Phone Number *</label>
                    <div className="flex mt-1">
                      <span className="bg-muted/80 border border-border/50 border-r-0 rounded-l-sm px-3 py-2.5 text-sm text-muted-foreground">+91</span>
                      <input required type="tel" maxLength={10} pattern="[0-9]{10}" value={form.phone} onChange={(e) => update("phone", e.target.value.replace(/\D/g, ""))} placeholder="10-digit mobile number" className="flex-1 bg-muted/50 border border-border/50 rounded-r-sm px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/50" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="glass-card rounded-lg p-6">
                <h3 className="font-heading text-lg font-bold mb-4 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" /> Delivery Address
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wider">Address *</label>
                    <textarea required value={form.address} onChange={(e) => update("address", e.target.value)} placeholder="House no., Building, Street, Area" className="w-full bg-muted/50 border border-border/50 rounded-sm px-3 py-2.5 text-sm text-foreground mt-1 h-20 focus:outline-none focus:border-primary/50" />
                  </div>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs text-muted-foreground uppercase tracking-wider">City *</label>
                      <input required value={form.city} onChange={(e) => update("city", e.target.value)} className="w-full bg-muted/50 border border-border/50 rounded-sm px-3 py-2.5 text-sm text-foreground mt-1 focus:outline-none focus:border-primary/50" />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground uppercase tracking-wider">State *</label>
                      <input required value={form.state} onChange={(e) => update("state", e.target.value)} className="w-full bg-muted/50 border border-border/50 rounded-sm px-3 py-2.5 text-sm text-foreground mt-1 focus:outline-none focus:border-primary/50" />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground uppercase tracking-wider">Pincode *</label>
                      <input required maxLength={6} pattern="[0-9]{6}" value={form.pincode} onChange={(e) => update("pincode", e.target.value.replace(/\D/g, ""))} className="w-full bg-muted/50 border border-border/50 rounded-sm px-3 py-2.5 text-sm text-foreground mt-1 focus:outline-none focus:border-primary/50" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="glass-card rounded-lg p-6">
                <h3 className="font-heading text-lg font-bold mb-4 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-primary" /> Payment Method
                </h3>
                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center gap-4 p-4 rounded-sm border cursor-pointer transition-all ${
                        form.paymentMethod === method.id
                          ? "border-primary/50 bg-primary/5"
                          : "border-border/30 hover:border-border/60"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={method.id}
                        checked={form.paymentMethod === method.id}
                        onChange={(e) => update("paymentMethod", e.target.value)}
                        className="accent-primary"
                      />
                      <method.icon className={`w-5 h-5 ${form.paymentMethod === method.id ? "text-primary" : "text-muted-foreground"}`} />
                      <div>
                        <p className="text-sm font-semibold">{method.label}</p>
                        <p className="text-xs text-muted-foreground">{method.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-1">
              <div className="glass-card rounded-lg p-6 sticky top-6">
                <h3 className="font-heading text-lg font-bold mb-4">Order Summary</h3>
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <img src={item.image} alt={item.name} className="w-14 h-14 rounded-sm object-cover bg-muted/30" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{item.name}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-bold text-primary">₹{(item.price * item.quantity).toFixed(0)}</p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border/30 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{subtotal.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className={shippingCharge === 0 ? "text-green-500" : ""}>
                      {shippingCharge === 0 ? "FREE" : `₹${shippingCharge}`}
                    </span>
                  </div>
                  {shippingCharge > 0 && (
                    <p className="text-[10px] text-muted-foreground">Free shipping on orders above ₹999</p>
                  )}
                  {birthdayDiscount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Cake className="w-3 h-3 text-primary" /> Birthday Discount
                      </span>
                      <span className="text-green-500">-₹{birthdayDiscount}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-heading text-lg font-bold pt-2 border-t border-border/20">
                    <span>Total</span>
                    <span className="text-primary">₹{total.toFixed(0)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-luxury w-full py-3.5 rounded-sm text-sm tracking-[0.2em] gold-glow mt-6 disabled:opacity-50"
                >
                  {submitting ? "Placing Order..." : "Place Order"}
                </button>
                <p className="text-[10px] text-center text-muted-foreground mt-3 tracking-wider">
                  Secure checkout · 100% genuine products
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
