import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Search, Ban, CheckCircle, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { mapDatabaseError } from "@/lib/errorHandler";

const Customers = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");

  const { data: profiles, isLoading } = useQuery({
    queryKey: ["admin-customers"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const toggleBlock = useMutation({
    mutationFn: async ({ userId, blocked }: { userId: string; blocked: boolean }) => {
      const { error } = await supabase.from("profiles").update({ blocked }).eq("user_id", userId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-customers"] });
      toast({ title: "Customer updated" });
    },
    onError: (e: any) => {
      console.error('Customer update error:', e);
      toast({ title: "Error", description: mapDatabaseError(e), variant: "destructive" });
    },
  });

  const deleteCustomer = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase.from("profiles").delete().eq("user_id", userId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-customers"] });
      toast({ title: "Customer profile deleted" });
    },
    onError: (e: any) => {
      console.error('Customer delete error:', e);
      toast({ title: "Error", description: mapDatabaseError(e), variant: "destructive" });
    },
  });

  const filtered = profiles?.filter((p) =>
    (p.full_name || "").toLowerCase().includes(search.toLowerCase()) ||
    p.user_id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold gold-gradient-text">Customers</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage registered users</p>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search customers..."
          className="w-full bg-muted/50 border border-border/50 rounded-sm pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50"
        />
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading...</p>
      ) : !filtered || filtered.length === 0 ? (
        <div className="glass-card rounded-lg p-12 text-center">
          <p className="text-muted-foreground">No customers found.</p>
        </div>
      ) : (
        <div className="glass-card rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/30">
                <th className="text-left p-4 text-muted-foreground font-normal text-xs uppercase tracking-wider">Name</th>
                <th className="text-left p-4 text-muted-foreground font-normal text-xs uppercase tracking-wider">Status</th>
                <th className="text-left p-4 text-muted-foreground font-normal text-xs uppercase tracking-wider">Joined</th>
                <th className="text-left p-4 text-muted-foreground font-normal text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((profile) => (
                <tr key={profile.id} className="border-b border-border/10 hover:bg-muted/20 transition-colors">
                  <td className="p-4">{profile.full_name || "Unnamed"}</td>
                  <td className="p-4">
                    <span className={`text-[10px] px-2 py-1 rounded-full tracking-wider uppercase font-bold ${
                      profile.blocked ? "bg-destructive/20 text-destructive-foreground" : "bg-accent/20 text-accent-foreground"
                    }`}>
                      {profile.blocked ? "Blocked" : "Active"}
                    </span>
                  </td>
                  <td className="p-4 text-muted-foreground">{new Date(profile.created_at).toLocaleDateString()}</td>
                  <td className="p-4 flex gap-2">
                    <button
                      onClick={() => toggleBlock.mutate({ userId: profile.user_id, blocked: !profile.blocked })}
                      className={`p-1.5 rounded transition-colors ${profile.blocked ? "text-accent-foreground hover:text-accent" : "text-foreground/50 hover:text-destructive"}`}
                      title={profile.blocked ? "Unblock" : "Block"}
                    >
                      {profile.blocked ? <CheckCircle className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => { if (confirm("Delete this customer profile?")) deleteCustomer.mutate(profile.user_id); }}
                      className="p-1.5 text-foreground/50 hover:text-destructive transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Customers;
