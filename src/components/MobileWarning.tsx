'use client';

import { useState, useEffect } from 'react';
import styles from './MobileWarning.module.css';

export function MobileWarning() {
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      const isMobile = width < 1024;
      const hasSeenWarning = sessionStorage.getItem('mobileWarningDismissed');
      
      if (isMobile && !hasSeenWarning) {
        setShowWarning(true);
      }
    };

    checkDevice();
  }, []);

  const handleDismiss = () => {
    sessionStorage.setItem('mobileWarningDismissed', 'true');
    setShowWarning(false);
  };

  if (!showWarning) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.icon}>⚠️</div>
        <h2 className={styles.title}>Mobile Experience Notice</h2>
        <p className={styles.message}>
          Marcus Omega works best on laptop and desktop screens. Some features may not work properly or the app may lag on mobile devices.
        </p>
        <p className={styles.recommendation}>
          For the optimal philosophical experience, please use a larger screen.
        </p>
        <button className={styles.button} onClick={handleDismiss}>
          I Understand
        </button>
      </div>
    </div>
  );
}
