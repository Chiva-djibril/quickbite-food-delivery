import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Menu, X, UtensilsCrossed } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import CartSidebar from './CartSidebar';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const isHomePage = location.pathname === '/';

  //  Don't show customer navbar to admin users
  if (user?.role === 'admin') {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <nav className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <UtensilsCrossed className="h-8 w-8 text-orange-500" />
              <span className="text-xl font-bold text-gray-800">
                Quick<span className="text-orange-500">Bite</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-600 hover:text-orange-500 font-medium">Home</Link>
              <Link to="/menu" className="text-gray-600 hover:text-orange-500 font-medium">Menu</Link>
              {user && (
                <Link to="/orders" className="text-gray-600 hover:text-orange-500 font-medium">My Orders</Link>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-gray-600 hover:text-orange-500"
              >
                <ShoppingCart className="h-6 w-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </button>

              {!isHomePage && (
                <>
                  {user ? (
                    <div className="hidden md:flex items-center space-x-3">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <User className="h-5 w-5" />
                        <span className="font-medium">{user.fullname}</span>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-1 text-red-500 hover:text-red-700 font-medium"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  ) : (
                    <div className="hidden md:flex items-center space-x-3">
                      <Link to="/login" className="text-gray-600 hover:text-orange-500 font-medium">Login</Link>
                      <Link to="/register" className="btn-primary text-sm">Sign Up</Link>
                    </div>
                  )}
                </>
              )}

              {isHomePage && user && (
                <div className="hidden md:flex items-center space-x-3">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <User className="h-5 w-5" />
                    <span className="font-medium">{user.fullname}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 text-red-500 hover:text-red-700 font-medium"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-gray-600"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 py-4 px-4 space-y-3">
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="block text-gray-600 py-2">Home</Link>
            <Link to="/menu" onClick={() => setIsMenuOpen(false)} className="block text-gray-600 py-2">Menu</Link>
            {user && (
              <Link to="/orders" onClick={() => setIsMenuOpen(false)} className="block text-gray-600 py-2">My Orders</Link>
            )}
            
            {!isHomePage && (
              <>
                {user ? (
                  <button onClick={handleLogout} className="block w-full text-left text-red-500 py-2">Logout</button>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block text-gray-600 py-2">Login</Link>
                    <Link to="/register" onClick={() => setIsMenuOpen(false)} className="block btn-primary text-center">Sign Up</Link>
                  </>
                )}
              </>
            )}

            {isHomePage && user && (
              <button onClick={handleLogout} className="block w-full text-left text-red-500 py-2">Logout</button>
            )}
          </div>
        )}
      </nav>

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Navbar;