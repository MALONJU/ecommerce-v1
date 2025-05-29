import React, { useState } from "react";
import { orderService } from "../services/apiService";

const OrderStatusModal = ({ order, isOpen, onClose, onOrderUpdated }) => {
  const [newStatus, setNewStatus] = useState(order?.status || "pending");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  // Available statuses (excluding cancelled as it's handled separately)
  const statusOptions = [
    { value: "pending", label: "Pending", color: "text-yellow-600" },
    { value: "processing", label: "Processing", color: "text-blue-600" },
    { value: "shipped", label: "Shipped", color: "text-purple-600" },
    { value: "delivered", label: "Delivered", color: "text-green-600" },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return {
          backgroundColor: "#fef9c3",
          color: "#854d0e"
        };
      case "processing":
        return {
          backgroundColor: "#dbeafe",
          color: "#1e40af"
        };
      case "shipped":
        return {
          backgroundColor: "#f3e8ff",
          color: "#6b21a8"
        };
      case "delivered":
        return {
          backgroundColor: "#dcfce7",
          color: "#166534"
        };
      case "cancelled":
        return {
          backgroundColor: "#fee2e2",
          color: "#991b1b"
        };
      default:
        return {
          backgroundColor: "#f3f4f6",
          color: "#1f2937"
        };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!order || newStatus === order.status) {
      alert("Please select a different status to update.");
      return;
    }

    try {
      setLoading(true);

      await orderService.updateOrderStatus(order._id, {
        status: newStatus,
        comment: comment || `Status updated to ${newStatus}`,
      });

      alert(`Order status updated to ${newStatus} successfully!`);
      onOrderUpdated(); // Refresh the orders list
      onClose(); // Close the modal

    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update order status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setNewStatus(order?.status || "pending");
    setComment("");
    onClose();
  };

  if (!isOpen || !order) return null;

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 50
    }}>
      <div style={{
        backgroundColor: "white",
        borderRadius: "0.5rem",
        boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
        maxWidth: "28rem",
        width: "100%",
        margin: "0 1rem"
      }}>
        {/* Modal Header */}
        <div style={{
          padding: "1rem 1.5rem",
          borderBottom: "1px solid #e5e7eb"
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}>
            <h3 style={{
              fontSize: "1.125rem",
              fontWeight: 600,
              color: "#111827"
            }}>
              Update Order Status
            </h3>
            <button
              onClick={handleClose}
              style={{
                color: "#9ca3af",
                transition: "color 0.2s"
              }}
              onMouseOver={(e) => e.currentTarget.style.color = "#4b5563"}
              onMouseOut={(e) => e.currentTarget.style.color = "#9ca3af"}
            >
              <svg style={{width: "1.5rem", height: "1.5rem"}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div style={{padding: "1rem 1.5rem"}}>
          {/* Order Info */}
          <div style={{
            marginBottom: "1rem",
            padding: "0.75rem",
            backgroundColor: "#f9fafb",
            borderRadius: "0.5rem"
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "0.5rem"
            }}>
              <span style={{
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "#111827"
              }}>
                Order #{order._id.slice(-8).toUpperCase()}
              </span>
              <span style={{
                fontSize: "0.875rem",
                color: "#4b5563"
              }}>
                ${order.totalAmount}
              </span>
            </div>
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}>
              <span style={{
                fontSize: "0.75rem",
                color: "#4b5563"
              }}>
                {new Date(order.createdAt).toLocaleDateString()}
              </span>
              <span style={{
                padding: "0.25rem 0.5rem",
                borderRadius: "9999px",
                fontSize: "0.75rem",
                fontWeight: 500,
                ...getStatusColor(order.status)
              }}>
                Current: {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
          </div>

          {/* Status Update Form */}
          <form onSubmit={handleSubmit}>
            <div style={{marginBottom: "1rem"}}>
              <label htmlFor="status" style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "#374151",
                marginBottom: "0.5rem"
              }}>
                New Status
              </label>
              <select
                id="status"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.5rem 0.75rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "0.5rem",
                  outline: "none"
                }}
                required
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div style={{marginBottom: "1.5rem"}}>
              <label htmlFor="comment" style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "#374151",
                marginBottom: "0.5rem"
              }}>
                Comment (Optional)
              </label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={`Status updated to ${newStatus}`}
                rows={3}
                style={{
                  width: "100%",
                  padding: "0.5rem 0.75rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "0.5rem",
                  resize: "none",
                  outline: "none"
                }}
              />
            </div>

            {/* Modal Footer */}
            <div style={{display: "flex", gap: "0.75rem"}}>
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: "0.5rem 1rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "0.5rem",
                  color: "#374151",
                  backgroundColor: "white",
                  transition: "background-color 0.2s"
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#f9fafb"}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = "white"}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || newStatus === order.status}
                style={{
                  flex: 1,
                  padding: "0.5rem 1rem",
                  borderRadius: "0.5rem",
                  fontWeight: 500,
                  backgroundColor: loading || newStatus === order.status ? "#d1d5db" : "#16a34a",
                  color: loading || newStatus === order.status ? "#6b7280" : "white",
                  cursor: loading || newStatus === order.status ? "not-allowed" : "pointer",
                  transition: "background-color 0.2s"
                }}
                onMouseOver={(e) => {
                  if (!loading && newStatus !== order.status) {
                    e.currentTarget.style.backgroundColor = "#15803d"
                  }
                }}
                onMouseOut={(e) => {
                  if (!loading && newStatus !== order.status) {
                    e.currentTarget.style.backgroundColor = "#16a34a"
                  }
                }}
              >
                {loading ? "Updating..." : "Update Status"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OrderStatusModal;