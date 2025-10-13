const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const { authenticate } = require('../middleware/authMiddleware');
const { getOrderById , getAllOrders } = require('../controllers/orderController');

const JWT_SECRET = process.env.JWT_SECRET || 'verysecretkey';

function authMiddleware(req, res, next){
  const header = req.headers.authorization;
  if(!header) return res.status(401).json({ message: 'No token' });
  const token = header.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch(err) {
    res.status(401).json({ message: 'Token invalid' });
  }
}


// Get single order by ID (with items.product populated)
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("items.product", "name");
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Attach product name to each item (for frontend compatibility)
    const items = order.items.map(i => ({
      ...i.toObject(),
      name: i.name || (i.product && i.product.name) || ""
    }));
    const orderObj = order.toObject();
    orderObj.items = items;

    res.json(orderObj);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, totalPrice } = req.body;
    if(!items || items.length === 0) return res.status(400).json({ message: 'Cart is empty' });
    const user = await User.findById(req.userId);
    if(!user) return res.status(401).json({ message: 'Invalid user' });

    // reduce stock (best-effort)
    for(const it of items){
      await Product.findByIdAndUpdate(it.product, { $inc: { countInStock: -it.qty } });
    }

    const isPaid = paymentMethod === 'Online' ? true : false;
    const order = new Order({ user: req.userId, items, shippingAddress, paymentMethod, totalPrice, isPaid, status: isPaid ? 'Paid' : 'Pending' });
    await order.save();
    res.json({ message: 'Order created', orderId: order._id });
  } catch(err) {
    console.error(err); res.status(500).json({ message: 'Server error' });
  }
});

// Get all orders for the logged-in user
router.get('/', authenticate, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch(err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;