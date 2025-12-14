'use client';

import { useChat } from '@/hooks/useChat';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { ModeSelector } from './ModeSelector';
import styles from './ChatContainer.module.css';

export function ChatContainer() {
  const {
    displayMessages,
    isLoading,
    currentMode,
    setCurrentMode,
    sendMessage,
    clearConversation,
    turnsLeft,
  } = useChat();

  return (
    <>
      <ModeSelector currentMode={currentMode} onModeChange={setCurrentMode} />
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Marcus Omega</h1>
          <div className={styles.creator}>(by GlyphThoughts)</div>
          <button className={styles.clearButton} onClick={clearConversation}>
            <span className={styles.clearButtonInner}>Clear</span>
          </button>
        </div>

        <MessageList messages={displayMessages} isLoading={isLoading} />

        <ChatInput
          onSend={sendMessage}
          isLoading={isLoading}
          turnsLeft={turnsLeft}
        />
      </div>
    </>
  );
}
