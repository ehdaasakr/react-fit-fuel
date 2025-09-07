// Fitness Tracker - Main Dashboard
import React from 'react';
import { Dumbbell, Activity } from 'lucide-react';
import { AddWorkoutForm } from '../components/AddWorkoutForm';
import { WorkoutList } from '../components/WorkoutList';
import { TotalCalories } from '../components/TotalCalories';
import { useWorkouts } from '../hooks/useWorkouts';

const Index = () => {
  const { 
    workouts, 
    loading, 
    totalCalories, 
    addWorkout, 
    deleteWorkout 
  } = useWorkouts();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fitness-gradient text-white shadow-fitness">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Dumbbell className="h-10 w-10" />
            <h1 className="text-4xl font-bold">Fitness Tracker</h1>
          </div>
          <p className="text-center text-white/80 text-lg max-w-2xl mx-auto">
            Track your workouts, monitor calories burned, and stay motivated on your fitness journey
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <section className="mb-8" aria-labelledby="stats-heading">
          <h2 id="stats-heading" className="sr-only">Workout Statistics</h2>
          <TotalCalories 
            totalCalories={totalCalories} 
            workoutCount={workouts.length} 
          />
        </section>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Add Workout Form */}
          <section aria-labelledby="add-workout-heading">
            <h2 id="add-workout-heading" className="sr-only">Add New Workout</h2>
            <AddWorkoutForm 
              onSubmit={addWorkout} 
              loading={loading} 
            />
          </section>

          {/* Workout List */}
          <section aria-labelledby="workout-list-heading">
            <h2 id="workout-list-heading" className="sr-only">Your Workouts</h2>
            <WorkoutList 
              workouts={workouts} 
              onDelete={deleteWorkout} 
              loading={loading} 
            />
          </section>
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-border">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Activity className="h-5 w-5" />
            <p className="text-sm">
              Keep pushing your limits! Every workout counts. 💪
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;
