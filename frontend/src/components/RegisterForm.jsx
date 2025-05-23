import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Logo from './Logo';

const validationSchema = Yup.object({
  firstName: Yup.string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters'),
  companyLocation: Yup.string()
    .required('Company location is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  phoneNumber: Yup.string()
    .required('Phone number is required'),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters'),
  industry: Yup.string()
    .required('Industry is required'),
});

const RegisterForm = () => {
  const initialValues = {
    firstName: '',
    companyLocation: '',
    email: '',
    phoneNumber: '',
    password: '',
    industry: '',
    accountType: 'merchant',
  };

  const handleSubmit = (values, { setSubmitting }) => {
    console.log('Form submitted:', values);
    setSubmitting(false);
  };

  const testimonials = [
    {
      text: "This analytics platform is a game-changer! It's easy to use, provides valuable insights, and has helped me make smarter business decisions. I highly recommend it.",
      author: "Casey Bachmeyer",
      role: "Founder, Sisyphus Ventures"
    },
    // Add more testimonials here
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Section - Dark Theme */}
      <div className="hidden lg:flex lg:w-1/2 bg-mongodb-darkgreen p-12 flex-col justify-between">
        <div>
          <Logo className="h-8 w-8" />
        </div>

        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-white">
            Manage your Money<br />Anywhere
          </h1>
          <p className="text-mongodb-gray-400">
            View all the analytics and grow your business<br />from anywhere!
          </p>

          {/* Testimonials Carousel */}
          <div className="mt-12 space-y-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-black/20 p-6 rounded-xl">
                <p className="text-white text-sm mb-4">{testimonial.text}</p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-mongodb-gray-400"></div>
                  <div>
                    <p className="text-white font-medium">{testimonial.author}</p>
                    <p className="text-mongodb-gray-400 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2 mt-4">
            <div className="h-2 w-2 rounded-full bg-mongodb-green"></div>
            <div className="h-2 w-2 rounded-full bg-white/20"></div>
            <div className="h-2 w-2 rounded-full bg-white/20"></div>
          </div>
        </div>

        <div className="text-mongodb-gray-400 text-sm">
          © 2024 All rights reserved.
        </div>
      </div>

      {/* Right Section - Light Theme */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 bg-white">
        <div className="max-w-md w-full mx-auto">
          <h2 className="text-3xl font-bold text-mongodb-darkgreen mb-8">
            Create an account
          </h2>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, values, setFieldValue }) => (
              <Form className="space-y-6">
                {/* Account Type Toggle */}
                <div className="flex gap-3 mb-6">
                  <button
                    type="button"
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium ${
                      values.accountType === 'merchant'
                        ? 'bg-black text-white'
                        : 'bg-mongodb-gray-100 text-mongodb-gray-600'
                    }`}
                    onClick={() => setFieldValue('accountType', 'merchant')}
                  >
                    🏪 Merchant
                  </button>
                  <button
                    type="button"
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium ${
                      values.accountType === 'agent'
                        ? 'bg-black text-white'
                        : 'bg-mongodb-gray-100 text-mongodb-gray-600'
                    }`}
                    onClick={() => setFieldValue('accountType', 'agent')}
                  >
                    👤 Agent
                  </button>
                </div>

                <div>
                  <Field
                    name="firstName"
                    type="text"
                    placeholder="First Name"
                    className={`input-field ${errors.firstName && touched.firstName ? 'error-field' : ''}`}
                  />
                  {errors.firstName && touched.firstName && (
                    <div className="error-message">{errors.firstName}</div>
                  )}
                </div>

                <div>
                  <Field
                    as="select"
                    name="companyLocation"
                    className={`input-field ${errors.companyLocation && touched.companyLocation ? 'error-field' : ''}`}
                  >
                    <option value="">Where is your company based?</option>
                    <option value="us">United States</option>
                    <option value="uk">United Kingdom</option>
                    <option value="eu">European Union</option>
                    <option value="other">Other</option>
                  </Field>
                  {errors.companyLocation && touched.companyLocation && (
                    <div className="error-message">{errors.companyLocation}</div>
                  )}
                </div>

                <div>
                  <Field
                    name="email"
                    type="email"
                    placeholder="Business E-mail"
                    className={`input-field ${errors.email && touched.email ? 'error-field' : ''}`}
                  />
                  {errors.email && touched.email && (
                    <div className="error-message">{errors.email}</div>
                  )}
                </div>

                <div>
                  <Field
                    as="select"
                    name="industry"
                    className={`input-field ${errors.industry && touched.industry ? 'error-field' : ''}`}
                  >
                    <option value="">Please select an Industry</option>
                    <option value="retail">Retail</option>
                    <option value="technology">Technology</option>
                    <option value="finance">Finance</option>
                    <option value="healthcare">Healthcare</option>
                  </Field>
                  {errors.industry && touched.industry && (
                    <div className="error-message">{errors.industry}</div>
                  )}
                </div>

                <div>
                  <Field
                    name="phoneNumber"
                    type="tel"
                    placeholder="Phone number"
                    className={`input-field ${errors.phoneNumber && touched.phoneNumber ? 'error-field' : ''}`}
                  />
                  {errors.phoneNumber && touched.phoneNumber && (
                    <div className="error-message">{errors.phoneNumber}</div>
                  )}
                </div>

                <div>
                  <Field
                    name="password"
                    type="password"
                    placeholder="Password"
                    className={`input-field ${errors.password && touched.password ? 'error-field' : ''}`}
                  />
                  {errors.password && touched.password && (
                    <div className="error-message">{errors.password}</div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="privacy"
                    className="h-4 w-4 rounded border-mongodb-gray-300"
                  />
                  <label htmlFor="privacy" className="text-sm text-mongodb-gray-600">
                    I accept the <a href="#" className="text-mongodb-green hover:text-mongodb-darkgreen">Privacy Policy</a>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-[#FF4D00] text-white rounded-lg font-medium hover:bg-[#E64500] transition-colors"
                >
                  Create an Account
                </button>

                <p className="text-center text-sm text-mongodb-gray-600">
                  Already have an account?{' '}
                  <a href="#" className="text-mongodb-green hover:text-mongodb-darkgreen font-medium">
                    Log In
                  </a>
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