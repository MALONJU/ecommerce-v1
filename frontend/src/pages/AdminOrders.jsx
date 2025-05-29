import React, { useEffect, useState } from "react";
import { orderService } from "../services/apiService";
import OrderStatusModal from "../components/OrderStatusModal";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getOrders();
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
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  const handleOrderUpdated = () => {
    fetchOrders(); // Refresh the orders list
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return {
          backgroundColor: "#f59e0b",
          color: "white",
        };
      case "processing":
        return {
          backgroundColor: "#3b82f6",
          color: "white",
        };
      case "shipped":
        return {
          backgroundColor: "#8b5cf6",
          color: "white",
        };
      case "delivered":
        return {
          backgroundColor: "#10b981",
          color: "white",
        };
      case "cancelled":
        return {
          backgroundColor: "#ef4444",
          color: "white",
        };
      default:
        return {
          backgroundColor: "#6b7280",
          color: "white",
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
        <div className="mb-6">
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
            style={{
              padding: "0.25rem 0.75rem",
              borderRadius: "9999px",
              fontSize: "0.75rem",
              fontWeight: "500",
              transition: "all 0.2s ease",
              border: filterStatus === "all" ? "none" : "1px solid var(--mongodb-gray-400)",
              backgroundColor: filterStatus === "all" ? "var(--mongodb-gray-900)" : "white",
              color: filterStatus === "all" ? "white" : "var(--mongodb-gray-700)",
              cursor: "pointer"
            }}
          >
            All ({orders.length})
          </button>
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              style={{
                padding: "0.25rem 0.75rem",
                borderRadius: "9999px",
                fontSize: "0.75rem",
                fontWeight: "500",
                transition: "all 0.2s ease",
                textTransform: "capitalize",
                border: filterStatus === status ? "none" : "1px solid var(--mongodb-gray-400)",
                backgroundColor: filterStatus === status ? "var(--mongodb-gray-900)" : "white",
                color: filterStatus === status ? "white" : "var(--mongodb-gray-700)",
                cursor: "pointer"
              }}
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
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-4">
              {filterStatus === "all"
                ? "No orders found"
                : `No ${filterStatus} orders found`}
            </div>
            {filterStatus !== "all" && (
              <button
                onClick={() => setFilterStatus("all")}
                className="text-green-600 hover:text-green-800"
              >
                Show all orders
              </button>
            )}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                onClick={() => handleOrderClick(order)}
                className="bg-white rounded-lg shadow-md overflow-hidden"
                style={{ cursor: "pointer", transition: "all 0.3s ease" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)";
                }}
              >
                {/* Order Header */}
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                  <div className="flex flex-col md:flex-row md:justify-between">
                    <div className="mb-2 md:mb-0">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Order #{order._id.slice(-8).toUpperCase()}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
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
                    <div className="flex items-center gap-3">
                      <span
                        style={{
                          padding: "0.5rem 1rem",
                          borderRadius: "0.5rem",
                          fontSize: "0.875rem",
                          fontWeight: "500",
                          textTransform: "capitalize",
                          ...getStatusColor(order.status),
                        }}
                      >
                        {order.status}
                      </span>
                      <span className="text-lg font-bold text-gray-900">
                        ${order.totalAmount}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Items Preview */}
                <div className="p-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">
                    Items ({order.items.length})
                  </h4>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1rem" }}>
                    {order.items.slice(0, 3).map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900">
                            {item.product?.name || "Product"}
                          </h5>
                          <p className="text-sm text-gray-600">
                            Qty: {item.quantity} × ${item.product?.price || 0}
                          </p>
                        </div>
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="text-sm text-gray-500 text-center p-3">
                        +{order.items.length - 3} more items
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between text-sm text-gray-600">
                    <div>
                      {order.shippingAddress && (
                        <span>
                          Shipping: {order.shippingAddress.address},{" "}
                          {order.shippingAddress.city}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-2 md:mt-0">
                      <span>Click to manage order</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Order Status Modal */}
      {showModal && selectedOrder && (
        <OrderStatusModal
          order={selectedOrder}
          isOpen={showModal}
          onClose={handleCloseModal}
          onOrderUpdated={handleOrderUpdated}
        />
      )}
    </div>
  );
}
