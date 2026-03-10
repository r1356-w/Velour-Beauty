const Product = require('./models/Product');
const mongoose = require('mongoose');

require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/velour')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    const products = await Product.find().limit(2);
    console.log('First product in MongoDB:');
    console.log(JSON.stringify(products[0], null, 2));
    
    process.exit(0);
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
