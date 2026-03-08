import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const INSTAMOJO_BASE_URL = "https://www.instamojo.com/api/1.1";

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const INSTAMOJO_API_KEY = Deno.env.get('INSTAMOJO_API_KEY');
  const INSTAMOJO_AUTH_TOKEN = Deno.env.get('INSTAMOJO_AUTH_TOKEN');
  const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

  if (!INSTAMOJO_API_KEY || !INSTAMOJO_AUTH_TOKEN) {
    console.error('Missing secrets. API_KEY exists:', !!INSTAMOJO_API_KEY, 'AUTH_TOKEN exists:', !!INSTAMOJO_AUTH_TOKEN);
    return new Response(JSON.stringify({ error: 'Instamojo credentials not configured' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const { action, ...params } = await req.json();

    if (action === 'create_payment') {
      const { amount, purpose, buyer_name, email, phone, redirect_url, order_data } = params;

      // Validate auth
      const authHeader = req.headers.get('Authorization');
      if (!authHeader?.startsWith('Bearer ')) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const token = authHeader.replace('Bearer ', '');
      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
      
      // Verify user via getUser
      const { data: { user }, error: userError } = await supabase.auth.getUser(token);
      if (userError || !user) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const userId = user.id;

      // Create Instamojo payment request
      const formData = new URLSearchParams();
      formData.append('amount', amount.toString());
      formData.append('purpose', purpose);
      formData.append('buyer_name', buyer_name);
      formData.append('email', email);
      formData.append('phone', phone);
      formData.append('redirect_url', redirect_url);
      formData.append('allow_repeated_payments', 'false');

      const response = await fetch(`${INSTAMOJO_BASE_URL}/payment-requests/`, {
        method: 'POST',
        headers: {
          'X-Api-Key': INSTAMOJO_API_KEY,
          'X-Auth-Token': INSTAMOJO_AUTH_TOKEN,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        console.error('Instamojo error:', data);
        return new Response(JSON.stringify({ error: 'Payment creation failed', details: data }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Store order as pending
      const { error: orderError } = await supabase.from('orders').insert({
        user_id: userId,
        customer_name: order_data.customer_name,
        customer_email: order_data.customer_email,
        phone: order_data.phone,
        shipping_address: order_data.shipping_address,
        payment_method: 'instamojo',
        items: order_data.items,
        total: order_data.total,
        status: 'pending',
      });

      if (orderError) {
        console.error('Order insert error:', orderError);
      }

      return new Response(JSON.stringify({
        success: true,
        payment_url: data.payment_request.longurl,
        payment_request_id: data.payment_request.id,
      }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'verify_payment') {
      const { payment_request_id, payment_id } = params;

      const response = await fetch(
        `${INSTAMOJO_BASE_URL}/payment-requests/${payment_request_id}/${payment_id}/`,
        {
          headers: {
            'X-Api-Key': INSTAMOJO_API_KEY,
            'X-Auth-Token': INSTAMOJO_AUTH_TOKEN,
          },
        }
      );

      const data = await response.json();
      if (!response.ok) {
        return new Response(JSON.stringify({ error: 'Verification failed', details: data }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const payment = data.payment_request;
      const isSuccess = payment?.payment?.status === 'Credit';

      return new Response(JSON.stringify({
        success: isSuccess,
        status: payment?.payment?.status,
        payment_request: payment,
      }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Edge function error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
