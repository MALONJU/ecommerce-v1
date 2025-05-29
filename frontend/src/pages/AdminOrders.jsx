import React, { useEffect, useState } from "react";
import OrderStatusModal from "../components/OrderStatusModal";
import ProductCard from "../components/ProductCard";
import { orderService } from "../services/apiService";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getOrders(); // Admin endpoint - gets all orders
      setOrders(data);
    } catch (error) {
      setError("Failed to load orders");
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const handleOrderUpdated = () => {
    fetchOrders(); // Refresh orders after update
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return {
          backgroundColor: "yellow",
          color: "black",
        };
      case "processing":
        return {
          backgroundColor: "blue",
          color: "black",
        };
      case "shipped":
        return {
          backgroundColor: "purple",
          color: "black",
        };
      case "delivered":
        return {
          backgroundColor: "green",
          color: "black",
        };
      case "cancelled":
        return {
          backgroundColor: "red",
          color: "black",
        };
      default:
        return {
          backgroundColor: "gray",
          color: "black",
        };
    }
  };

  // Filter orders based on status
  const filteredOrders = orders.filter((order) => {
    if (filterStatus === "all") return true;
    return order.status === filterStatus;
  });

  // Get unique statuses for filter
  const statuses = [...new Set(orders.map((order) => order.status))];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading orders...</p>
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
            onClick={fetchOrders}
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Order Management
          </h1>
          <p className="text-gray-600">Manage and update order statuses</p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium text-gray-700">
            Filter by status:
          </span>
          <button
            onClick={() => setFilterStatus("all")}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              filterStatus === "all"
                ? "bg-gray-900 text-white"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            All ({orders.length})
          </button>
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors capitalize ${
                filterStatus === status
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              {status} (
              {orders.filter((order) => order.status === status).length})
            </button>
          ))}
        </div>

        {/* Orders Summary */}
        <div className="mb-6 text-sm text-gray-600">
          Showing {filteredOrders.length} of {orders.length} orders
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              width: "100%",
              textAlign: "center",
              paddingTop: "12rem",
              paddingBottom: "12rem",
              paddingLeft: "1rem",
            }}
          >
            <div
              style={{
                color: "gray",
                fontSize: "1.2rem",
                marginBottom: "1rem",
              }}
            >
              {filterStatus === "all"
                ? "No orders found"
                : `No ${filterStatus} orders found`}
            </div>
            {filterStatus !== "all" && (
              <button
                onClick={() => setFilterStatus("all")}
                style={{
                  color: "green",
                  hover: {
                    color: "green",
                  },
                }}
              >
                Show all orders
              </button>
            )}
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                onClick={() => handleOrderClick(order)}
                style={{
                  backgroundColor: "white",
                  borderRadius: "1rem",
                  boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)",
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  hover: {
                    boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.2)",
                  },
                }}
              >
                {/* Order Header */}
                <div
                  style={{
                    paddingLeft: "1rem",
                    paddingRight: "1rem",
                    paddingTop: "1rem",
                    paddingBottom: "1rem",
                    backgroundColor: "lightgrey",
                    borderBottom: "1px solid #e0e0e0",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        marginBottom: "1rem",
                      }}
                    >
                      <h3
                        style={{
                          fontSize: "1.2rem",
                          fontWeight: "500",
                          color: "black",
                        }}
                      >
                        Order #{order._id.slice(-8).toUpperCase()}
                      </h3>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "1rem",
                        }}
                      >
                        <span>
                          Customer:{" "}
                          {order.user?.name || order.user?.email || "Unknown"}
                        </span>
                        <span>
                          Placed on{" "}
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                      }}
                    >
                      <span
                        style={{
                          ...getStatusColor(order.status),
                          padding: "0.5rem",
                          borderRadius: "0.5rem",
                          fontSize: "0.8rem",
                          fontWeight: "500",
                        }}
                      >
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </span>
                      <span
                        style={{
                          fontSize: "1rem",
                          fontWeight: "bold",
                          color: "black",
                        }}
                      >
                        ${order.totalAmount}
                      </span>
                      <div
                        style={{
                          fontSize: "0.8rem",
                          fontWeight: "500",
                          color: "black",
                        }}
                      >
                        Click to update →
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items Preview */}
                <div className="p-6">
                  <h4 className="text-md font-medium text-gray-900 mb-4">
                    Order Items ({order.items.length})
                  </h4>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(200px, 1fr))",
                      gap: "1rem",
                      maxHeight: "300px",
                      overflowY: "auto",
                    }}
                  >
                    {order.items.map((item, index) => (
                      <ProductCard
                        key={index}
                        product={item.product}
                        showOrderButton={false}
                        isOrderView={true}
                        quantity={item.quantity}
                      />
                    ))}
                  </div>
                </div>

                {/* Order Details */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between text-sm text-gray-600">
                    <div>
                      {order.shippingAddress && (
                        <span>
                          Shipping to: {order.shippingAddress.address},{" "}
                          {order.shippingAddress.city}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-2 md:mt-0">
                      <span>Payment: {order.paymentStatus || "Pending"}</span>
                      <span>Method: {order.paymentMethod || "Card"}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Order Status Modal */}
        <OrderStatusModal
          order={selectedOrder}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onOrderUpdated={handleOrderUpdated}
        />
      </div>
    </div>
  );
}
