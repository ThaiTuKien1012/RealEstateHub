import express from 'express';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import * as authController from '../controllers/authController.js';
import * as watchesController from '../controllers/watchesController.js';
import * as cartController from '../controllers/cartController.js';
import * as ordersController from '../controllers/ordersController.js';
import * as wishlistController from '../controllers/wishlistController.js';
import * as usersController from '../controllers/usersController.js';

const router = express.Router();

router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.post('/auth/logout', authenticate, authController.logout);
router.get('/auth/me', authenticate, authController.getMe);

router.get('/watches', watchesController.getAllWatches);
router.get('/watches/search', watchesController.searchWatches);
router.get('/watches/featured', watchesController.getFeaturedWatches);
router.get('/watches/best-sellers', watchesController.getBestSellers);
router.get('/watches/:id', watchesController.getWatchById);
router.post('/watches', authenticate, requireAdmin, watchesController.createWatch);
router.put('/watches/:id', authenticate, requireAdmin, watchesController.updateWatch);
router.delete('/watches/:id', authenticate, requireAdmin, watchesController.deleteWatch);

router.get('/cart', authenticate, cartController.getCart);
router.post('/cart', authenticate, cartController.addToCart);
router.put('/cart/:id', authenticate, cartController.updateCartItem);
router.delete('/cart/:id', authenticate, cartController.removeFromCart);
router.delete('/cart', authenticate, cartController.clearCart);

router.get('/orders', authenticate, ordersController.getOrders);
router.post('/orders', authenticate, ordersController.createOrder);
router.get('/orders/:id', authenticate, ordersController.getOrderById);
router.put('/orders/:id/status', authenticate, requireAdmin, ordersController.updateOrderStatus);

router.get('/wishlist', authenticate, wishlistController.getWishlist);
router.post('/wishlist', authenticate, wishlistController.addToWishlist);
router.delete('/wishlist/:id', authenticate, wishlistController.removeFromWishlist);

router.get('/users', authenticate, requireAdmin, usersController.getAllUsers);
router.get('/users/:id', authenticate, requireAdmin, usersController.getUserById);
router.post('/users', authenticate, requireAdmin, usersController.createUser);
router.put('/users/:id', authenticate, requireAdmin, usersController.updateUser);
router.delete('/users/:id', authenticate, requireAdmin, usersController.deleteUser);

export default router;
