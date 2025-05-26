import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/login" element={<LoginForm />} />
          {/* Ajoute d'autres routes ici */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;