import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

const validationSchema = Yup.object({
  firstName: Yup.string()
    .required('Le prénom est requis')
    .min(2, 'Minimum 2 caractères'),
  email: Yup.string()
    .email('Email invalide')
    .required('Email requis'),
  password: Yup.string()
    .required('Mot de passe requis')
    .min(8, 'Au moins 8 caractères'),
  role: Yup.string()
    .required('Le rôle est requis')
    .oneOf(['user', 'admin'], 'Le rôle doit être soit "user" soit "admin"'),
});

const RegisterForm = () => {
  const [apiError, setApiError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const initialValues = {
    firstName: '',
    email: '',
    password: '',
    role: 'user', // Default to user role
    rememberMe: false,
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      setApiError('');

      const userData = {
        name: values.firstName,
        email: values.email,
        password: values.password,
        role: values.role, // Include role in userData
      };

      // Use AuthContext register method to properly update auth state
      await register(userData, values.rememberMe);

      // Redirect to shop after successful registration
      navigate('/shop', { replace: true });

      resetForm();
      console.log('Inscription réussie');
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      setApiError(
        error.message ||
        error.data?.message ||
        'Une erreur est survenue lors de l\'inscription. Veuillez réessayer.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-5" style={{ maxWidth: '600px', margin: '0 auto', padding: '0 20px' }}>
      <div className="card shadow border-0">
        <div className="card-body p-4">
          <h2 className="text-center mb-4">Créer un compte</h2>
          {apiError && <div className="alert alert-danger">{apiError}</div>}
          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
            {({ errors, touched, isSubmitting }) => (
              <Form>
                <div className="mb-3">
                  <label htmlFor="firstName" className="form-label">Prénom</label>
                  <Field
                    id="firstName"
                    name="firstName"
                    type="text"
                    className={`form-control ${errors.firstName && touched.firstName ? 'is-invalid' : ''}`}
                  />
                  {errors.firstName && touched.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <Field
                    id="email"
                    name="email"
                    type="email"
                    className={`form-control ${errors.email && touched.email ? 'is-invalid' : ''}`}
                  />
                  {errors.email && touched.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Mot de passe</label>
                  <Field
                    id="password"
                    name="password"
                    type="password"
                    className={`form-control ${errors.password && touched.password ? 'is-invalid' : ''}`}
                  />
                  {errors.password && touched.password && <div className="invalid-feedback">{errors.password}</div>}
                </div>
                <div className="mb-3">
                  <label htmlFor="role" className="form-label">Rôle</label>
                  <Field
                    as="select"
                    id="role"
                    name="role"
                    className={`form-select ${errors.role && touched.role ? 'is-invalid' : ''}`}
                  >
                    <option value="user">Utilisateur</option>
                    <option value="admin">Administrateur</option>
                  </Field>
                  {errors.role && touched.role && <div className="invalid-feedback">{errors.role}</div>}
                  <div className="form-text">
                    Sélectionnez le rôle pour ce compte. Les administrateurs ont accès à toutes les fonctionnalités.
                  </div>
                </div>
                <div className="mb-4">
                  <div className="form-check">
                    <Field
                      id="rememberMe"
                      name="rememberMe"
                      type="checkbox"
                      className="form-check-input"
                    />
                    <label htmlFor="rememberMe" className="form-check-label">
                      Se souvenir de moi
                    </label>
                  </div>
                </div>
                <button type="submit" className="btn btn-primary w-100 py-2" disabled={isSubmitting}>
                  {isSubmitting ? 'Création du compte...' : 'Créer le compte'}
                </button>
                <p className="text-center mt-3">
                  Déjà un compte ? <Link to="/login" className="text-decoration-none">Se connecter</Link>
                </p>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;