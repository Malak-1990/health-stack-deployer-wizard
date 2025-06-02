
import { useAuth } from '@/hooks/useAuth';

const WelcomeHeader = () => {
  const { user } = useAuth();

  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        مرحباً، {user?.email}
      </h1>
      <p className="text-gray-600">لوحة تحكم المريض - متابعة الحالة الصحية مع التنبيهات الذكية</p>
    </div>
  );
};

export default WelcomeHeader;
