import { User } from 'lucide-react';
import styles from './page.module.css';

export default function ProfilePage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.avatar}>
          <User size={48} />
        </div>
        <h1 className={styles.name}>Guest User</h1>
      </div>

      <div className={styles.stats}>
        <div className={styles.statCard}>
          <span className={styles.statValue}>0</span>
          <span className={styles.statLabel}>Workouts</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>0h</span>
          <span className={styles.statLabel}>Time Active</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>0</span>
          <span className={styles.statLabel}>Exercises</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>0</span>
          <span className={styles.statLabel}>Streak</span>
        </div>
      </div>
    </div>
  );
}
