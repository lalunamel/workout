'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Check, X, MoreVertical, Trash2 } from 'lucide-react';
import { useWorkoutStore, Exercise, Set, ExerciseDefinition, Routine } from '../hooks/useWorkoutStore';
import styles from './page.module.css';

export default function WorkoutsPage() {
  const router = useRouter();
  const { exercises: allExercises, routines, addWorkout, addRoutine, deleteRoutine } = useWorkoutStore();
  
  const [isActive, setIsActive] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [activeExercises, setActiveExercises] = useState<Exercise[]>([]);
  const [showAddExercise, setShowAddExercise] = useState(false);
  
  // Routine state
  const [showCreateRoutine, setShowCreateRoutine] = useState(false);
  const [newRoutineName, setNewRoutineName] = useState('');
  const [newRoutineExercises, setNewRoutineExercises] = useState<ExerciseDefinition[]>([]);
  const [showAddExerciseToRoutine, setShowAddExerciseToRoutine] = useState(false);
  
  // Routine Details Modal
  const [selectedRoutine, setSelectedRoutine] = useState<Routine | null>(null);
  
  // Kebab Menu State
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive) {
      interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartWorkout = () => {
    setIsActive(true);
    setElapsedTime(0);
    setActiveExercises([]);
  };

  const handleStartRoutine = (routine: Routine) => {
    setIsActive(true);
    setElapsedTime(0);
    
    const exercises: Exercise[] = routine.exercises.map(ex => ({
      id: ex.id,
      name: ex.name,
      sets: [{ id: '1', reps: 0, weight: 0, completed: false }]
    }));
    
    setActiveExercises(exercises);
    setSelectedRoutine(null);
  };

  const handleFinishWorkout = () => {
    if (activeExercises.length === 0) {
        setIsActive(false);
        return;
    }

    addWorkout({
      id: Date.now().toString(),
      name: `Workout on ${new Date().toLocaleDateString()}`,
      date: new Date().toISOString(),
      duration: elapsedTime,
      exercises: activeExercises,
    });
    
    setIsActive(false);
    router.push('/history');
  };

  const handleAddExercise = (exerciseDef: ExerciseDefinition) => {
    const newExercise: Exercise = {
      id: exerciseDef.id,
      name: exerciseDef.name,
      sets: [
        { id: '1', reps: 0, weight: 0, completed: false },
      ],
    };
    setActiveExercises([...activeExercises, newExercise]);
    setShowAddExercise(false);
  };

  const addSet = (exerciseIndex: number) => {
    const updatedExercises = [...activeExercises];
    const currentSets = updatedExercises[exerciseIndex].sets;
    const newSet: Set = {
      id: (currentSets.length + 1).toString(),
      reps: 0,
      weight: 0,
      completed: false,
    };
    updatedExercises[exerciseIndex].sets.push(newSet);
    setActiveExercises(updatedExercises);
  };

  const updateSet = (exerciseIndex: number, setIndex: number, field: keyof Set, value: any) => {
    const updatedExercises = [...activeExercises];
    updatedExercises[exerciseIndex].sets[setIndex] = {
      ...updatedExercises[exerciseIndex].sets[setIndex],
      [field]: value,
    };
    setActiveExercises(updatedExercises);
  };

  const toggleSetComplete = (exerciseIndex: number, setIndex: number) => {
    const updatedExercises = [...activeExercises];
    const set = updatedExercises[exerciseIndex].sets[setIndex];
    set.completed = !set.completed;
    updatedExercises[exerciseIndex].sets[setIndex] = set;
    setActiveExercises(updatedExercises);
  };

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

  if (!isActive) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Workouts</h1>
        
        <button className={styles.addExerciseButton} onClick={handleStartWorkout}>
          Start Empty Workout
        </button>

        <div style={{ marginTop: '2rem' }}>
          <div className={styles.header}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>My Routines</h2>
            <button 
              onClick={() => setShowCreateRoutine(true)}
              style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }}
            >
              + New
            </button>
          </div>

          {routines.length === 0 ? (
            <p className={styles.emptyState}>No routines yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {routines.map(routine => (
                <div 
                  key={routine.id} 
                  className={styles.routineCard}
                  onClick={() => setSelectedRoutine(routine)}
                >
                  <div className={styles.exerciseHeader}>
                    <span className={styles.exerciseName}>{routine.name}</span>
                    <div className={styles.menuContainer}>
                      <button 
                        className={styles.menuButton}
                        onClick={(e) => toggleMenu(e, routine.id)}
                      >
                        <MoreVertical size={20} />
                      </button>
                      {openMenuId === routine.id && (
                        <div className={styles.dropdownMenu}>
                          <div 
                            className={styles.menuItem}
                            onClick={(e) => handleDeleteRoutine(e, routine.id)}
                          >
                            <Trash2 size={16} />
                            Delete
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
                    {routine.exercises.map(e => e.name).join(', ')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Routine Details Modal */}
        {selectedRoutine && (
          <div className={styles.modalOverlay} onClick={() => setSelectedRoutine(null)}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h2>{selectedRoutine.name}</h2>
                <button onClick={() => setSelectedRoutine(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  <X size={24} />
                </button>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                {selectedRoutine.exercises.map((ex, idx) => (
                  <div key={idx} style={{ padding: '0.75rem', backgroundColor: 'var(--secondary)', borderRadius: 'var(--radius)' }}>
                    {ex.name}
                  </div>
                ))}
              </div>

              <button 
                className={styles.addExerciseButton}
                onClick={() => handleStartRoutine(selectedRoutine)}
              >
                Start Routine
              </button>
            </div>
          </div>
        )}

        {showCreateRoutine && (
          <div className={styles.modalOverlay} onClick={() => setShowCreateRoutine(false)}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h2>Create Routine</h2>
                <button onClick={() => setShowCreateRoutine(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  <X size={24} />
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
                  <div key={idx} style={{ padding: '0.5rem', borderBottom: '1px solid var(--border)' }}>
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
            </div>
          </div>
        )}

        {showAddExerciseToRoutine && (
          <div className={styles.modalOverlay} style={{ zIndex: 101 }} onClick={() => setShowAddExerciseToRoutine(false)}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h2>Select Exercise</h2>
                <button onClick={() => setShowAddExerciseToRoutine(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  <X size={24} />
                </button>
              </div>
              {allExercises.map((ex) => (
                <div
                  key={ex.id}
                  className={styles.exerciseOption}
                  onClick={() => handleAddExerciseToRoutine(ex)}
                >
                  {ex.name}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.timer}>{formatTime(elapsedTime)}</div>
        <button className={styles.finishButton} onClick={handleFinishWorkout}>
          Finish
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
            <span className={styles.setHeader}></span>
          </div>

          {exercise.sets.map((set, setIndex) => (
            <div key={set.id} className={styles.setRow}>
              <span className={styles.setNumber}>{setIndex + 1}</span>
              <input
                type="number"
                className={styles.input}
                placeholder="0"
                value={set.weight || ''}
                onChange={(e) => updateSet(exIndex, setIndex, 'weight', Number(e.target.value))}
              />
              <input
                type="number"
                className={styles.input}
                placeholder="0"
                value={set.reps || ''}
                onChange={(e) => updateSet(exIndex, setIndex, 'reps', Number(e.target.value))}
              />
              <button
                className={`${styles.checkButton} ${set.completed ? styles.completed : ''}`}
                onClick={() => toggleSetComplete(exIndex, setIndex)}
              >
                <Check size={16} />
              </button>
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

      <button className={styles.addExerciseButton} onClick={() => setShowAddExercise(true)}>
        <Plus size={20} style={{ marginRight: '8px' }} />
        Add Exercise
      </button>

      {showAddExercise && (
        <div className={styles.modalOverlay} onClick={() => setShowAddExercise(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Select Exercise</h2>
              <button onClick={() => setShowAddExercise(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>
            {allExercises.map((ex) => (
              <div
                key={ex.id}
                className={styles.exerciseOption}
                onClick={() => handleAddExercise(ex)}
              >
                {ex.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
