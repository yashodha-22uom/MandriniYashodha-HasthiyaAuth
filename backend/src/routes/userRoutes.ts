import { Router } from 'express';
import { getProfile, updateProfile } from '../controllers/userController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

/**
 * @route   GET /api/user/profile
 * @desc    Get current user profile
 * @access  Private (requires JWT token)
 */
router.get('/profile', authenticateToken, getProfile);

/**
 * @route   PUT /api/user/profile
 * @desc    Update current user profile
 * @access  Private (requires JWT token)
 */
router.put('/profile', authenticateToken, updateProfile);

export default router;
