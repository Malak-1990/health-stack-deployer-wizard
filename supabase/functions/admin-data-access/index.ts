
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client with service role key for admin access
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Create regular client to verify the requesting user
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Set the auth header for the client
    supabaseClient.auth.setSession = () => Promise.resolve({ data: { session: null }, error: null });
    
    // Get user from token
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user is admin using service role client
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || !profile || profile.role !== 'admin') {
      return new Response(
        JSON.stringify({ error: 'Access denied. Admin role required.' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse request
    const url = new URL(req.url);
    const action = url.searchParams.get('action');

    console.log(`Admin access granted for user ${user.id}, action: ${action}`);

    switch (action) {
      case 'getAllUsers':
        const { data: users, error: usersError } = await supabaseAdmin
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (usersError) throw usersError;
        return new Response(
          JSON.stringify({ data: users }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      case 'getAllHeartRateReadings':
        const { data: heartRateData, error: heartRateError } = await supabaseAdmin
          .from('heart_rate_readings')
          .select(`
            *,
            profiles!inner(full_name, role)
          `)
          .order('recorded_at', { ascending: false })
          .limit(100);

        if (heartRateError) throw heartRateError;
        return new Response(
          JSON.stringify({ data: heartRateData }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      case 'getAllHealthLogs':
        const { data: healthLogs, error: healthLogsError } = await supabaseAdmin
          .from('daily_health_logs')
          .select(`
            *,
            profiles!inner(full_name, role)
          `)
          .order('date', { ascending: false })
          .limit(100);

        if (healthLogsError) throw healthLogsError;
        return new Response(
          JSON.stringify({ data: healthLogs }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      case 'getAllAppointments':
        const { data: appointments, error: appointmentsError } = await supabaseAdmin
          .from('appointments')
          .select(`
            *,
            profiles!inner(full_name, role)
          `)
          .order('appointment_date', { ascending: false });

        if (appointmentsError) throw appointmentsError;
        return new Response(
          JSON.stringify({ data: appointments }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      case 'updateUserRole':
        if (req.method !== 'POST') {
          return new Response(
            JSON.stringify({ error: 'Method not allowed' }),
            { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const { userId, newRole } = await req.json();
        
        if (!userId || !newRole || !['user', 'admin', 'doctor', 'family'].includes(newRole)) {
          return new Response(
            JSON.stringify({ error: 'Invalid userId or role' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const { data: updateResult, error: updateError } = await supabaseAdmin
          .from('profiles')
          .update({ role: newRole })
          .eq('id', userId)
          .select();

        if (updateError) throw updateError;
        return new Response(
          JSON.stringify({ data: updateResult }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      case 'getSystemStats':
        // Get various system statistics
        const [usersCount, heartRateCount, appointmentsCount, alertsCount] = await Promise.all([
          supabaseAdmin.from('profiles').select('*', { count: 'exact', head: true }),
          supabaseAdmin.from('heart_rate_readings').select('*', { count: 'exact', head: true }),
          supabaseAdmin.from('appointments').select('*', { count: 'exact', head: true }),
          supabaseAdmin.from('smart_alerts').select('*', { count: 'exact', head: true })
        ]);

        return new Response(
          JSON.stringify({
            data: {
              totalUsers: usersCount.count || 0,
              totalHeartRateReadings: heartRateCount.count || 0,
              totalAppointments: appointmentsCount.count || 0,
              totalAlerts: alertsCount.count || 0
            }
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

  } catch (error) {
    console.error('Admin function error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
