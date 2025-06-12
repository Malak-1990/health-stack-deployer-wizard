
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Create supabase client with service role key
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get the authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Missing authorization header')
    }

    // Verify the user's token
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      throw new Error('Unauthorized')
    }

    // Verify user is admin
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError || profile?.role !== 'admin') {
      throw new Error('Access denied: Admin role required')
    }

    // Parse the request
    const { action, table, filters } = await req.json()

    let result

    switch (action) {
      case 'getStats':
        // Get dashboard statistics
        const [
          { count: totalUsers },
          { count: totalPatients },
          { count: totalDoctors },
          { count: totalAlerts },
          { count: totalReadings }
        ] = await Promise.all([
          supabase.from('profiles').select('*', { count: 'exact', head: true }),
          supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'user'),
          supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'doctor'),
          supabase.from('smart_alerts').select('*', { count: 'exact', head: true }),
          supabase.from('heart_rate_readings').select('*', { count: 'exact', head: true })
        ])

        result = {
          totalUsers: totalUsers || 0,
          totalPatients: totalPatients || 0,
          totalDoctors: totalDoctors || 0,
          totalAlerts: totalAlerts || 0,
          totalReadings: totalReadings || 0
        }
        break

      case 'getAllUsers':
        // Get all users with their profiles
        const { data: users, error: usersError } = await supabase
          .from('profiles')
          .select(`
            id,
            full_name,
            role,
            created_at,
            emergency_contact_name,
            emergency_contact_phone
          `)
          .order('created_at', { ascending: false })

        if (usersError) throw usersError
        result = users
        break

      case 'getAllAlerts':
        // Get all alerts with user information
        const { data: alerts, error: alertsError } = await supabase
          .from('smart_alerts')
          .select(`
            *,
            profiles!inner(full_name, role)
          `)
          .order('created_at', { ascending: false })
          .limit(100)

        if (alertsError) throw alertsError
        result = alerts
        break

      case 'getSystemActivity':
        // Get recent system activity
        const { data: recentReadings, error: readingsError } = await supabase
          .from('heart_rate_readings')
          .select(`
            id,
            heart_rate,
            recorded_at,
            profiles!inner(full_name)
          `)
          .order('recorded_at', { ascending: false })
          .limit(50)

        if (readingsError) throw readingsError
        result = recentReadings
        break

      case 'updateUserRole':
        // Update user role (admin only)
        const { userId, newRole } = filters
        const { data: updatedUser, error: updateError } = await supabase
          .from('profiles')
          .update({ role: newRole })
          .eq('id', userId)
          .select()

        if (updateError) throw updateError
        result = updatedUser
        break

      default:
        throw new Error('Invalid action')
    }

    return new Response(
      JSON.stringify({ success: true, data: result }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
