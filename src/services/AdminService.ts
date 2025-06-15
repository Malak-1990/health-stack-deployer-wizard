
import { supabase } from '@/integrations/supabase/client';

const SUPABASE_FUNCTIONS_URL = "https://uzxjjuursjgymtgfkgxd.supabase.co/functions/v1"; // استخدم رابط مشروعك مباشرة

class AdminService {
  private async callAdminFunction(action: string, filters?: any) {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('No authenticated session');
    }

    const response = await fetch(`${SUPABASE_FUNCTIONS_URL}/admin-data-access`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action, filters }),
    });

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Admin function call failed');
    }

    return result.data;
  }

  async getStats() {
    return this.callAdminFunction('getStats');
  }

  async getAllUsers() {
    return this.callAdminFunction('getAllUsers');
  }

  async getAllAlerts() {
    return this.callAdminFunction('getAllAlerts');
  }

  async getSystemActivity() {
    return this.callAdminFunction('getSystemActivity');
  }

  async updateUserRole(userId: string, newRole: string) {
    return this.callAdminFunction('updateUserRole', { userId, newRole });
  }
}

export const adminService = new AdminService();

