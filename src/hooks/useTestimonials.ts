import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Testimonial {
  id: string;
  customer_name: string;
  rating: number;
  review_text: string;
  customer_photo_url: string | null;
  is_verified_purchase: boolean;
  is_approved: boolean;
  created_at: string;
}

export const useTestimonials = (approvedOnly = true) => {
  return useQuery({
    queryKey: ["testimonials", approvedOnly],
    queryFn: async () => {
      let query = supabase.from("testimonials" as any).select("*").order("created_at", { ascending: false });
      if (approvedOnly) {
        query = query.eq("is_approved", true);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data as unknown as Testimonial[];
    },
  });
};

export const useTestimonialMutations = () => {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ["testimonials"] });

  const create = useMutation({
    mutationFn: async (t: Omit<Testimonial, "id" | "created_at">) => {
      const { error } = await supabase.from("testimonials" as any).insert(t as any);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const update = useMutation({
    mutationFn: async ({ id, ...rest }: Partial<Testimonial> & { id: string }) => {
      const { error } = await supabase.from("testimonials" as any).update(rest as any).eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("testimonials" as any).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  return { create, update, remove };
};
