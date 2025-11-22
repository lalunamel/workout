'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useWorkoutStore } from '../../hooks/useWorkoutStore';
import styles from '../page.module.css';

export default function ExerciseEditPage() {
  const router = useRouter();
  const params = useParams();
  const { exercises, addExercise, updateExercise, deleteExercise } = useWorkoutStore();
  
  const isNew = params.id === 'new';
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (!isNew && exercises.length > 0) {
      const exercise = exercises.find((ex) => ex.id === params.id);
      if (exercise) {
        setName(exercise.name);
        setCategory(exercise.category);
        setNotes(exercise.notes || '');
      }
    }
  }, [isNew, params.id, exercises]);

  const handleSave = () => {
    if (!name) return;

    const exerciseData = {
      id: isNew ? Date.now().toString() : (params.id as string),
      name,
      category,
      notes,
    };

    if (isNew) {
      addExercise(exerciseData);
    } else {
      updateExercise(exerciseData);
    }

    router.back();
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this exercise?')) {
      deleteExercise(params.id as string);
      router.back();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{isNew ? 'New Exercise' : 'Edit Exercise'}</h1>
      </div>

      <div className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Name</label>
          <input
            className={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Bench Press"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Category</label>
          <input
            className={styles.input}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g. Push"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Notes</label>
          <textarea
            className={styles.textarea}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Optional notes..."
          />
        </div>

        <div className={styles.buttonGroup}>
          <button className={styles.saveButton} onClick={handleSave}>
            Save
          </button>
          {!isNew && (
            <button className={styles.deleteButton} onClick={handleDelete}>
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
