'use client';

import { useState, useEffect } from 'react';
import { PhilosopherMode } from '@/types';
import { modeLabels } from '@/constants/modeInstructions';
import styles from './Message.module.css';

interface TypingMessageProps {
  content: string;
  timestamp: string;
  mode?: PhilosopherMode;
  turnsLeft?: number;
  onComplete: () => void;
  skipTyping?: boolean;
}

export function TypingMessage({ content, timestamp, mode, turnsLeft, onComplete, skipTyping = false }: TypingMessageProps) {
  const [displayedText, setDisplayedText] = useState(skipTyping ? content : '');
  const [isComplete, setIsComplete] = useState(skipTyping);

  useEffect(() => {
    if (isComplete || skipTyping) return;

    let index = 0;
    const interval = setInterval(() => {
      if (index < content.length) {
        setDisplayedText(content.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
        setIsComplete(true);
        onComplete();
      }
    }, 20);

    return () => clearInterval(interval);
  }, [content, onComplete, isComplete, skipTyping]);

  return (
    <div className={styles.botTyping}>
      <div>
        <span className={isComplete ? '' : styles.typingText}>{displayedText}</span>
      </div>
      {isComplete && (
        <div className={styles.timestamp}>
          {mode && (
            <>
              <span className={styles.mode}>{modeLabels[mode]}</span>
              <span className={styles.separator}>•</span>
            </>
          )}
          {timestamp}
          {turnsLeft !== undefined && (
            <>
              <span className={styles.separator}>•</span>
              <span className={styles.turnsLeft}>{turnsLeft} turns left</span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
