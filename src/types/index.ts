export interface Device {
  _id: string;
  device_id: string;
  agent_id: string | null;
  created_at: string;
  last_connected_at: string;
  is_deleted: boolean;
  deleted_at: string | null;
  updated_at: string | null;
  is_active: boolean;
}

export interface Agent {
  _id: string;
  agent_name: string;
  system_instruction: string;
  params: {
    temperature: number;
    topK: number;
    safetySettings: {
      harassmentThreshold: string;
    };
  };
  is_default: boolean;
  created_at: string;
  is_deleted: boolean;
  deleted_at: string | null;
  updated_at: string | null;
  is_active: boolean;
}

export interface Session {
  _id: string;
  session_id: string;
  device_id: string;
  agent_id: string;
  created_at: string;
  chat_log: ChatMessage[];
}

export interface ChatMessage {
  created_at: string;
  sender: 'agent' | 'user';
  message: string;
  file_url?: string;
  _id: string;
}

export interface Incident {
  _id: string;
  device_id: string;
  agent_id: string | null;
  created_at: string;
  status: 'connected' | 'failed' | 'unauthorized';
  details: string | {
    error: string;
    timestamp: string;
    errorCode: number;
  };
}

export interface ConsolidatedLog {
  _id: string;
  from_timestamp: string;
  to_timestamp: string;
  sessions: Session[];
  generated_at: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  count: number;
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  data: T[];
}

export interface FilterParams {
  page?: number;
  limit?: number;
  search?: string;
  [key: string]: any;
} 