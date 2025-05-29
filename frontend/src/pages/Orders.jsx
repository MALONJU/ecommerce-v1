import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { orderService } from "../services/apiService";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getMyOrders();
      setOrders(data);
    } catch (error) {
      setError("Failed to load orders");
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      const confirmed = window.confirm(
        "Are you sure you want to cancel this order?"
      );
      if (!confirmed) return;

      await orderService.cancelOrder(orderId);
      // Refresh orders after cancelling
      fetchOrders();
      alert("Order cancelled successfully");
    } catch (error) {
      console.error("Error cancelling order:", error);
      alert("Failed to cancel order");
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "pending":
        return "badge bg-warning text-dark";
      case "processing":
        return "badge bg-info text-dark";
      case "shipped":
        return "badge bg-primary";
      case "delivered":
        return "badge bg-success";
      case "cancelled":
        return "badge bg-danger";
      default:
        return "badge bg-secondary";
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
            <p className="text-muted">Loading your orders...</p>
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
              onClick={fetchOrders}
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
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h2 mb-1">My Orders</h1>
          <p className="text-muted mb-0">View and manage your order history</p>
        </div>
        <div className="text-muted">
          <i className="bi bi-box-seam me-1"></i>
          {orders.length} order{orders.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-bag-x display-1 text-muted mb-3"></i>
          <h4 className="text-muted mb-3">No orders found</h4>
          <p className="text-muted mb-4">
            You haven't placed any orders yet.
          </p>
          <Link
            to="/shop"
            className="btn btn-primary"
          >
            <i className="bi bi-shop me-2"></i>
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="row">
          {orders.map((order) => (
            <div key={order._id} className="col-12 mb-4">
              <div className="card shadow-sm">
                {/* Order Header */}
                <div className="card-header bg-light">
                  <div className="row align-items-center">
                    <div className="col-md-6">
                      <h5 className="card-title mb-1">
                        <i className="bi bi-receipt me-2"></i>
                        Order #{order._id.slice(-8).toUpperCase()}
                      </h5>
                      <small className="text-muted">
                        <i className="bi bi-calendar3 me-1"></i>
                        Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </small>
                    </div>
                    <div className="col-md-6 text-md-end">
                      <div className="d-flex flex-column align-items-md-end">
                        <span className={getStatusBadgeClass(order.status)}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                        <h5 className="mb-0 mt-2">
                          <strong>€{order.totalAmount}</strong>
                        </h5>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="card-body">
                  <h6 className="card-subtitle mb-3 text-muted">
                    <i className="bi bi-box me-1"></i>
                    Order Items ({order.items.length})
                  </h6>
                  <div className="row">
                    {order.items
                      .filter(item => item.product)
                      .map((item, index) => (
                      <div key={index} className="col-md-6 col-lg-4 mb-3">
                        <ProductCard
                          product={item.product}
                          showOrderButton={false}
                          isOrderView={true}
                          quantity={item.quantity}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Footer */}
                <div className="card-footer bg-light">
                  <div className="row align-items-center">
                    <div className="col-md-8">
                      {order.shippingAddress && (
                        <div className="text-muted small">
                          <i className="bi bi-geo-alt me-1"></i>
                          Shipping to: {order.shippingAddress.address}, {order.shippingAddress.city}
                          {order.shippingAddress.postalCode && `, ${order.shippingAddress.postalCode}`}
                        </div>
                      )}
                    </div>
                    <div className="col-md-4 text-md-end">
                      {order.status === "pending" && (
                        <button
                          onClick={() => handleCancelOrder(order._id)}
                          className="btn btn-outline-danger btn-sm"
                        >
                          <i className="bi bi-x-circle me-1"></i>
                          Cancel Order
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
