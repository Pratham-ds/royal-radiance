import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface BirthdayCoupon {
  id: string;
  user_id: string;
  coupon_code: string;
  discount_percent: number;
  valid_from: string;
  valid_until: string;
  is_used: boolean;
  created_at: string;
}

export const useUserCoupons = (userId?: string) => {
  return useQuery({
    queryKey: ["birthday_coupons", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("birthday_coupons" as any)
        .select("*")
        .eq("user_id", userId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as unknown as BirthdayCoupon[];
    },
  });
};

export const useCheckBirthday = (userId?: string) => {
  return useQuery({
    queryKey: ["birthday_check", userId],
    enabled: !!userId,
    queryFn: async () => {
      // Get user profile DOB
      const { data: profile } = await supabase
        .from("profiles")
        .select("date_of_birth")
        .eq("user_id", userId!)
        .maybeSingle();

      if (!profile?.date_of_birth) return { isBirthday: false, coupon: null };

      const today = new Date();
      const dob = new Date(profile.date_of_birth);
      const isBirthday = today.getMonth() === dob.getMonth() && today.getDate() === dob.getDate();

      // Check for active coupon
      const todayStr = today.toISOString().split("T")[0];
      const { data: coupons } = await supabase
        .from("birthday_coupons" as any)
        .select("*")
        .eq("user_id", userId!)
        .eq("is_used", false)
        .gte("valid_until", todayStr)
        .lte("valid_from", todayStr)
        .limit(1);

      const activeCoupon = (coupons as unknown as BirthdayCoupon[] | null)?.[0] || null;

      return { isBirthday, coupon: activeCoupon };
    },
  });
};

export const useGenerateBirthdayCoupon = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, discountPercent, validityDays }: { userId: string; discountPercent: number; validityDays: number }) => {
      const code = `BDAY-${Date.now().toString(36).toUpperCase()}`;
      const validFrom = new Date().toISOString().split("T")[0];
      const validUntil = new Date(Date.now() + validityDays * 86400000).toISOString().split("T")[0];

      const { error } = await supabase.from("birthday_coupons" as any).insert({
        user_id: userId,
        coupon_code: code,
        discount_percent: discountPercent,
        valid_from: validFrom,
        valid_until: validUntil,
      } as any);
      if (error) throw error;
      return code;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["birthday_coupons"] }),
  });
};
