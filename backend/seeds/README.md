# Database Seeding

This directory contains scripts to populate the database with sample data.

## Running the Seeds

### Products Seed

To populate the database with sample products, run:

```bash
cd backend
npm run seed
```

This will:
1. Clear all existing products from the database
2. Insert 10 sample products with various categories
3. Include products with different stock levels (including one out-of-stock item)

### Sample Products Included

- **Electronics**: Wireless Headphones, Bluetooth Speaker, Wireless Mouse
- **Accessories**: Smartphone Case, Backpack
- **Kitchen**: Coffee Mug, Water Bottle
- **Fitness**: Yoga Mat
- **Furniture**: Desk Lamp
- **Footwear**: Running Shoes (out of stock)

All products include:
- Name and description
- Price
- Stock quantity
- Category
- Image URL (using Unsplash placeholder images)

## Environment Setup

Make sure your MongoDB connection is configured in your `.env` file or environment variables before running the seed script.

The script will use the `MONGODB_URI` environment variable or if not set, will fail.