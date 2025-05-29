import React, { useEffect, useState } from "react";
import { productService } from "../services/apiService";

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  // Load products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getProducts();
      setProducts(data);
    } catch (error) {
      setError("Failed to load products");
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort products
  const filteredProducts = products
    .filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "name":
        default:
          return a.name.localeCompare(b.name);
      }
    });

  // Get unique categories for filter
  const categories = [...new Set(products.map((product) => product.category))];

  const handleOrderClick = (product) => {
    // Placeholder for order functionality
    alert(
      `Order functionality will be implemented soon!\nProduct: ${product.name}\nPrice: $${product.price}`
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-4">{error}</div>
          <button
            onClick={fetchProducts}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <button
            onClick={() => setSelectedCategory("all")}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "0.5rem",
              fontSize: "0.8rem",
              fontWeight: "500",
              transition: "all 0.3s ease",
              color: "black",
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === "all"
                ? "bg-gray-900 text-white"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            All categories
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "0.5rem",
                fontSize: "0.8rem",
                fontWeight: "500",
                transition: "all 0.3s ease",
                color: "black",
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors capitalize ${
                selectedCategory === category
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Controls Row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <div
            style={{
              fontSize: "0.8rem",
              color: "#666",
            }}
          >
            Showing {filteredProducts.length} of {products.length}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            {/* Search */}
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
            />

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
            >
              <option value="name">Sort by</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">No products found</div>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="mt-4 text-green-600 hover:text-green-800"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="bg-white border border-gray-200">
            <div
              style={{
                gridTemplateColumns: "repeat(2, 1fr)",
                display: "grid",
                gap: "1rem",
                padding: "1rem",
              }}
            >
              {filteredProducts.map((product) => {
                return (
                  <div
                    key={product._id}
                    style={{
                      padding: "1rem",
                      border: "1px solid #e0e0e0",
                      borderRadius: "0.5rem",
                      position: "relative",
                      backgroundColor: "#f9fafb",
                    }}
                  >
                    {/* Product Image */}
                    <div className="aspect-square bg-gray-100 flex items-center justify-center mb-4 p-4">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="text-gray-400 text-sm font-medium">
                          noimage
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="text-center">
                      <h3 className="font-medium text-gray-900 mb-2 uppercase tracking-wide text-sm">
                        {product.name}
                      </h3>

                      <p className="text-gray-600 text-xs mb-3 line-height-relaxed">
                        {product.description}
                      </p>

                      {/* Price */}
                      <div className="flex items-center justify-center gap-2 mb-4">
                        <span className="font-bold text-lg">
                          ${product.price}
                        </span>
                      </div>

                      {/* Stock Status */}
                      {product.stock === 0 ? (
                        <button className="text-red-600 text-sm font-medium mb-2 cursor-not-allowed">
                          Out of stock
                        </button>
                      ) : (
                        <button onClick={() => handleOrderClick(product)}>
                          Add to Cart
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
