import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, LogOut, Menu, X, Home, Package, UtensilsCrossed, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import CartSidebar from './CartSidebar';
import Logo from './Logo';

const CustomerNavbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/menu', label: 'Menu', icon: UtensilsCrossed },
    { path: '/orders', label: 'My Orders', icon: Package },
  ];

  return (
    <>
      <nav className="bg-white dark:bg-black shadow-md sticky top-0 z-40 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/dashboard">
              <Logo size={40} showText={true} textSize="text-xl" />
            </Link>

            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map(link => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      isActive(link.path)
                        ? 'bg-black text-white dark:bg-white dark:text-black'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-gray-600 dark:text-white hover:text-black dark:hover:text-gray-300"
              >
                <ShoppingCart className="h-6 w-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-black dark:bg-white text-white dark:text-black text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </button>

              <div className="hidden md:flex items-center space-x-3 border-l border-gray-200 dark:border-gray-800 pl-4">
                <Link to="/profile" className="flex items-center space-x-2 hover:opacity-80 transition-opacity" title="My Profile">
                  {user?.profile_picture ? (
                    <img 
                      src={user.profile_picture} 
                      alt={user.fullname}
                      className="w-9 h-9 rounded-full object-cover border-2 border-black dark:border-white"
                      onError={(e) => { 
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-9 h-9 bg-black dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center font-bold">
                      {user?.fullname?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="font-semibold text-gray-700 dark:text-white text-sm">{user?.fullname?.split(' ')[0]}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-red-500 hover:text-red-700 font-medium"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-gray-600 dark:text-white"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 py-4 px-4 space-y-2">
            {navLinks.map(link => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium ${
                    isActive(link.path) ? 'bg-black text-white dark:bg-white dark:text-black' : 'text-gray-600 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
            <Link to="/profile" onClick={() => setIsMenuOpen(false)}
              className="flex items-center space-x-2 px-4 py-3 rounded-lg font-medium text-gray-600 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900">
              <User className="h-5 w-5" />
              <span>My Profile</span>
            </Link>
            <div className="border-t border-gray-200 dark:border-gray-800 pt-3 mt-3">
              <div className="flex items-center space-x-3 px-4 py-2">
                {user?.profile_picture ? (
                  <img src={user.profile_picture} alt="" className="w-9 h-9 rounded-full object-cover border-2 border-black dark:border-white" />
                ) : (
                  <div className="w-9 h-9 bg-black dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center font-bold">
                    {user?.fullname?.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="font-semibold text-gray-700 dark:text-white">{user?.fullname}</span>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-2 px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg font-medium"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default CustomerNavbar;