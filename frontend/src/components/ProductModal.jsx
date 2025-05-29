import { useState } from "react";
import { productService } from "../services/apiService.js";

export default function ProductModal({ product, onClose, onRefresh }) {
  const [form, setForm] = useState({
    name: product?.name || "",
    price: product?.price || "",
    description: product?.description || "",
    imageUrl: product?.imageUrl || "",
    stock: product?.stock || 0,
    category: product?.category || "general",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setForm({
      ...form,
      [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // Validate required fields
      if (!form.name.trim()) {
        throw new Error("Product name is required");
      }
      if (!form.price || form.price <= 0) {
        throw new Error("Product price must be greater than 0");
      }
      if (form.stock < 0) {
        throw new Error("Stock cannot be negative");
      }

      const productData = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock)
      };

      if (product) {
        // Update existing product
        await productService.updateProduct(product._id, productData);
      } else {
        // Create new product
        await productService.createProduct(productData);
      }

      onRefresh();
      onClose();
    } catch (error) {
      console.error("Error saving product:", error);
      setError(
        error.message ||
        error.data?.message ||
        "An error occurred while saving the product."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className={`bi ${product ? 'bi-pencil' : 'bi-plus-circle'} me-2`}></i>
              {product ? "Edit Product" : "Create Product"}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              disabled={isSubmitting}
            ></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {error && (
                <div className="alert alert-danger d-flex align-items-center">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {error}
                </div>
              )}

              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                      <i className="bi bi-tag me-1"></i>
                      Product Name *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting}
                      placeholder="Enter product name"
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mb-3">
                    <label htmlFor="category" className="form-label">
                      <i className="bi bi-collection me-1"></i>
                      Category
                    </label>
                    <select
                      className="form-control"
                      id="category"
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      disabled={isSubmitting}
                    >
                      <option value="general">General</option>
                      <option value="electronics">Electronics</option>
                      <option value="accessories">Accessories</option>
                      <option value="kitchen">Kitchen</option>
                      <option value="fitness">Fitness</option>
                      <option value="furniture">Furniture</option>
                      <option value="footwear">Footwear</option>
                      <option value="clothing">Clothing</option>
                      <option value="books">Books</option>
                      <option value="toys">Toys</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label htmlFor="price" className="form-label">
                      <i className="bi bi-currency-dollar me-1"></i>
                      Price *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      className="form-control"
                      id="price"
                      name="price"
                      value={form.price}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting}
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mb-3">
                    <label htmlFor="stock" className="form-label">
                      <i className="bi bi-box me-1"></i>
                      Stock Quantity
                    </label>
                    <input
                      type="number"
                      min="0"
                      className="form-control"
                      id="stock"
                      name="stock"
                      value={form.stock}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="imageUrl" className="form-label">
                  <i className="bi bi-image me-1"></i>
                  Image URL
                </label>
                <input
                  type="url"
                  className="form-control"
                  id="imageUrl"
                  name="imageUrl"
                  value={form.imageUrl}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  placeholder="https://example.com/image.jpg"
                />
                {form.imageUrl && (
                  <div className="mt-2">
                    <small className="text-muted">Preview:</small>
                    <div className="mt-1">
                      <img
                        src={form.imageUrl}
                        alt="Preview"
                        className="img-thumbnail"
                        style={{ maxWidth: '150px', maxHeight: '150px', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="description" className="form-label">
                  <i className="bi bi-text-paragraph me-1"></i>
                  Description
                </label>
                <textarea
                  className="form-control"
                  id="description"
                  name="description"
                  rows="4"
                  value={form.description}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  placeholder="Enter product description..."
                ></textarea>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={isSubmitting}
              >
                <i className="bi bi-x-circle me-1"></i>
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="spinner-border spinner-border-sm me-2" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    {product ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>
                    <i className={`bi ${product ? 'bi-check-circle' : 'bi-plus-circle'} me-1`}></i>
                    {product ? "Update Product" : "Create Product"}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}