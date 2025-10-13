const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Product = require('../models/Product');
const JWT_SECRET = process.env.JWT_SECRET || 'verysecretkey';

function auth(req, res, next) {
  const header = req.headers.authorization;
  if(!header) return res.status(401).json({ message: 'No token' });
  const token = header.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch(err){ res.status(401).json({ message: 'Invalid token' }); }
}

router.get('/', auth, async (req,res) => {
  const user = await User.findById(req.userId).populate('wishlist');
  res.json(user.wishlist || []);
});

router.post('/:productId', auth, async (req,res) => {
  const user = await User.findById(req.userId);
  const pid = req.params.productId;
  if(!user.wishlist.includes(pid)){
    user.wishlist.push(pid);
    await user.save();
  }
  res.json({ message: 'Added to wishlist' });
});

router.delete('/:productId', auth, async (req,res) => {
  const user = await User.findById(req.userId);
  const pid = req.params.productId;
  user.wishlist = user.wishlist.filter(id => id.toString() !== pid);
  await user.save();
  res.json({ message: 'Removed from wishlist' });
});

module.exports = router;
