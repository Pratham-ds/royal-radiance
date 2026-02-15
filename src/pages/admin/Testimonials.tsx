import { useState } from "react";
import { useTestimonials, useTestimonialMutations, Testimonial } from "@/hooks/useTestimonials";
import { Star, Plus, Trash2, CheckCircle2, XCircle, Edit2, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const emptyForm = {
  customer_name: "",
  rating: 5,
  review_text: "",
  customer_photo_url: "",
  is_verified_purchase: true,
  is_approved: false,
};

const Testimonials = () => {
  const { data: testimonials = [], isLoading } = useTestimonials(false);
  const { create, update, remove } = useTestimonialMutations();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.customer_name || !form.review_text) {
      toast({ title: "Name and review are required", variant: "destructive" });
      return;
    }
    try {
      if (editingId) {
        await update.mutateAsync({ id: editingId, ...form });
        toast({ title: "Testimonial updated" });
      } else {
        await create.mutateAsync(form);
        toast({ title: "Testimonial added" });
      }
      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleEdit = (t: Testimonial) => {
    setForm({
      customer_name: t.customer_name,
      rating: t.rating,
      review_text: t.review_text,
      customer_photo_url: t.customer_photo_url || "",
      is_verified_purchase: t.is_verified_purchase,
      is_approved: t.is_approved,
    });
    setEditingId(t.id);
    setShowForm(true);
  };

  const toggleApproval = async (t: Testimonial) => {
    await update.mutateAsync({ id: t.id, is_approved: !t.is_approved });
    toast({ title: t.is_approved ? "Unpublished" : "Approved & Published" });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold gold-gradient-text">Testimonials</h1>
        <button
          onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyForm); }}
          className="btn-luxury px-4 py-2 rounded-sm text-sm tracking-wider flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="glass-card rounded-lg p-6 mb-6 animate-fade-in">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-heading text-lg font-bold">{editingId ? "Edit" : "Add"} Testimonial</h3>
            <button onClick={() => { setShowForm(false); setEditingId(null); }} className="text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wider">Customer Name *</label>
                <input value={form.customer_name} onChange={(e) => setForm({ ...form, customer_name: e.target.value })} className="w-full bg-muted/50 border border-border/50 rounded-sm px-3 py-2.5 text-sm text-foreground mt-1 focus:outline-none focus:border-primary/50" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wider">Photo URL</label>
                <input value={form.customer_photo_url} onChange={(e) => setForm({ ...form, customer_photo_url: e.target.value })} className="w-full bg-muted/50 border border-border/50 rounded-sm px-3 py-2.5 text-sm text-foreground mt-1 focus:outline-none focus:border-primary/50" placeholder="https://..." />
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider">Rating</label>
              <div className="flex gap-1 mt-1">
                {[1, 2, 3, 4, 5].map((r) => (
                  <button key={r} type="button" onClick={() => setForm({ ...form, rating: r })}>
                    <Star className={`w-6 h-6 ${r <= form.rating ? "fill-primary text-primary" : "text-muted-foreground"}`} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider">Review Text *</label>
              <textarea value={form.review_text} onChange={(e) => setForm({ ...form, review_text: e.target.value })} className="w-full bg-muted/50 border border-border/50 rounded-sm px-3 py-2.5 text-sm text-foreground mt-1 h-24 focus:outline-none focus:border-primary/50" />
            </div>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.is_verified_purchase} onChange={(e) => setForm({ ...form, is_verified_purchase: e.target.checked })} className="accent-primary" />
                <span className="text-sm">Verified Purchase</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.is_approved} onChange={(e) => setForm({ ...form, is_approved: e.target.checked })} className="accent-primary" />
                <span className="text-sm">Approved (Visible)</span>
              </label>
            </div>
            <button type="submit" className="btn-luxury px-6 py-2.5 rounded-sm text-sm tracking-wider">
              {editingId ? "Update" : "Add"} Testimonial
            </button>
          </form>
        </div>
      )}

      {/* List */}
      <div className="space-y-3">
        {testimonials.map((t) => (
          <div key={t.id} className="glass-card rounded-lg p-4 flex items-start gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-heading font-bold text-sm">{t.customer_name}</span>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3 h-3 ${i < t.rating ? "fill-primary text-primary" : "text-muted"}`} />
                  ))}
                </div>
                {t.is_verified_purchase && (
                  <span className="text-[10px] text-primary bg-primary/10 px-1.5 py-0.5 rounded">Verified</span>
                )}
              </div>
              <p className="text-sm text-foreground/70 line-clamp-2">{t.review_text}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => toggleApproval(t)}
                className={`p-1.5 rounded-sm transition-colors ${t.is_approved ? "text-green-500 hover:bg-green-500/10" : "text-muted-foreground hover:bg-muted"}`}
                title={t.is_approved ? "Unpublish" : "Approve"}
              >
                {t.is_approved ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
              </button>
              <button onClick={() => handleEdit(t)} className="p-1.5 rounded-sm text-muted-foreground hover:text-primary hover:bg-muted transition-colors">
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={async () => { await remove.mutateAsync(t.id); toast({ title: "Deleted" }); }}
                className="p-1.5 rounded-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {testimonials.length === 0 && (
          <p className="text-center text-muted-foreground py-8">No testimonials yet. Add one to get started.</p>
        )}
      </div>
    </div>
  );
};

export default Testimonials;
