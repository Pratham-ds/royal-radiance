import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-setup-token',
};

// Strict RFC 5322-compatible email regex
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;

// Generic error response to prevent user enumeration
const GENERIC_NOT_FOUND = JSON.stringify({ error: 'Request could not be completed. Please verify your details and try again.' });

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate setup token
    const setupToken = Deno.env.get('ADMIN_SETUP_TOKEN');
    const providedToken = req.headers.get('x-setup-token');
    if (!setupToken || providedToken !== setupToken) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Enforce payload size limit (1 KB max)
    const contentLength = parseInt(req.headers.get('content-length') || '0', 10);
    if (contentLength > 1024) {
      return new Response(JSON.stringify({ error: 'Payload too large' }), { status: 413, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON body' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const { email } = body;

    // Strict email validation: must be a non-empty string, ≤ 254 chars, valid format
    if (
      !email ||
      typeof email !== 'string' ||
      email.length > 254 ||
      email.trim().length === 0 ||
      !EMAIL_REGEX.test(email.trim())
    ) {
      return new Response(JSON.stringify({ error: 'A valid email address is required' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const sanitizedEmail = email.trim().toLowerCase();

    // Check if any admin exists — use generic error to avoid leaking state
    const { data: existingAdmins } = await supabase
      .from('user_roles')
      .select('id')
      .eq('role', 'admin')
      .limit(1);

    if (existingAdmins && existingAdmins.length > 0) {
      // Generic message — does not reveal that an admin already exists
      return new Response(GENERIC_NOT_FOUND, { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Find user by email
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) throw listError;

    const user = users.find((u: { email?: string }) => u.email?.toLowerCase() === sanitizedEmail);
    if (!user) {
      // Generic message — does not reveal whether the email is registered
      return new Response(GENERIC_NOT_FOUND, { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Assign admin role
    const { error: roleError } = await supabase.from('user_roles').insert({ user_id: user.id, role: 'admin' });
    if (roleError) throw roleError;

    return new Response(JSON.stringify({ success: true, message: 'Admin role assigned!' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (_e) {
    return new Response(JSON.stringify({ error: 'An internal error occurred' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});

