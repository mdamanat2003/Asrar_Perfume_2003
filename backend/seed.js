// Simple seed runner that inserts sample products using the Product model directly.
const mongoose = require('mongoose');
const Product = require('./models/Product');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/asrar_perfume';

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
    
mongoose.connect(MONGODB_URI).then(async () => {
  console.log('Connected for seeding');
  await Product.deleteMany({});
  await Product.insertMany(sample);
  console.log('Seeded products');
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});