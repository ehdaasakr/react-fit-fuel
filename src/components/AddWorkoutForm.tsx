// Add Workout Form Component with validation
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreateWorkoutData } from '../services/api';

interface AddWorkoutFormProps {
  onSubmit: (data: CreateWorkoutData) => Promise<void>;
  loading?: boolean;
}

interface FormData {
  type: string;
  duration: string;
  calories: string;
}

interface FormErrors {
  type?: string;
  duration?: string;
  calories?: string;
}

export const AddWorkoutForm: React.FC<AddWorkoutFormProps> = ({ onSubmit, loading = false }) => {
  const [formData, setFormData] = useState<FormData>({
    type: '',
    duration: '',
    calories: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.type.trim()) {
      newErrors.type = 'Workout type is required';
    }

    const duration = parseInt(formData.duration);
    if (!formData.duration || isNaN(duration) || duration <= 0) {
      newErrors.duration = 'Duration must be a positive number';
    } else if (duration > 1440) { // 24 hours in minutes
      newErrors.duration = 'Duration cannot exceed 24 hours';
    }

    const calories = parseInt(formData.calories);
    if (!formData.calories || isNaN(calories) || calories <= 0) {
      newErrors.calories = 'Calories must be a positive number';
    } else if (calories > 10000) {
      newErrors.calories = 'Calories seem too high, please check';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        type: formData.type.trim(),
        duration: parseInt(formData.duration),
        calories: parseInt(formData.calories),
      });
      
      // Reset form on success
      setFormData({ type: '', duration: '', calories: '' });
      setErrors({});
    } catch (error) {
      // Error is handled by the hook
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="text-xl font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Add New Workout
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type" className="text-sm font-medium">
              Workout Type *
            </Label>
            <Input
              id="type"
              type="text"
              placeholder="e.g., Running, Push-ups, Cycling"
              value={formData.type}
              onChange={handleInputChange('type')}
              className={errors.type ? 'border-destructive' : ''}
              disabled={isSubmitting || loading}
              aria-describedby={errors.type ? 'type-error' : undefined}
            />
            {errors.type && (
              <p id="type-error" className="text-sm text-destructive" role="alert">
                {errors.type}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration" className="text-sm font-medium">
                Duration (minutes) *
              </Label>
              <Input
                id="duration"
                type="number"
                placeholder="30"
                min="1"
                max="1440"
                value={formData.duration}
                onChange={handleInputChange('duration')}
                className={errors.duration ? 'border-destructive' : ''}
                disabled={isSubmitting || loading}
                aria-describedby={errors.duration ? 'duration-error' : undefined}
              />
              {errors.duration && (
                <p id="duration-error" className="text-sm text-destructive" role="alert">
                  {errors.duration}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="calories" className="text-sm font-medium">
                Calories Burned *
              </Label>
              <Input
                id="calories"
                type="number"
                placeholder="250"
                min="1"
                max="10000"
                value={formData.calories}
                onChange={handleInputChange('calories')}
                className={errors.calories ? 'border-destructive' : ''}
                disabled={isSubmitting || loading}
                aria-describedby={errors.calories ? 'calories-error' : undefined}
              />
              {errors.calories && (
                <p id="calories-error" className="text-sm text-destructive" role="alert">
                  {errors.calories}
                </p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full fitness-gradient hover:shadow-fitness transition-smooth"
            disabled={isSubmitting || loading}
          >
            {isSubmitting ? 'Adding Workout...' : 'Add Workout'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};