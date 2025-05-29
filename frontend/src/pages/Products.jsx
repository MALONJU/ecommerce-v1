import { useEffect, useState } from "react";
import ProductModal from "../components/ProductModal";
import { productService } from "../services/apiService";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load products
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

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await productService.deleteProduct(id);
        fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product");
      }
    }
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    setShowModal(true);
  };

  const handleCreate = () => {
    setEditProduct(null);
    setShowModal(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return { text: 'Out of Stock', class: 'badge bg-danger' };
    if (stock < 10) return { text: `Low Stock (${stock})`, class: 'badge bg-warning text-dark' };
    return { text: `In Stock (${stock})`, class: 'badge bg-success' };
  };

  if (loading) {
    return (
      <div className="container py-4">
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-4">
        <div className="alert alert-danger" role="alert">
          {error}
          <button className="btn btn-outline-danger ms-2" onClick={fetchProducts}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Product Management</h2>
        <button className="btn btn-primary" onClick={handleCreate}>
          <i className="bi bi-plus-circle me-2"></i>
          Add Product
        </button>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-box-seam display-1 text-muted"></i>
          <h4 className="mt-3 text-muted">No products found</h4>
          <p className="text-muted">Get started by adding your first product.</p>
          <button className="btn btn-primary" onClick={handleCreate}>
            Add Product
          </button>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th style={{ width: '80px' }}>Image</th>
                <th>Name</th>
                <th>Price</th>
                <th>Category</th>
                <th>Stock</th>
                <th>Description</th>
                <th>Updated</th>
                <th style={{ width: '150px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((prod) => {
                const stockStatus = getStockStatus(prod.stock);
                return (
                  <tr key={prod._id}>
                    <td>
                      <div
                        className="bg-light rounded d-flex align-items-center justify-content-center"
                        style={{ width: '60px', height: '60px' }}
                      >
                        {prod.imageUrl ? (
                          <img
                            src={prod.imageUrl}
                            alt={prod.name}
                            className="img-fluid rounded"
                            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <i className="bi bi-image text-muted"></i>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="fw-semibold">{prod.name}</div>
                    </td>
                    <td>
                      <span className="fw-bold">${prod.price}</span>
                    </td>
                    <td>
                      <span className="badge bg-secondary">{prod.category || 'general'}</span>
                    </td>
                    <td>
                      <span className={stockStatus.class}>{stockStatus.text}</span>
                    </td>
                    <td>
                      <div
                        className="text-truncate"
                        style={{ maxWidth: '200px' }}
                        title={prod.description}
                      >
                        {prod.description}
                      </div>
                    </td>
                    <td>
                      <small className="text-muted">
                        {prod.updatedAt ? formatDate(prod.updatedAt) : 'N/A'}
                      </small>
                    </td>
                    <td>
                      <div className="btn-group" role="group">
                        <button
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => handleEdit(prod)}
                          title="Edit product"
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleDelete(prod._id)}
                          title="Delete product"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Summary Statistics */}
      <div className="row mt-4">
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title text-primary">{products.length}</h5>
              <p className="card-text text-muted">Total Products</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title text-success">
                {products.filter(p => p.stock > 0).length}
              </h5>
              <p className="card-text text-muted">In Stock</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title text-warning">
                {products.filter(p => p.stock > 0 && p.stock < 10).length}
              </h5>
              <p className="card-text text-muted">Low Stock</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title text-danger">
                {products.filter(p => p.stock === 0).length}
              </h5>
              <p className="card-text text-muted">Out of Stock</p>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <ProductModal
          product={editProduct}
          onClose={() => setShowModal(false)}
          onRefresh={fetchProducts}
        />
      )}
    </div>
  );
}
