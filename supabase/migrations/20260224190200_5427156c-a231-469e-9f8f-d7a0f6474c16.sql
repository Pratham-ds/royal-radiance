-- Allow users to UPDATE their own birthday coupons (e.g. mark as used)
CREATE POLICY "Users can update own coupons"
ON public.birthday_coupons
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Allow users to UPDATE their own orders (e.g. cancel)
CREATE POLICY "Users can update own orders"
ON public.orders
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Allow users to UPDATE their own contact messages
CREATE POLICY "Users can update own messages"
ON public.contact_messages
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);