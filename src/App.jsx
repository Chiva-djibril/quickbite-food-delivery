import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { SettingsProvider } from './context/SettingsContext';
import ProtectedRoute from './components/ProtectedRoute';
import SettingsButton from './components/SettingsButton';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Menu from './pages/Menu';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import Checkout from './pages/Checkout';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import CustomerNavbar from './components/CustomerNavbar';

function CustomerLayout({ children }) {
  return (
    <>
      <CustomerNavbar />
      {children}
    </>
  );
}

function App() {
  return (
    <SettingsProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
            <Toaster position="top-right" />
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/admin/login" element={<AdminLogin />} />

              <Route path="/dashboard" element={
                <ProtectedRoute role="customer">
                  <CustomerLayout><Dashboard /></CustomerLayout>
                </ProtectedRoute>
              } />
              <Route path="/menu" element={
                <ProtectedRoute role="customer">
                  <CustomerLayout><Menu /></CustomerLayout>
                </ProtectedRoute>
              } />
              <Route path="/orders" element={
                <ProtectedRoute role="customer">
                  <CustomerLayout><Orders /></CustomerLayout>
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute role="customer">
                  <CustomerLayout><Profile /></CustomerLayout>
                </ProtectedRoute>
              } />
              <Route path="/checkout" element={
                <ProtectedRoute role="customer">
                  <CustomerLayout><Checkout /></CustomerLayout>
                </ProtectedRoute>
              } />

              <Route path="/admin/dashboard" element={
                <ProtectedRoute role="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } />
            </Routes>
            <SettingsButton />
          </Router>
        </CartProvider>
      </AuthProvider>
    </SettingsProvider>
  );
}

export default App;