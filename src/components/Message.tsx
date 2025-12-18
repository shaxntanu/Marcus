'use client';

import { DisplayMessage } from '@/types';
import { modeLabels } from '@/constants/modeInstructions';
import styles from './Message.module.css';

interface MessageProps {
  message: DisplayMessage;
}

export function Message({ message }: MessageProps) {
  const isBotWithMeta = message.type === 'bot' && message.mode;
  const showTimestamp = message.type === 'bot';
  
  return (
    <div className={`${styles.message} ${styles[message.type]}`}>
      <div>{message.content}</div>
      {showTimestamp && (
        <div className={styles.timestamp}>
          {isBotWithMeta && (
            <>
              <span className={styles.mode}>{modeLabels[message.mode!]}</span>
              <span className={styles.separator}>•</span>
            </>
          )}
          {message.timestamp}
          {isBotWithMeta && message.turnsLeft !== undefined && (
            <>
              <span className={styles.separator}>•</span>
              <span className={styles.turnsLeft}>{message.turnsLeft} turns (context reset)</span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
