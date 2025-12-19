import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { Secret } from 'jsonwebtoken';
import { query } from '../config/database';
import { RegisterRequest, LoginRequest, AuthResponse, UserResponse } from '../types/user';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// handle user registration
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { full_name, email, password }: RegisterRequest = req.body;

    // check if all required fields are present
    if (!full_name || !email || !password) {
      res.status(400).json({
        success: false,
        message: 'Please provide full name, email, and password'
      } as AuthResponse);
      return;
    }

    // validate full_name - must be at least 2 chars, no special chars except spaces
    const nameRegex = /^[a-zA-Z\s]{2,50}$/;
    if (!nameRegex.test(full_name.trim())) {
      res.status(400).json({
        success: false,
        message: 'Full name must be 2-50 characters and contain only letters'
      } as AuthResponse);
      return;
    }

    // validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      } as AuthResponse);
      return;
    }

    // validate password - at least 6 chars, max 100
    if (password.length < 6) {
      res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      } as AuthResponse);
      return;
    }

    if (password.length > 100) {
      res.status(400).json({
        success: false,
        message: 'Password must not exceed 100 characters'
      } as AuthResponse);
      return;
    }

    // check for common weak passwords
    const weakPasswords = ['password', '123456', 'qwerty', 'abc123', 'password123'];
    if (weakPasswords.includes(password.toLowerCase())) {
      res.status(400).json({
        success: false,
        message: 'Password is too weak. Please choose a stronger password'
      } as AuthResponse);
      return;
    }

    // check if email is already taken
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

    // hash the password before storing
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // save user to database
    const result = await query(
      'INSERT INTO users (full_name, email, password_hash) VALUES (?, ?, ?)',
      [full_name, email, hashedPassword]
    ) as ResultSetHeader;

    // create jwt token for immediate login
    const jwtSecret: Secret = process.env.JWT_SECRET || 'your_jwt_secret_key_here';
    // @ts-ignore - jwt types are weird with expiresIn
    const token = jwt.sign(
      { id: result.insertId, email },
      jwtSecret,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    // send back user data without password
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

// handle user login
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password }: LoginRequest = req.body;

    // validate both fields are provided
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      } as AuthResponse);
      return;
    }

    // validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      } as AuthResponse);
      return;
    }

    // validate password isn't empty string
    if (password.trim().length === 0) {
      res.status(400).json({
        success: false,
        message: 'Password cannot be empty'
      } as AuthResponse);
      return;
    }

    // lookup user in db
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

    const user = users[0] as any;

    // verify password hash
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      } as AuthResponse);
      return;
    }

    // generate token for logged in session
    const jwtSecret: Secret = process.env.JWT_SECRET || 'your_jwt_secret_key_here';
    // @ts-ignore - jwt types are weird with expiresIn
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
