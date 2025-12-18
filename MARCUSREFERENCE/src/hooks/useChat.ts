'use client';

import { useState, useCallback, useEffect } from 'react';
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
  const [displayMessages, setDisplayMessages] = useState<DisplayMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingMessageId, setTypingMessageId] = useState<string | null>(null);
  const [typedMessageIds, setTypedMessageIds] = useState<Set<string>>(new Set());
  const [currentMode, setCurrentMode] = useState<PhilosopherMode>('default');
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize welcome messages only on client side to avoid hydration mismatch
  useEffect(() => {
    if (!isInitialized) {
      setDisplayMessages([
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
      setIsInitialized(true);
    }
  }, [isInitialized]);

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

        // Calculate turns left after this response
        const newTurnsLeft = Math.max(0, MAX_CONTEXT_TURNS - Math.floor((newHistory.length + 1) / 2));
        
        // Add bot response to display with typing effect
        const botMsgId = generateId();
        const botDisplayMsg: DisplayMessage = {
          id: botMsgId,
          content: botReply,
          type: 'bot',
          timestamp: getCurrentTime(),
          mode: currentMode,
          turnsLeft: newTurnsLeft,
        };
        setDisplayMessages((prev: DisplayMessage[]) => [...prev, botDisplayMsg]);
        setTypingMessageId(botMsgId);
        setIsTyping(true);

        // Add bot response to conversation history
        const botHistoryMsg: Message = {
          role: 'model',
          parts: [{ text: botReply }],
        };
        setConversationHistory((prev: Message[]) => [...prev, botHistoryMsg]);
      } catch (error) {
        console.error('Error sending message:', error);
        const errorMsgId = generateId();
        const errorMsg: DisplayMessage = {
          id: errorMsgId,
          content:
            'I find myself momentarily disconnected from the digital realm. Please try again.',
          type: 'bot',
          timestamp: getCurrentTime(),
          mode: currentMode,
          turnsLeft: turnsLeft,
        };
        setDisplayMessages((prev: DisplayMessage[]) => [...prev, errorMsg]);
        setTypingMessageId(errorMsgId);
        setIsTyping(true);
      } finally {
        setIsLoading(false);
      }
    },
    [conversationHistory, currentMode, isLoading]
  );

  const clearConversation = useCallback(() => {
    setConversationHistory([]);
    setIsLoading(false);
    setIsTyping(false);
    setTypingMessageId(null);
    setTypedMessageIds(new Set());
    setDisplayMessages([
      {
        id: generateId(),
        content:
          'These words dissolve with the closing of your browser. Nothing is preserved, save what you choose to remember.',
        type: 'privacy',
        timestamp: getCurrentTime(),
      },
      {
        id: generateId(),
        content:
          'Welcome to the realm of digital consciousness. What philosophical inquiry shall we explore today?',
        type: 'bot',
        timestamp: getCurrentTime(),
      },
    ]);
  }, []);

  const onTypingComplete = useCallback(() => {
    setIsTyping(false);
    if (typingMessageId) {
      setTypedMessageIds((prev) => new Set(prev).add(typingMessageId));
    }
    setTypingMessageId(null);
  }, [typingMessageId]);

  return {
    displayMessages,
    isLoading,
    isTyping,
    typingMessageId,
    typedMessageIds,
    currentMode,
    setCurrentMode,
    sendMessage,
    clearConversation,
    onTypingComplete,
    turnsLeft,
    turnsUsed,
  };
}
