'use client';

import { useState, useCallback } from 'react';
import { Message, DisplayMessage, PhilosopherMode } from '@/types';
import { modeInstructions, MAX_CONTEXT_TURNS } from '@/constants/modeInstructions';

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

function getCurrentTime(): string {
  return new Date().toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export function useChat() {
  const [conversationHistory, setConversationHistory] = useState<Message[]>([]);
  const [displayMessages, setDisplayMessages] = useState<DisplayMessage[]>([
    {
      id: 'privacy',
      content:
        'These words dissolve with the closing of your browser. Nothing is preserved, save what you choose to remember.',
      type: 'privacy',
      timestamp: getCurrentTime(),
    },
    {
      id: 'welcome',
      content:
        'Welcome to the realm of digital consciousness. What philosophical inquiry shall we explore today?',
      type: 'bot',
      timestamp: getCurrentTime(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentMode, setCurrentMode] = useState<PhilosopherMode>('default');

  // Calculate turns left for context window
  const turnsUsed = Math.floor(conversationHistory.length / 2);
  const turnsLeft = Math.max(0, MAX_CONTEXT_TURNS - turnsUsed);

  const sendMessage = useCallback(
    async (userMessage: string) => {
      if (!userMessage.trim() || isLoading) return;

      // Add user message to display
      const userDisplayMsg: DisplayMessage = {
        id: generateId(),
        content: userMessage,
        type: 'user',
        timestamp: getCurrentTime(),
      };
      setDisplayMessages((prev: DisplayMessage[]) => [...prev, userDisplayMsg]);

      // Add user message to conversation history
      const userHistoryMsg: Message = {
        role: 'user',
        parts: [{ text: userMessage }],
      };
      const newHistory = [...conversationHistory, userHistoryMsg];
      setConversationHistory(newHistory);

      setIsLoading(true);

      try {
        // Apply sliding window - only send last MAX_CONTEXT_TURNS * 2 messages
        const truncatedHistory = newHistory.slice(-(MAX_CONTEXT_TURNS * 2));
        const systemInstruction = modeInstructions[currentMode];

        const response = await fetch('/api/marcus', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            history: truncatedHistory,
            systemInstruction,
          }),
        });

        const data = await response.json();
        const botReply =
          data.reply ||
          'I find myself in contemplative silence. Please, ask again.';

        // Add bot response to display
        const botDisplayMsg: DisplayMessage = {
          id: generateId(),
          content: botReply,
          type: 'bot',
          timestamp: getCurrentTime(),
        };
        setDisplayMessages((prev: DisplayMessage[]) => [...prev, botDisplayMsg]);

        // Add bot response to conversation history
        const botHistoryMsg: Message = {
          role: 'model',
          parts: [{ text: botReply }],
        };
        setConversationHistory((prev: Message[]) => [...prev, botHistoryMsg]);
      } catch (error) {
        console.error('Error sending message:', error);
        const errorMsg: DisplayMessage = {
          id: generateId(),
          content:
            'I find myself momentarily disconnected from the digital realm. Please try again.',
          type: 'bot',
          timestamp: getCurrentTime(),
        };
        setDisplayMessages((prev: DisplayMessage[]) => [...prev, errorMsg]);
      } finally {
        setIsLoading(false);
      }
    },
    [conversationHistory, currentMode, isLoading]
  );

  const clearConversation = useCallback(() => {
    setConversationHistory([]);
    setDisplayMessages([
      {
        id: 'privacy',
        content:
          'These words dissolve with the closing of your browser. Nothing is preserved save what you choose to remember.',
        type: 'privacy',
        timestamp: getCurrentTime(),
      },
      {
        id: 'welcome',
        content:
          'Welcome to the realm of digital consciousness. What philosophical inquiry shall we explore today?',
        type: 'bot',
        timestamp: getCurrentTime(),
      },
    ]);
  }, []);

  return {
    displayMessages,
    isLoading,
    currentMode,
    setCurrentMode,
    sendMessage,
    clearConversation,
    turnsLeft,
    turnsUsed,
  };
}
