
-- Recreate view with SECURITY INVOKER (default, but explicit)
DROP VIEW IF EXISTS public.public_site_settings;

CREATE VIEW public.public_site_settings
WITH (security_invoker = true) AS
SELECT id, banner_text, urgency_message, countdown_minutes, shipping_charge, updated_at
FROM public.site_settings;

GRANT SELECT ON public.public_site_settings TO anon, authenticated;
