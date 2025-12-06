import { useState, useEffect } from 'react';

export type Set = {
  id: string;
  reps: number;
  weight: number;
  completed: boolean;
  placeholderReps?: number;
  placeholderWeight?: number;
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
  // Neck
  { id: 'neck-1', name: 'Neck Rotation', category: 'Neck' },
  { id: 'neck-2', name: 'Lateral Neck Flexion', category: 'Neck' },
  { id: 'neck-3', name: 'Neck Flexion', category: 'Neck' },
  { id: 'neck-4', name: 'Neck Extension', category: 'Neck' },
  { id: 'neck-5', name: 'Neck Isometric Holds', category: 'Neck' },

  // Shoulders
  { id: 'shoulders-1', name: 'Overhead Press', category: 'Shoulders' },
  { id: 'shoulders-2', name: 'Front Raise', category: 'Shoulders' },
  { id: 'shoulders-3', name: 'Arnold Press', category: 'Shoulders' },
  { id: 'shoulders-4', name: 'Push Press', category: 'Shoulders' },
  { id: 'shoulders-5', name: 'Dumbbell Lateral Raise', category: 'Shoulders' },
  { id: 'shoulders-6', name: 'Machine Lateral Raise', category: 'Shoulders' },
  { id: 'shoulders-7', name: 'Upright Row', category: 'Shoulders' },
  { id: 'shoulders-8', name: 'Bent-Over Dumbbell Reverse Fly', category: 'Shoulders' },
  { id: 'shoulders-9', name: 'Reverse Machine Fly', category: 'Shoulders' },
  { id: 'shoulders-10', name: 'Face Pull', category: 'Shoulders' },
  { id: 'shoulders-11', name: 'Band Pull-Apart', category: 'Shoulders' },
  { id: 'shoulders-12', name: 'Dumbbell Internal Rotation', category: 'Shoulders' },
  { id: 'shoulders-13', name: 'Dumbbell External Rotation', category: 'Shoulders' },

  // Arms
  { id: 'arms-1', name: 'Barbell Curl', category: 'Arms' },
  { id: 'arms-2', name: 'Dumbbell Curl', category: 'Arms' },
  { id: 'arms-3', name: 'Seated Incline Dumbbell Curl', category: 'Arms' },
  { id: 'arms-4', name: 'Hammer Curl', category: 'Arms' },
  { id: 'arms-5', name: 'Preacher Curl', category: 'Arms' },
  { id: 'arms-6', name: 'Concentration Curl', category: 'Arms' },
  { id: 'arms-7', name: 'Weighted Chin-Up', category: 'Arms' },
  { id: 'arms-8', name: 'Overhead Triceps Extension', category: 'Arms' },
  { id: 'arms-9', name: 'Triceps Pushdown', category: 'Arms' },
  { id: 'arms-10', name: 'Close-Grip Bench Press', category: 'Arms' },
  { id: 'arms-11', name: 'Lying Triceps Extension', category: 'Arms' },
  { id: 'arms-12', name: 'Bench Dip', category: 'Arms' },
  { id: 'arms-13', name: 'Prone Wrist Curl', category: 'Arms' },
  { id: 'arms-14', name: 'Reverse Wrist Extension', category: 'Arms' },
  { id: 'arms-15', name: 'Farmer\'s Walk', category: 'Arms' },

  // Back
  { id: 'back-1', name: 'Pull-Up', category: 'Back' },
  { id: 'back-2', name: 'Lat Pulldown', category: 'Back' },
  { id: 'back-3', name: 'Assisted Pull-Up', category: 'Back' },
  { id: 'back-4', name: 'Straight Arm Lat Pulldown', category: 'Back' },
  { id: 'back-5', name: 'Bent-Over Barbell Row', category: 'Back' },
  { id: 'back-6', name: 'Pendlay Row', category: 'Back' },
  { id: 'back-7', name: 'Seated Cable Row', category: 'Back' },
  { id: 'back-8', name: 'Dumbbell Row', category: 'Back' },
  { id: 'back-9', name: 'T-Bar Row', category: 'Back' },
  { id: 'back-10', name: 'Renegade Row', category: 'Back' },
  { id: 'back-11', name: 'Deadlift', category: 'Back' },
  { id: 'back-12', name: 'Romanian Deadlift', category: 'Back' },
  { id: 'back-13', name: 'Hyperextension', category: 'Back' },
  { id: 'back-14', name: 'Good Morning', category: 'Back' },
  { id: 'back-15', name: 'Barbell Shrug', category: 'Back' },
  { id: 'back-16', name: 'Dumbbell Shrug', category: 'Back' },

  // Chest
  { id: 'chest-1', name: 'Barbell Bench Press', category: 'Chest' },
  { id: 'chest-2', name: 'Dumbbell Bench Press', category: 'Chest' },
  { id: 'chest-3', name: 'Dumbbell Flyes', category: 'Chest' },
  { id: 'chest-4', name: 'Push-Up', category: 'Chest' },
  { id: 'chest-5', name: 'Chest Dip', category: 'Chest' },
  { id: 'chest-6', name: 'Cable Crossover', category: 'Chest' },
  { id: 'chest-7', name: 'Pec Deck Fly', category: 'Chest' },

  // Waist (Abdomen)
  { id: 'abs-1', name: 'Crunch', category: 'Waist' },
  { id: 'abs-2', name: 'Cable Crunch', category: 'Waist' },
  { id: 'abs-3', name: 'Hanging Leg Raise', category: 'Waist' },
  { id: 'abs-4', name: 'V-Up', category: 'Waist' },
  { id: 'abs-5', name: 'Abdominal Machine Crunch', category: 'Waist' },
  { id: 'abs-6', name: 'Bicycle Crunch', category: 'Waist' },
  { id: 'abs-7', name: 'Cable Wood Chop', category: 'Waist' },
  { id: 'abs-8', name: 'Dumbbell Side Bend', category: 'Waist' },
  { id: 'abs-9', name: 'Side Plank', category: 'Waist' },
  { id: 'abs-10', name: 'Plank', category: 'Waist' },
  { id: 'abs-11', name: 'Dead Bug', category: 'Waist' },
  { id: 'abs-12', name: 'Bear Crawl', category: 'Waist' },
  { id: 'abs-13', name: 'Hanging Windshield Wiper', category: 'Waist' },

  // Hip / Thigh
  { id: 'legs-1', name: 'Barbell Squat', category: 'Hip/Thigh' },
  { id: 'legs-2', name: 'Hack Squat', category: 'Hip/Thigh' },
  { id: 'legs-3', name: 'Leg Extension', category: 'Hip/Thigh' },
  { id: 'legs-4', name: 'Leg Press', category: 'Hip/Thigh' },
  { id: 'legs-5', name: 'Bulgarian Split Squat', category: 'Hip/Thigh' },
  { id: 'legs-6', name: 'Walking Lunge', category: 'Hip/Thigh' },
  { id: 'legs-7', name: 'Seated Leg Curl', category: 'Hip/Thigh' },
  { id: 'legs-8', name: 'Lying Leg Curl', category: 'Hip/Thigh' },
  { id: 'legs-9', name: 'Glute-Ham Raise', category: 'Hip/Thigh' },
  { id: 'legs-10', name: 'Stiff-Legged Deadlift', category: 'Hip/Thigh' },
  { id: 'legs-11', name: 'Barbell Hip Thrust', category: 'Hip/Thigh' },
  { id: 'legs-12', name: 'Glute Bridge', category: 'Hip/Thigh' },
  { id: 'legs-13', name: 'Cable Glute Kickbacks', category: 'Hip/Thigh' },
  { id: 'legs-14', name: 'Kettlebell Swing', category: 'Hip/Thigh' },
  { id: 'legs-15', name: 'Step-Up', category: 'Hip/Thigh' },
  { id: 'legs-16', name: 'Machine Hip Abduction', category: 'Hip/Thigh' },
  { id: 'legs-17', name: 'Machine Hip Adduction', category: 'Hip/Thigh' },
  { id: 'legs-18', name: 'Cable Lateral Leg Raise', category: 'Hip/Thigh' },

  // Calf
  { id: 'calves-1', name: 'Standing Calf Raise', category: 'Calf' },
  { id: 'calves-2', name: 'Seated Calf Raise', category: 'Calf' },
  { id: 'calves-3', name: 'Single-Leg Calf Raise', category: 'Calf' },
  { id: 'calves-4', name: 'Donkey Calf Raise', category: 'Calf' },
  { id: 'calves-5', name: 'Leg Press Calf Raise', category: 'Calf' },
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
