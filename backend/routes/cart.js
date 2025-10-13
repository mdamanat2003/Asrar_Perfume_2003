const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Product = require('../models/Product');

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

// In-memory cart for demo (replace with DB in production)
const carts = {};

router.post('/', authMiddleware, async (req, res) => {
  const { productId } = req.body;
  if(!productId) return res.status(400).json({ message: 'Product required' });
  const product = await Product.findById(productId);
  if(!product) return res.status(404).json({ message: 'Product not found' });
  if(!carts[req.userId]) carts[req.userId] = [];
  carts[req.userId].push(productId);
  res.json({ message: 'Added to cart' });
});

// Decrement one instance of a product from cart
router.post('/decrement/:productId', authMiddleware, async (req, res) => {
  const pid = req.params.productId;
  if(!carts[req.userId] || carts[req.userId].length === 0) return res.status(400).json({ message: 'Cart empty' });
  const idx = carts[req.userId].indexOf(pid);
  if(idx === -1) return res.status(404).json({ message: 'Product not in cart' });
  carts[req.userId].splice(idx, 1);
  res.json({ message: 'Decremented' });
});

// Remove item from cart
router.delete('/:productId', authMiddleware, async (req, res) => {
  const pid = req.params.productId;
  if (!carts[req.userId]) return res.status(400).json({ message: 'Cart empty' });
  carts[req.userId] = carts[req.userId].filter(id => id.toString() !== pid);
  res.json({ message: 'Removed from cart' });
});

// GET /api/cart - get current user's cart with product details
router.get('/', authMiddleware, async (req, res) => {
  const userCart = carts[req.userId] || [];
  // Get product details for each productId
  const products = await Product.find({ _id: { $in: userCart } });
  // Count qty for each productId
  const qtyMap = {};
  userCart.forEach(pid => {
    qtyMap[pid] = (qtyMap[pid] || 0) + 1;
  });
  // Attach qty to each product
  const cartItems = products.map(p => ({
    product: p._id,
    name: p.name,
    price: p.price,
    image: p.image,
    qty: qtyMap[p._id.toString()] || 1
  }));
  res.json(cartItems);
});

module.exports = router;
