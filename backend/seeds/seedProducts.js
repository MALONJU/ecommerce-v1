const mongoose = require("mongoose");
const Product = require("../models/Product");
require("dotenv").config({ path: "../.env" });

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected for seeding");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

const sampleProducts = [
  {
    name: "Wireless Headphones",
    description:
      "High-quality wireless headphones with noise cancellation and 20-hour battery life.",
    price: 79.99,
    imageUrl:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    stock: 25,
    category: "electronics",
  },
  {
    name: "Smartphone Case",
    description:
      "Durable protective case for smartphones with anti-drop technology.",
    price: 19.99,
    imageUrl:
      "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&h=400&fit=crop",
    stock: 50,
    category: "accessories",
  },
  {
    name: "Bluetooth Speaker",
    description:
      "Portable Bluetooth speaker with crystal-clear sound and waterproof design.",
    price: 45.99,
    imageUrl:
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop",
    stock: 15,
    category: "electronics",
  },
  {
    name: "Coffee Mug",
    description:
      "Premium ceramic coffee mug with temperature retention technology.",
    price: 12.99,
    imageUrl:
      "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=400&fit=crop",
    stock: 100,
    category: "kitchen",
  },
  {
    name: "Yoga Mat",
    description:
      "Eco-friendly yoga mat with excellent grip and cushioning for all types of exercise.",
    price: 29.99,
    imageUrl:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop",
    stock: 30,
    category: "fitness",
  },
  {
    name: "Desk Lamp",
    description:
      "Modern LED desk lamp with adjustable brightness and USB charging port.",
    price: 34.99,
    imageUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    stock: 20,
    category: "furniture",
  },
  {
    name: "Running Shoes",
    description:
      "Lightweight running shoes with advanced cushioning and breathable mesh upper.",
    price: 89.99,
    imageUrl:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
    stock: 0, // Out of stock example
    category: "footwear",
  },
  {
    name: "Backpack",
    description:
      "Durable travel backpack with multiple compartments and laptop sleeve.",
    price: 59.99,
    imageUrl:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
    stock: 18,
    category: "accessories",
  },
  {
    name: "Water Bottle",
    description:
      "Stainless steel water bottle that keeps drinks cold for 24 hours or hot for 12 hours.",
    price: 24.99,
    imageUrl:
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop",
    stock: 75,
    category: "kitchen",
  },
  {
    name: "Wireless Mouse",
    description:
      "Ergonomic wireless mouse with precision tracking and long battery life.",
    price: 22.99,
    imageUrl:
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop",
    stock: 40,
    category: "electronics",
  },
];

const seedProducts = async () => {
  try {
    await connectDB();

    // Clear existing products
    console.log("Clearing existing products...");
    await Product.deleteMany({});

    // Insert sample products
    console.log("Inserting sample products...");
    const products = await Product.insertMany(sampleProducts);

    console.log(`✅ Successfully seeded ${products.length} products!`);
    console.log(
      "Sample products:",
      products.map((p) => ({
        name: p.name,
        price: p.price,
        category: p.category,
      }))
    );
  } catch (error) {
    console.error("❌ Error seeding products:", error);
  } finally {
    mongoose.connection.close();
    console.log("Database connection closed");
  }
};

// Run the seed function if this file is executed directly
if (require.main === module) {
  seedProducts();
}

module.exports = { seedProducts, sampleProducts };
