
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const AuthPage: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [selectedRole, setSelectedRole] = useState<'patient' | 'doctor' | 'family' | 'admin'>('patient');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const { signIn, signUp } = useAuth();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            if (isLogin) {
                const { error } = await signIn(email, password);
                if (error) throw error;
                setMessage('تم تسجيل الدخول بنجاح. جاري التوجيه...');
            } else {
                const { error } = await signUp(email, password, fullName);
                if (error) {
                    throw error;
                }

                // Create user profile with selected role
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    const { error: profileError } = await supabase.from('profiles').upsert([
                        {
                            id: user.id,
                            full_name: fullName,
                            role: selectedRole,
                        }
                    ], { onConflict: 'id' });

                    if (profileError) {
                        console.error('Error creating user profile:', profileError.message);
                        setMessage(`حدث خطأ أثناء إنشاء ملفك الشخصي: ${profileError.message}`);
                        return;
                    }

                    setMessage('تم إنشاء الحساب بنجاح! جاري التوجيه...');
                } else {
                    setMessage('تحقق من بريدك الإلكتروني لتأكيد حسابك قبل تسجيل الدخول.');
                }
            }
        } catch (error: any) {
            setMessage(`خطأ: ${error.message}`);
            console.error('Auth error:', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#03045E] to-[#0077B6] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full text-center">
                {/* Logo and University Header */}
                <div className="flex items-center justify-center mb-6">
                    <img 
                        src="/lovable-uploads/1d5bbf79-3e01-4978-8149-e5c89b8136b2.png" 
                        alt="University Logo" 
                        className="w-12 h-12 mr-3"
                    />
                    <div className="text-right">
                        <h1 className="text-lg font-bold text-[#03045E]">جامعة الإسكندرية</h1>
                        <p className="text-sm text-gray-600">كلية الهندسة</p>
                    </div>
                </div>

                <h2 className="text-3xl font-bold text-[#03045E] mb-6">
                    {isLogin ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
                </h2>

                <form onSubmit={handleAuth} className="space-y-6">
                    {!isLogin && (
                        <input
                            type="text"
                            placeholder="الاسم الكامل"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00B4D8] focus:border-transparent transition-all"
                            required={!isLogin}
                        />
                    )}
                    <input
                        type="email"
                        placeholder="البريد الإلكتروني"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00B4D8] focus:border-transparent transition-all"
                        required
                    />
                    <input
                        type="password"
                        placeholder="كلمة المرور"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00B4D8] focus:border-transparent transition-all"
                        required
                    />

                    {!isLogin && (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-700 mb-3">اختر نوع المستخدم:</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                {['patient', 'doctor', 'family', 'admin'].map((roleOption) => (
                                    <button
                                        key={roleOption}
                                        type="button"
                                        onClick={() => setSelectedRole(roleOption as any)}
                                        className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                                            selectedRole === roleOption
                                                ? 'bg-[#00B4D8] border-[#0077B6] text-white shadow-md'
                                                : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        {roleOption === 'patient' && 'مريض'}
                                        {roleOption === 'doctor' && 'طبيب'}
                                        {roleOption === 'family' && 'فرد عائلة'}
                                        {roleOption === 'admin' && 'مشرف'}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {message && (
                        <p className={`mt-4 text-sm ${message.startsWith('خطأ') ? 'text-red-500' : 'text-green-500'}`}>
                            {message}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-[#0077B6] text-white font-bold py-3 rounded-lg hover:bg-opacity-90 transition-colors duration-300 shadow-md disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? 'جاري التحميل...' : (isLogin ? 'تسجيل الدخول' : 'إنشاء حساب')}
                    </button>
                </form>

                <p className="mt-6 text-gray-600">
                    {isLogin ? 'ليس لديك حساب؟ ' : 'لديك حساب بالفعل؟ '}
                    <button
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setMessage('');
                            setLoading(false);
                            setEmail('');
                            setPassword('');
                            setFullName('');
                            setSelectedRole('patient');
                        }}
                        className="text-[#0077B6] font-semibold hover:underline"
                    >
                        {isLogin ? 'إنشاء حساب جديد' : 'تسجيل الدخول'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default AuthPage;
