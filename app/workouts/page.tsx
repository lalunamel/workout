'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useWorkoutStore, Exercise, Set, ExerciseDefinition, Routine } from '../hooks/useWorkoutStore';
import styles from './page.module.css';

export default function WorkoutsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const routineId = searchParams.get('routineId');
  const { routines, addWorkout, isLoaded, workouts } = useWorkoutStore();
  
  const [isActive, setIsActive] = useState(false);
  const [activeExercises, setActiveExercises] = useState<Exercise[]>([]);
  
  // Load draft or initialize from routine
  useEffect(() => {
    if (isActive || !isLoaded) return;

    if (routineId) {
      const draftKey = `workout_draft_${routineId}`;
      const savedDraft = localStorage.getItem(draftKey);

      if (savedDraft) {
        try {
          const parsedDraft = JSON.parse(savedDraft);
          setActiveExercises(parsedDraft);
          setIsActive(true);
          return;
        } catch (e) {
          console.error('Failed to parse workout draft', e);
          localStorage.removeItem(draftKey);
        }
      }

      const routine = routines.find(r => r.id === routineId);
      if (routine) {
        const exercises: Exercise[] = routine.exercises.map(ex => {
          // Find most recent workout with this exercise
          const lastWorkout = workouts.find(w => w.exercises.some(e => e.id === ex.id));
          const lastExercise = lastWorkout?.exercises.find(e => e.id === ex.id);
          
          let sets: Set[] = [{ id: '1', reps: 0, weight: 0, completed: false }];
          
          if (lastExercise && lastExercise.sets.length > 0) {
            sets = lastExercise.sets.map((s, idx) => ({
              id: (idx + 1).toString(),
              reps: 0,
              weight: 0,
              completed: false,
              placeholderReps: s.reps,
              placeholderWeight: s.weight
            }));
          }

          return {
            id: ex.id,
            name: ex.name,
            sets
          };
        });
        setActiveExercises(exercises);
        setIsActive(true);
      } else {
        router.push('/summary');
      }
    } else {
      router.push('/summary');
    }
  }, [routineId, routines, isActive, router, isLoaded, workouts]);

  // Save draft on change
  useEffect(() => {
    if (isActive && routineId && activeExercises.length > 0) {
      localStorage.setItem(`workout_draft_${routineId}`, JSON.stringify(activeExercises));
    }
  }, [activeExercises, isActive, routineId]);

  const addSet = (exerciseIndex: number) => {
    const updatedExercises = [...activeExercises];
    const previousSet = updatedExercises[exerciseIndex].sets[updatedExercises[exerciseIndex].sets.length - 1];
    updatedExercises[exerciseIndex].sets.push({
      id: (updatedExercises[exerciseIndex].sets.length + 1).toString(),
      reps: previousSet ? previousSet.reps : 0,
      weight: previousSet ? previousSet.weight : 0,
      completed: false
    });
    setActiveExercises(updatedExercises);
  };

  const updateSet = (exerciseIndex: number, setIndex: number, field: keyof Set, value: number) => {
    const updatedExercises = [...activeExercises];
    updatedExercises[exerciseIndex].sets[setIndex] = {
      ...updatedExercises[exerciseIndex].sets[setIndex],
      [field]: value
    };
    setActiveExercises(updatedExercises);
  };

  const handleExit = () => {
    // Draft is already saved by the effect
    router.push('/summary');
  };

  const handleFinishWorkout = () => {
    const finishedExercises = activeExercises.map(ex => ({
      ...ex,
      sets: ex.sets.filter(s => s.reps > 0)
    })).filter(ex => ex.sets.length > 0);

    if (finishedExercises.length === 0) {
        setIsActive(false);
        router.push('/summary');
        return;
    }

    addWorkout({
      id: Date.now().toString(),
      name: `Workout on ${new Date().toLocaleDateString()}`,
      date: new Date().toISOString(),
      exercises: finishedExercises,
    });
    
    // Clear draft
    if (routineId) {
      localStorage.removeItem(`workout_draft_${routineId}`);
    }

    setIsActive(false);
    router.push('/summary');
  };

  if (!isActive && !isLoaded) {
    return <div className={styles.container}>Loading workout...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={handleExit} className={styles.newButton} style={{ fontSize: '1.5rem', padding: '0.5rem' }}>
          ✕
        </button>
      </div>

      {activeExercises.map((exercise, exIndex) => (
        <div key={`${exercise.id}-${exIndex}`} className={styles.exerciseCard}>
          <div className={styles.exerciseHeader}>
            <span className={styles.exerciseName}>{exercise.name}</span>
          </div>
          
          <div className={styles.setRow}>
            <span className={styles.setHeader}>Set</span>
            <span className={styles.setHeader}>lbs</span>
            <span className={styles.setHeader}>Reps</span>
            <span></span>
          </div>

          {exercise.sets.map((set, setIndex) => (
            <div key={setIndex} className={styles.setRow}>
              <span className={styles.setNumber}>{setIndex + 1}</span>
              <input
                type="number"
                className={styles.input}
                value={set.weight || ''}
                placeholder={set.placeholderWeight?.toString()}
                onChange={(e) => updateSet(exIndex, setIndex, 'weight', Number(e.target.value))}
              />
              <input
                type="number"
                className={styles.input}
                value={set.reps || ''}
                placeholder={set.placeholderReps?.toString()}
                onChange={(e) => updateSet(exIndex, setIndex, 'reps', Number(e.target.value))}
              />
            </div>
          ))}
          
          <button 
            className={styles.addExerciseButton} 
            style={{ marginTop: '0.5rem', padding: '0.5rem', backgroundColor: 'var(--secondary)', color: 'var(--foreground)', border: '1px solid var(--border)' }}
            onClick={() => addSet(exIndex)}
          >
            Add Set
          </button>
        </div>
      ))}

      <button 
        className={styles.finishButton} 
        onClick={handleFinishWorkout}
        style={{ marginTop: '2rem', width: '100%' }}
      >
        Finish Workout
      </button>
    </div>
  );
}
