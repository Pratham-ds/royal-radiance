import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useUserSubscriptions, useSubscriptionMutations } from "@/hooks/useSubscriptions";
import { useUserCoupons, useCheckBirthday, useGenerateBirthdayCoupon } from "@/hooks/useBirthdayCoupons";
import { useSavedAddresses, useAddressMutations, SavedAddress } from "@/hooks/useSavedAddresses";
import { useSiteSettings } from "@/hooks/useProducts";
import { useProducts } from "@/hooks/useProducts";
import { toast } from "@/hooks/use-toast";
import {
  ArrowLeft, Package, RefreshCw, MapPin, Gift, Tag, Pause, Play,
  XCircle, Plus, Trash2, Edit2, X, Star, Cake, Copy, Home, Briefcase,
} from "lucide-react";

const freqLabels: Record<string, string> = { "30_days": "Every 30 Days", "60_days": "Every 60 Days" };

const UserDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"orders" | "subscriptions" | "addresses" | "coupons" | "profile">("orders");
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [dob, setDob] = useState("");
  const [savingDob, setSavingDob] = useState(false);

  const { data: subscriptions = [] } = useUserSubscriptions(user?.id);
  const { updateStatus } = useSubscriptionMutations();
  const { data: coupons = [] } = useUserCoupons(user?.id);
  const { data: birthdayData } = useCheckBirthday(user?.id);
  const generateCoupon = useGenerateBirthdayCoupon();
  const { data: addresses = [] } = useSavedAddresses(user?.id);
  const { create: createAddr, remove: removeAddr } = useAddressMutations();
  const { data: siteSettings } = useSiteSettings();
  const { data: products = [] } = useProducts();

  const [showAddrForm, setShowAddrForm] = useState(false);
  const [addrForm, setAddrForm] = useState({ label: "Home", full_name: "", phone: "", address: "", city: "", state: "", pincode: "" });

  useEffect(() => {
    if (!user) { navigate("/login"); return; }

    const fetchData = async () => {
      const [{ data: orderData }, { data: profileData }] = await Promise.all([
        supabase.from("orders").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle(),
      ]);
      if (orderData) setOrders(orderData);
      if (profileData) {
        setProfile(profileData);
        setDob(profileData.date_of_birth || "");
      }
      setLoadingOrders(false);
    };
    fetchData();
  }, [user, navigate]);

  const handleSaveDob = async () => {
    if (!user || !dob) return;
    setSavingDob(true);
    await supabase.from("profiles").update({ date_of_birth: dob } as any).eq("user_id", user.id);
    toast({ title: "Date of birth saved!" });
    setSavingDob(false);
  };

  const handleGenerateCoupon = async () => {
    if (!user || !siteSettings) return;
    const settings = siteSettings as any;
    try {
      const code = await generateCoupon.mutateAsync({
        userId: user.id,
        discountPercent: settings.birthday_discount_percent || 15,
        validityDays: settings.birthday_coupon_validity_days || 7,
      });
      toast({ title: "🎂 Birthday coupon generated!", description: `Use code: ${code}` });
    } catch {
      toast({ title: "Coupon already exists or error occurred", variant: "destructive" });
    }
  };

  const handleSaveAddr = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    await createAddr.mutateAsync({ ...addrForm, user_id: user.id, is_default: addresses.length === 0 });
    toast({ title: "Address saved" });
    setShowAddrForm(false);
    setAddrForm({ label: "Home", full_name: "", phone: "", address: "", city: "", state: "", pincode: "" });
  };

  const tabs = [
    { id: "orders" as const, label: "Orders", icon: Package },
    { id: "subscriptions" as const, label: "Subscriptions", icon: RefreshCw },
    { id: "addresses" as const, label: "Addresses", icon: MapPin },
    { id: "coupons" as const, label: "Coupons", icon: Tag },
    { id: "profile" as const, label: "Profile", icon: Cake },
  ];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background py-24 px-4 md:px-6">
      <div className="container mx-auto max-w-4xl">
        <button onClick={() => navigate("/")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {/* Birthday Banner */}
        {birthdayData?.isBirthday && (
          <div className="glass-card rounded-lg p-4 mb-6 gold-glow flex items-center gap-4 animate-fade-in">
            <Cake className="w-8 h-8 text-primary" />
            <div className="flex-1">
              <p className="font-heading text-lg font-bold gold-gradient-text">🎂 Happy Birthday!</p>
              <p className="text-sm text-foreground/70">Enjoy a special discount on us today!</p>
            </div>
            {!birthdayData.coupon && (
              <button onClick={handleGenerateCoupon} className="btn-luxury px-4 py-2 rounded-sm text-xs tracking-wider">
                Claim Gift
              </button>
            )}
          </div>
        )}

        <h1 className="font-heading text-3xl font-bold gold-gradient-text mb-6">My Dashboard</h1>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-sm text-sm font-medium whitespace-nowrap transition-all ${
                tab === t.id ? "bg-primary text-primary-foreground" : "bg-muted/50 text-muted-foreground hover:text-foreground"
              }`}
            >
              <t.icon className="w-4 h-4" /> {t.label}
            </button>
          ))}
        </div>

        {/* Orders Tab */}
        {tab === "orders" && (
          <div className="space-y-3">
            {loadingOrders ? (
              <div className="text-center py-8"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" /></div>
            ) : orders.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No orders yet</p>
            ) : (
              orders.map((o) => (
                <div key={o.id} className="glass-card rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-bold">₹{o.total} · <span className="capitalize text-primary">{o.status}</span></p>
                      <p className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                    </div>
                    <span className="text-[10px] text-muted-foreground">{o.id.slice(0, 8).toUpperCase()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Subscriptions Tab */}
        {tab === "subscriptions" && (
          <div className="space-y-3">
            {subscriptions.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No active subscriptions</p>
            ) : (
              subscriptions.map((s) => {
                const product = products.find((p) => p.id === s.product_id);
                return (
                  <div key={s.id} className="glass-card rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-bold">{product?.name || "Product"}</p>
                        <p className="text-xs text-muted-foreground">{freqLabels[s.frequency]} · {s.discount_percent}% off</p>
                        <p className="text-xs text-muted-foreground">Next: {new Date(s.next_delivery_date).toLocaleDateString("en-IN")}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${
                          s.status === "active" ? "text-green-500 bg-green-500/10" :
                          s.status === "paused" ? "text-yellow-500 bg-yellow-500/10" : "text-red-500 bg-red-500/10"
                        }`}>{s.status}</span>
                        {s.status === "active" && (
                          <button onClick={() => updateStatus.mutateAsync({ id: s.id, status: "paused" })} className="p-1 text-muted-foreground hover:text-yellow-500"><Pause className="w-4 h-4" /></button>
                        )}
                        {s.status === "paused" && (
                          <button onClick={() => updateStatus.mutateAsync({ id: s.id, status: "active" })} className="p-1 text-muted-foreground hover:text-green-500"><Play className="w-4 h-4" /></button>
                        )}
                        {s.status !== "cancelled" && (
                          <button onClick={() => updateStatus.mutateAsync({ id: s.id, status: "cancelled" })} className="p-1 text-muted-foreground hover:text-destructive"><XCircle className="w-4 h-4" /></button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Addresses Tab */}
        {tab === "addresses" && (
          <div>
            <button onClick={() => setShowAddrForm(true)} className="btn-luxury px-4 py-2 rounded-sm text-sm tracking-wider flex items-center gap-2 mb-4">
              <Plus className="w-4 h-4" /> Add Address
            </button>
            {showAddrForm && (
              <form onSubmit={handleSaveAddr} className="glass-card rounded-lg p-6 mb-4 animate-fade-in space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-heading font-bold">New Address</h3>
                  <button type="button" onClick={() => setShowAddrForm(false)} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wider">Label</label>
                    <select value={addrForm.label} onChange={(e) => setAddrForm({ ...addrForm, label: e.target.value })} className="w-full bg-muted/50 border border-border/50 rounded-sm px-3 py-2.5 text-sm text-foreground mt-1">
                      <option>Home</option><option>Work</option><option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wider">Full Name *</label>
                    <input required value={addrForm.full_name} onChange={(e) => setAddrForm({ ...addrForm, full_name: e.target.value })} className="w-full bg-muted/50 border border-border/50 rounded-sm px-3 py-2.5 text-sm text-foreground mt-1 focus:outline-none focus:border-primary/50" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wider">Phone *</label>
                  <input required value={addrForm.phone} onChange={(e) => setAddrForm({ ...addrForm, phone: e.target.value.replace(/\D/g, "") })} maxLength={10} className="w-full bg-muted/50 border border-border/50 rounded-sm px-3 py-2.5 text-sm text-foreground mt-1 focus:outline-none focus:border-primary/50" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wider">Address *</label>
                  <textarea required value={addrForm.address} onChange={(e) => setAddrForm({ ...addrForm, address: e.target.value })} className="w-full bg-muted/50 border border-border/50 rounded-sm px-3 py-2.5 text-sm text-foreground mt-1 h-20 focus:outline-none focus:border-primary/50" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div><label className="text-xs text-muted-foreground uppercase tracking-wider">City *</label><input required value={addrForm.city} onChange={(e) => setAddrForm({ ...addrForm, city: e.target.value })} className="w-full bg-muted/50 border border-border/50 rounded-sm px-3 py-2.5 text-sm text-foreground mt-1 focus:outline-none focus:border-primary/50" /></div>
                  <div><label className="text-xs text-muted-foreground uppercase tracking-wider">State *</label><input required value={addrForm.state} onChange={(e) => setAddrForm({ ...addrForm, state: e.target.value })} className="w-full bg-muted/50 border border-border/50 rounded-sm px-3 py-2.5 text-sm text-foreground mt-1 focus:outline-none focus:border-primary/50" /></div>
                  <div><label className="text-xs text-muted-foreground uppercase tracking-wider">Pincode *</label><input required value={addrForm.pincode} onChange={(e) => setAddrForm({ ...addrForm, pincode: e.target.value.replace(/\D/g, "") })} maxLength={6} className="w-full bg-muted/50 border border-border/50 rounded-sm px-3 py-2.5 text-sm text-foreground mt-1 focus:outline-none focus:border-primary/50" /></div>
                </div>
                <button type="submit" className="btn-luxury px-6 py-2.5 rounded-sm text-sm tracking-wider">Save Address</button>
              </form>
            )}
            <div className="space-y-3">
              {addresses.map((a) => (
                <div key={a.id} className="glass-card rounded-lg p-4 flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {a.label === "Home" ? <Home className="w-4 h-4 text-primary" /> : <Briefcase className="w-4 h-4 text-primary" />}
                      <span className="text-sm font-bold">{a.label}</span>
                      {a.is_default && <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded">Default</span>}
                    </div>
                    <p className="text-xs text-foreground/70">{a.full_name} · +91 {a.phone}</p>
                    <p className="text-xs text-muted-foreground">{a.address}, {a.city}, {a.state} - {a.pincode}</p>
                  </div>
                  <button onClick={() => removeAddr.mutateAsync(a.id)} className="p-1.5 text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
              {addresses.length === 0 && <p className="text-center text-muted-foreground py-8">No saved addresses</p>}
            </div>
          </div>
        )}

        {/* Coupons Tab */}
        {tab === "coupons" && (
          <div className="space-y-3">
            {coupons.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No coupons available</p>
            ) : (
              coupons.map((c) => {
                const isExpired = new Date(c.valid_until) < new Date();
                return (
                  <div key={c.id} className={`glass-card rounded-lg p-4 ${c.is_used || isExpired ? "opacity-50" : ""}`}>
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="flex items-center gap-2">
                          <Gift className="w-4 h-4 text-primary" />
                          <span className="font-heading font-bold text-sm">{c.discount_percent}% OFF</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Valid: {new Date(c.valid_from).toLocaleDateString("en-IN")} — {new Date(c.valid_until).toLocaleDateString("en-IN")}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <code className="text-xs bg-muted px-2 py-1 rounded font-mono text-primary">{c.coupon_code}</code>
                        {!c.is_used && !isExpired && (
                          <button
                            onClick={() => { navigator.clipboard.writeText(c.coupon_code); toast({ title: "Copied!" }); }}
                            className="p-1 text-muted-foreground hover:text-primary"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        )}
                        {c.is_used && <span className="text-[10px] text-muted-foreground">Used</span>}
                        {isExpired && !c.is_used && <span className="text-[10px] text-red-500">Expired</span>}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Profile Tab */}
        {tab === "profile" && (
          <div className="glass-card rounded-lg p-6 space-y-6">
            <div>
              <h3 className="font-heading text-lg font-bold mb-4">Profile Information</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wider">Name</label>
                  <p className="text-sm mt-1">{profile?.full_name || user?.user_metadata?.full_name || "—"}</p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wider">Email</label>
                  <p className="text-sm mt-1">{user?.email || "—"}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-border/30 pt-6">
              <h3 className="font-heading text-lg font-bold mb-2 flex items-center gap-2">
                <Cake className="w-5 h-5 text-primary" /> Birthday Discount
              </h3>
              <p className="text-xs text-muted-foreground mb-4">
                {profile?.date_of_birth 
                  ? "Your birthday discount will be automatically applied when you shop on your birthday!"
                  : "Add your date of birth to receive a special discount coupon on your birthday! (can only be set once)"}
              </p>
              {profile?.date_of_birth ? (
                <div className="flex items-center gap-3">
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wider">Date of Birth</label>
                    <p className="text-sm mt-1 text-foreground">{new Date(profile.date_of_birth).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground bg-muted/50 px-2 py-1 rounded">Locked</span>
                </div>
              ) : (
                <div className="flex gap-3 items-end">
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wider">Date of Birth</label>
                    <input
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full bg-muted/50 border border-border/50 rounded-sm px-3 py-2.5 text-sm text-foreground mt-1 focus:outline-none focus:border-primary/50"
                    />
                  </div>
                  <button onClick={handleSaveDob} disabled={savingDob || !dob} className="btn-luxury px-4 py-2.5 rounded-sm text-sm tracking-wider disabled:opacity-50">
                    {savingDob ? "Saving..." : "Save"}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
