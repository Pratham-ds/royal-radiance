import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Mail, Phone, User, Tag, ShoppingCart, Calendar, MessageSquare, Eye } from "lucide-react";
import { format } from "date-fns";
import { mapDatabaseError } from "@/lib/errorHandler";

type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  category: string;
  order_id: string | null;
  subject: string;
  message: string;
  user_id: string | null;
  status: string;
  created_at: string;
};

const STATUS_OPTIONS = [
  { value: "new", label: "New", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  { value: "in_progress", label: "In Progress", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  { value: "resolved", label: "Resolved", color: "bg-green-500/20 text-green-400 border-green-500/30" },
  { value: "closed", label: "Closed", color: "bg-muted text-muted-foreground border-border" },
];

const CATEGORY_LABELS: Record<string, string> = {
  general: "General Inquiry",
  order: "Order Issue",
  product: "Product Question",
  complaint: "Complaint",
  feedback: "Feedback",
  other: "Other",
};

const ContactMessages = () => {
  const queryClient = useQueryClient();
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["contact-messages", filterCategory, filterStatus],
    queryFn: async () => {
      let query = supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (filterCategory !== "all") query = query.eq("category", filterCategory);
      if (filterStatus !== "all") query = query.eq("status", filterStatus);

      const { data, error } = await query;
      if (error) throw error;
      return data as ContactMessage[];
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from("contact_messages")
        .update({ status })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact-messages"] });
      toast({ title: "Status updated" });
    },
    onError: (err) => {
      toast({ title: "Update failed", description: mapDatabaseError(err), variant: "destructive" });
    },
  });

  const getStatusBadge = (status: string) => {
    const opt = STATUS_OPTIONS.find((s) => s.value === status) || STATUS_OPTIONS[0];
    return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${opt.color}`}>{opt.label}</span>;
  };

  const getCategoryBadge = (category: string) => {
    const isComplaint = category === "complaint";
    return (
      <Badge variant={isComplaint ? "destructive" : "secondary"} className="text-xs">
        {CATEGORY_LABELS[category] || category}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold gold-gradient-text">Contact Messages</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {messages.length} message{messages.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex gap-3">
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {Object.entries(CATEGORY_LABELS).map(([val, label]) => (
                <SelectItem key={val} value={val}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {STATUS_OPTIONS.map((s) => (
                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground text-sm">Loading...</p>
      ) : messages.length === 0 ? (
        <Card className="glass-card"><CardContent className="py-12 text-center text-muted-foreground">No messages found.</CardContent></Card>
      ) : (
        <div className="grid gap-4">
          {messages.map((msg) => (
            <Card key={msg.id} className="glass-card hover:border-primary/30 transition-colors">
              <CardContent className="p-5">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      {getCategoryBadge(msg.category)}
                      {getStatusBadge(msg.status)}
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(msg.created_at), "dd MMM yyyy, hh:mm a")}
                      </span>
                    </div>
                    <h3 className="font-heading font-semibold text-foreground truncate">{msg.subject}</h3>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><User className="w-3 h-3" />{msg.name}</span>
                      <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{msg.email}</span>
                      {msg.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{msg.phone}</span>}
                      {msg.order_id && <span className="flex items-center gap-1"><ShoppingCart className="w-3 h-3" />Order: {msg.order_id}</span>}
                    </div>
                    <p className="text-sm text-foreground/80 line-clamp-2">{msg.message}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Select
                      value={msg.status}
                      onValueChange={(v) => updateStatus.mutate({ id: msg.id, status: v })}
                    >
                      <SelectTrigger className="w-[130px] h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS.map((s) => (
                          <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button size="sm" variant="outline" onClick={() => setSelectedMessage(msg)}>
                      <Eye className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Detail Dialog */}
      <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-heading">{selectedMessage?.subject}</DialogTitle>
          </DialogHeader>
          {selectedMessage && (
            <div className="space-y-4">
              <div className="flex gap-2 flex-wrap">
                {getCategoryBadge(selectedMessage.category)}
                {getStatusBadge(selectedMessage.status)}
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground text-xs block">Name</span>
                  <span className="font-medium">{selectedMessage.name}</span>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs block">Email</span>
                  <span className="font-medium">{selectedMessage.email}</span>
                </div>
                {selectedMessage.phone && (
                  <div>
                    <span className="text-muted-foreground text-xs block">Phone</span>
                    <span className="font-medium">{selectedMessage.phone}</span>
                  </div>
                )}
                {selectedMessage.order_id && (
                  <div>
                    <span className="text-muted-foreground text-xs block">Order ID</span>
                    <span className="font-medium">{selectedMessage.order_id}</span>
                  </div>
                )}
                <div>
                  <span className="text-muted-foreground text-xs block">Date</span>
                  <span className="font-medium">{format(new Date(selectedMessage.created_at), "dd MMM yyyy, hh:mm a")}</span>
                </div>
                {selectedMessage.user_id && (
                  <div>
                    <span className="text-muted-foreground text-xs block">Registered User</span>
                    <span className="font-medium text-primary">Yes</span>
                  </div>
                )}
              </div>
              <div>
                <span className="text-muted-foreground text-xs block mb-1">Message</span>
                <p className="text-sm bg-muted/30 rounded-lg p-3 whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContactMessages;
