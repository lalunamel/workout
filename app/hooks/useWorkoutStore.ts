import { useState, useEffect } from 'react';

export type Set = {
  id: string;
  reps: number;
  weight: number;
  completed: boolean;
};

export type Exercise = {
  id: string;
  name: string;
  sets: Set[];
};

export type Workout = {
  id: string;
  name: string;
  date: string;
  duration: number; // in seconds
  exercises: Exercise[];
};

export type Routine = {
  id: string;
  name: string;
  exercises: ExerciseDefinition[];
};

export type ExerciseDefinition = {
  id: string;
  name: string;
  category: string;
  notes?: string;
};

const DEFAULT_EXERCISES: ExerciseDefinition[] = [
  { id: '1', name: 'Bench Press', category: 'Push' },
  { id: '2', name: 'Squat', category: 'Legs' },
  { id: '3', name: 'Deadlift', category: 'Pull' },
  { id: '4', name: 'Overhead Press', category: 'Push' },
  { id: '5', name: 'Pull Up', category: 'Pull' },
];

export function useWorkoutStore() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [exercises, setExercises] = useState<ExerciseDefinition[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadedWorkouts = localStorage.getItem('workouts');
    const loadedExercises = localStorage.getItem('exercises');
    const loadedRoutines = localStorage.getItem('routines');

    if (loadedWorkouts) {
      setWorkouts(JSON.parse(loadedWorkouts));
    }

    if (loadedRoutines) {
      setRoutines(JSON.parse(loadedRoutines));
    }

    if (loadedExercises) {
      setExercises(JSON.parse(loadedExercises));
    } else {
      setExercises(DEFAULT_EXERCISES);
      localStorage.setItem('exercises', JSON.stringify(DEFAULT_EXERCISES));
    }
    setIsLoaded(true);
  }, []);

  const saveWorkouts = (newWorkouts: Workout[]) => {
    setWorkouts(newWorkouts);
    localStorage.setItem('workouts', JSON.stringify(newWorkouts));
  };

  const saveExercises = (newExercises: ExerciseDefinition[]) => {
    setExercises(newExercises);
    localStorage.setItem('exercises', JSON.stringify(newExercises));
  };

  const saveRoutines = (newRoutines: Routine[]) => {
    setRoutines(newRoutines);
    localStorage.setItem('routines', JSON.stringify(newRoutines));
  };

  const addWorkout = (workout: Workout) => {
    const newWorkouts = [workout, ...workouts];
    saveWorkouts(newWorkouts);
  };

  const addExercise = (exercise: ExerciseDefinition) => {
    const newExercises = [...exercises, exercise];
    saveExercises(newExercises);
  };

  const updateExercise = (updatedExercise: ExerciseDefinition) => {
    const newExercises = exercises.map((ex) =>
      ex.id === updatedExercise.id ? updatedExercise : ex
    );
    saveExercises(newExercises);
  };

  const deleteExercise = (id: string) => {
    const newExercises = exercises.filter((ex) => ex.id !== id);
    saveExercises(newExercises);
  };

  const addRoutine = (routine: Routine) => {
    const newRoutines = [...routines, routine];
    saveRoutines(newRoutines);
  };

  const deleteRoutine = (id: string) => {
    const newRoutines = routines.filter((r) => r.id !== id);
    saveRoutines(newRoutines);
  };

  return {
    workouts,
    exercises,
    routines,
    addWorkout,
    addExercise,
    updateExercise,
    deleteExercise,
    addRoutine,
    deleteRoutine,
    isLoaded,
  };
}
