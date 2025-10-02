import { db } from '../config/database.js';
import { watches, reviews } from '../models/schema.js';
import { eq, like, and, gte, lte, desc, sql } from 'drizzle-orm';

export const getAllWatches = async (req, res) => {
  try {
    const {
      search = '',
      brand = '',
      category = '',
      minPrice = 0,
      maxPrice = 1000000,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      isFeatured,
      isBestSeller
    } = req.query;

    const conditions = [];
    
    if (search) {
      conditions.push(like(watches.name, `%${search}%`));
    }
    if (brand) {
      conditions.push(eq(watches.brand, brand));
    }
    if (category) {
      conditions.push(eq(watches.category, category));
    }
    if (minPrice) {
      conditions.push(gte(watches.price, minPrice));
    }
    if (maxPrice) {
      conditions.push(lte(watches.price, maxPrice));
    }
    if (isFeatured !== undefined) {
      conditions.push(eq(watches.isFeatured, isFeatured === 'true'));
    }
    if (isBestSeller !== undefined) {
      conditions.push(eq(watches.isBestSeller, isBestSeller === 'true'));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    
    const allWatches = await db
      .select()
      .from(watches)
      .where(whereClause)
      .limit(parseInt(limit))
      .offset(offset)
      .orderBy(sortOrder === 'desc' ? desc(watches[sortBy]) : watches[sortBy]);

    const [{ count }] = await db
      .select({ count: sql`count(*)` })
      .from(watches)
      .where(whereClause);

    res.json({
      success: true,
      data: allWatches,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(count),
        totalPages: Math.ceil(parseInt(count) / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get watches error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch watches', details: error.message }
    });
  }
};

export const getWatchById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [watch] = await db.select().from(watches).where(eq(watches.id, parseInt(id)));

    if (!watch) {
      return res.status(404).json({
        success: false,
        error: { message: 'Watch not found' }
      });
    }

    const watchReviews = await db.select().from(reviews).where(eq(reviews.watchId, parseInt(id)));

    res.json({
      success: true,
      data: {
        ...watch,
        reviews: watchReviews
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch watch', details: error.message }
    });
  }
};

export const createWatch = async (req, res) => {
  try {
    const watchData = req.body;

    const [newWatch] = await db.insert(watches).values(watchData).returning();

    res.status(201).json({
      success: true,
      data: newWatch
    });
  } catch (error) {
    console.error('Create watch error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to create watch', details: error.message }
    });
  }
};

export const updateWatch = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const [updatedWatch] = await db
      .update(watches)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(watches.id, parseInt(id)))
      .returning();

    if (!updatedWatch) {
      return res.status(404).json({
        success: false,
        error: { message: 'Watch not found' }
      });
    }

    res.json({
      success: true,
      data: updatedWatch
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Failed to update watch', details: error.message }
    });
  }
};

export const deleteWatch = async (req, res) => {
  try {
    const { id } = req.params;

    await db.delete(watches).where(eq(watches.id, parseInt(id)));

    res.json({
      success: true,
      message: 'Watch deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Failed to delete watch', details: error.message }
    });
  }
};

export const searchWatches = async (req, res) => {
  try {
    const { q = '', brand, category, minPrice, maxPrice } = req.query;

    const conditions = [like(watches.name, `%${q}%`)];
    
    if (brand) conditions.push(eq(watches.brand, brand));
    if (category) conditions.push(eq(watches.category, category));
    if (minPrice) conditions.push(gte(watches.price, minPrice));
    if (maxPrice) conditions.push(lte(watches.price, maxPrice));

    const results = await db
      .select()
      .from(watches)
      .where(and(...conditions))
      .limit(20);

    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Search failed', details: error.message }
    });
  }
};

export const getFeaturedWatches = async (req, res) => {
  try {
    const featured = await db
      .select()
      .from(watches)
      .where(eq(watches.isFeatured, true))
      .limit(10);

    res.json({
      success: true,
      data: featured
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch featured watches', details: error.message }
    });
  }
};

export const getBestSellers = async (req, res) => {
  try {
    const bestSellers = await db
      .select()
      .from(watches)
      .where(eq(watches.isBestSeller, true))
      .limit(10);

    res.json({
      success: true,
      data: bestSellers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch best sellers', details: error.message }
    });
  }
};
