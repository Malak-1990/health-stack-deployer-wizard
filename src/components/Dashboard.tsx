
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Activity, Calendar, User, Plus, LogOut } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import HeartRateCard from './HeartRateCard';
import DailyLogCard from './DailyLogCard';
import AppointmentsCard from './AppointmentsCard';
import ProfileCard from './ProfileCard';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState({
    todayHeartRate: null as number | null,
    weeklyAvgHeartRate: null as number | null,
    totalReadings: 0,
    upcomingAppointments: 0
  });

  useEffect(() => {
    if (user) {
      loadDashboardStats();
    }
  }, [user]);

  const loadDashboardStats = async () => {
    if (!user) return;

    try {
      // Get today's heart rate readings
      const today = new Date().toISOString().split('T')[0];
      const { data: todayReadings } = await supabase
        .from('heart_rate_readings')
        .select('heart_rate')
        .eq('user_id', user.id)
        .gte('recorded_at', today)
        .order('recorded_at', { ascending: false });

      // Get weekly average
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const { data: weeklyReadings } = await supabase
        .from('heart_rate_readings')
        .select('heart_rate')
        .eq('user_id', user.id)
        .gte('recorded_at', weekAgo.toISOString());

      // Get total readings count
      const { count: totalCount } = await supabase
        .from('heart_rate_readings')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // Get upcoming appointments
      const { count: appointmentCount } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('status', 'scheduled')
        .gte('appointment_date', new Date().toISOString());

      setStats({
        todayHeartRate: todayReadings && todayReadings.length > 0 ? todayReadings[0].heart_rate : null,
        weeklyAvgHeartRate: weeklyReadings && weeklyReadings.length > 0 
          ? Math.round(weeklyReadings.reduce((sum, r) => sum + r.heart_rate, 0) / weeklyReadings.length)
          : null,
        totalReadings: totalCount || 0,
        upcomingAppointments: appointmentCount || 0
      });
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out successfully",
      description: "See you next time!",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Heart className="h-6 w-6 text-red-600" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Heart Monitor</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user?.email}</span>
              <Button onClick={handleSignOut} variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Heart Rate</CardTitle>
              <Heart className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.todayHeartRate ? `${stats.todayHeartRate} BPM` : 'No data'}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Weekly Average</CardTitle>
              <Activity className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.weeklyAvgHeartRate ? `${stats.weeklyAvgHeartRate} BPM` : 'No data'}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Readings</CardTitle>
              <Activity className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalReadings}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.upcomingAppointments}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <HeartRateCard onUpdate={loadDashboardStats} />
            <DailyLogCard />
          </div>
          <div className="space-y-6">
            <AppointmentsCard />
            <ProfileCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
