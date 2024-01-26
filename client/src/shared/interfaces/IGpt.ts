export interface IGpt {
  message: string;
  sender: string;
  direction: string;
}

export interface Message {
  role: string;
  content: string;
}

export interface ApiRequestBody {
  model: string;
  messages: Message[];
}

export interface AssistantChoice {
  index: number;
  message: {
    role: string;
    content: string;
  };
  finish_reason: string;
}

export interface ChatCompletion {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: AssistantChoice[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}
