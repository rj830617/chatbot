export interface AuthTokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  is_exists: boolean;
}

export interface UserPreferences {
  theme?: string;
  language?: string;
  voice_volume?: string;
  bg_volume?: string;
  notifications?: Record<string, unknown>;
}

export interface UserResponse {
  id: number;
  email: string;
  name?: string;
  auth_provider: string;
  preferences?: UserPreferences;
}

export interface UserStatsResponse {
  total_minutes: number;
  total_sessions: number;
  average_length: number;
  longest_streak: number;
}

export interface SessionResponse {
  id: number;
  user_id: number;
}

export interface MessageResponse {
  id: number;
  role: 'user' | 'agent';
  content: string;
  created_at: string;
}

export interface AudioBlock {
  block: number;
  duration: number;
  key?: string;
  url?: string;
  type?: string;
  has_voice?: boolean;
  background_audio?: string;
}

export interface AudioFile {
  duration?: number;
  key?: string;
  url?: string;
  type?: string;
  background_audio?: string;
}

export interface MeditationResponse {
  id: number;
  session_id: number;
  name?: string;
  summary?: string;
  script?: string[];
  audio_blocks?: AudioBlock[];
  merged_audio?: AudioFile | null;
  status: string;
  progress: number;
  is_liked: boolean;
}

export interface MusicResponse {
  id: number;
  display_name: string;
  path: string;
  category: string;
  mood: string[];
  description?: string;
  tags?: string[];
  url?: string;
}
