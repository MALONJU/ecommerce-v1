import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const validationSchema = Yup.object({
  email: Yup.string().email('Email invalide').required('Email requis'),
  password: Yup.string().required('Mot de passe requis'),
});

const LoginForm = () => {
  const [apiError, setApiError] = useState('');
  const navigate = useNavigate();

  const initialValues = { email: '', password: '' };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setApiError('');
      const response = await axios.post('http://localhost:3000/api/auth/login', values);

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));
        navigate('/products'); // Redirection vers la page profil après connexion
      }
    } catch (error) {
      setApiError(
        error.response?.data?.message ||
        'Erreur lors de la connexion. Veuillez réessayer.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-5" style={{ maxWidth: '600px', margin: '0 auto', padding: '0 20px' }}>
      <div className="card shadow border-0">
        <div className="card-body p-4">
          <h2 className="text-center mb-4">Se connecter</h2>
          {apiError && <div className="alert alert-danger">{apiError}</div>}
          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
            {({ errors, touched, isSubmitting }) => (
              <Form>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <Field id="email" name="email" type="email" className={`form-control ${errors.email && touched.email ? 'is-invalid' : ''}`} />
                  {errors.email && touched.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>
                <div className="mb-4">
                  <label htmlFor="password" className="form-label">Mot de passe</label>
                  <Field id="password" name="password" type="password" className={`form-control ${errors.password && touched.password ? 'is-invalid' : ''}`} />
                  {errors.password && touched.password && <div className="invalid-feedback">{errors.password}</div>}
                </div>
                <button type="submit" className="btn btn-primary w-100 py-2" disabled={isSubmitting}>
                  {isSubmitting ? 'Connexion...' : 'Se connecter'}
                </button>
                <p className="text-center mt-3">
                  Pas encore de compte ? <Link to="/register" className="text-decoration-none">Créer un compte</Link>
                </p>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;