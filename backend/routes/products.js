const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET all products
router.get('/', async (req, res) => {
  try {
    const q = req.query.q;
    let filter = {};
    if(q) filter = { name: { $regex: q, $options: 'i' } };
    const products = await Product.find(filter);
    res.json(products);
  } catch(err){ console.error(err); res.status(500).json({ message: 'Server error' }); }
});

// GET single product
router.get('/:id', async (req, res) => {
  try {
    const p = await Product.findById(req.params.id);
    if(!p) return res.status(404).json({ message: 'Product not found' });
    res.json(p);
  } catch(err){ console.error(err); res.status(500).json({ message: 'Server error' }); }
});

// SEED - create sample products
router.post('/seed', async (req, res) => {
  try {
    const sample = [
      { name: ' Oud Elegance', description: 'Rich oud with floral hints', price: 1200, image: 'https://res.cloudinary.com/defte4omf/image/upload/v1759056266/Gemini_Generated_Image_fhwbnnfhwbnnfhwb_unvamv.png', countInStock: 20 },
      { name: ' Rose Velvet', description: 'Soft rose and musk', price: 900, image: 'https://res.cloudinary.com/defte4omf/image/upload/v1759056266/Gemini_Generated_Image_eoneafeoneafeone_l1ol8p.png', countInStock: 15 },
      { name: ' Bloosom Breeze', description: 'Fresh citrus unisex', price: 700, image: 'https://res.cloudinary.com/defte4omf/image/upload/v1759056266/Gemini_Generated_Image_wv7lzowv7lzowv7l_vj3vfu.png', countInStock: 30 },
      { name: ' Citrus Breeze', description: 'Fresh citrus unisex', price: 700, image: 'https://res.cloudinary.com/defte4omf/image/upload/v1759242033/Gemini_Generated_Image_gj26cggj26cggj26_hupjbp.png', countInStock: 30 },
      { name: ' Belly Elegance', description: 'Rich oud with floral hints', price: 1200, image: 'https://res.cloudinary.com/defte4omf/image/upload/v1759242596/Gemini_Generated_Image_hidhpehidhpehidh_v3zpro.png', countInStock: 20 },
      { name: ' Rose Blossom', description: 'Soft rose fragrance for everyday use', price: 850, image: 'https://res.cloudinary.com/defte4omf/image/upload/v1759242596/Gemini_Generated_Image_kawufvkawufvkawu_iysq8b.png', countInStock: 25 },
      { name: ' Amber Nights', description: 'Warm amber scent for evenings', price: 950, image: 'https://res.cloudinary.com/defte4omf/image/upload/v1759242597/Gemini_Generated_Image_gfptzigfptzigfpt_vzqtjz.png', countInStock: 15 },
      { name: ' Vanilla Whisper', description: 'Sweet vanilla fragrance for casual wear', price: 780, image: 'https://res.cloudinary.com/defte4omf/image/upload/v1759312131/Gemini_Generated_Image_ml2eptml2eptml2e_rnqxwo.png', countInStock: 40 }

    ];
    await Product.deleteMany({});
    await Product.insertMany(sample);
    res.json({ message: 'Seeded' });
  } catch(err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
});

module.exports = router;