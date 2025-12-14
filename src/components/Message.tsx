'use client';

import { DisplayMessage } from '@/types';
import styles from './Message.module.css';

interface MessageProps {
  message: DisplayMessage;
}

export function Message({ message }: MessageProps) {
  return (
    <div className={`${styles.message} ${styles[message.type]}`}>
      <div>{message.content}</div>
      <div className={styles.timestamp}>{message.timestamp}</div>
    </div>
  );
}
