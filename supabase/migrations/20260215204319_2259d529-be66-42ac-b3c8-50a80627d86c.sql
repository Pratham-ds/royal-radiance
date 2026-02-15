
-- 1. TESTIMONIALS TABLE
CREATE TABLE public.testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  rating integer NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  review_text text NOT NULL,
  customer_photo_url text,
  is_verified_purchase boolean DEFAULT false,
  is_approved boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view approved testimonials"
ON public.testimonials FOR SELECT
USING (is_approved = true);

CREATE POLICY "Admins can manage testimonials"
ON public.testimonials FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_testimonials_updated_at
BEFORE UPDATE ON public.testimonials
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 2. SUBSCRIPTIONS TABLE
CREATE TYPE public.subscription_status AS ENUM ('active', 'paused', 'cancelled');
CREATE TYPE public.subscription_frequency AS ENUM ('30_days', '60_days');

CREATE TABLE public.subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  frequency subscription_frequency NOT NULL DEFAULT '30_days',
  status subscription_status NOT NULL DEFAULT 'active',
  discount_percent numeric NOT NULL DEFAULT 10,
  next_delivery_date date NOT NULL DEFAULT (CURRENT_DATE + INTERVAL '30 days'),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscriptions"
ON public.subscriptions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own subscriptions"
ON public.subscriptions FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscriptions"
ON public.subscriptions FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all subscriptions"
ON public.subscriptions FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_subscriptions_updated_at
BEFORE UPDATE ON public.subscriptions
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 3. ADD DOB TO PROFILES
ALTER TABLE public.profiles ADD COLUMN date_of_birth date;

-- 4. BIRTHDAY COUPONS TABLE
CREATE TABLE public.birthday_coupons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  coupon_code text NOT NULL UNIQUE,
  discount_percent numeric NOT NULL DEFAULT 15,
  valid_from date NOT NULL,
  valid_until date NOT NULL,
  is_used boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.birthday_coupons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own coupons"
ON public.birthday_coupons FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage coupons"
ON public.birthday_coupons FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- 5. SAVED ADDRESSES TABLE
CREATE TABLE public.saved_addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  label text NOT NULL DEFAULT 'Home',
  full_name text NOT NULL,
  phone text NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  pincode text NOT NULL,
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.saved_addresses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own addresses"
ON public.saved_addresses FOR ALL
USING (auth.uid() = user_id);

CREATE TRIGGER update_saved_addresses_updated_at
BEFORE UPDATE ON public.saved_addresses
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 6. ADD BIRTHDAY SETTINGS TO SITE_SETTINGS
ALTER TABLE public.site_settings
ADD COLUMN birthday_discount_enabled boolean DEFAULT true,
ADD COLUMN birthday_discount_percent numeric DEFAULT 15,
ADD COLUMN birthday_coupon_validity_days integer DEFAULT 7;

-- Update public view to include birthday settings
DROP VIEW IF EXISTS public.public_site_settings;
CREATE VIEW public.public_site_settings
WITH (security_invoker = true) AS
SELECT id, banner_text, urgency_message, countdown_minutes, shipping_charge, updated_at,
       birthday_discount_enabled, birthday_discount_percent, birthday_coupon_validity_days
FROM public.site_settings;

GRANT SELECT ON public.public_site_settings TO anon, authenticated;
