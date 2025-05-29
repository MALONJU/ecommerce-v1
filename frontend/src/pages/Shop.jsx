import React, { useEffect, useState } from "react";
import { productService, orderService } from "../services/apiService";
import ProductCard from "../components/ProductCard";

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [orderLoading, setOrderLoading] = useState(false);

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

  const handleOrderClick = async (product) => {
    // Show confirmation dialog
    const confirmOrder = window.confirm(
      `Add "${product.name}" to your cart?\nPrice: €${product.price}\n\nThis will create an order for this item.`
    );

    if (!confirmOrder) return;

    try {
      setOrderLoading(true);

      // Create order with the selected product
      const orderData = {
        items: [
          {
            product: product._id,
            quantity: 1
          }
        ],
        totalAmount: product.price,
        shippingAddress: {
          address: "Default Address", // You can implement address selection later
          city: "Default City",
          postalCode: "12345",
          country: "US"
        }
      };

      await orderService.createOrder(orderData);

      alert(`Order created successfully!\nProduct: ${product.name}\nPrice: €${product.price}`);

      // Refresh products to update stock
      fetchProducts();

    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to create order. Please try again.');
    } finally {
      setOrderLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <div className="text-center">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-muted">Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <div className="text-center">
            <div className="alert alert-danger mb-3">{error}</div>
            <button
              onClick={fetchProducts}
              className="btn btn-primary"
            >
              Try Again
            </button>
          </div>
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
              borderRadius: "9999px",
              fontSize: "0.875rem",
              fontWeight: "500",
              transition: "all 0.3s ease",
              border: selectedCategory === "all" ? "none" : "1px solid var(--mongodb-gray-400)",
              backgroundColor: selectedCategory === "all" ? "var(--mongodb-gray-900)" : "white",
              color: selectedCategory === "all" ? "white" : "var(--mongodb-gray-700)",
              cursor: "pointer"
            }}
          >
            All categories
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "9999px",
                fontSize: "0.875rem",
                fontWeight: "500",
                transition: "all 0.3s ease",
                textTransform: "capitalize",
                border: selectedCategory === category ? "none" : "1px solid var(--mongodb-gray-400)",
                backgroundColor: selectedCategory === category ? "var(--mongodb-gray-900)" : "white",
                color: selectedCategory === category ? "white" : "var(--mongodb-gray-700)",
                cursor: "pointer"
              }}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Controls Row */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-600">
            Showing {filteredProducts.length} of {products.length}
          </div>

          <div className="flex items-center gap-4">
            {/* Search */}
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control text-sm"
              style={{ width: "200px" }}
            />

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="form-control text-sm"
              style={{ width: "180px" }}
            >
              <option value="name">Sort by</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Order Loading Indicator */}
        {orderLoading && (
          <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1055 }}>
            <div className="alert alert-success d-flex align-items-center">
              <div className="spinner-border spinner-border-sm me-2" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              Creating order...
            </div>
          </div>
        )}

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
            <div className="products-grid p-4">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onOrderClick={handleOrderClick}
                  showOrderButton={true}
                  isOrderView={false}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
