import { db } from '../config/database.js';
import { cart, watches } from '../models/schema.js';
import { eq, and } from 'drizzle-orm';

export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cartItems = await db
      .select({
        id: cart.id,
        quantity: cart.quantity,
        variantId: cart.variantId,
        watch: watches
      })
      .from(cart)
      .leftJoin(watches, eq(cart.watchId, watches.id))
      .where(eq(cart.userId, userId));

    res.json({
      success: true,
      data: cartItems
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch cart', details: error.message }
    });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { watchId, quantity = 1, variantId } = req.body;
    const userId = req.user.id;

    const [existingItem] = await db
      .select()
      .from(cart)
      .where(and(eq(cart.userId, userId), eq(cart.watchId, watchId)));

    if (existingItem) {
      const [updated] = await db
        .update(cart)
        .set({ quantity: existingItem.quantity + quantity })
        .where(eq(cart.id, existingItem.id))
        .returning();

      return res.json({
        success: true,
        data: updated
      });
    }

    const [newItem] = await db
      .insert(cart)
      .values({ userId, watchId, quantity, variantId })
      .returning();

    res.status(201).json({
      success: true,
      data: newItem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Failed to add to cart', details: error.message }
    });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const userId = req.user.id;

    const [updated] = await db
      .update(cart)
      .set({ quantity })
      .where(and(eq(cart.id, parseInt(id)), eq(cart.userId, userId)))
      .returning();

    if (!updated) {
      return res.status(404).json({
        success: false,
        error: { message: 'Cart item not found' }
      });
    }

    res.json({
      success: true,
      data: updated
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Failed to update cart', details: error.message }
    });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    await db
      .delete(cart)
      .where(and(eq(cart.id, parseInt(id)), eq(cart.userId, userId)));

    res.json({
      success: true,
      message: 'Item removed from cart'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Failed to remove from cart', details: error.message }
    });
  }
};

export const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    await db.delete(cart).where(eq(cart.userId, userId));

    res.json({
      success: true,
      message: 'Cart cleared successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Failed to clear cart', details: error.message }
    });
  }
};
