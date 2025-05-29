import { useState } from "react";
import { productService } from "../services/apiService.js";

export default function ProductModal({ product, onClose, onRefresh }) {
  const [form, setForm] = useState({
    name: product?.name || "",
    price: product?.price || "",
    description: product?.description || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      if (product) {
        // Update existing product
        await productService.updateProduct(product._id, form);
      } else {
        // Create new product
        await productService.createProduct(form);
      }

      onRefresh();
      onClose();
    } catch (error) {
      console.error("Error saving product:", error);
      setError(
        error.message ||
        error.data?.message ||
        "Une erreur est survenue lors de la sauvegarde du produit."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal show d-block" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {product ? "Modifier le produit" : "Créer un produit"}
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
              {error && <div className="alert alert-danger">{error}</div>}

              <div className="mb-3">
                <label htmlFor="name" className="form-label">Nom</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="price" className="form-label">Prix</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-control"
                  id="price"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="description" className="form-label">Description</label>
                <textarea
                  className="form-control"
                  id="description"
                  name="description"
                  rows="3"
                  value={form.description}
                  onChange={handleChange}
                  disabled={isSubmitting}
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
                Annuler
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? (product ? "Mise à jour..." : "Création...")
                  : (product ? "Mettre à jour" : "Créer")
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}