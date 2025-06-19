import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2';

/** Supported admin actions */
type AdminAction = 'getStats' | 'getAllUsers' | 'getAllAlerts' | 'getSystemActivity' | 'updateUserRole';

/** Payload structure for incoming requests */
interface RequestPayload {
  action: AdminAction;
  table?: string;
  filters?: Record<string, any>;
  limit?: number;
  offset?: number;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * Validates that required environment variables exist and returns them.
 */
function getSupabaseEnv() {
  const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Server Misconfigured: Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  }
  return { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY };
}

/**
 * Extracts and validates the Bearer token from the Authorization header.
 */
function getBearerToken(authHeader: string | null): string {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Missing or malformed authorization header');
  }
  return authHeader.replace('Bearer ', '');
}

/**
 * Validates the request payload and returns a typed object.
 */
function validatePayload(payload: any): RequestPayload {
  const allowedActions: AdminAction[] = [
    'getStats', 'getAllUsers', 'getAllAlerts', 'getSystemActivity', 'updateUserRole'
  ];
  if (!payload || typeof payload !== 'object' || !allowedActions.includes(payload.action)) {
    throw new Error('Invalid or missing action.');
  }
  if (payload.filters && typeof payload.filters !== 'object') {
    throw new Error('Filters must be an object.');
  }
  if ((payload.limit && typeof payload.limit !== 'number') || payload.limit < 1) {
    payload.limit = 100;
  }
  if ((payload.offset && typeof payload.offset !== 'number') || payload.offset < 0) {
    payload.offset = 0;
  }
  return payload as RequestPayload;
}

/**
 * Confirms that the given user is an admin.
 */
async function verifyAdminRole(supabase: SupabaseClient, userId: string): Promise<void> {
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();
  if (error || !profile || profile.role !== 'admin') {
    throw new Error('Access denied: Admin role required');
  }
}

/**
 * Fetches dashboard statistics.
 */
async function getStats(supabase: SupabaseClient) {
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
  ]);
  return {
    totalUsers: totalUsers ?? 0,
    totalPatients: totalPatients ?? 0,
    totalDoctors: totalDoctors ?? 0,
    totalAlerts: totalAlerts ?? 0,
    totalReadings: totalReadings ?? 0
  };
}

/**
 * Fetches all users with their profiles, paginated.
 */
async function getAllUsers(supabase: SupabaseClient, limit = 100, offset = 0) {
  const { data: users, error } = await supabase
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
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return users;
}

/**
 * Fetches all alerts with user information, paginated.
 */
async function getAllAlerts(supabase: SupabaseClient, limit = 100, offset = 0) {
  const { data: alerts, error } = await supabase
    .from('smart_alerts')
    .select(`
      *,
      profiles!inner(full_name, role)
    `)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return alerts;
}

/**
 * Fetches recent system activity.
 */
async function getSystemActivity(supabase: SupabaseClient, limit = 50, offset = 0) {
  const { data: recentReadings, error } = await supabase
    .from('heart_rate_readings')
    .select(`
      id,
      heart_rate,
      recorded_at,
      profiles!inner(full_name)
    `)
    .order('recorded_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return recentReadings;
}

/**
 * Updates a user's role.
 */
async function updateUserRole(supabase: SupabaseClient, filters: any) {
  if (!filters || typeof filters !== 'object' || !filters.userId || !filters.newRole) {
    throw new Error('userId and newRole are required in filters');
  }
  const { data: updatedUser, error } = await supabase
    .from('profiles')
    .update({ role: filters.newRole })
    .eq('id', filters.userId)
    .select();

  if (error) throw error;
  return updatedUser;
}

/**
 * Main handler for incoming HTTP requests.
 */
serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Use a unique requestId for logging and tracing
  const requestId = crypto.randomUUID();

  try {
    // Environment variables
    const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = getSupabaseEnv();
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Authorization
    const authHeader = req.headers.get('Authorization');
    const token = getBearerToken(authHeader);

    // Validate and get user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) throw new Error('Unauthorized');

    // Admin check
    await verifyAdminRole(supabase, user.id);

    // Parse and validate payload
    const payload = validatePayload(await req.json());

    // Logging the action
    console.info(`[${requestId}] Action: ${payload.action} by User: ${user.id}`);

    // Dispatch action
    let result: any;
    switch (payload.action) {
      case 'getStats':
        result = await getStats(supabase);
        break;
      case 'getAllUsers':
        result = await getAllUsers(
          supabase,
          payload.limit ?? 100,
          payload.offset ?? 0
        );
        break;
      case 'getAllAlerts':
        result = await getAllAlerts(
          supabase,
          payload.limit ?? 100,
          payload.offset ?? 0
        );
        break;
      case 'getSystemActivity':
        result = await getSystemActivity(
          supabase,
          payload.limit ?? 50,
          payload.offset ?? 0
        );
        break;
      case 'updateUserRole':
        result = await updateUserRole(supabase, payload.filters);
        break;
      default:
        throw new Error('Invalid action');
    }

    // Success response
    return new Response(
      JSON.stringify({ success: true, data: result, requestId }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error: any) {
    // Enhanced error logging
    console.error(`[${requestId}] Error:`, error?.stack || error?.message || error);
    return new Response(
      JSON.stringify({ success: false, error: error.message, requestId }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
