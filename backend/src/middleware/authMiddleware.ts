import { Request, Response, NextFunction } from 'express';
import jwt, { Secret, JwtPayload } from 'jsonwebtoken';

// extending the Request type to include user data after auth
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
      };
    }
  }
}

// main auth middleware - blocks request if token is missing or invalid
export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // grab the token from header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // format: Bearer TOKEN

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
      return;
    }

    const jwtSecret: Secret = process.env.JWT_SECRET || 'your_jwt_secret_key_here';
    
    try {
      const decoded = jwt.verify(token, jwtSecret) as JwtPayload;
      
      // attach user data to request object
      req.user = {
        id: decoded.id,
        email: decoded.email
      };

      next();
    } catch (jwtError: any) {
      // handle different token errors
      if (jwtError.name === 'TokenExpiredError') {
        res.status(401).json({
          success: false,
          message: 'Token has expired. Please login again.'
        });
        return;
      }

      if (jwtError.name === 'JsonWebTokenError') {
        res.status(401).json({
          success: false,
          message: 'Invalid token. Please login again.'
        });
        return;
      }

      res.status(401).json({
        success: false,
        message: 'Token verification failed.'
      });
      return;
    }

  } catch (error) {
    console.error('Authentication middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during authentication'
    });
  }
};

// optional auth - doesn't fail if token is missing, just sets user if valid token exists
// useful for routes that work for both logged in and guest users
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      next();
      return;
    }

    const jwtSecret: Secret = process.env.JWT_SECRET || 'your_jwt_secret_key_here';
    
    try {
      const decoded = jwt.verify(token, jwtSecret) as JwtPayload;
      req.user = {
        id: decoded.id,
        email: decoded.email
      };
    } catch (jwtError) {
      // invalid token but we don't care, just continue without user data
      console.log('Optional auth: Invalid token, continuing without user');
    }

    next();
  } catch (error) {
    console.error('Optional auth middleware error:', error);
    next(); // continue anyway
  }
};
