# E-Commerce Application v1

A full-stack e-commerce application built with React and Node.js, featuring user authentication, product management, order processing, and an admin dashboard.

## 🚀 Features

### User Features
- **Authentication**: User registration, login, and logout with JWT tokens
- **Product Browsing**: View products with filtering by category and search functionality
- **Order Management**: Place orders, view order history, and track order status
- **Responsive Design**: Mobile-friendly interface with modern UI

### Admin Features
- **Admin Dashboard**: Overview of system statistics and metrics
- **Product Management**: Create, edit, and delete products
- **Order Management**: View all orders, update order status, and track order history
- **User Management**: View, edit, delete users, and manage user roles

### Security Features
- **Role-based Access Control**: Different permissions for users and admins
- **JWT Authentication**: Secure token-based authentication
- **Protected Routes**: Frontend and backend route protection
- **Password Hashing**: Secure password storage using bcrypt

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern JavaScript library for building user interfaces
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API requests
- **Formik & Yup** - Form handling and validation
- **Vite** - Fast build tool and development server
- **Bootstrap Icons** - Icon library for UI elements

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JSON Web Token (JWT)** - Authentication tokens
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

## 📁 Project Structure

```
ecommerce-v1/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── contexts/        # React context providers
│   │   ├── pages/           # Main application pages
│   │   ├── services/        # API service functions
│   │   ├── utils/           # Utility functions and configurations
│   │   └── App.jsx          # Main application component
│   ├── package.json
│   └── vite.config.js
├── backend/                  # Node.js backend API
│   ├── controllers/         # Request handlers
│   ├── middleware/          # Custom middleware functions
│   ├── models/              # Database models
│   ├── routes/              # API route definitions
│   ├── utils/               # Utility functions
│   ├── seeds/               # Database seeding scripts
│   ├── config/              # Configuration files
│   ├── package.json
│   └── index.js             # Server entry point
└── README.md
```

## 🏃‍♂️ Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ecommerce-v1
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Create environment file**
   Create a `.env` file in the backend directory:
   ```env
   MONGO_URI=mongodb://localhost:27017/ecommerce
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   ```

4. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
   The backend server will run on `http://localhost:5000`

2. **Start the Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend application will run on `http://localhost:5173`

3. **Seed the Database (Optional)**
   ```bash
   cd backend
   npm run seed
   ```
   This will populate the database with sample products.

## 🎯 How It Works

### Authentication Flow
1. Users register with name, email, and password
2. Passwords are hashed using bcrypt before storage
3. Login generates JWT access and refresh tokens
4. Tokens are stored in localStorage with expiration handling
5. Protected routes verify token validity
6. Automatic token refresh on expiration

### Product Management
1. Admins can create, edit, and delete products
2. Products have name, description, price, image, stock, and category
3. Stock levels are automatically updated when orders are placed
4. Users can browse products with category filtering

### Order Processing
1. Users add products to orders with specified quantities
2. Stock availability is verified before order creation
3. Orders track items, quantities, total amount, and shipping info
4. Order status progression: pending → processing → shipped → delivered
5. Admins can update order status and add comments
6. Order history is maintained for tracking changes

### Admin Dashboard
1. Role-based access control restricts admin features
2. Admins can manage users (view, edit, delete, change roles)
3. Order management with status updates and filtering
4. Product inventory management

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh-token` - Refresh access token
- `GET /api/auth/me` - Get current user info

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get all orders (Admin)
- `GET /api/orders/myorders` - Get user's orders
- `GET /api/orders/:id` - Get order by ID
- `PUT /api/orders/:id/status` - Update order status (Admin)
- `DELETE /api/orders/:id` - Cancel order

### Users (Admin)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `PUT /api/users/:id/role` - Update user role

## 🔐 Security Considerations

- JWT tokens for secure authentication
- Password hashing with bcrypt
- Role-based access control
- CORS configuration for cross-origin requests
- Input validation and sanitization
- Protected API routes with middleware

## 🎨 Frontend Features

### Components
- **Navbar**: Navigation with role-based menu items
- **ProtectedRoute**: Route protection with role verification
- **ProductModal**: Product creation and editing
- **OrderStatusModal**: Order status management
- **UserManagement**: Admin user management interface

### Pages
- **Shop**: Product browsing with category filtering
- **Orders**: User order history and management
- **Products**: Product management for admins
- **AdminDashboard**: System overview and statistics
- **AdminOrders**: Order management interface
- **UserManagementPage**: User administration

## 🚀 Production Build

### Frontend
```bash
cd frontend
npm run build
```

### Backend
```bash
cd backend
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## 📞 Support

For support or questions, please open an issue in the repository.

---

Built with ❤️ using React and Node.js