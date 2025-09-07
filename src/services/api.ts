// API service for workout CRUD operations
// Using fetch API with proper error handling

export interface Workout {
  id: string;
  type: string;
  duration: number; // in minutes
  calories: number;
  createdAt: string;
}

export interface CreateWorkoutData {
  type: string;
  duration: number;
  calories: number;
}

const API_BASE_URL = 'https://jsonplaceholder.typicode.com'; // Mock API
const WORKOUTS_KEY = 'fitness_tracker_workouts'; // LocalStorage key as fallback

// Helper to generate unique IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

// Helper to get workouts from localStorage
const getStoredWorkouts = (): Workout[] => {
  try {
    const stored = localStorage.getItem(WORKOUTS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// Helper to store workouts in localStorage
const setStoredWorkouts = (workouts: Workout[]) => {
  try {
    localStorage.setItem(WORKOUTS_KEY, JSON.stringify(workouts));
  } catch (error) {
    console.error('Failed to store workouts:', error);
  }
};

// Simulated API delay for realistic UX
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const workoutAPI = {
  // Fetch all workouts
  async getWorkouts(): Promise<Workout[]> {
    try {
      await delay(500); // Simulate network delay
      
      // Use localStorage as our "database"
      const workouts = getStoredWorkouts();
      return workouts;
    } catch (error) {
      console.error('Failed to fetch workouts:', error);
      throw new Error('Failed to load workouts. Please try again.');
    }
  },

  // Create a new workout
  async createWorkout(data: CreateWorkoutData): Promise<Workout> {
    try {
      await delay(300);
      
      const newWorkout: Workout = {
        id: generateId(),
        ...data,
        createdAt: new Date().toISOString(),
      };

      const workouts = getStoredWorkouts();
      const updatedWorkouts = [newWorkout, ...workouts];
      setStoredWorkouts(updatedWorkouts);
      
      return newWorkout;
    } catch (error) {
      console.error('Failed to create workout:', error);
      throw new Error('Failed to save workout. Please try again.');
    }
  },

  // Delete a workout
  async deleteWorkout(id: string): Promise<void> {
    try {
      await delay(200);
      
      const workouts = getStoredWorkouts();
      const updatedWorkouts = workouts.filter(workout => workout.id !== id);
      setStoredWorkouts(updatedWorkouts);
    } catch (error) {
      console.error('Failed to delete workout:', error);
      throw new Error('Failed to delete workout. Please try again.');
    }
  },
};