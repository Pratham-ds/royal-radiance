import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface SavedAddress {
  id: string;
  user_id: string;
  label: string;
  full_name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  is_default: boolean;
  created_at: string;
}

export const useSavedAddresses = (userId?: string) => {
  return useQuery({
    queryKey: ["saved_addresses", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("saved_addresses" as any)
        .select("*")
        .eq("user_id", userId!)
        .order("is_default", { ascending: false });
      if (error) throw error;
      return data as unknown as SavedAddress[];
    },
  });
};

export const useAddressMutations = () => {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ["saved_addresses"] });

  const create = useMutation({
    mutationFn: async (addr: Omit<SavedAddress, "id" | "created_at">) => {
      const { error } = await supabase.from("saved_addresses" as any).insert(addr as any);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const update = useMutation({
    mutationFn: async ({ id, ...rest }: Partial<SavedAddress> & { id: string }) => {
      const { error } = await supabase.from("saved_addresses" as any).update(rest as any).eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("saved_addresses" as any).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  return { create, update, remove };
};
