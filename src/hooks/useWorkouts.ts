// Custom hook for managing workout state and operations
import { useState, useEffect, useCallback } from 'react';
import { workoutAPI, Workout, CreateWorkoutData } from '../services/api';
import { useToast } from './use-toast';

interface UseWorkoutsReturn {
  workouts: Workout[];
  loading: boolean;
  error: string | null;
  totalCalories: number;
  addWorkout: (data: CreateWorkoutData) => Promise<void>;
  deleteWorkout: (id: string) => Promise<void>;
  refreshWorkouts: () => Promise<void>;
}

export const useWorkouts = (): UseWorkoutsReturn => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Calculate total calories
  const totalCalories = workouts.reduce((sum, workout) => sum + workout.calories, 0);

  // Fetch workouts
  const fetchWorkouts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await workoutAPI.getWorkouts();
      setWorkouts(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load workouts';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Add workout
  const addWorkout = useCallback(async (data: CreateWorkoutData) => {
    try {
      setError(null);
      const newWorkout = await workoutAPI.createWorkout(data);
      setWorkouts(prev => [newWorkout, ...prev]);
      toast({
        title: "Success!",
        description: `${data.type} workout added successfully`,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add workout';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err; // Re-throw to handle in component
    }
  }, [toast]);

  // Delete workout
  const deleteWorkout = useCallback(async (id: string) => {
    try {
      setError(null);
      // Optimistic update
      const workoutToDelete = workouts.find(w => w.id === id);
      setWorkouts(prev => prev.filter(workout => workout.id !== id));
      
      await workoutAPI.deleteWorkout(id);
      toast({
        title: "Deleted",
        description: `${workoutToDelete?.type || 'Workout'} removed successfully`,
      });
    } catch (err) {
      // Revert optimistic update on error
      await fetchWorkouts();
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete workout';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [workouts, toast, fetchWorkouts]);

  // Load workouts on mount
  useEffect(() => {
    fetchWorkouts();
  }, [fetchWorkouts]);

  return {
    workouts,
    loading,
    error,
    totalCalories,
    addWorkout,
    deleteWorkout,
    refreshWorkouts: fetchWorkouts,
  };
};