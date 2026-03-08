ALTER TABLE public.testimonials ADD COLUMN product_id uuid REFERENCES public.products(id) ON DELETE SET NULL;

-- Update existing Rose Water reviews
UPDATE public.testimonials SET product_id = 'cbd757a8-a514-4b5a-9698-f76eebccb08f' WHERE customer_name IN ('Priya Sharma', 'Ravi Kumar', 'Sneha Iyer', 'Kavita Nair');

-- Update existing Serum reviews (link to Vitamin C Serum as default serum)
UPDATE public.testimonials SET product_id = '7201ae6e-70d8-425b-9944-49a3d75b60df' WHERE customer_name IN ('Ananya Reddy', 'Meera Patel', 'Arjun Deshmukh', 'Deepak Verma');