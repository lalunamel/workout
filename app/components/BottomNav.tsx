'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, History, PlayCircle, Dumbbell } from 'lucide-react';
import styles from './BottomNav.module.css';

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'History', href: '/history', icon: History },
    { name: 'Workouts', href: '/workouts', icon: PlayCircle },
    { name: 'Exercises', href: '/exercises', icon: Dumbbell },
  ];

  return (
    <nav className={styles.nav}>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`${styles.link} ${isActive ? styles.active : ''}`}
          >
            <Icon size={24} />
            <span>{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
