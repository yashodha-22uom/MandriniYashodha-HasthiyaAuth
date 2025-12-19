import { Request } from 'express';

export interface User {
  id?: number;
  username: string;
  email: string;
  password: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface RefreshToken {
  id?: number;
  user_id: number;
  token: string;
  expires_at: Date;
  created_at?: Date;
}

export interface AuthRequest extends Request {
  user?: {
    id: number;
    username: string;
    email: string;
  };
}
