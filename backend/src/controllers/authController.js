import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../config/database.js';
import { users } from '../models/schema.js';
import { eq } from 'drizzle-orm';

export const register = async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Validation failed',
          details: [
            !firstName && { field: 'firstName', message: '"firstName" is required' },
            !lastName && { field: 'lastName', message: '"lastName" is required' },
            !email && { field: 'email', message: '"email" is required' },
            !password && { field: 'password', message: '"password" is required' },
          ].filter(Boolean)
        }
      });
    }

    const [existingUser] = await db.select().from(users).where(eq(users.email, email));
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: { message: 'User already exists', details: 'USER_EXISTS' }
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const role = email.includes('admin') ? 'admin' : 'customer';

    const [newUser] = await db.insert(users).values({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role,
    }).returning();

    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      success: true,
      data: {
        user: userWithoutPassword,
        token
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Registration failed', details: error.message }
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [user] = await db.select().from(users).where(eq(users.email, email));

    if (!user) {
      return res.status(401).json({
        success: false,
        error: { message: 'Invalid credentials', details: 'INVALID_CREDENTIALS' }
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: { message: 'Invalid credentials', details: 'INVALID_CREDENTIALS' }
      });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      data: {
        user: userWithoutPassword,
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Login failed', details: error.message }
    });
  }
};

export const logout = async (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
};

export const getMe = async (req, res) => {
  try {
    const [user] = await db.select().from(users).where(eq(users.id, req.user.id));
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { message: 'User not found' }
      });
    }

    const { password, ...userWithoutPassword } = user;
    
    res.json({
      success: true,
      data: userWithoutPassword
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Failed to get user', details: error.message }
    });
  }
};
