import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Send, ArrowLeft } from "lucide-react";
import Footer from "@/components/Footer";

const CATEGORIES = [
  { value: "general", label: "General Inquiry" },
  { value: "order", label: "Order Issue" },
  { value: "product", label: "Product Question" },
  { value: "complaint", label: "Complaint" },
  { value: "feedback", label: "Feedback" },
  { value: "other", label: "Other" },
];

const Contact = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    category: "",
    order_id: "",
    subject: "",
    message: "",
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.category || !form.subject.trim() || !form.message.trim()) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email.trim())) {
      toast({ title: "Please enter a valid email", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from("contact_messages").insert({
        name: form.name.trim().slice(0, 100),
        email: form.email.trim().slice(0, 255),
        phone: form.phone.trim().slice(0, 20) || null,
        category: form.category,
        order_id: form.order_id.trim().slice(0, 100) || null,
        subject: form.subject.trim().slice(0, 200),
        message: form.message.trim().slice(0, 2000),
        user_id: user?.id || null,
      });

      if (error) throw error;

      toast({ title: "Message sent successfully!", description: "We'll get back to you soon." });
      setForm({ name: "", email: "", phone: "", category: "", order_id: "", subject: "", message: "" });
    } catch {
      toast({ title: "Failed to send message", description: "Please try again later.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const showOrderField = form.category === "order" || form.category === "complaint";

  return (
    <>
      <section className="min-h-screen pt-28 pb-16 px-6">
        <div className="container mx-auto max-w-2xl">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <div className="text-center mb-10">
            <h1 className="font-heading text-3xl md:text-4xl font-bold gold-gradient-text mb-3">
              Contact Us
            </h1>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              Have a question, complaint, or feedback? We'd love to hear from you.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="glass-card rounded-xl p-6 md:p-8 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Your full name"
                  maxLength={100}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="you@example.com"
                  maxLength={255}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone (optional)</Label>
                <Input
                  id="phone"
                  value={form.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="+91 XXXXX XXXXX"
                  maxLength={20}
                />
              </div>
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select value={form.category} onValueChange={(v) => handleChange("category", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {showOrderField && (
              <div className="space-y-2">
                <Label htmlFor="order_id">Order ID (if applicable)</Label>
                <Input
                  id="order_id"
                  value={form.order_id}
                  onChange={(e) => handleChange("order_id", e.target.value)}
                  placeholder="Enter your order ID"
                  maxLength={100}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="subject">Subject *</Label>
              <Input
                id="subject"
                value={form.subject}
                onChange={(e) => handleChange("subject", e.target.value)}
                placeholder="Brief subject of your message"
                maxLength={200}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message *</Label>
              <Textarea
                id="message"
                value={form.message}
                onChange={(e) => handleChange("message", e.target.value)}
                placeholder="Describe your inquiry, complaint, or feedback in detail..."
                rows={5}
                maxLength={2000}
              />
              <p className="text-xs text-muted-foreground text-right">{form.message.length}/2000</p>
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="btn-luxury w-full py-3 rounded-lg flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              {submitting ? "Sending..." : "Send Message"}
            </Button>
          </form>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Contact;
