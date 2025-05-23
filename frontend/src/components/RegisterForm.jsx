import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useState } from 'react';

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
});

const RegisterForm = () => {
  const [apiError, setApiError] = useState('');

  const initialValues = {
    firstName: '',
    email: '',
    password: '',
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      setApiError('');
      
      // Adapter les données pour correspondre à l'attente du backend
      const userData = {
        name: values.firstName, // Conversion de firstName en name pour le backend
        email: values.email,
        password: values.password,
      };

      // Appel à l'API
      const response = await axios.post('http://localhost:3000/api/auth/register', userData);

      // Stocker le token dans le localStorage
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));
      }

      // Réinitialiser le formulaire en cas de succès
      resetForm();

      // Rediriger vers la page d'accueil ou le dashboard
      // Note: Vous devrez implémenter la redirection avec react-router-dom
      console.log('Inscription réussie:', response.data);
      
      // Vous pouvez ajouter ici un message de succès ou une redirection
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      setApiError(
        error.response?.data?.message || 
        'Une erreur est survenue lors de l\'inscription. Veuillez réessayer.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="py-5"
      style={{
        maxWidth: '600px',
        margin: '0 auto',
        padding: '0 20px',
      }}
    >
      <div className="card shadow border-0">
        <div className="card-body p-4">
          <h2 className="text-center mb-4">Créer un compte</h2>

          {apiError && (
            <div className="alert alert-danger" role="alert">
              {apiError}
            </div>
          )}

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form>
                {/* Prénom */}
                <div className="mb-3">
                  <label htmlFor="firstName" className="form-label">Prénom</label>
                  <Field
                    id="firstName"
                    name="firstName"
                    type="text"
                    className={`form-control ${errors.firstName && touched.firstName ? 'is-invalid' : ''}`}
                    placeholder="Votre prénom"
                  />
                  {errors.firstName && touched.firstName && (
                    <div className="invalid-feedback">{errors.firstName}</div>
                  )}
                </div>

                {/* Email */}
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <Field
                    id="email"
                    name="email"
                    type="email"
                    className={`form-control ${errors.email && touched.email ? 'is-invalid' : ''}`}
                    placeholder="votre@email.com"
                  />
                  {errors.email && touched.email && (
                    <div className="invalid-feedback">{errors.email}</div>
                  )}
                </div>

                {/* Mot de passe */}
                <div className="mb-4">
                  <label htmlFor="password" className="form-label">Mot de passe</label>
                  <Field
                    id="password"
                    name="password"
                    type="password"
                    className={`form-control ${errors.password && touched.password ? 'is-invalid' : ''}`}
                    placeholder="Minimum 8 caractères"
                  />
                  {errors.password && touched.password && (
                    <div className="invalid-feedback">{errors.password}</div>
                  )}
                </div>

                {/* Bouton */}
                <button 
                  type="submit" 
                  className="btn btn-primary w-100 py-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Création en cours...' : 'Créer un compte'}
                </button>

                {/* Lien vers connexion */}
                <p className="text-center mt-3">
                  Vous avez déjà un compte ? <a href="#" className="text-decoration-none">Se connecter</a>
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
