import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Admin actions supported
type AdminAction =
  | 'getStats'
  | 'getAllUsers'
  | 'getAllAlerts'
  | 'getSystemActivity'
  | 'updateUserRole';

// Payload structure for incoming requests
interface RequestPayload {
  action: AdminAction;
  table?: string;
  filters?: Record<string, unknown>;
  limit?: number;
  offset?: number;
}

const DEFAULT_LIMIT = 100;
const DEFAULT_OFFSET = 0;
const SYSTEM_ACTIVITY_LIMIT = 50;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'no-referrer'
};

function getSupabaseEnv() {
  const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Server Misconfigured: Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  }
  return { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY };
}

function getBearerToken(authHeader: string | null): string {
  if (!authHeader?.startsWith('Bearer ')) {
    throw new Error('Unauthorized');
  }
  return authHeader.slice(7);
}

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
  payload.limit = typeof payload.limit === 'number' && payload.limit > 0 ? payload.limit : DEFAULT_LIMIT;
  payload.offset = typeof payload.offset === 'number' && payload.offset >= 0 ? payload.offset : DEFAULT_OFFSET;
  return payload as RequestPayload;
}

async function verifyAdminRole(supabase: SupabaseClient, userId: string): Promise<void> {
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();
  if (error || !profile || profile.role !== 'admin') {
    throw new Error('Forbidden');
  }
}

// Data actions

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

async function getAllUsers(supabase: SupabaseClient, limit: number, offset: number) {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, role, created_at, emergency_contact_name, emergency_contact_phone')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);
  if (error) throw new Error('Failed to fetch users');
  return data;
}

async function getAllAlerts(supabase: SupabaseClient, limit: number, offset: number) {
  const { data, error } = await supabase
    .from('smart_alerts')
    .select('*, profiles!inner(full_name, role)')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);
  if (error) throw new Error('Failed to fetch alerts');
  return data;
}

async function getSystemActivity(supabase: SupabaseClient, limit: number, offset: number) {
  const { data, error } = await supabase
    .from('heart_rate_readings')
    .select('id, heart_rate, recorded_at, profiles!inner(full_name)')
    .order('recorded_at', { ascending: false })
    .range(offset, offset + limit - 1);
  if (error) throw new Error('Failed to fetch activity');
  return data;
}

async function updateUserRole(supabase: SupabaseClient, filters: any) {
  if (!filters?.userId || !filters?.newRole) {
    throw new Error('userId and newRole are required in filters');
  }
  const { data, error } = await supabase
    .from('profiles')
    .update({ role: filters.newRole })
    .eq('id', filters.userId)
    .select();
  if (error) throw new Error('Failed to update user role');
  return data;
}

// Action dispatcher
const actionHandlers: Record<AdminAction, Function> = {
  getStats: async (supabase: SupabaseClient) => getStats(supabase),
  getAllUsers: async (supabase: SupabaseClient, payload: RequestPayload) =>
    getAllUsers(supabase, payload.limit!, payload.offset!),
  getAllAlerts: async (supabase: SupabaseClient, payload: RequestPayload) =>
    getAllAlerts(supabase, payload.limit!, payload.offset!),
  getSystemActivity: async (supabase: SupabaseClient, payload: RequestPayload) =>
    getSystemActivity(supabase, payload.limit ?? SYSTEM_ACTIVITY_LIMIT, payload.offset!),
  updateUserRole: async (supabase: SupabaseClient, payload: RequestPayload) =>
    updateUserRole(supabase, payload.filters)
};

serve(async (req: Request) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const requestId = crypto.randomUUID();

  try {
    const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = getSupabaseEnv();
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Auth
    const authHeader = req.headers.get('Authorization');
    const token = getBearerToken(authHeader);

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) throw new Error('Unauthorized');

    await verifyAdminRole(supabase, user.id);

    const payload = validatePayload(await req.json());

    console.info(`[${requestId}] Action: ${payload.action} by User: ${user.id}`);

    const handler = actionHandlers[payload.action];
    if (!handler) throw new Error('Invalid action');

    const result = await handler(supabase, payload);

    return new Response(
      JSON.stringify({ success: true, data: result, requestId }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (err: any) {
    // Hide stack trace from client, log internally
    const status =
      err.message === 'Unauthorized' ? 401 :
      err.message === 'Forbidden'   ? 403 :
      400;
    console.error(`[${requestId}] Error:`, err?.stack || err?.message || err);
    return new Response(
      JSON.stringify({ success: false, error: err.message || 'Unknown error', requestId }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status }
    );
  }
});
