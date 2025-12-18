'use client';

import React from 'react';
import { useChat } from '@/hooks/useChat';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { ModeSelector } from './ModeSelector';
import styles from './ChatContainer.module.css';

export function ChatContainer() {
  const {
    displayMessages,
    isLoading,
    isTyping,
    typingMessageId,
    typedMessageIds,
    currentMode,
    setCurrentMode,
    sendMessage,
    onTypingComplete,
  } = useChat();

  return (
    <>
      <ModeSelector currentMode={currentMode} onModeChange={setCurrentMode} />
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Marcus Omega</h1>
          <div className={styles.creator}>(Shantanu X GlyphThoughts)</div>
        </div>

        <MessageList
          messages={displayMessages}
          isLoading={isLoading}
          typingMessageId={typingMessageId}
          typedMessageIds={typedMessageIds}
          onTypingComplete={onTypingComplete}
        />

        <ChatInput onSend={sendMessage} isLoading={isLoading || isTyping} />
      </div>
    </>
  );
}
