'use client';

import { useEffect, useState, useRef } from 'react';
import styles from './Modal.module.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  zIndex?: number;
}

export default function Modal({ isOpen, onClose, children, zIndex = 100 }: ModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      // Small delay to allow render before adding 'open' class for transition
      requestAnimationFrame(() => {
        setIsVisible(true);
      });
    } else {
      setIsVisible(false);
      // Wait for animation to finish before unmounting
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setShouldRender(false);
      }, 300); // Match CSS transition duration
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  return (
    <div 
      className={`${styles.overlay} ${isVisible ? styles.open : ''}`} 
      onClick={onClose}
      style={{ zIndex }}
    >
      <div 
        className={styles.content} 
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
