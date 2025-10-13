const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');
const { authenticate, isAdmin } = require('../middleware/authMiddleware');

// Get all products for admin
router.get('/products', authenticate, isAdmin, async (req,res)=>{
  try {
    const products = await Product.find({});
    res.json(products);
  } catch(err){ res.status(500).json({ message: err.message }); }
});

// Get all orders
router.get('/orders', authenticate, isAdmin, async (req,res)=>{
  try {
    const orders = await Order.find({}).populate('user','name email').populate('items.product','name image');
    res.json(orders);
  } catch(err){ res.status(500).json({ message: err.message }); }
});

// Update order status and add tracking entry
router.put('/order/:id/status', authenticate, isAdmin, async (req,res)=>{
  try {
    const order = await Order.findById(req.params.id);
    if(!order) return res.status(404).json({ message: 'Order not found' });
    const { status, note } = req.body;
    order.status = status || order.status;
    if(!order.tracking) order.tracking = [];
    order.tracking.push({ status, note: note || '', at: new Date() });
    await order.save();
    res.json(order);
  } catch(err){ res.status(500).json({ message: err.message }); }
});

module.exports = router;
