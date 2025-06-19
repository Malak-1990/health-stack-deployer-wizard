import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

// Type for user roles
type UserRole = 'patient' | 'doctor' | 'family';

interface RoleSelectorProps {
  selectedRole: UserRole;
  setSelectedRole: (role: UserRole) => void;
}

// Validation schemas
const validation = {
  email: (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },
  password: (password: string) => ({
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    isStrong: password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password)
  }),
  fullName: (name: string) => name.trim().length >= 2
};

const roles: { key: UserRole; label: string; icon: string }[] = [
  { key: 'patient', label: 'مريض', icon: '🏥' },
  { key: 'doctor', label: 'طبيب', icon: '👩‍⚕️' },
  { key: 'family', label: 'فرد عائلة', icon: '👨‍👩‍👧‍👦' },
];

const RoleSelector: React.FC<RoleSelectorProps> = ({ selectedRole, setSelectedRole }) => (
  <div>
    <h3 className="text-lg font-semibold text-gray-700 mb-3" id="role-label">
      اختر نوع المستخدم:
    </h3>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3" role="group" aria-labelledby="role-label">
      {roles.map(({ key, label, icon }) => (
        <button
          key={key}
          type="button"
          aria-pressed={selectedRole === key}
          onClick={() => setSelectedRole(key)}
          className={`p-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center gap-2 ${
            selectedRole === key
              ? 'bg-[#00B4D8] border-[#0077B6] text-white shadow-md transform scale-105'
              : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200 hover:border-gray-400'
          }`}
        >
          <span className="text-2xl">{icon}</span>
          <span className="text-sm font-medium">{label}</span>
        </button>
      ))}
    </div>
  </div>
);

// Helper functions
const handleInputChange = (
  setter: React.Dispatch<React.SetStateAction<string>>
) => (e: React.ChangeEvent<HTMLInputElement>) => setter(e.target.value);

const sanitizeError = (msg: string): string => {
  const errorMappings: { [key: string]: string } = {
    'Invalid login credentials': 'بيانات تسجيل الدخول غير صحيحة',
    'User already registered': 'هذا البريد الإلكتروني مسجل مسبقاً',
    'Password should be at least 6 characters': 'كلمة المرور يجب أن تكون 6 أحرف على الأقل',
    'Invalid email': 'البريد الإلكتروني غير صالح',
    'Email not confirmed': 'لم يتم تأكيد البريد الإلكتروني',
  };
  
  return errorMappings[msg] || 'حدث خطأ غير متوقع. يرجى المحاولة لاحقاً.';
};

