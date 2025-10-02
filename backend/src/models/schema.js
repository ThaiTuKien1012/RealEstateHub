import { pgTable, serial, varchar, text, integer, decimal, boolean, timestamp, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  role: varchar('role', { length: 20 }).notNull().default('customer'),
  phone: varchar('phone', { length: 20 }),
  avatar: text('avatar'),
  isVerified: boolean('is_verified').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const addresses = pgTable('addresses', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  addressLine1: varchar('address_line1', { length: 255 }).notNull(),
  addressLine2: varchar('address_line2', { length: 255 }),
  city: varchar('city', { length: 100 }).notNull(),
  state: varchar('state', { length: 100 }),
  country: varchar('country', { length: 100 }).notNull(),
  postalCode: varchar('postal_code', { length: 20 }).notNull(),
  isDefault: boolean('is_default').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

export const watches = pgTable('watches', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  brand: varchar('brand', { length: 100 }).notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  description: text('description'),
  images: jsonb('images').default([]),
  category: varchar('category', { length: 100 }),
  movement: varchar('movement', { length: 50 }),
  caseMaterial: varchar('case_material', { length: 100 }),
  caseDiameter: integer('case_diameter'),
  strapMaterial: varchar('strap_material', { length: 100 }),
  waterResistance: integer('water_resistance'),
  color: varchar('color', { length: 50 }),
  stock: integer('stock').default(0),
  isFeatured: boolean('is_featured').default(false),
  isBestSeller: boolean('is_best_seller').default(false),
  storeId: integer('store_id'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const reviews = pgTable('reviews', {
  id: serial('id').primaryKey(),
  watchId: integer('watch_id').references(() => watches.id).notNull(),
  userId: integer('user_id').references(() => users.id).notNull(),
  rating: integer('rating').notNull(),
  comment: text('comment'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const cart = pgTable('cart', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  watchId: integer('watch_id').references(() => watches.id).notNull(),
  quantity: integer('quantity').default(1),
  variantId: integer('variant_id'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  total: decimal('total', { precision: 10, scale: 2 }).notNull(),
  status: varchar('status', { length: 50 }).default('pending'),
  shippingAddress: jsonb('shipping_address'),
  paymentMethod: varchar('payment_method', { length: 50 }),
  paymentStatus: varchar('payment_status', { length: 50 }).default('pending'),
  trackingNumber: varchar('tracking_number', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const orderItems = pgTable('order_items', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id').references(() => orders.id).notNull(),
  watchId: integer('watch_id').references(() => watches.id).notNull(),
  quantity: integer('quantity').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const wishlist = pgTable('wishlist', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  watchId: integer('watch_id').references(() => watches.id).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const stores = pgTable('stores', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  ownerId: integer('owner_id').references(() => users.id).notNull(),
  logo: text('logo'),
  address: text('address'),
  phone: varchar('phone', { length: 20 }),
  email: varchar('email', { length: 255 }),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

export const supportTickets = pgTable('support_tickets', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  subject: varchar('subject', { length: 255 }).notNull(),
  message: text('message').notNull(),
  status: varchar('status', { length: 50 }).default('open'),
  priority: varchar('priority', { length: 20 }).default('medium'),
  assignedTo: integer('assigned_to').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const chatMessages = pgTable('chat_messages', {
  id: serial('id').primaryKey(),
  ticketId: integer('ticket_id').references(() => supportTickets.id).notNull(),
  senderId: integer('sender_id').references(() => users.id).notNull(),
  message: text('message').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  addresses: many(addresses),
  reviews: many(reviews),
  cart: many(cart),
  orders: many(orders),
  wishlist: many(wishlist),
  stores: many(stores),
  supportTickets: many(supportTickets),
  chatMessages: many(chatMessages),
}));

export const watchesRelations = relations(watches, ({ many }) => ({
  reviews: many(reviews),
  cartItems: many(cart),
  orderItems: many(orderItems),
  wishlistItems: many(wishlist),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  items: many(orderItems),
}));
