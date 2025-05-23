import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand navbar-light bg-light mb-4">
      <div className="container">
        <Link className="navbar-brand" to="/">Ecommerce</Link>
        <div>
          <Link className="nav-link d-inline" to="/products">Produits</Link>
          <Link className="nav-link d-inline" to="/cart">Panier</Link>
          <Link className="nav-link d-inline" to="/orders">Commandes</Link>
          <Link className="nav-link d-inline" to="/profile">Profil</Link>
          <Link className="nav-link d-inline" to="/admin">Admin</Link>
          <Link className="nav-link d-inline" to="/login">Connexion</Link>
        </div>
      </div>
    </nav>
  );
}