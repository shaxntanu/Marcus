'use client';

import { useState, useRef, useEffect } from 'react';
import { PhilosopherMode } from '@/types';
import styles from './ModeSelector.module.css';

interface ModeSelectorProps {
  currentMode: PhilosopherMode;
  onModeChange: (mode: PhilosopherMode) => void;
}

const modes: { value: PhilosopherMode; label: string }[] = [
  { value: 'default', label: 'Default Mode' },
  { value: 'stoic', label: 'Stoic' },
  { value: 'existentialist', label: 'Existentialist' },
  { value: 'socratic', label: 'Socratic' },
  { value: 'zen', label: 'Zen' },
  { value: 'nietzschean', label: 'Nietzschean' },
  { value: 'absurdist', label: 'Absurdist' },
  { value: 'epicurean', label: 'Epicurean' },
  { value: 'debate', label: 'Debate' },
  { value: 'mentor', label: 'Mentor' },
  { value: 'scholar', label: 'Scholar' },
  { value: 'poet', label: 'Poet' },
  { value: 'pragmatist', label: 'Pragmatist' },
  { value: 'mystic', label: 'Mystic' },
  { value: 'quick', label: 'Quick Wisdom' },
  { value: 'deep', label: 'Deep Dive' },
  { value: 'reflective', label: 'Reflective' },
  { value: 'teaching', label: 'Teaching' },
  { value: 'contemplative', label: 'Contemplative' },
  { value: 'crisis', label: 'Crisis Support' },
  { value: 'curious', label: 'Curious Explorer' },
  { value: 'playful', label: 'Playful' },
  { value: 'serious', label: 'Serious' },
];

export function ModeSelector({ currentMode, onModeChange }: ModeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentLabel =
    modes.find((m) => m.value === currentMode)?.label || 'Default Mode';

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
          {currentLabel}
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
                key={mode.value}
                className={`${styles.option} ${
                  currentMode === mode.value ? styles.optionSelected : ''
                }`}
                onClick={() => handleSelect(mode.value)}
              >
                {mode.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
