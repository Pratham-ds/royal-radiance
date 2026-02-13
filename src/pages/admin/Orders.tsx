import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Eye, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

type OrderStatus = "pending" | "shipped" | "delivered" | "cancelled";

const statusColors: Record<OrderStatus, string> = {
  pending: "bg-muted text-muted-foreground",
  shipped: "bg-primary/20 text-primary",
  delivered: "bg-accent/20 text-accent-foreground",
  cancelled: "bg-destructive/20 text-destructive-foreground",
};

const Orders = () => {
  const queryClient = useQueryClient();
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const { data: orders, isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: OrderStatus }) => {
      const { error } = await supabase.from("orders").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      toast({ title: "Order status updated" });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold gold-gradient-text">Orders</h1>
        <p className="text-sm text-muted-foreground mt-1">View and manage customer orders</p>
      </div>

      {/* Order detail modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-background/70 backdrop-blur-sm z-50 flex items-center justify-center p-6" onClick={() => setSelectedOrder(null)}>
          <div className="glass-card rounded-lg w-full max-w-lg gold-glow p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-heading text-xl font-bold text-primary">Order Details</h3>
              <button onClick={() => setSelectedOrder(null)} className="text-foreground/50 hover:text-foreground"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Customer</span><span>{selectedOrder.customer_name}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Email</span><span>{selectedOrder.customer_email}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Total</span><span className="text-primary font-bold">${Number(selectedOrder.total).toFixed(2)}</span></div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Status</span>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => {
                    const newStatus = e.target.value as OrderStatus;
                    updateStatus.mutate({ id: selectedOrder.id, status: newStatus });
                    setSelectedOrder({ ...selectedOrder, status: newStatus });
                  }}
                  className="bg-muted/50 border border-border/50 rounded-sm px-2 py-1 text-xs text-foreground focus:outline-none focus:border-primary/50"
                >
                  <option value="pending">Pending</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              {selectedOrder.shipping_address && (
                <div className="flex justify-between"><span className="text-muted-foreground">Address</span><span>{selectedOrder.shipping_address}</span></div>
              )}
              <div className="border-t border-border/30 pt-3">
                <p className="text-muted-foreground text-xs mb-2 uppercase tracking-wider">Items</p>
                {Array.isArray(selectedOrder.items) && selectedOrder.items.map((item: any, i: number) => (
                  <div key={i} className="flex justify-between py-1">
                    <span>{item.name} × {item.quantity}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="text-xs text-muted-foreground">Placed: {new Date(selectedOrder.created_at).toLocaleString()}</div>
            </div>
          </div>
        </div>
      )}

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading orders...</p>
      ) : !orders || orders.length === 0 ? (
        <div className="glass-card rounded-lg p-12 text-center">
          <p className="text-muted-foreground">No orders yet.</p>
        </div>
      ) : (
        <div className="glass-card rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/30">
                  <th className="text-left p-4 text-muted-foreground font-normal text-xs uppercase tracking-wider">Customer</th>
                  <th className="text-left p-4 text-muted-foreground font-normal text-xs uppercase tracking-wider">Email</th>
                  <th className="text-left p-4 text-muted-foreground font-normal text-xs uppercase tracking-wider">Total</th>
                  <th className="text-left p-4 text-muted-foreground font-normal text-xs uppercase tracking-wider">Status</th>
                  <th className="text-left p-4 text-muted-foreground font-normal text-xs uppercase tracking-wider">Date</th>
                  <th className="text-left p-4 text-muted-foreground font-normal text-xs uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-border/10 hover:bg-muted/20 transition-colors">
                    <td className="p-4">{order.customer_name}</td>
                    <td className="p-4 text-muted-foreground">{order.customer_email}</td>
                    <td className="p-4 text-primary font-semibold">${Number(order.total).toFixed(2)}</td>
                    <td className="p-4">
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus.mutate({ id: order.id, status: e.target.value as OrderStatus })}
                        className={`text-[10px] px-2 py-1 rounded-full tracking-wider uppercase font-bold border-0 cursor-pointer focus:outline-none ${statusColors[order.status as OrderStatus]}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="p-4 text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</td>
                    <td className="p-4">
                      <button onClick={() => setSelectedOrder(order)} className="text-foreground/50 hover:text-primary transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
