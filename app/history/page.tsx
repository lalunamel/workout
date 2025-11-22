'use client';

import { useWorkoutStore } from '../hooks/useWorkoutStore';
import styles from './page.module.css';

export default function HistoryPage() {
  const { workouts, isLoaded } = useWorkoutStore();

  if (!isLoaded) {
    return <div className={styles.container}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>History</h1>
      
      {workouts.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No workouts yet.</p>
          <p>Start a workout to see it here!</p>
        </div>
      ) : (
        workouts.map((workout) => (
          <div key={workout.id} className={styles.workoutCard}>
            <div className={styles.workoutHeader}>
              <span className={styles.workoutName}>{workout.name}</span>
              <span className={styles.workoutDate}>
                {new Date(workout.date).toLocaleDateString()}
              </span>
            </div>
            <div className={styles.workoutStats}>
              <span>{Math.floor(workout.duration / 60)} min</span>
              <span>{workout.exercises.length} Exercises</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
