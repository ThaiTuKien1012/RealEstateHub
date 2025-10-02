import { db } from '../config/database.js';
import { users, addresses } from '../models/schema.js';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, pageSize = 10 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(pageSize);

    const allUsers = await db
      .select({
        id: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        role: users.role,
        phone: users.phone,
        avatar: users.avatar,
        isVerified: users.isVerified,
        createdAt: users.createdAt
      })
      .from(users)
      .limit(parseInt(pageSize))
      .offset(offset);

    res.json({
      success: true,
      data: allUsers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch users', details: error.message }
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        role: users.role,
        phone: users.phone,
        avatar: users.avatar,
        isVerified: users.isVerified,
        createdAt: users.createdAt
      })
      .from(users)
      .where(eq(users.id, parseInt(id)));

    if (!user) {
      return res.status(404).json({
        success: false,
        error: { message: 'User not found' }
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch user', details: error.message }
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const [updated] = await db
      .update(users)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(users.id, parseInt(id)))
      .returning({
        id: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        role: users.role,
        phone: users.phone,
        avatar: users.avatar
      });

    if (!updated) {
      return res.status(404).json({
        success: false,
        error: { message: 'User not found' }
      });
    }

    res.json({
      success: true,
      data: updated
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Failed to update user', details: error.message }
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    await db.delete(users).where(eq(users.id, parseInt(id)));

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Failed to delete user', details: error.message }
    });
  }
};

export const createUser = async (req, res) => {
  try {
    const { email, password, firstName, lastName, role = 'customer' } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const [newUser] = await db
      .insert(users)
      .values({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role
      })
      .returning({
        id: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        role: users.role
      });

    res.status(201).json({
      success: true,
      data: newUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Failed to create user', details: error.message }
    });
  }
};
