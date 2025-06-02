
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const HealthTipsCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>نصائح صحية ذكية</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border rounded-lg bg-green-50">
            <h4 className="font-semibold text-green-700 mb-2">🎯 معدل طبيعي</h4>
            <p className="text-sm text-gray-600">
              معدل ضربات القلب الطبيعي في الراحة: 60-100 نبضة/دقيقة
            </p>
          </div>
          <div className="p-4 border rounded-lg bg-blue-50">
            <h4 className="font-semibold text-blue-700 mb-2">💡 نصائح مهمة</h4>
            <p className="text-sm text-gray-600">
              تناول الأدوية في مواعيدها وتجنب الإجهاد الزائد
            </p>
          </div>
          <div className="p-4 border rounded-lg bg-yellow-50">
            <h4 className="font-semibold text-yellow-700 mb-2">🔒 أمان البيانات</h4>
            <p className="text-sm text-gray-600">
              جميع بياناتك الصحية محمية بتشفير متقدم
            </p>
          </div>
          <div className="p-4 border rounded-lg bg-purple-50">
            <h4 className="font-semibold text-purple-700 mb-2">🚨 تنبيهات ذكية</h4>
            <p className="text-sm text-gray-600">
              النظام يراقب حالتك ويرسل تنبيهات فورية عند الحاجة
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HealthTipsCard;
