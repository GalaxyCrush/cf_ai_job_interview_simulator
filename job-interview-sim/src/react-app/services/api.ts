import axios, { AxiosInstance } from "axios";


export interface SessionStartRequest {
  candidateName: string;
  jobArea: string;
}

export interface SessionStartResponse {
  sessionId: string;
  jobArea: string;
  candidateName: string;
  createdAt: string;
}

export interface ChatMessage {
  role: string;
  content: string;
  timestamp: string;
}

export interface ChatRequest {
  sessionId: string;
  message: string;
}

export interface ChatResponse {
  response: string;
  timestamp: string;
}

export interface HistoryResponse {
  session: {
    sessionID: string;
    jobArea: string;
    candidateName: string;
    createddAt: string;
    updatedAt: string;
  } | null;
  messages: ChatMessage[];
}

export interface FeedbackResponse {
  feedback: string;
  jobArea: string;
  candidateName: string;
  messageCount: number;
  timestamp: string;
}

const API_BASE_URL ="/api";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    if (error.response) {
      console.error(`API Error [${error.response.status}]:`, error.response.data);
      throw new Error(error.response.data.error || `HTTP ${error.response.status}`);
    } else if (error.request) {
      console.error('No response from server');
      throw new Error('Network error');
    } else {
      console.error('Request setup error:', error.message);
      throw error;
    }
  }
);

class ApiClient{

    async startSession(data: SessionStartRequest): Promise<SessionStartResponse> {
        const response = await axiosInstance.post<SessionStartResponse>("/sessions/start", data);
        return response.data;
    }

    async sendMessage(data: ChatRequest): Promise<ChatResponse> {
        const response = await axiosInstance.post<ChatResponse>("/chat", data);
        return response.data;
    }

    async getHistory(sessionId: string): Promise<HistoryResponse> {
        const response = await axiosInstance.get<HistoryResponse>(`/sessions/${sessionId}/history`);
        return response.data;
    }

    async getFeedback(sessionId: string): Promise<FeedbackResponse> {
        const response = await axiosInstance.get<FeedbackResponse>(`/sessions/${sessionId}/feedback`);
        return response.data;
    }

    async checkHealth(): Promise<{ status: string; timestamp: string; ai_available: boolean; durable_objects_available: boolean }> {
        const response = await axiosInstance.get(`/health`);
        return response.data;
    }
}

export const api = new ApiClient();
export default api;