const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Product = require('../models/Product');
const User = require('../models/User');
const JWT_SECRET = process.env.JWT_SECRET || 'verysecretkey';

function auth(req,res,next){
  const header = req.headers.authorization;
  if(!header) return res.status(401).json({ message: 'No token' });
  const token = header.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch(err){ res.status(401).json({ message: 'Invalid token' }); }
}

router.post('/:productId', auth, async (req,res) => {
  const { rating, comment } = req.body;
  const p = await Product.findById(req.params.productId);
  if(!p) return res.status(404).json({ message: 'Product not found' });
  const user = await User.findById(req.userId);
  p.reviews.push({ user: user._id, name: user.name, rating, comment });
  // recalc rating
  p.rating = p.reviews.reduce((s,r)=>s+r.rating,0) / p.reviews.length;
  await p.save();
  res.json({ message: 'Review added' });
});

module.exports = router;
