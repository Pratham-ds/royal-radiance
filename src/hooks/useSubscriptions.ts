import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Subscription {
  id: string;
  user_id: string;
  product_id: string;
  frequency: "30_days" | "60_days";
  status: "active" | "paused" | "cancelled";
  discount_percent: number;
  next_delivery_date: string;
  created_at: string;
  updated_at: string;
}

export const useUserSubscriptions = (userId?: string) => {
  return useQuery({
    queryKey: ["subscriptions", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subscriptions" as any)
        .select("*")
        .eq("user_id", userId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as unknown as Subscription[];
    },
  });
};

export const useAllSubscriptions = () => {
  return useQuery({
    queryKey: ["subscriptions", "all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subscriptions" as any)
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as unknown as Subscription[];
    },
  });
};

export const useSubscriptionMutations = () => {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ["subscriptions"] });

  const create = useMutation({
    mutationFn: async (sub: Omit<Subscription, "id" | "created_at" | "updated_at">) => {
      const { error } = await supabase.from("subscriptions" as any).insert(sub as any);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("subscriptions" as any).update({ status } as any).eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  return { create, updateStatus };
};
