import { useEffect, useState } from "react";
import axios from "axios";
import ProductModal from "../components/ProductModal";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  // Charger les produits
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await axios.get("http://localhost:3000/api/products");
    setProducts(res.data);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:3000/api/products/${id}`);
    fetchProducts();
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    setShowModal(true);
  };

  const handleCreate = () => {
    setEditProduct(null);
    setShowModal(true);
  };

  return (
    <div className="container py-4">
      <h2>Liste des produits</h2>
      <button className="btn btn-primary mb-3" onClick={handleCreate}>
        Ajouter un produit
      </button>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Prix</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((prod) => (
            <tr key={prod._id}>
              <td>{prod.name}</td>
              <td>{prod.price} €</td>
              <td>{prod.description}</td>
              <td>
                <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(prod)}>
                  Modifier
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(prod._id)}>
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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