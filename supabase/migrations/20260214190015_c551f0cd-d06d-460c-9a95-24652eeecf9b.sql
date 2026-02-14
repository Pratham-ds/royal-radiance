
-- Add delivery details and payment method columns to orders
ALTER TABLE public.orders ADD COLUMN phone text;
ALTER TABLE public.orders ADD COLUMN payment_method text DEFAULT 'cod';
