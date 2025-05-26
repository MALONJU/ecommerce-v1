import { useState } from "react";
import axios from "axios";

export default function ProductModal({ product, onClose, onRefresh }) {
  const [form, setForm] = useState({
    name: product?.name || "",
    price: product?.price || "",
    description: product?.description || "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (product) {
      await axios.put(`http://localhost:3000/api/products/${product._id}`, form);
    } else {
      await axios.post("http://localhost:3000/api/products", form);
    }
    onRefresh();
    onClose();
  };

  return (
    <div className="modal show d-block" tabIndex="-1">
      <div className="modal-dialog">
        <form className="modal-content" onSubmit={handleSubmit}>
          <div className="modal-header">
            <h5 className="modal-title">{product ? "Modifier" : "Créer"} un produit</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label">Nom</label>
              <input type="text" className="form-control" name="name" value={form.name} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Prix</label>
              <input type="number" className="form-control" name="price" value={form.price} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea className="form-control" name="description" value={form.description} onChange={handleChange} />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Annuler</button>
            <button type="submit" className="btn btn-primary">{product ? "Modifier" : "Créer"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}