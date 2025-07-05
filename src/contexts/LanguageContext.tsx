
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'ar' | 'en';
type Direction = 'rtl' | 'ltr';

interface LanguageContextType {
  language: Language;
  direction: Direction;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  ar: {
    // Navigation
    'dashboard': 'لوحة القيادة',
    'patients': 'المرضى',
    'appointments': 'المواعيد',
    'profile': 'الملف الشخصي',
    'settings': 'الإعدادات',
    'logout': 'تسجيل الخروج',
    
    // Auth
    'welcome': 'مرحباً',
    'signin': 'تسجيل الدخول',
    'signup': 'إنشاء حساب',
    'email': 'البريد الإلكتروني',
    'password': 'كلمة المرور',
    'fullname': 'الاسم الكامل',
    'role': 'نوع المستخدم',
    
    // Roles
    'patient': 'مريض',
    'doctor': 'طبيب',
    'family': 'أهل المريض',
    
    // Health Data
    'heartRate': 'معدل نبضات القلب',
    'bloodPressure': 'ضغط الدم',
    'temperature': 'درجة الحرارة',
    'weight': 'الوزن',
    'height': 'الطول',
    'bpm': 'نبضة/دقيقة',
    'mmHg': 'مم زئبق',
    'celsius': 'مئوي',
    'kg': 'كيلو',
    'cm': 'سم',
    
    // Status
    'normal': 'طبيعي',
    'high': 'مرتفع',
    'low': 'منخفض',
    'critical': 'حرج',
    'stable': 'مستقر',
    
    // Actions
    'add': 'إضافة',
    'edit': 'تعديل',
    'delete': 'حذف',
    'save': 'حفظ',
    'cancel': 'إلغاء',
    'view': 'عرض',
    'search': 'بحث',
    'filter': 'تصفية',
    
    // Project Info
    'projectTitle': 'مشروع تخرج - كلية العلوم العجيلات، جامعة الزاوية',
    'students': 'الطالبات',
    'supervisor': 'تحت إشراف',
    'projectDescription': 'نظام متكامل لمراقبة الحالة الصحية عن بُعد، يتيح متابعة مؤشرات القلب للمرضى بشكل مباشر',
    'features': 'المميزات',
    'technologies': 'التقنيات المستخدمة',
    
    // Alerts
    'alertHigh': 'تحذير: معدل ضربات القلب مرتفع',
    'alertLow': 'تحذير: معدل ضربات القلب منخفض',
    'emergency': 'طوارئ',
    'contactDoctor': 'اتصل بالطبيب',
    
    // Time
    'today': 'اليوم',
    'yesterday': 'أمس',
    'thisWeek': 'هذا الأسبوع',
    'thisMonth': 'هذا الشهر',
    
    // Messages
    'noData': 'لا توجد بيانات',
    'loading': 'جاري التحميل...',
    'error': 'حدث خطأ',
    'success': 'تم بنجاح',
    'welcome_back': 'مرحباً بعودتك'
  },
  en: {
    // Navigation
    'dashboard': 'Dashboard',
    'patients': 'Patients',
    'appointments': 'Appointments',
    'profile': 'Profile',
    'settings': 'Settings',
    'logout': 'Logout',
    
    // Auth
    'welcome': 'Welcome',
    'signin': 'Sign In',
    'signup': 'Sign Up',
    'email': 'Email',
    'password': 'Password',
    'fullname': 'Full Name',
    'role': 'Role',
    
    // Roles
    'patient': 'Patient',
    'doctor': 'Doctor',
    'family': 'Family Member',
    
    // Health Data
    'heartRate': 'Heart Rate',
    'bloodPressure': 'Blood Pressure',
    'temperature': 'Temperature',
    'weight': 'Weight',
    'height': 'Height',
    'bpm': 'BPM',
    'mmHg': 'mmHg',
    'celsius': '°C',
    'kg': 'kg',
    'cm': 'cm',
    
    // Status
    'normal': 'Normal',
    'high': 'High',
    'low': 'Low',
    'critical': 'Critical',
    'stable': 'Stable',
    
    // Actions
    'add': 'Add',
    'edit': 'Edit',
    'delete': 'Delete',
    'save': 'Save',
    'cancel': 'Cancel',
    'view': 'View',
    'search': 'Search',
    'filter': 'Filter',
    
    // Project Info
    'projectTitle': 'Graduation Project - Faculty of Sciences Ajaylat, University of Zawia',
    'students': 'Students',
    'supervisor': 'Supervised by',
    'projectDescription': 'Integrated remote health monitoring system for real-time patient heart monitoring',
    'features': 'Features',
    'technologies': 'Technologies Used',
    
    // Alerts
    'alertHigh': 'Alert: High heart rate detected',
    'alertLow': 'Alert: Low heart rate detected',
    'emergency': 'Emergency',
    'contactDoctor': 'Contact Doctor',
    
    // Time
    'today': 'Today',
    'yesterday': 'Yesterday',
    'thisWeek': 'This Week',
    'thisMonth': 'This Month',
    
    // Messages
    'noData': 'No data available',
    'loading': 'Loading...',
    'error': 'An error occurred',
    'success': 'Success',
    'welcome_back': 'Welcome back'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>('ar');
  const direction: Direction = language === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang && ['ar', 'en'].includes(savedLang)) {
      setLanguageState(savedLang);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = direction;
    localStorage.setItem('language', language);
  }, [language, direction]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return (translations[language] as any)[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, direction, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
