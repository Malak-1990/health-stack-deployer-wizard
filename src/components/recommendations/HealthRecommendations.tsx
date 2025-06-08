
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, Activity, Utensils, Moon, Droplets, Target, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface Recommendation {
  id: string;
  category: 'diet' | 'exercise' | 'sleep' | 'medication' | 'lifestyle';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  action: string;
  completed: boolean;
  dueDate?: string;
}

interface HealthGoal {
  id: string;
  title: string;
  target: number;
  current: number;
  unit: string;
  category: string;
  deadline: string;
}

const HealthRecommendations = () => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [healthGoals, setHealthGoals] = useState<HealthGoal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadRecommendations();
      loadHealthGoals();
    }
  }, [user]);

  const loadRecommendations = async () => {
    // Sample recommendations based on user's health data
    const sampleRecommendations: Recommendation[] = [
      {
        id: '1',
        category: 'exercise',
        priority: 'high',
        title: 'زيادة النشاط البدني',
        description: 'بناءً على معدل ضربات القلب، ننصح بزيادة النشاط البدني',
        action: 'امشِ لمدة 30 دقيقة يومياً',
        completed: false,
        dueDate: '2024-01-20'
      },
      {
        id: '2',
        category: 'diet',
        priority: 'medium',
        title: 'تحسين النظام الغذائي',
        description: 'تناول المزيد من الخضروات والفواكه لتحسين صحة القلب',
        action: 'تناول 5 حصص من الخضروات والفواكه يومياً',
        completed: false
      },
      {
        id: '3',
        category: 'sleep',
        priority: 'medium',
        title: 'تحسين جودة النوم',
        description: 'النوم الجيد مهم لصحة القلب والأوعية الدموية',
        action: 'احرص على النوم 7-8 ساعات يومياً',
        completed: true
      },
      {
        id: '4',
        category: 'medication',
        priority: 'high',
        title: 'مراجعة الأدوية',
        description: 'حان وقت مراجعة الطبيب لتقييم الأدوية الحالية',
        action: 'حدد موعد مع الطبيب خلال أسبوع',
        completed: false,
        dueDate: '2024-01-25'
      },
      {
        id: '5',
        category: 'lifestyle',
        priority: 'low',
        title: 'إدارة التوتر',
        description: 'ممارسة تقنيات الاسترخاء تساعد في تحسين صحة القلب',
        action: 'مارس التأمل أو التنفس العميق لمدة 10 دقائق يومياً',
        completed: false
      }
    ];
    
    setRecommendations(sampleRecommendations);
  };

  const loadHealthGoals = async () => {
    const sampleGoals: HealthGoal[] = [
      {
        id: '1',
        title: 'معدل ضربات القلب المستهدف',
        target: 75,
        current: 78,
        unit: 'bpm',
        category: 'heart',
        deadline: '2024-02-01'
      },
      {
        id: '2',
        title: 'عدد الخطوات اليومية',
        target: 10000,
        current: 7500,
        unit: 'خطوة',
        category: 'activity',
        deadline: '2024-01-31'
      },
      {
        id: '3',
        title: 'ساعات النوم',
        target: 8,
        current: 6.5,
        unit: 'ساعة',
        category: 'sleep',
        deadline: '2024-01-25'
      },
      {
        id: '4',
        title: 'شرب الماء',
        target: 2000,
        current: 1500,
        unit: 'مل',
        category: 'hydration',
        deadline: '2024-01-20'
      }
    ];
    
    setHealthGoals(sampleGoals);
    setLoading(false);
  };

  const markRecommendationComplete = (id: string) => {
    setRecommendations(prev => prev.map(rec => 
      rec.id === id ? { ...rec, completed: !rec.completed } : rec
    ));
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'exercise': return Activity;
      case 'diet': return Utensils;
      case 'sleep': return Moon;
      case 'medication': return Heart;
      default: return Target;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'exercise': return 'bg-blue-100 text-blue-800';
      case 'diet': return 'bg-green-100 text-green-800';
      case 'sleep': return 'bg-purple-100 text-purple-800';
      case 'medication': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return AlertTriangle;
      case 'medium': return Info;
      default: return CheckCircle;
    }
  };

  const getGoalIcon = (category: string) => {
    switch (category) {
      case 'heart': return Heart;
      case 'activity': return Activity;
      case 'sleep': return Moon;
      case 'hydration': return Droplets;
      default: return Target;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const completedRecommendations = recommendations.filter(rec => rec.completed).length;
  const totalRecommendations = recommendations.length;
  const completionRate = (completedRecommendations / totalRecommendations) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">التوصيات الصحية</h2>
          <p className="text-gray-600">توصيات مخصصة لتحسين صحتك</p>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{Math.round(completionRate)}%</div>
          <div className="text-sm text-gray-600">معدل الإنجاز</div>
        </div>
      </div>

      <Tabs defaultValue="recommendations" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="recommendations">التوصيات</TabsTrigger>
          <TabsTrigger value="goals">الأهداف الصحية</TabsTrigger>
        </TabsList>

        <TabsContent value="recommendations" className="space-y-4">
          {/* Progress Overview */}
          <Card>
            <CardHeader>
              <CardTitle>تقدم التوصيات</CardTitle>
              <CardDescription>
                مكتمل {completedRecommendations} من {totalRecommendations} توصية
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={completionRate} className="w-full" />
            </CardContent>
          </Card>

          {/* Recommendations by Priority */}
          {['high', 'medium', 'low'].map(priority => {
            const priorityRecommendations = recommendations.filter(rec => rec.priority === priority);
            if (priorityRecommendations.length === 0) return null;

            return (
              <Card key={priority}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Badge className={getPriorityColor(priority)}>
                      {priority === 'high' ? 'عالية الأولوية' : priority === 'medium' ? 'متوسطة الأولوية' : 'منخفضة الأولوية'}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {priorityRecommendations.map((recommendation) => {
                      const CategoryIcon = getCategoryIcon(recommendation.category);
                      const PriorityIcon = getPriorityIcon(recommendation.priority);
                      
                      return (
                        <div
                          key={recommendation.id}
                          className={`p-4 border rounded-lg ${recommendation.completed ? 'bg-green-50 border-green-200' : 'bg-white'}`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3">
                              <div className={`p-2 rounded-full ${getCategoryColor(recommendation.category)}`}>
                                <CategoryIcon className="h-4 w-4" />
                              </div>
                              <div className="mr-3 flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h4 className={`font-medium ${recommendation.completed ? 'line-through text-gray-500' : ''}`}>
                                    {recommendation.title}
                                  </h4>
                                  <PriorityIcon className="h-4 w-4 text-gray-400" />
                                </div>
                                <p className="text-sm text-gray-600 mb-2">{recommendation.description}</p>
                                <p className="text-sm font-medium text-blue-600">{recommendation.action}</p>
                                {recommendation.dueDate && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    مطلوب بحلول: {new Date(recommendation.dueDate).toLocaleDateString('ar-EG')}
                                  </p>
                                )}
                              </div>
                            </div>
                            <Button
                              variant={recommendation.completed ? "default" : "outline"}
                              size="sm"
                              onClick={() => markRecommendationComplete(recommendation.id)}
                            >
                              {recommendation.completed ? (
                                <>
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  مكتمل
                                </>
                              ) : (
                                'تم'
                              )}
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="goals" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {healthGoals.map((goal) => {
              const GoalIcon = getGoalIcon(goal.category);
              const progress = (goal.current / goal.target) * 100;
              const isAchieved = goal.current >= goal.target;
              
              return (
                <Card key={goal.id} className={`${isAchieved ? 'border-green-500 bg-green-50' : ''}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <GoalIcon className="h-5 w-5 text-blue-600" />
                        <CardTitle className="text-lg mr-2">{goal.title}</CardTitle>
                      </div>
                      {isAchieved && (
                        <Badge className="bg-green-100 text-green-800">
                          مُحقق
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span>الحالي: {goal.current} {goal.unit}</span>
                      <span>الهدف: {goal.target} {goal.unit}</span>
                    </div>
                    
                    <Progress 
                      value={Math.min(progress, 100)} 
                      className={`w-full ${isAchieved ? 'bg-green-100' : ''}`}
                    />
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{Math.round(progress)}% مكتمل</span>
                      <span>الموعد النهائي: {new Date(goal.deadline).toLocaleDateString('ar-EG')}</span>
                    </div>
                    
                    {!isAchieved && (
                      <div className="text-sm text-gray-600">
                        يحتاج: {(goal.target - goal.current).toFixed(1)} {goal.unit} إضافية
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HealthRecommendations;
