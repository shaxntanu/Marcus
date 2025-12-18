'use client';

import { useState, KeyboardEvent, useRef } from 'react';
import { typingTexts } from '@/constants/modeInstructions';
import buttonStyles from './Button.module.css';
import styles from './ChatInput.module.css';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

export function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

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

  const handleFocus = () => {
    setTimeout(() => {
      inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 300);
  };

  return (
    <div className={styles.container}>
      <input
        ref={inputRef}
        type="text"
        className={styles.input}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={handleKeyPress}
        onFocus={handleFocus}
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
