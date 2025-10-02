import { db } from '../config/database.js';
import { orders, orderItems, cart, watches } from '../models/schema.js';
import { eq, desc } from 'drizzle-orm';

export const createOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;
    const userId = req.user.id;

    const cartItems = await db
      .select({
        watchId: cart.watchId,
        quantity: cart.quantity,
        price: watches.price
      })
      .from(cart)
      .leftJoin(watches, eq(cart.watchId, watches.id))
      .where(eq(cart.userId, userId));

    if (cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        error: { message: 'Cart is empty' }
      });
    }

    const total = cartItems.reduce((sum, item) => 
      sum + (parseFloat(item.price) * item.quantity), 0
    );

    const [newOrder] = await db
      .insert(orders)
      .values({
        userId,
        total: total.toString(),
        shippingAddress,
        paymentMethod,
        status: 'pending',
        paymentStatus: 'pending'
      })
      .returning();

    for (const item of cartItems) {
      await db.insert(orderItems).values({
        orderId: newOrder.id,
        watchId: item.watchId,
        quantity: item.quantity,
        price: item.price
      });
    }

    await db.delete(cart).where(eq(cart.userId, userId));

    res.status(201).json({
      success: true,
      data: newOrder
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to create order', details: error.message }
    });
  }
};

export const getOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const userOrders = await db
      .select()
      .from(orders)
      .where(eq(orders.userId, userId))
      .orderBy(desc(orders.createdAt))
      .limit(parseInt(limit))
      .offset(offset);

    res.json({
      success: true,
      data: userOrders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch orders', details: error.message }
    });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, parseInt(id)));

    if (!order) {
      return res.status(404).json({
        success: false,
        error: { message: 'Order not found' }
      });
    }

    if (order.userId !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: { message: 'Access denied' }
      });
    }

    const items = await db
      .select({
        id: orderItems.id,
        quantity: orderItems.quantity,
        price: orderItems.price,
        watch: watches
      })
      .from(orderItems)
      .leftJoin(watches, eq(orderItems.watchId, watches.id))
      .where(eq(orderItems.orderId, parseInt(id)));

    res.json({
      success: true,
      data: {
        ...order,
        items
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch order', details: error.message }
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, trackingNumber } = req.body;

    const [updated] = await db
      .update(orders)
      .set({ 
        status, 
        trackingNumber,
        updatedAt: new Date() 
      })
      .where(eq(orders.id, parseInt(id)))
      .returning();

    if (!updated) {
      return res.status(404).json({
        success: false,
        error: { message: 'Order not found' }
      });
    }

    res.json({
      success: true,
      data: updated
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Failed to update order', details: error.message }
    });
  }
};
