'use client';

import { useEffect, useRef } from 'react';
import { DisplayMessage } from '@/types';
import { Message } from './Message';
import { TypingIndicator } from './TypingIndicator';
import styles from './MessageList.module.css';

interface MessageListProps {
  messages: DisplayMessage[];
  isLoading: boolean;
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className={styles.messageList}>
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
      {isLoading && <TypingIndicator />}
      <div ref={messagesEndRef} />
    </div>
  );
}
