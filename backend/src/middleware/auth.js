import jwt from 'jsonwebtoken';
import { db } from '../config/database.js';
import { users } from '../models/schema.js';
import { eq } from 'drizzle-orm';

export const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: { message: 'No token provided', details: 'UNAUTHORIZED' }
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const [user] = await db.select().from(users).where(eq(users.id, decoded.userId));

    if (!user) {
      return res.status(401).json({
        success: false,
        error: { message: 'Invalid token', details: 'INVALID_TOKEN' }
      });
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: { message: 'Invalid token', details: 'INVALID_TOKEN' }
    });
  }
};

export const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: { message: 'Admin access required', details: 'FORBIDDEN' }
    });
  }
  next();
};
