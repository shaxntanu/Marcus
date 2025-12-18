'use client';

import { DisplayMessage } from '@/types';
import { modeLabels } from '@/constants/modeInstructions';
import styles from './Message.module.css';

interface MessageProps {
  message: DisplayMessage;
}

export function Message({ message }: MessageProps) {
  const showMeta = message.type === 'bot' && message.mode;
  
  return (
    <div className={`${styles.message} ${styles[message.type]}`}>
      <div>{message.content}</div>
      <div className={styles.timestamp}>
        {showMeta && (
          <>
            <span className={styles.mode}>{modeLabels[message.mode!]}</span>
            <span className={styles.separator}>•</span>
          </>
        )}
        {message.timestamp}
        {showMeta && message.turnsLeft !== undefined && (
          <>
            <span className={styles.separator}>•</span>
            <span className={styles.turnsLeft}>{message.turnsLeft} turns left</span>
          </>
        )}
      </div>
    </div>
  );
}
