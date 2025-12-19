import { Request, Response } from 'express';
import { query } from '../config/database';
import { UserResponse } from '../types/user';
import { RowDataPacket } from 'mysql2';

// get logged in user's profile
export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    // req.user comes from auth middleware
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
      return;
    }

    // grab user data from db
    const users = await query(
      'SELECT id, full_name, email, created_at FROM users WHERE id = ?',
      [req.user.id]
    ) as RowDataPacket[];

    if (users.length === 0) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    const user = users[0] as any;

    const userResponse: UserResponse = {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      created_at: user.created_at
    };

    res.status(200).json({
      success: true,
      message: 'Profile retrieved successfully',
      user: userResponse
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching profile'
    });
  }
};

// update user profile info
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
      return;
    }

    const { full_name } = req.body;

    // validate full_name is provided
    if (!full_name) {
      res.status(400).json({
        success: false,
        message: 'Please provide full name'
      });
      return;
    }

    // validate full_name format - 2-50 chars, letters and spaces only
    const nameRegex = /^[a-zA-Z\s]{2,50}$/;
    if (!nameRegex.test(full_name.trim())) {
      res.status(400).json({
        success: false,
        message: 'Full name must be 2-50 characters and contain only letters'
      });
      return;
    }

    // update in database - trim to remove extra spaces
    await query(
      'UPDATE users SET full_name = ? WHERE id = ?',
      [full_name.trim(), req.user.id]
    );

    // get the updated data - explicitly exclude password_hash
    const users = await query(
      'SELECT id, full_name, email, created_at FROM users WHERE id = ?',
      [req.user.id]
    ) as RowDataPacket[];

    if (users.length === 0) {
      res.status(404).json({
        success: false,
        message: 'User not found after update'
      });
      return;
    }

    const user = users[0] as any;

    const userResponse: UserResponse = {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      created_at: user.created_at
    };

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: userResponse
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating profile'
    });
  }
};
