// Workout List Component with delete functionality
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2, Clock, Flame, Activity } from 'lucide-react';
import { Workout } from '../services/api';

interface WorkoutListProps {
  workouts: Workout[];
  onDelete: (id: string) => Promise<void>;
  loading?: boolean;
}

interface WorkoutItemProps {
  workout: Workout;
  onDelete: (id: string) => Promise<void>;
}

const WorkoutItem: React.FC<WorkoutItemProps> = ({ workout, onDelete }) => {
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete this ${workout.type} workout?`)) {
      setIsDeleting(true);
      try {
        await onDelete(workout.id);
      } catch (error) {
        // Error is handled by the hook
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card className="workout-card hover:scale-[1.02] transition-bounce">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-lg truncate">{workout.type}</h3>
            </div>
            
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{workout.duration} min</span>
              </div>
              <div className="flex items-center gap-1">
                <Flame className="h-4 w-4 text-accent" />
                <span className="font-medium text-accent">{workout.calories} cal</span>
              </div>
            </div>
            
            <p className="text-xs text-muted-foreground mt-2">
              {formatDate(workout.createdAt)}
            </p>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
            className="ml-3 text-destructive hover:text-destructive-foreground hover:bg-destructive transition-smooth"
            aria-label={`Delete ${workout.type} workout`}
          >
            <Trash2 className="h-4 w-4" />
            {isDeleting && <span className="ml-1">...</span>}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const EmptyState: React.FC = () => (
  <Card className="text-center py-12">
    <CardContent>
      <Activity className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-lg font-medium mb-2">No workouts yet</h3>
      <p className="text-muted-foreground">
        Add your first workout to start tracking your fitness journey!
      </p>
    </CardContent>
  </Card>
);

const LoadingSkeleton: React.FC = () => (
  <div className="space-y-4">
    {[1, 2, 3].map((i) => (
      <Card key={i} className="animate-pulse">
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div className="space-y-2 flex-1">
              <div className="h-6 bg-muted rounded w-3/4"></div>
              <div className="flex gap-4">
                <div className="h-4 bg-muted rounded w-20"></div>
                <div className="h-4 bg-muted rounded w-24"></div>
              </div>
              <div className="h-3 bg-muted rounded w-32"></div>
            </div>
            <div className="h-8 w-16 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

export const WorkoutList: React.FC<WorkoutListProps> = ({ 
  workouts, 
  onDelete, 
  loading = false 
}) => {
  if (loading) {
    return <LoadingSkeleton />;
  }

  if (workouts.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground mb-4">
        Your Workouts ({workouts.length})
      </h2>
      <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
        {workouts.map((workout) => (
          <WorkoutItem 
            key={workout.id} 
            workout={workout} 
            onDelete={onDelete} 
          />
        ))}
      </div>
    </div>
  );
};