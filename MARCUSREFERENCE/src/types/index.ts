export type MessageRole = 'user' | 'model' | 'system';

export interface MessagePart {
  text: string;
}

export interface Message {
  role: MessageRole;
  parts: MessagePart[];
}

export interface DisplayMessage {
  id: string;
  content: string;
  type: 'user' | 'bot' | 'privacy';
  timestamp: string;
  mode?: PhilosopherMode;
  turnsLeft?: number;
}

export type PhilosopherMode =
  | 'default'
  | 'stoic'
  | 'existentialist'
  | 'socratic'
  | 'zen'
  | 'nietzschean'
  | 'absurdist'
  | 'epicurean'
  | 'debate'
  | 'mentor'
  | 'scholar'
  | 'poet'
  | 'pragmatist'
  | 'mystic'
  | 'quick'
  | 'deep'
  | 'reflective'
  | 'teaching'
  | 'contemplative'
  | 'crisis'
  | 'curious'
  | 'playful'
  | 'serious';

export interface MarcusApiRequest {
  history: Message[];
  systemInstruction: string;
}

export interface MarcusApiResponse {
  reply: string;
}
