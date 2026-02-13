import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const SiteSettings = () => {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    banner_text: "",
    urgency_message: "",
    countdown_minutes: "15",
    shipping_charge: "0",
    discount_codes: "",
  });

  const { data: settings } = useQuery({
    queryKey: ["admin-settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("*").limit(1).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (settings) {
      setForm({
        banner_text: settings.banner_text || "",
        urgency_message: settings.urgency_message || "",
        countdown_minutes: String(settings.countdown_minutes || 15),
        shipping_charge: String(settings.shipping_charge || 0),
        discount_codes: settings.discount_codes ? JSON.stringify(settings.discount_codes, null, 2) : "[]",
      });
    }
  }, [settings]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      let codes;
      try { codes = JSON.parse(form.discount_codes); } catch { codes = []; }
      const payload = {
        banner_text: form.banner_text,
        urgency_message: form.urgency_message,
        countdown_minutes: parseInt(form.countdown_minutes),
        shipping_charge: parseFloat(form.shipping_charge),
        discount_codes: codes,
      };
      if (settings?.id) {
        const { error } = await supabase.from("site_settings").update(payload).eq("id", settings.id);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-settings"] });
      queryClient.invalidateQueries({ queryKey: ["site_settings"] });
      toast({ title: "Settings saved" });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold gold-gradient-text">Site Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Configure your website</p>
      </div>

      <div className="glass-card rounded-lg p-6 max-w-2xl space-y-5">
        <div>
          <label className="text-xs text-muted-foreground uppercase tracking-wider">Banner Text</label>
          <input value={form.banner_text} onChange={(e) => setForm({ ...form, banner_text: e.target.value })} className="w-full bg-muted/50 border border-border/50 rounded-sm px-3 py-2 text-sm text-foreground mt-1 focus:outline-none focus:border-primary/50" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground uppercase tracking-wider">Urgency Message</label>
          <input value={form.urgency_message} onChange={(e) => setForm({ ...form, urgency_message: e.target.value })} className="w-full bg-muted/50 border border-border/50 rounded-sm px-3 py-2 text-sm text-foreground mt-1 focus:outline-none focus:border-primary/50" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-muted-foreground uppercase tracking-wider">Countdown (min)</label>
            <input type="number" value={form.countdown_minutes} onChange={(e) => setForm({ ...form, countdown_minutes: e.target.value })} className="w-full bg-muted/50 border border-border/50 rounded-sm px-3 py-2 text-sm text-foreground mt-1 focus:outline-none focus:border-primary/50" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground uppercase tracking-wider">Shipping Charge ($)</label>
            <input type="number" step="0.01" value={form.shipping_charge} onChange={(e) => setForm({ ...form, shipping_charge: e.target.value })} className="w-full bg-muted/50 border border-border/50 rounded-sm px-3 py-2 text-sm text-foreground mt-1 focus:outline-none focus:border-primary/50" />
          </div>
        </div>
        <div>
          <label className="text-xs text-muted-foreground uppercase tracking-wider">Discount Codes (JSON)</label>
          <textarea value={form.discount_codes} onChange={(e) => setForm({ ...form, discount_codes: e.target.value })} className="w-full bg-muted/50 border border-border/50 rounded-sm px-3 py-2 text-sm text-foreground mt-1 h-24 font-mono focus:outline-none focus:border-primary/50" />
        </div>

        <button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending} className="btn-luxury px-6 py-2.5 rounded-sm text-xs tracking-wider flex items-center gap-2">
          <Save className="w-4 h-4" /> {saveMutation.isPending ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
};

export default SiteSettings;
