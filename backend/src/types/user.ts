export interface User {
  id?: number;
  full_name: string;
  email: string;
  password_hash: string;
  created_at?: Date;
}

export interface UserResponse {
  id: number;
  full_name: string;
  email: string;
  created_at?: Date;
}

export interface RegisterRequest {
  full_name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: UserResponse;
  token?: string;
}