// Password strength indicator component
const PasswordStrengthIndicator: React.FC<{ password: string }> = ({ password }) => {
  const strength = validation.password(password);
  const requirements = [
    { key: 'minLength', label: '8 أحرف على الأقل', met: strength.minLength },
    { key: 'hasUpperCase', label: 'حرف كبير', met: strength.hasUpperCase },
    { key: 'hasLowerCase', label: 'حرف صغير', met: strength.hasLowerCase },
    { key: 'hasNumber', label: 'رقم', met: strength.hasNumber },
  ];

  if (!password) return null;

  return (
    <div className="mt-2 p-3 bg-gray-50 rounded-lg">
      <p className="text-xs text-gray-600 mb-2">متطلبات كلمة المرور:</p>
      <div className="space-y-1">
        {requirements.map(({ key, label, met }) => (
          <div key={key} className="flex items-center gap-2 text-xs">
            <span className={met ? 'text-green-500' : 'text-red-500'}>
              {met ? '✓' : '✗'}
            </span>
            <span className={met ? 'text-green-700' : 'text-gray-600'}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('patient');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const navigate = useNavigate();
  const { signIn } = useAuth();

  // Real-time validation
  useEffect(() => {
    const errors: string[] = [];
    
    if (!isLogin) {
      if (fullName && !validation.fullName(fullName)) {
        errors.push('الاسم يجب أن يكون حرفين على الأقل');
      }
      if (password && !validation.password(password).isStrong) {
        errors.push('كلمة المرور لا تحقق المتطلبات');
      }
    }
    
    if (email && !validation.email(email)) {
      errors.push('البريد الإلكتروني غير صالح');
    }

    setValidationErrors(errors);
  }, [email, password, fullName, isLogin]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Final validation
    if (validationErrors.length > 0) {
      setMessage('يرجى تصحيح الأخطاء قبل المتابعة');
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) throw error;
        
        setMessage('تم تسجيل الدخول بنجاح. جاري التوجيه...');
        setTimeout(() => navigate('/dashboard'), 1500);
      } else {
        // Sign up process
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName }
          }
        });

        if (signUpError) throw signUpError;

        // Check if user needs email confirmation
        if (data?.user && !data.session) {
          setMessage('تم إرسال رابط التأكيد إلى بريدك الإلكتروني');
          setLoading(false);
          return;
        }

        // Immediate login if no confirmation required
        const { error: signInErr } = await signIn(email, password);
        if (signInErr) throw signInErr;

        // Create profile
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        
        if (user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert([
              {
                id: user.id,
                full_name: fullName,
                role: selectedRole,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }
            ], { onConflict: 'id' });

          if (profileError) {
            console.error('Profile creation error:', profileError);
            setMessage('تم إنشاء الحساب ولكن حدث خطأ في إعداد الملف الشخصي');
            return;
          }
        }
        
        setMessage('تم إنشاء الحساب وتسجيل الدخول بنجاح!');
        setTimeout(() => navigate('/dashboard'), 1500);
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      setMessage(sanitizeError(error.message));
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setIsLogin(!isLogin);
    setMessage('');
    setValidationErrors([]);
    setLoading(false);
    setEmail('');
    setPassword('');
    setFullName('');
    setSelectedRole('patient');
  };

  const isFormValid = validationErrors.length === 0 && email && password && (isLogin || fullName);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#03045E] to-[#0077B6] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full">
        {/* Header */}
        <div className="flex items-center justify-center mb-6">
          <img
            src="/lovable-uploads/8e458822-aeb4-4983-89dc-16e2b6e10938.png"
            alt="شعار جامعة الزاوية وكلية العلوم العجيلات"
            className="w-12 h-12 mr-3 rounded-full"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = 'https://placehold.co/50x50/CCCCCC/888888?text=شعار';
            }}
          />
          <div className="text-right">
            <h1 className="text-lg font-bold text-[#03045E]">جامعة الزاوية</h1>
            <p className="text-sm text-gray-600">كلية العلوم العجيلات</p>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-[#03045E] mb-6 text-center">
          {isLogin ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
        </h2>

        <form onSubmit={handleAuth} className="space-y-6" noValidate>
          {!isLogin && (
            <div>
              <input
                type="text"
                placeholder="الاسم الكامل"
                value={fullName}
                onChange={handleInputChange(setFullName)}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#00B4D8] focus:border-transparent transition-all ${
                  fullName && !validation.fullName(fullName) ? 'border-red-300' : 'border-gray-300'
                }`}
                required
                aria-invalid={fullName && !validation.fullName(fullName)}
              />
            </div>
          )}

          <div>
            <input
              type="email"
              placeholder="البريد الإلكتروني"
              value={email}
              onChange={handleInputChange(setEmail)}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#00B4D8] focus:border-transparent transition-all ${
                email && !validation.email(email) ? 'border-red-300' : 'border-gray-300'
              }`}
              required
              autoComplete="username"
              aria-invalid={email && !validation.email(email)}
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="كلمة المرور"
              value={password}
              onChange={handleInputChange(setPassword)}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#00B4D8] focus:border-transparent transition-all ${
                password && !isLogin && !validation.password(password).isStrong ? 'border-red-300' : 'border-gray-300'
              }`}
              required
              autoComplete={isLogin ? "current-password" : "new-password"}
              aria-invalid={password && !isLogin && !validation.password(password).isStrong}
            />
            {!isLogin && <PasswordStrengthIndicator password={password} />}
          </div>

          {!isLogin && (
            <RoleSelector selectedRole={selectedRole} setSelectedRole={setSelectedRole} />
          )}

          {/* Validation errors */}
          {validationErrors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <ul className="text-sm text-red-600 space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span>•</span>
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Success/Error messages */}
          {message && (
            <div
              className={`p-3 rounded-lg ${
                message.includes('خطأ') || message.includes('error')
                  ? 'bg-red-50 text-red-600 border border-red-200'
                  : 'bg-green-50 text-green-600 border border-green-200'
              }`}
              role="alert"
            >
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !isFormValid}
            className="w-full bg-[#0077B6] text-white font-bold py-3 rounded-lg hover:bg-opacity-90 transition-all duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            aria-busy={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin mr-2 h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                جاري التحميل...
              </>
            ) : (
              isLogin ? 'تسجيل الدخول' : 'إنشاء حساب'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            {isLogin ? 'ليس لديك حساب؟ ' : 'لديك حساب بالفعل؟ '}
            <button
              onClick={resetForm}
              className="text-[#0077B6] font-semibold hover:underline transition-colors"
              type="button"
            >
              {isLogin ? 'إنشاء حساب جديد' : 'تسجيل الدخول'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
