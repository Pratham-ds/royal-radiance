
-- Fix 1: Remove permissive SELECT on site_settings, restrict to admins only
DROP POLICY IF EXISTS "Anyone can view settings" ON public.site_settings;

CREATE POLICY "Only admins can view site_settings"
ON public.site_settings FOR SELECT
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Fix 2: Allow users to INSERT their own birthday coupons
CREATE POLICY "Users can create own birthday coupons"
ON public.birthday_coupons FOR INSERT
WITH CHECK (auth.uid() = user_id);
