'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search } from 'lucide-react';
import { useWorkoutStore } from '../hooks/useWorkoutStore';
import styles from './page.module.css';

export default function ExercisesPage() {
  const router = useRouter();
  const { exercises } = useWorkoutStore();
  const [search, setSearch] = useState('');

  const filteredExercises = exercises.filter((ex) =>
    ex.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Exercises</h1>
      </div>

      <div style={{ position: 'relative' }}>
        <input
          type="text"
          className={styles.searchBar}
          placeholder="Search exercises..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Search 
            size={20} 
            style={{ position: 'absolute', right: '12px', top: '12px', color: 'var(--muted-foreground)' }} 
        />
      </div>

      <div className={styles.exerciseList}>
        {filteredExercises.map((ex) => (
          <div
            key={ex.id}
            className={styles.exerciseItem}
            onClick={() => router.push(`/exercises/${ex.id}`)}
          >
            <span className={styles.exerciseName}>{ex.name}</span>
            <span className={styles.exerciseCategory}>{ex.category}</span>
          </div>
        ))}
      </div>

      <button className={styles.fab} onClick={() => router.push('/exercises/new')}>
        <Plus size={24} />
      </button>
    </div>
  );
}
