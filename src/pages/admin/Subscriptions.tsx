import { useAllSubscriptions, useSubscriptionMutations } from "@/hooks/useSubscriptions";
import { useProducts } from "@/hooks/useProducts";
import { RefreshCw, Pause, Play, XCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const freqLabels: Record<string, string> = { "30_days": "Every 30 Days", "60_days": "Every 60 Days" };
const statusColors: Record<string, string> = {
  active: "text-green-500 bg-green-500/10",
  paused: "text-yellow-500 bg-yellow-500/10",
  cancelled: "text-red-500 bg-red-500/10",
};

const Subscriptions = () => {
  const { data: subs = [], isLoading } = useAllSubscriptions();
  const { data: products = [] } = useProducts();
  const { updateStatus } = useSubscriptionMutations();

  const getProductName = (pid: string) => products.find((p) => p.id === pid)?.name || "Unknown";

  const handleStatus = async (id: string, status: string) => {
    await updateStatus.mutateAsync({ id, status });
    toast({ title: `Subscription ${status}` });
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold gold-gradient-text mb-6">Subscriptions</h1>

      <div className="glass-card rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/30">
              <th className="text-left p-4 text-xs text-muted-foreground uppercase tracking-wider">Product</th>
              <th className="text-left p-4 text-xs text-muted-foreground uppercase tracking-wider">Frequency</th>
              <th className="text-left p-4 text-xs text-muted-foreground uppercase tracking-wider">Status</th>
              <th className="text-left p-4 text-xs text-muted-foreground uppercase tracking-wider">Next Delivery</th>
              <th className="text-left p-4 text-xs text-muted-foreground uppercase tracking-wider">Discount</th>
              <th className="text-right p-4 text-xs text-muted-foreground uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {subs.map((s) => (
              <tr key={s.id} className="border-b border-border/20 hover:bg-muted/20">
                <td className="p-4 font-semibold">{getProductName(s.product_id)}</td>
                <td className="p-4">{freqLabels[s.frequency]}</td>
                <td className="p-4">
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold capitalize ${statusColors[s.status]}`}>{s.status}</span>
                </td>
                <td className="p-4">{new Date(s.next_delivery_date).toLocaleDateString("en-IN")}</td>
                <td className="p-4 text-primary">{s.discount_percent}%</td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-1">
                    {s.status === "active" && (
                      <button onClick={() => handleStatus(s.id, "paused")} className="p-1.5 text-muted-foreground hover:text-yellow-500 transition-colors" title="Pause">
                        <Pause className="w-4 h-4" />
                      </button>
                    )}
                    {s.status === "paused" && (
                      <button onClick={() => handleStatus(s.id, "active")} className="p-1.5 text-muted-foreground hover:text-green-500 transition-colors" title="Resume">
                        <Play className="w-4 h-4" />
                      </button>
                    )}
                    {s.status !== "cancelled" && (
                      <button onClick={() => handleStatus(s.id, "cancelled")} className="p-1.5 text-muted-foreground hover:text-destructive transition-colors" title="Cancel">
                        <XCircle className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {subs.length === 0 && <p className="text-center text-muted-foreground py-8">No active subscriptions</p>}
      </div>
    </div>
  );
};

export default Subscriptions;
