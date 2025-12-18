'use client';

import { useEffect, useRef } from 'react';
import { DisplayMessage } from '@/types';
import { Message } from './Message';
import { TypingMessage } from './TypingMessage';
import { TypingIndicator } from './TypingIndicator';
import styles from './MessageList.module.css';

interface MessageListProps {
  messages: DisplayMessage[];
  isLoading: boolean;
  typingMessageId: string | null;
  typedMessageIds: Set<string>;
  onTypingComplete: () => void;
}

export function MessageList({ messages, isLoading, typingMessageId, typedMessageIds, onTypingComplete }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className={styles.messageList}>
      {messages.map((message) => {
        const isCurrentlyTyping = message.id === typingMessageId;
        const wasTyped = typedMessageIds.has(message.id);
        
        if (isCurrentlyTyping || wasTyped) {
          return (
            <TypingMessage
              key={message.id}
              content={message.content}
              timestamp={message.timestamp}
              mode={message.mode}
              turnsLeft={message.turnsLeft}
              onComplete={onTypingComplete}
              skipTyping={wasTyped}
            />
          );
        }
        return <Message key={message.id} message={message} />;
      })}
      {isLoading && <TypingIndicator />}
      <div ref={messagesEndRef} />
    </div>
  );
}
