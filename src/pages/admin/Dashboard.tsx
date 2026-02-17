import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DollarSign, ShoppingCart, Users, Package, AlertTriangle, TrendingUp, Cake } from "lucide-react";

const StatCard = ({ icon: Icon, label, value, accent = false }: { icon: any; label: string; value: string | number; accent?: boolean }) => (
  <div className={`glass-card rounded-lg p-6 {accent ? "gold-glow border-primary/30" : ""}`}>
    <div className="flex items-center justify-between mb-3">
      <Icon className={`w-5 h-5 {accent ? "text-primary" : "text-muted-foreground"}`} />
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</span>
    </div>
    <p className={`font-heading text-2xl font-bold {accent ? "text-primary" : "text-foreground"}`}>{value}</p>
  </div>
);

const Dashboard = () => {
  const { data: products } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*");
      if (error) throw error;
      return data;
    },
  });

  const { data: orders } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: profiles } = useQuery({
    queryKey: ["admin-customers"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*");
      if (error) throw error;
      return data;
    },
  });

  const totalRevenue = orders?.reduce((sum, o) => sum + Number(o.total), 0) ?? 0;
  const inStockCount = products?.filter((p) => p.status === "in_stock").length ?? 0;
  const lowStock = products?.filter((p) => p.stock_quantity > 0 && p.stock_quantity <= 5) ?? [];

  // Birthday customers - today's birthdays
  const today = new Date();
  const todayBirthdays = profiles?.filter((p) => {
    if (!p.date_of_birth) return false;
    const dob = new Date(p.date_of_birth);
    return dob.getMonth() === today.getMonth() && dob.getDate() === today.getDate();
  }) ?? [];

  // Upcoming birthdays (next 7 days)
  const upcomingBirthdays = profiles?.filter((p) => {
    if (!p.date_of_birth) return false;
    const dob = new Date(p.date_of_birth);
    const thisYearBday = new Date(today.getFullYear(), dob.getMonth(), dob.getDate());
    if (thisYearBday < today) thisYearBday.setFullYear(thisYearBday.getFullYear() + 1);
    const diffDays = Math.ceil((thisYearBday.getTime() - today.getTime()) / 86400000);
    return diffDays > 0 && diffDays <= 7;
  }) ?? [];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold gold-gradient-text">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Welcome to Medieval Admin</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={ShoppingCart} label="Total Orders" value={orders?.length ?? 0} />
        <StatCard icon={DollarSign} label="Revenue" value={`₹${totalRevenue.toFixed(2)}`} accent />
        <StatCard icon={Users} label="Customers" value={profiles?.length ?? 0} />
        <StatCard icon={Package} label="In Stock" value={inStockCount} />
      </div>

      {/* Low stock alerts */}
      {lowStock.length > 0 && (
        <div className="glass-card rounded-lg p-6 mb-8 border-primary/20">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-primary animate-pulse-glow" />
            <h3 className="font-heading text-lg font-bold text-primary">Low Stock Alert</h3>
          </div>
          <div className="space-y-2">
            {lowStock.map((p) => (
              <div key={p.id} className="flex items-center justify-between py-2 border-b border-border/20 last:border-0">
                <span className="text-sm">{p.name}</span>
                <span className="text-xs text-primary font-bold">{p.stock_quantity} left</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Birthday Section */}
      <div className="glass-card rounded-lg p-6 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Cake className="w-5 h-5 text-primary" />
          <h3 className="font-heading text-lg font-bold">Customer Birthdays</h3>
        </div>
        {todayBirthdays.length > 0 ? (
          <div className="mb-4">
            <p className="text-xs text-primary font-semibold uppercase tracking-wider mb-2">🎂 Today's Birthdays</p>
            <div className="space-y-2">
              {todayBirthdays.map((p) => (
                <div key={p.id} className="flex items-center justify-between py-2 border-b border-border/20 last:border-0">
                  <span className="text-sm">{p.full_name || "Unknown"}</span>
                  <span className="text-xs text-primary font-bold">{new Date(p.date_of_birth!).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground mb-4">No birthdays today</p>
        )}
        {upcomingBirthdays.length > 0 && (
          <div>
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-2">Upcoming (next 7 days)</p>
            <div className="space-y-2">
              {upcomingBirthdays.map((p) => {
                const dob = new Date(p.date_of_birth!);
                const bday = new Date(today.getFullYear(), dob.getMonth(), dob.getDate());
                if (bday < today) bday.setFullYear(bday.getFullYear() + 1);
                const daysLeft = Math.ceil((bday.getTime() - today.getTime()) / 86400000);
                return (
                  <div key={p.id} className="flex items-center justify-between py-2 border-b border-border/20 last:border-0">
                    <span className="text-sm">{p.full_name || "Unknown"}</span>
                    <span className="text-xs text-muted-foreground">{daysLeft} day{daysLeft !== 1 ? "s" : ""} · {bday.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Recent Orders */}
      <div className="glass-card rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-muted-foreground" />
          <h3 className="font-heading text-lg font-bold">Recent Orders</h3>
        </div>
        {!orders || orders.length === 0 ? (
          <p className="text-sm text-muted-foreground">No orders yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/30">
                  <th className="text-left py-2 text-muted-foreground font-normal text-xs uppercase tracking-wider">Customer</th>
                  <th className="text-left py-2 text-muted-foreground font-normal text-xs uppercase tracking-wider">Total</th>
                  <th className="text-left py-2 text-muted-foreground font-normal text-xs uppercase tracking-wider">Status</th>
                  <th className="text-left py-2 text-muted-foreground font-normal text-xs uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 10).map((order) => (
                  <tr key={order.id} className="border-b border-border/10">
                    <td className="py-3">{order.customer_name}</td>
                    <td className="py-3 text-primary font-semibold">₹{Number(order.total).toFixed(2)}</td>
                    <td className="py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        order.status === "delivered" ? "bg-accent/20 text-accent-foreground" :
                        order.status === "shipped" ? "bg-primary/20 text-primary" :
                        order.status === "cancelled" ? "bg-destructive/20 text-destructive-foreground" :
                        "bg-muted text-muted-foreground"
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
