import express from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  updateShippingInfo,
  applyDiscount,
  removeDiscount,
} from '../controller/cart/cart.controller.js';
import verifyFirebaseToken from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', verifyFirebaseToken, getCart);
router.post('/', verifyFirebaseToken, addToCart);
router.put('/shipping', verifyFirebaseToken, updateShippingInfo); // <-- Đặt trước
router.put('/:id', verifyFirebaseToken, updateCartItem);
router.delete('/:id', verifyFirebaseToken, removeFromCart);
router.delete('/apply', verifyFirebaseToken, clearCart);
router.post('/apply', verifyFirebaseToken, applyDiscount);
router.delete('/apply', verifyFirebaseToken, removeDiscount);

export default router;
