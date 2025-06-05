
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Heart, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRole, UserRole } from '@/contexts/RoleContext';
import { AuthService } from '@/services/AuthService';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('patient');
  const [loading, setLoading] = useState(false);
  const { signUp, user } = useAuth();
  const { setUserRole } = useRole();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { language, setLanguage, t, direction } = useLanguage();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await signUp(email, password, fullName);
    
    if (error) {
      toast({
        title: "فشل في إنشاء الحساب",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setUserRole(selectedRole);
      toast({
        title: "تم بنجاح!",
        description: "يرجى التحقق من بريدك الإلكتروني لتأكيد الحساب.",
      });
    }
    setLoading(false);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await AuthService.signInSafely(email, password);
      
      if (error) {
        toast({
          title: "فشل في تسجيل الدخول",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "مرحباً بعودتك!",
          description: "تم تسجيل الدخول بنجاح.",
        });
        // Navigation will be handled by auth state change
      }
    } catch (error) {
      toast({
        title: "خطأ في تسجيل الدخول",
        description: "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    }
    
    setLoading(false);
  };

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4 ${direction === 'rtl' ? 'font-cairo' : ''}`} dir={direction}>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-red-100 rounded-full">
                <Heart className="h-8 w-8 text-red-600" />
              </div>
              <div className={direction === 'rtl' ? 'mr-3 text-right' : 'ml-3'}>
                <CardTitle className="text-2xl font-bold">
                  نظام مراقبة مرضى القلب
                </CardTitle>
                <CardDescription>جامعة الزاوية - كلية العلوم العجيلات</CardDescription>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={toggleLanguage}>
              <Globe className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">{t('signin')}</TabsTrigger>
              <TabsTrigger value="signup">{t('signup')}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">{t('email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={t('email')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={direction === 'rtl' ? 'text-right' : ''}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">{t('password')}</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder={t('password')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className={direction === 'rtl' ? 'text-right' : ''}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? t('loading') : t('signin')}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">{t('fullname')}</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder={t('fullname')}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className={direction === 'rtl' ? 'text-right' : ''}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">{t('role')}</Label>
                  <Select value={selectedRole} onValueChange={(value: UserRole) => setSelectedRole(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('role')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="patient">{t('patient')}</SelectItem>
                      <SelectItem value="doctor">{t('doctor')}</SelectItem>
                      <SelectItem value="family">{t('family')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{t('email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={t('email')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={direction === 'rtl' ? 'text-right' : ''}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">{t('password')}</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder={t('password')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className={direction === 'rtl' ? 'text-right' : ''}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? t('loading') : t('signup')}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
