
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { Calendar, Plus, Edit } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface DailyLog {
  id: string;
  date: string;
  sleep_hours?: number;
  water_intake_ml?: number;
  exercise_minutes?: number;
  stress_level?: number;
  mood?: number;
  weight_kg?: number;
  notes?: string;
}

const DailyLogCard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [todayLog, setTodayLog] = useState<DailyLog | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    sleep_hours: '',
    water_intake_ml: '',
    exercise_minutes: '',
    stress_level: [5],
    mood: [5],
    weight_kg: '',
    notes: ''
  });

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (user) {
      loadTodayLog();
    }
  }, [user]);

  const loadTodayLog = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('daily_health_logs')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', today)
      .single();

    if (error && error.code !== 'PGRST116') {
      toast({
        title: "Error loading daily log",
        description: error.message,
        variant: "destructive",
      });
    } else if (data) {
      const transformedData = {
        ...data,
        sleep_hours: data.sleep_hours ?? undefined,
        water_intake_ml: data.water_intake_ml ?? undefined,
        exercise_minutes: data.exercise_minutes ?? undefined,
        stress_level: data.stress_level ?? undefined,
        mood: data.mood ?? undefined,
        weight_kg: data.weight_kg ?? undefined,
        notes: data.notes ?? undefined
      };
      setTodayLog(transformedData);
      setFormData({
        sleep_hours: data.sleep_hours?.toString() || '',
        water_intake_ml: data.water_intake_ml?.toString() || '',
        exercise_minutes: data.exercise_minutes?.toString() || '',
        stress_level: [data.stress_level || 5],
        mood: [data.mood || 5],
        weight_kg: data.weight_kg?.toString() || '',
        notes: data.notes || ''
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const data = {
      user_id: user.id,
      date: today,
      sleep_hours: formData.sleep_hours ? parseFloat(formData.sleep_hours) : null,
      water_intake_ml: formData.water_intake_ml ? parseInt(formData.water_intake_ml) : null,
      exercise_minutes: formData.exercise_minutes ? parseInt(formData.exercise_minutes) : null,
      stress_level: formData.stress_level[0],
      mood: formData.mood[0],
      weight_kg: formData.weight_kg ? parseFloat(formData.weight_kg) : null,
      notes: formData.notes || null,
    };

    let error;
    if (todayLog) {
      const { error: updateError } = await supabase
        .from('daily_health_logs')
        .update(data)
        .eq('id', todayLog.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from('daily_health_logs')
        .insert([data]);
      error = insertError;
    }

    if (error) {
      toast({
        title: "Error saving daily log",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Daily log saved successfully",
      });
      setIsDialogOpen(false);
      loadTodayLog();
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <span>Today's Health Log</span>
            </CardTitle>
            <CardDescription>Track your daily wellness metrics</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                {todayLog ? <Edit className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                {todayLog ? 'Update Log' : 'Add Log'}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  Daily Health Log - {format(new Date(), 'MMM dd, yyyy')}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="sleep_hours">Sleep Hours</Label>
                    <Input
                      id="sleep_hours"
                      type="number"
                      step="0.5"
                      min="0"
                      max="24"
                      value={formData.sleep_hours}
                      onChange={(e) => setFormData({ ...formData, sleep_hours: e.target.value })}
                      placeholder="8.0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="water_intake_ml">Water (ml)</Label>
                    <Input
                      id="water_intake_ml"
                      type="number"
                      min="0"
                      max="5000"
                      value={formData.water_intake_ml}
                      onChange={(e) => setFormData({ ...formData, water_intake_ml: e.target.value })}
                      placeholder="2000"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="exercise_minutes">Exercise (min)</Label>
                    <Input
                      id="exercise_minutes"
                      type="number"
                      min="0"
                      max="300"
                      value={formData.exercise_minutes}
                      onChange={(e) => setFormData({ ...formData, exercise_minutes: e.target.value })}
                      placeholder="30"
                    />
                  </div>
                  <div>
                    <Label htmlFor="weight_kg">Weight (kg)</Label>
                    <Input
                      id="weight_kg"
                      type="number"
                      step="0.1"
                      min="30"
                      max="300"
                      value={formData.weight_kg}
                      onChange={(e) => setFormData({ ...formData, weight_kg: e.target.value })}
                      placeholder="70.0"
                    />
                  </div>
                </div>

                <div>
                  <Label>Stress Level: {formData.stress_level[0]}/10</Label>
                  <Slider
                    value={formData.stress_level}
                    onValueChange={(value) => setFormData({ ...formData, stress_level: value })}
                    max={10}
                    min={1}
                    step={1}
                    className="mt-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Low</span>
                    <span>High</span>
                  </div>
                </div>

                <div>
                  <Label>Mood: {formData.mood[0]}/10</Label>
                  <Slider
                    value={formData.mood}
                    onValueChange={(value) => setFormData({ ...formData, mood: value })}
                    max={10}
                    min={1}
                    step={1}
                    className="mt-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Poor</span>
                    <span>Excellent</span>
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="How are you feeling today?"
                    rows={3}
                  />
                </div>

                <Button type="submit" className="w-full">
                  {todayLog ? 'Update Log' : 'Save Log'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {todayLog ? (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Sleep:</span> {todayLog.sleep_hours || 'N/A'} hours
              </div>
              <div>
                <span className="font-medium">Water:</span> {todayLog.water_intake_ml || 'N/A'} ml
              </div>
              <div>
                <span className="font-medium">Exercise:</span> {todayLog.exercise_minutes || 'N/A'} min
              </div>
              <div>
                <span className="font-medium">Weight:</span> {todayLog.weight_kg || 'N/A'} kg
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Stress:</span> {todayLog.stress_level || 'N/A'}/10
              </div>
              <div>
                <span className="font-medium">Mood:</span> {todayLog.mood || 'N/A'}/10
              </div>
            </div>
            {todayLog.notes && (
              <div className="text-sm">
                <span className="font-medium">Notes:</span> {todayLog.notes}
              </div>
            )}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-4">
            No log for today. Start tracking your daily wellness!
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default DailyLogCard;
