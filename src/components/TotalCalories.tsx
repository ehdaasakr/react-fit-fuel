// Total Calories Display Component
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Flame, TrendingUp, Target } from 'lucide-react';

interface TotalCaloriesProps {
  totalCalories: number;
  workoutCount: number;
}

export const TotalCalories: React.FC<TotalCaloriesProps> = ({ 
  totalCalories, 
  workoutCount 
}) => {
  const averageCalories = workoutCount > 0 ? Math.round(totalCalories / workoutCount) : 0;
  
  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Total Calories */}
      <Card className="fitness-gradient text-white shadow-fitness">
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center mb-2">
            <Flame className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold mb-1">
            {formatNumber(totalCalories)}
          </h3>
          <p className="text-white/80 text-sm">Total Calories Burned</p>
        </CardContent>
      </Card>

      {/* Workout Count */}
      <Card className="shadow-card hover:shadow-fitness transition-smooth">
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center mb-2">
            <TrendingUp className="h-8 w-8 text-secondary" />
          </div>
          <h3 className="text-2xl font-bold mb-1 text-secondary">
            {workoutCount}
          </h3>
          <p className="text-muted-foreground text-sm">
            Total Workouts
          </p>
        </CardContent>
      </Card>

      {/* Average Calories */}
      <Card className="shadow-card hover:shadow-fitness transition-smooth">
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center mb-2">
            <Target className="h-8 w-8 text-accent" />
          </div>
          <h3 className="text-2xl font-bold mb-1 text-accent">
            {formatNumber(averageCalories)}
          </h3>
          <p className="text-muted-foreground text-sm">
            Avg per Workout
          </p>
        </CardContent>
      </Card>
    </div>
  );
};