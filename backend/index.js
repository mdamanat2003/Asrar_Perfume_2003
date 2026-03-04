const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// Routes (CommonJS modules)
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const wishlistRoutes = require('./routes/wishlist');
const reviewRoutes = require('./routes/reviews');
const adminRoutes = require('./routes/admin');
const cartRoutes = require('./routes/cart');
const paymentRoutes = require('./routes/payment');

const { authenticate, isAdmin } = require('./middleware/authMiddleware');

require('dotenv').config();

const app = express();

app.use(cors({
  origin: "https://frontend-oweyg57zt-md-amanat-ullahs-projects.vercel.app",
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

const MONGO = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/asrar_perfume';
mongoose.connect(MONGO)
  .then(()=> console.log('MongoDB connected'))
  .catch(err=> console.error('Mongo connect error', err));

app.get('/', (req,res)=> res.json({message:'API is running'}));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/payment', paymentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));
