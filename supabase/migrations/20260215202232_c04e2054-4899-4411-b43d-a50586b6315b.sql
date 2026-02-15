
-- Create a public view that excludes discount_codes
CREATE VIEW public.public_site_settings AS
SELECT id, banner_text, urgency_message, countdown_minutes, shipping_charge, updated_at
FROM public.site_settings;

-- Grant access to the view
GRANT SELECT ON public.public_site_settings TO anon, authenticated;
