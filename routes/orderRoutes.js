const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrder,
  getOrders,
  updateOrderStatus,
  cancelOrder,
  getOrderStats
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

// Customer routes
router.post('/', protect, createOrder);
router.get('/myorders', protect, authorize('customer'), getMyOrders);
router.get('/:id', protect, getOrder);
router.put('/:id/cancel', protect, authorize('customer'), cancelOrder);

// Admin/Staff routes
router.get('/', protect, authorize('admin', 'staff'), getOrders);
router.put('/:id/status', protect, authorize('admin', 'staff'), updateOrderStatus);
router.get('/stats/all', protect, authorize('admin'), getOrderStats);

module.exports = router;
