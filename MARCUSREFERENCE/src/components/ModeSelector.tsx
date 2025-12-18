'use client';

import { useState, useRef, useEffect } from 'react';
import { PhilosopherMode } from '@/types';
import { modeLabels, modeDescriptions } from '@/constants/modeInstructions';
import styles from './ModeSelector.module.css';

interface ModeSelectorProps {
  currentMode: PhilosopherMode;
  onModeChange: (mode: PhilosopherMode) => void;
}

const modes: PhilosopherMode[] = [
  'default',
  'stoic',
  'existentialist',
  'socratic',
  'zen',
  'nietzschean',
  'absurdist',
  'epicurean',
  'debate',
  'mentor',
  'scholar',
  'poet',
  'pragmatist',
  'mystic',
  'quick',
  'deep',
  'reflective',
  'teaching',
  'contemplative',
  'crisis',
  'curious',
  'playful',
  'serious',
];

export function ModeSelector({ currentMode, onModeChange }: ModeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (mode: PhilosopherMode) => {
    onModeChange(mode);
    setIsOpen(false);
  };

  return (
    <div className={styles.container} ref={containerRef}>
      <div className={styles.select}>
        <div className={styles.selected} onClick={() => setIsOpen(!isOpen)}>
          {modeLabels[currentMode]}
          <svg
            className={`${styles.arrow} ${isOpen ? styles.arrowOpen : ''}`}
            viewBox="0 0 512 512"
          >
            <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
          </svg>
        </div>
        {isOpen && (
          <div className={styles.options}>
            {modes.map((mode) => (
              <button
                key={mode}
                className={`${styles.option} ${
                  currentMode === mode ? styles.optionSelected : ''
                }`}
                onClick={() => handleSelect(mode)}
              >
                <span className={styles.optionLabel}>{modeLabels[mode]}</span>
                <span className={styles.optionDesc}>{modeDescriptions[mode]}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
