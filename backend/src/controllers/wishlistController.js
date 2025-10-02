import { db } from '../config/database.js';
import { wishlist, watches } from '../models/schema.js';
import { eq, and } from 'drizzle-orm';

export const getWishlist = async (req, res) => {
  try {
    const userId = req.user.id;

    const items = await db
      .select({
        id: wishlist.id,
        createdAt: wishlist.createdAt,
        watch: watches
      })
      .from(wishlist)
      .leftJoin(watches, eq(wishlist.watchId, watches.id))
      .where(eq(wishlist.userId, userId));

    res.json({
      success: true,
      data: items
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch wishlist', details: error.message }
    });
  }
};

export const addToWishlist = async (req, res) => {
  try {
    const { watchId } = req.body;
    const userId = req.user.id;

    const [existing] = await db
      .select()
      .from(wishlist)
      .where(and(eq(wishlist.userId, userId), eq(wishlist.watchId, watchId)));

    if (existing) {
      return res.status(400).json({
        success: false,
        error: { message: 'Item already in wishlist' }
      });
    }

    const [newItem] = await db
      .insert(wishlist)
      .values({ userId, watchId })
      .returning();

    res.status(201).json({
      success: true,
      data: newItem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Failed to add to wishlist', details: error.message }
    });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    await db
      .delete(wishlist)
      .where(and(eq(wishlist.id, parseInt(id)), eq(wishlist.userId, userId)));

    res.json({
      success: true,
      message: 'Item removed from wishlist'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Failed to remove from wishlist', details: error.message }
    });
  }
};
