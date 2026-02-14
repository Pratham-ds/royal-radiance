import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Pencil, Trash2, X, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";

type ProductStatus = "in_stock" | "out_of_stock" | "coming_soon";

interface ProductForm {
  name: string;
  description: string;
  price: string;
  stock_quantity: string;
  status: ProductStatus;
  urgency_message: string;
  countdown_minutes: string;
  image_url: string;
}

const emptyForm: ProductForm = {
  name: "", description: "", price: "0", stock_quantity: "0",
  status: "in_stock", urgency_message: "", countdown_minutes: "15", image_url: "",
};

const Products = () => {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<ProductForm>(emptyForm);

  const { data: products, isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").order("created_at");
      if (error) throw error;
      return data;
    },
  });

  const upsertMutation = useMutation({
    mutationFn: async ({ id, form }: { id?: string; form: ProductForm }) => {
      const payload = {
        name: form.name,
        description: form.description || null,
        price: parseFloat(form.price),
        stock_quantity: parseInt(form.stock_quantity),
        status: form.status as ProductStatus,
        urgency_message: form.urgency_message || null,
        countdown_minutes: form.countdown_minutes ? parseInt(form.countdown_minutes) : null,
        image_url: form.image_url || null,
      };
      if (id) {
        const { error } = await supabase.from("products").update(payload).eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("products").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setEditing(null);
      setCreating(false);
      setForm(emptyForm);
      toast({ title: "Product saved successfully" });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({ title: "Product deleted" });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const startEdit = (product: any) => {
    setEditing(product.id);
    setCreating(false);
    setForm({
      name: product.name,
      description: product.description || "",
      price: String(product.price),
      stock_quantity: String(product.stock_quantity),
      status: product.status,
      urgency_message: product.urgency_message || "",
      countdown_minutes: String(product.countdown_minutes || ""),
      image_url: product.image_url || "",
    });
  };

  const formFields = (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      <div>
        <label className="text-xs text-muted-foreground uppercase tracking-wider">Name</label>
        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-muted/50 border border-border/50 rounded-sm px-3 py-2 text-sm text-foreground mt-1 focus:outline-none focus:border-primary/50" />
      </div>
      <div>
        <label className="text-xs text-muted-foreground uppercase tracking-wider">Price (₹)</label>
        <input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full bg-muted/50 border border-border/50 rounded-sm px-3 py-2 text-sm text-foreground mt-1 focus:outline-none focus:border-primary/50" />
      </div>
      <div className="md:col-span-2">
        <label className="text-xs text-muted-foreground uppercase tracking-wider">Description</label>
        <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full bg-muted/50 border border-border/50 rounded-sm px-3 py-2 text-sm text-foreground mt-1 h-20 focus:outline-none focus:border-primary/50" />
      </div>
      <div>
        <label className="text-xs text-muted-foreground uppercase tracking-wider">Stock Quantity</label>
        <input type="number" value={form.stock_quantity} onChange={(e) => setForm({ ...form, stock_quantity: e.target.value })} className="w-full bg-muted/50 border border-border/50 rounded-sm px-3 py-2 text-sm text-foreground mt-1 focus:outline-none focus:border-primary/50" />
      </div>
      <div>
        <label className="text-xs text-muted-foreground uppercase tracking-wider">Status</label>
        <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as ProductStatus })} className="w-full bg-muted/50 border border-border/50 rounded-sm px-3 py-2 text-sm text-foreground mt-1 focus:outline-none focus:border-primary/50">
          <option value="in_stock">In Stock</option>
          <option value="out_of_stock">Out of Stock</option>
          <option value="coming_soon">Coming Soon</option>
        </select>
      </div>
      <div>
        <label className="text-xs text-muted-foreground uppercase tracking-wider">Urgency Message</label>
        <input value={form.urgency_message} onChange={(e) => setForm({ ...form, urgency_message: e.target.value })} className="w-full bg-muted/50 border border-border/50 rounded-sm px-3 py-2 text-sm text-foreground mt-1 focus:outline-none focus:border-primary/50" />
      </div>
      <div>
        <label className="text-xs text-muted-foreground uppercase tracking-wider">Countdown (minutes)</label>
        <input type="number" value={form.countdown_minutes} onChange={(e) => setForm({ ...form, countdown_minutes: e.target.value })} className="w-full bg-muted/50 border border-border/50 rounded-sm px-3 py-2 text-sm text-foreground mt-1 focus:outline-none focus:border-primary/50" />
      </div>
      <div className="md:col-span-2">
        <label className="text-xs text-muted-foreground uppercase tracking-wider">Image URL</label>
        <input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="w-full bg-muted/50 border border-border/50 rounded-sm px-3 py-2 text-sm text-foreground mt-1 focus:outline-none focus:border-primary/50" placeholder="https://..." />
      </div>
      <div className="md:col-span-2 flex gap-2 justify-end">
        <button onClick={() => { setEditing(null); setCreating(false); setForm(emptyForm); }} className="btn-luxury-outline px-4 py-2 rounded-sm text-xs tracking-wider flex items-center gap-1">
          <X className="w-3 h-3" /> Cancel
        </button>
        <button onClick={() => upsertMutation.mutate({ id: editing ?? undefined, form })} disabled={!form.name || upsertMutation.isPending} className="btn-luxury px-4 py-2 rounded-sm text-xs tracking-wider flex items-center gap-1">
          <Save className="w-3 h-3" /> {upsertMutation.isPending ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold gold-gradient-text">Products</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your product inventory</p>
        </div>
        <button onClick={() => { setCreating(true); setEditing(null); setForm(emptyForm); }} className="btn-luxury px-4 py-2 rounded-sm text-xs tracking-wider flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {creating && (
        <div className="glass-card rounded-lg mb-6 gold-glow">
          <div className="p-4 border-b border-border/30">
            <h3 className="font-heading text-lg font-bold text-primary">New Product</h3>
          </div>
          {formFields}
        </div>
      )}

      {isLoading ? (
        <p className="text-muted-foreground text-sm">Loading products...</p>
      ) : (
        <div className="space-y-4">
          {products?.map((product) => (
            <div key={product.id} className="glass-card rounded-lg overflow-hidden">
              {editing === product.id ? (
                <>
                  <div className="p-4 border-b border-border/30">
                    <h3 className="font-heading text-lg font-bold text-primary">Edit Product</h3>
                  </div>
                  {formFields}
                </>
              ) : (
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    {product.image_url && (
                      <img src={product.image_url} alt={product.name} className="w-12 h-12 rounded-sm object-cover" />
                    )}
                    <div>
                      <h4 className="font-heading text-sm font-bold">{product.name}</h4>
                      <p className="text-xs text-muted-foreground">₹{Number(product.price).toFixed(2)} · Stock: {product.stock_quantity}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] px-2 py-1 rounded-full tracking-wider uppercase font-bold ${
                      product.status === "in_stock" ? "bg-accent/20 text-accent-foreground" :
                      product.status === "coming_soon" ? "bg-primary/20 text-primary" :
                      "bg-muted text-muted-foreground"
                    }`}>{product.status.replace("_", " ")}</span>
                    <button onClick={() => startEdit(product)} className="p-2 text-foreground/50 hover:text-primary transition-colors">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => { if (confirm("Delete this product?")) deleteMutation.mutate(product.id); }} className="p-2 text-foreground/50 hover:text-destructive transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
