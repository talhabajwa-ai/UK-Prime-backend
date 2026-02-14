const Product = require('../models/Product');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
  try {
    const { category, search, available } = req.query;
    let query = {};

    if (category) {
      query.category = category.toLowerCase();
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    if (available !== undefined) {
      query.available = available === 'true';
    }

    const products = await Product.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create product
// @route   POST /api/products
// @access  Private (Admin only)
exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Admin only)
exports.updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Admin only)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get product categories
// @route   GET /api/products/categories
// @access  Public
exports.getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct('category');

    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Seed initial products (for demo purposes)
// @route   POST /api/products/seed
// @access  Public (should be protected in production)
exports.seedProducts = async (req, res) => {
  try {
    const sampleProducts = [
      // Pizzas
      {
        name: 'Margherita Classic',
        description: 'Classic Italian pizza with fresh mozzarella, tomatoes, and basil',
        category: 'pizza',
        price: 12.99,
        image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400',
        available: true
      },
      {
        name: 'Pepperoni Feast',
        description: 'Loaded with pepperoni slices and melted cheese',
        category: 'pizza',
        price: 14.99,
        image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400',
        available: true
      },
      {
        name: 'BBQ Chicken Pizza',
        description: 'Grilled chicken with BBQ sauce and onions',
        category: 'pizza',
        price: 16.99,
        image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=400',
        available: true
      },
      {
        name: 'Veggie Supreme',
        description: 'Loaded with fresh vegetables - peppers, mushrooms, olives, onions',
        category: 'pizza',
        price: 13.99,
        image: 'https://images.unsplash.com/photo-1511689660979-10d2b1aada49?w=400',
        available: true
      },
      // Burgers
      {
        name: 'Classic Cheeseburger',
        description: 'Juicy beef patty with cheddar cheese, lettuce, tomato, and special sauce',
        category: 'burger',
        price: 9.99,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
        available: true
      },
      {
        name: 'Bacon Deluxe Burger',
        description: 'Double beef patty with crispy bacon and cheese',
        category: 'burger',
        price: 12.99,
        image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400',
        available: true
      },
      {
        name: 'Veggie Burger',
        description: 'Plant-based patty with fresh vegetables and vegan mayo',
        category: 'burger',
        price: 10.99,
        image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=400',
        available: true
      },
      // Drinks
      {
        name: 'Coca Cola',
        description: '330ml can',
        category: 'drink',
        price: 1.99,
        image: 'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=400',
        available: true
      },
      {
        name: 'Fresh Orange Juice',
        description: '500ml freshly squeezed orange juice',
        category: 'drink',
        price: 3.49,
        image: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=400',
        available: true
      },
      {
        name: 'Iced Tea',
        description: '500ml refreshing iced tea',
        category: 'drink',
        price: 2.49,
        image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400',
        available: true
      },
      // Deals
      {
        name: 'Family Pizza Deal',
        description: '2 Large pizzas, 1.5L drink, and garlic bread',
        category: 'deal',
        price: 39.99,
        image: 'https://images.unsplash.com/photo-1594007654729-407eedc4be65?w=400',
        available: true
      },
      {
        name: 'Burger Combo Meal',
        description: 'Burger, fries, and drink',
        category: 'deal',
        price: 14.99,
        image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=400',
        available: true
      },
      // Sides
      {
        name: 'Garlic Bread',
        description: 'Crispy bread with garlic butter and herbs',
        category: 'side',
        price: 4.99,
        image: 'https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?w=400',
        available: true
      },
      {
        name: 'Loaded Fries',
        description: 'Fries with cheese, bacon, and sour cream',
        category: 'side',
        price: 6.99,
        image: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=400',
        available: true
      },
      // Desserts
      {
        name: 'Chocolate Lava Cake',
        description: 'Warm chocolate cake with molten center',
        category: 'dessert',
        price: 5.99,
        image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400',
        available: true
      },
      {
        name: 'Ice Cream Sundae',
        description: 'Vanilla ice cream with chocolate sauce and cherry',
        category: 'dessert',
        price: 4.49,
        image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400',
        available: true
      }
    ];

    // Clear existing products
    await Product.deleteMany({});

    // Insert new products
    const products = await Product.insertMany(sampleProducts);

    res.status(201).json({
      success: true,
      count: products.length,
      message: 'Products seeded successfully',
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
