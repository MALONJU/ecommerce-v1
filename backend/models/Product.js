const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    imageUrl: {
      type: String,
    },

    stock: {
      type: Number,
      default: 0,
    },

    category: {
      type: String,
      default: "general",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
