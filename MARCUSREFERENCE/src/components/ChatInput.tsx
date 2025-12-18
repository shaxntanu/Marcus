'use client';

import { useState, KeyboardEvent } from 'react';
import { typingTexts } from '@/constants/modeInstructions';
import buttonStyles from './Button.module.css';
import styles from './ChatInput.module.css';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

export function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [input, setInput] = useState('');

  const placeholder = isLoading
    ? typingTexts[Math.floor(Math.random() * typingTexts.length)]
    : 'Type your message here...';

  const handleSend = () => {
    if (input.trim() && !isLoading) {
      onSend(input.trim());
      setInput('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSend();
    }
  };

  return (
    <div className={styles.container}>
      <input
        type="text"
        className={styles.input}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
      />
      <button
        className={buttonStyles.button}
        onClick={handleSend}
        disabled={isLoading}
      >
        {isLoading ? 'WAIT...' : 'SEND'}
      </button>
    </div>
  );
}
