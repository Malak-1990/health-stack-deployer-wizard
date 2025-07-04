
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { User, Edit, Plus, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Profile {
  id: string;
  full_name?: string;
  date_of_birth?: string;
  gender?: string;
  height_cm?: number;
  weight_kg?: number;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  medical_conditions?: string[];
  medications?: string[];
}

const ProfileCard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    date_of_birth: '',
    gender: '',
    height_cm: '',
    weight_kg: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    medical_conditions: [] as string[],
    medications: [] as string[],
    newCondition: '',
    newMedication: ''
  });

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      toast({
        title: "Error loading profile",
        description: error.message,
        variant: "destructive",
      });
    } else if (data) {
      setProfile(data);
      setFormData({
        full_name: data.full_name || '',
        date_of_birth: data.date_of_birth || '',
        gender: data.gender || '',
        height_cm: data.height_cm?.toString() || '',
        weight_kg: data.weight_kg?.toString() || '',
        emergency_contact_name: data.emergency_contact_name || '',
        emergency_contact_phone: data.emergency_contact_phone || '',
        medical_conditions: data.medical_conditions || [],
        medications: data.medications || [],
        newCondition: '',
        newMedication: ''
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const data = {
      id: user.id,
      full_name: formData.full_name || null,
      date_of_birth: formData.date_of_birth || null,
      gender: formData.gender || null,
      height_cm: formData.height_cm ? parseInt(formData.height_cm) : null,
      weight_kg: formData.weight_kg ? parseFloat(formData.weight_kg) : null,
      emergency_contact_name: formData.emergency_contact_name || null,
      emergency_contact_phone: formData.emergency_contact_phone || null,
      medical_conditions: formData.medical_conditions.length > 0 ? formData.medical_conditions : null,
      medications: formData.medications.length > 0 ? formData.medications : null,
    };

    const { error } = await supabase
      .from('profiles')
      .upsert([data]);

    if (error) {
      toast({
        title: "Error saving profile",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      setIsDialogOpen(false);
      loadProfile();
    }
  };

  const addCondition = () => {
    if (formData.newCondition.trim()) {
      setFormData({
        ...formData,
        medical_conditions: [...formData.medical_conditions, formData.newCondition.trim()],
        newCondition: ''
      });
    }
  };

  const removeCondition = (index: number) => {
    setFormData({
      ...formData,
      medical_conditions: formData.medical_conditions.filter((_, i) => i !== index)
    });
  };

  const addMedication = () => {
    if (formData.newMedication.trim()) {
      setFormData({
        ...formData,
        medications: [...formData.medications, formData.newMedication.trim()],
        newMedication: ''
      });
    }
  };

  const removeMedication = (index: number) => {
    setFormData({
      ...formData,
      medications: formData.medications.filter((_, i) => i !== index)
    });
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const calculateBMI = (weight: number, height: number) => {
    const heightInM = height / 100;
    return (weight / (heightInM * heightInM)).toFixed(1);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5 text-green-600" />
              <span>Health Profile</span>
            </CardTitle>
            <CardDescription>Manage your personal health information</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Health Profile</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="date_of_birth">Date of Birth</Label>
                    <Input
                      id="date_of_birth"
                      type="date"
                      value={formData.date_of_birth}
                      onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="height_cm">Height (cm)</Label>
                    <Input
                      id="height_cm"
                      type="number"
                      min="100"
                      max="250"
                      value={formData.height_cm}
                      onChange={(e) => setFormData({ ...formData, height_cm: e.target.value })}
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
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="emergency_contact_name">Emergency Contact Name</Label>
                    <Input
                      id="emergency_contact_name"
                      value={formData.emergency_contact_name}
                      onChange={(e) => setFormData({ ...formData, emergency_contact_name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="emergency_contact_phone">Emergency Contact Phone</Label>
                    <Input
                      id="emergency_contact_phone"
                      type="tel"
                      value={formData.emergency_contact_phone}
                      onChange={(e) => setFormData({ ...formData, emergency_contact_phone: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label>Medical Conditions</Label>
                  <div className="flex space-x-2 mb-2">
                    <Input
                      placeholder="Add medical condition"
                      value={formData.newCondition}
                      onChange={(e) => setFormData({ ...formData, newCondition: e.target.value })}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCondition())}
                    />
                    <Button type="button" onClick={addCondition} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.medical_conditions.map((condition, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {condition}
                        <button
                          type="button"
                          onClick={() => removeCondition(index)}
                          className="ml-1 hover:text-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Current Medications</Label>
                  <div className="flex space-x-2 mb-2">
                    <Input
                      placeholder="Add medication"
                      value={formData.newMedication}
                      onChange={(e) => setFormData({ ...formData, newMedication: e.target.value })}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addMedication())}
                    />
                    <Button type="button" onClick={addMedication} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.medications.map((medication, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {medication}
                        <button
                          type="button"
                          onClick={() => removeMedication(index)}
                          className="ml-1 hover:text-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  Save Profile
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {profile ? (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Name:</span> {profile.full_name || 'Not set'}
              </div>
              <div>
                <span className="font-medium">Age:</span> {profile.date_of_birth ? calculateAge(profile.date_of_birth) : 'Not set'}
              </div>
              <div>
                <span className="font-medium">Gender:</span> {profile.gender || 'Not set'}
              </div>
              <div>
                <span className="font-medium">Height:</span> {profile.height_cm || 'Not set'} cm
              </div>
            </div>
            {profile.height_cm && profile.weight_kg && (
              <div className="text-sm">
                <span className="font-medium">BMI:</span> {calculateBMI(profile.weight_kg, profile.height_cm)}
              </div>
            )}
            {profile.emergency_contact_name && (
              <div className="text-sm">
                <span className="font-medium">Emergency Contact:</span> {profile.emergency_contact_name}
                {profile.emergency_contact_phone && ` (${profile.emergency_contact_phone})`}
              </div>
            )}
            {profile.medical_conditions && profile.medical_conditions.length > 0 && (
              <div className="text-sm">
                <span className="font-medium">Medical Conditions:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {profile.medical_conditions.map((condition, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {condition}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {profile.medications && profile.medications.length > 0 && (
              <div className="text-sm">
                <span className="font-medium">Medications:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {profile.medications.map((medication, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {medication}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-4">
            Complete your profile to help track your health better!
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
