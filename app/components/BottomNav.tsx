'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './BottomNav.module.css';

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Summary', href: '/summary', emoji: '📋' },
    { name: 'Workouts', href: '/workouts', emoji: '💪' },
  ];

  return (
    <nav className={styles.nav}>
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`${styles.link} ${isActive ? styles.active : ''}`}
          >
            <div className={styles.iconContainer}>
              <span style={{ fontSize: '24px', lineHeight: 1 }}>{item.emoji}</span>
            </div>
            <span>{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
