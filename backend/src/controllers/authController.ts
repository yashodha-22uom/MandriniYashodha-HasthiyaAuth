import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { query } from '../config/database';
import { RegisterRequest, LoginRequest, AuthResponse, UserResponse } from '../types/user';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

/**
 * Register a new user
 * POST /api/auth/register
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { full_name, email, password }: RegisterRequest = req.body;

    // Validate input
    if (!full_name || !email || !password) {
      res.status(400).json({
        success: false,
        message: 'Please provide full name, email, and password'
      } as AuthResponse);
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      } as AuthResponse);
      return;
    }

    // Validate password length
    if (password.length < 6) {
      res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      } as AuthResponse);
      return;
    }

    // Check if user already exists (by email)
    const existingUserByEmail = await query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    ) as RowDataPacket[];

    if (existingUserByEmail.length > 0) {
      res.status(409).json({
        success: false,
        message: 'Email already registered'
      } as AuthResponse);
      return;
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert user into database
    const result = await query(
      'INSERT INTO users (full_name, email, password_hash) VALUES (?, ?, ?)',
      [full_name, email, hashedPassword]
    ) as ResultSetHeader;

    // Generate JWT token
    const jwtSecret: Secret = process.env.JWT_SECRET || 'your_jwt_secret_key_here';
    // @ts-ignore - Type issue with jsonwebtoken options
    const token = jwt.sign(
      { id: result.insertId, email },
      jwtSecret,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    // Return user data (without password)
    const userResponse: UserResponse = {
      id: result.insertId,
      full_name,
      email
    };

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: userResponse,
      token
    } as AuthResponse);

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    } as AuthResponse);
  }
};

/**
 * Login user
 * POST /api/auth/login
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password }: LoginRequest = req.body;

    // Validate input
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      } as AuthResponse);
      return;
    }

    // Find user by email
    const users = await query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    ) as RowDataPacket[];

    if (users.length === 0) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      } as AuthResponse);
      return;
    }

    const user = users[0];

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      } as AuthResponse);
      return;
    }

    // Generate JWT token
    const jwtSecret: Secret = process.env.JWT_SECRET || 'your_jwt_secret_key_here';
    // @ts-ignore - Type issue with jsonwebtoken options
    const token = jwt.sign(
      { id: user.id, email: user.email },
      jwtSecret,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    // Return user data (without password)
    const userResponse: UserResponse = {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      created_at: user.created_at
    };

    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: userResponse,
      token
    } as AuthResponse);

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    } as AuthResponse);
  }
};
