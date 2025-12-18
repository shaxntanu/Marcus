'use client';

import { useState } from 'react';
import { DisplayMessage } from '@/types';
import { modeLabels } from '@/constants/modeInstructions';
import styles from './SettingsButton.module.css';

interface SettingsButtonProps {
  animationsEnabled: boolean;
  onAnimationsChange: (enabled: boolean) => void;
  messages: DisplayMessage[];
}

export function SettingsButton({ animationsEnabled, onAnimationsChange, messages }: SettingsButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const exportChat = () => {
    const chatContent = messages
      .filter(msg => msg.type !== 'privacy')
      .map(msg => {
        if (msg.type === 'user') {
          return `[USER] (${msg.timestamp})\n${msg.content}\n`;
        } else {
          const modeText = msg.mode ? ` | Mode: ${modeLabels[msg.mode]}` : '';
          const turnsText = msg.turnsLeft !== undefined ? ` | Turns left: ${msg.turnsLeft}` : '';
          return `[MARCUS] (${msg.timestamp}${modeText}${turnsText})\n${msg.content}\n`;
        }
      })
      .join('\n---\n\n');

    const header = `Marcus Omega Chat Export\nExported: ${new Date().toLocaleString()}\n${'='.repeat(50)}\n\n`;
    const fullContent = header + chatContent;

    const blob = new Blob([fullContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `marcus-chat-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={styles.container}>
      <div className={styles.btnCont}>
        <button className={styles.button} onClick={() => setIsOpen(!isOpen)}>
          <svg
            className={styles.settingsBtn}
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            viewBox="0 -960 960 960"
            width="24"
            fill="#e8eaed"
          >
            <path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z" />
          </svg>
          <span className={styles.tooltip}>settings</span>
        </button>
      </div>

      {isOpen && (
        <>
          <div className={styles.overlay} onClick={() => setIsOpen(false)} />
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>Settings</h2>
              <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>×</button>
            </div>

            <div className={styles.modalContent}>
              <div className={styles.settingItem}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={animationsEnabled}
                    onChange={(e) => onAnimationsChange(e.target.checked)}
                    className={styles.checkbox}
                  />
                  <span>Enable animations</span>
                </label>
                <p className={styles.warning}>
                  ⚠️ Animations may cause lag on mobile devices or older hardware
                </p>
              </div>

              <div className={styles.divider} />

              <div className={styles.settingItem}>
                <button className={styles.exportBtn} onClick={exportChat}>
                  Export Chat
                </button>
                <p className={styles.hint}>
                  Download conversation as a .txt file
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
