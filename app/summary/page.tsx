'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useWorkoutStore, ExerciseDefinition } from '../hooks/useWorkoutStore';
import Modal from '../components/Modal';
import styles from './page.module.css';

export default function SummaryPage() {
  const { workouts, routines, addRoutine, deleteRoutine, exercises: allExercises, isLoaded } = useWorkoutStore();
  const [showRoutineModal, setShowRoutineModal] = useState(false);
  
  // Routine state
  const [showCreateRoutine, setShowCreateRoutine] = useState(false);
  const [newRoutineName, setNewRoutineName] = useState('');
  const [newRoutineExercises, setNewRoutineExercises] = useState<ExerciseDefinition[]>([]);
  const [showAddExerciseToRoutine, setShowAddExerciseToRoutine] = useState(false);
  
  // Kebab Menu State
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  // Sort workouts by date (newest first)
  const sortedWorkouts = [...workouts].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const handleSaveRoutine = () => {
    if (!newRoutineName || newRoutineExercises.length === 0) return;
    
    addRoutine({
      id: Date.now().toString(),
      name: newRoutineName,
      exercises: newRoutineExercises
    });
    
    setNewRoutineName('');
    setNewRoutineExercises([]);
    setShowCreateRoutine(false);
  };

  const handleAddExerciseToRoutine = (ex: ExerciseDefinition) => {
    setNewRoutineExercises([...newRoutineExercises, ex]);
    setShowAddExerciseToRoutine(false);
  };

  const toggleMenu = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleDeleteRoutine = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this routine?')) {
      deleteRoutine(id);
    }
    setOpenMenuId(null);
  };

  if (!isLoaded) {
    return <div className={styles.container}><p className={styles.emptyState}>Loading...</p></div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Summary</h1>
      
      {sortedWorkouts.length === 0 ? (
        <p className={styles.emptyState}>No workouts yet.</p>
      ) : (
        <div className={styles.list}>
          {sortedWorkouts.map((workout) => (
            <div key={workout.id} className={styles.workoutCard}>
              <div className={styles.cardHeader}>
                <span className={styles.workoutName}>{workout.name}</span>
                <span className={styles.workoutDate}>
                  {new Date(workout.date).toLocaleDateString()}
                </span>
              </div>
              <div className={styles.statsRow}>
                <span>{workout.exercises.length} Exercises</span>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <button 
        className={styles.startButton}
        onClick={() => setShowRoutineModal(true)}
      >
        Start Workout
      </button>

      <Modal isOpen={showRoutineModal} onClose={() => setShowRoutineModal(false)}>
        <div className={styles.modalHeader}>
          <h2>Select Routine</h2>
          <button onClick={() => setShowRoutineModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem' }}>
            ✕
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '60vh', overflowY: 'auto' }}>
          <button 
            onClick={() => setShowCreateRoutine(true)}
            className={styles.newButton}
            style={{ width: '100%', padding: '1rem', marginBottom: '1rem' }}
          >
            + Create New Routine
          </button>

          {routines.map(routine => (
            <Link 
              key={routine.id} 
              href={`/workouts?routineId=${routine.id}`}
              className={styles.routineCard}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseName}>{routine.name}</span>
                <div className={styles.menuContainer}>
                  <button 
                    className={styles.menuButton}
                    onClick={(e) => {
                      e.preventDefault();
                      toggleMenu(e, routine.id);
                    }}
                  >
                    ⋮
                  </button>
                  {openMenuId === routine.id && (
                    <div className={styles.dropdownMenu}>
                      <div 
                        className={styles.menuItem}
                        onClick={(e) => {
                          e.preventDefault();
                          handleDeleteRoutine(e, routine.id);
                        }}
                      >
                        🗑️ Delete
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
                {routine.exercises.map(e => e.name).join(', ')}
              </div>
            </Link>
          ))}
        </div>
      </Modal>

      <Modal isOpen={showCreateRoutine} onClose={() => setShowCreateRoutine(false)} zIndex={101}>
        <div className={styles.modalHeader}>
          <h2>Create Routine</h2>
          <button onClick={() => setShowCreateRoutine(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem' }}>
            ✕
          </button>
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.label}>Routine Name</label>
          <input 
            className={styles.input}
            value={newRoutineName}
            onChange={(e) => setNewRoutineName(e.target.value)}
            placeholder="e.g. Push Day"
          />
        </div>

        <div style={{ marginTop: '1rem' }}>
          <label className={styles.label}>Exercises</label>
          {newRoutineExercises.map((ex, idx) => (
            <div key={idx} style={{ padding: '0.5rem', borderBottom: idx === newRoutineExercises.length - 1 ? 'none' : '1px solid var(--border)' }}>
              {ex.name}
            </div>
          ))}
          <button 
            className={styles.addExerciseButton}
            style={{ marginTop: '0.5rem', padding: '0.5rem', fontSize: '0.875rem' }}
            onClick={() => setShowAddExerciseToRoutine(true)}
          >
            + Add Exercise
          </button>
        </div>

        <button 
          className={styles.addExerciseButton}
          style={{ marginTop: '2rem' }}
          onClick={handleSaveRoutine}
        >
          Save Routine
        </button>
      </Modal>

      <Modal isOpen={showAddExerciseToRoutine} onClose={() => setShowAddExerciseToRoutine(false)} zIndex={102}>
        <div className={styles.modalHeader}>
          <h2>Select Exercise</h2>
          <button onClick={() => setShowAddExerciseToRoutine(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem' }}>
            ✕
          </button>
        </div>
        {Object.entries(
          allExercises.reduce((acc, ex) => {
            const category = ex.category || 'Other';
            if (!acc[category]) acc[category] = [];
            acc[category].push(ex);
            return acc;
          }, {} as Record<string, ExerciseDefinition[]>)
        ).map(([category, exercises]) => (
          <div key={category} style={{ marginBottom: '1rem' }}>
            <h3 style={{ 
              fontSize: '0.875rem', 
              color: 'var(--muted-foreground)', 
              marginBottom: '0.5rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              fontWeight: 600
            }}>
              {category}
            </h3>
            {exercises.map((ex) => (
              <div
                key={ex.id}
                className={styles.exerciseOption}
                onClick={() => handleAddExerciseToRoutine(ex)}
              >
                {ex.name}
              </div>
            ))}
          </div>
        ))}
      </Modal>
    </div>
  );
}
