import { useState } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, ZoomIn } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const CartSidebar = ({ isOpen, onClose }) => {
  const { cart, updateQuantity, removeFromCart, clearCart, cartTotal } = useCart();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const handleCheckout = async () => {
    if (!user) {
      toast.error('Please login to place an order');
      navigate('/login');
      onClose();
      return;
    }

    if (!address.trim()) {
      toast.error('Please enter a delivery address');
      return;
    }

    setLoading(true);
    try {
      const orderItems = cart.map(item => ({
        menu_item_id: item.id,
        quantity: item.quantity
      }));

      await axios.post(
        'http://localhost:5000/api/orders',
        { items: orderItems, delivery_address: address },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Order placed successfully!');
      clearCart();
      setAddress('');
      onClose();
      navigate('/orders');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityInput = (itemId, value) => {
    const num = parseInt(value);
    if (value === '') {
      updateQuantity(itemId, 1);
      return;
    }
    if (!isNaN(num) && num >= 0) {
      updateQuantity(itemId, num);
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={onClose} />
      )}

      <div className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white dark:bg-gray-900 shadow-2xl z-50 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="h-6 w-6 text-orange-500" />
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Your Cart</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
              <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <ShoppingBag className="h-16 w-16 mb-4" />
                <p className="text-lg font-medium">Your cart is empty</p>
                <p className="text-sm">Add some delicious food!</p>
              </div>
            ) : (
              cart.map(item => {
                const itemPrice = Number(item.price) || 0;
                const itemTotal = itemPrice * item.quantity;
                
                return (
                  <div key={item.id} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                    <div className="flex items-start space-x-3">
                      {/* Clickable image for preview */}
                      <div className="relative group cursor-pointer" onClick={() => setPreviewImage(item.image_url)}>
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg"
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/80?text=Food'; }}
                        />
                        <div className="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <ZoomIn className="h-5 w-5 text-white" />
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-800 dark:text-white text-sm truncate">{item.name}</h4>
                        <p className="text-orange-500 font-bold">${itemPrice.toFixed(2)}</p>
                        
                        {/* Quantity with editable input */}
                        <div className="flex items-center space-x-2 mt-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-red-100 dark:hover:bg-red-900 flex items-center justify-center transition-colors"
                          >
                            <Minus className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                          </button>
                          
                          {/* Editable quantity field */}
                          <input
                            type="number"
                            min="1"
                            max="9999"
                            value={item.quantity}
                            onChange={(e) => handleQuantityInput(item.id, e.target.value)}
                            className="w-16 h-8 text-center font-bold text-sm border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-orange-500 bg-white dark:bg-gray-700 dark:text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                          
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 rounded-lg bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center transition-colors"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end space-y-2">
                        <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600 p-1">
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <p className="font-bold text-gray-800 dark:text-white text-sm">
                          ${itemTotal.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {cart.length > 0 && (
            <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-4">
              <div className="flex justify-between items-center text-lg font-bold">
                <span className="dark:text-white">Total:</span>
                <span className="text-orange-500">${Number(cartTotal).toFixed(2)}</span>
              </div>

              <textarea
                placeholder="Enter delivery address..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-3 bg-gray-50 dark:bg-gray-800 dark:text-white border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-orange-500 resize-none text-sm h-20"
                rows="2"
              />

              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50"
              >
                {loading ? 'Placing Order...' : 'Place Order'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-lg w-full">
            <button 
              onClick={() => setPreviewImage(null)}
              className="absolute -top-4 -right-4 bg-white dark:bg-gray-800 rounded-full p-2 shadow-xl z-10"
            >
              <X className="h-6 w-6 text-gray-800 dark:text-white" />
            </button>
            <img
              src={previewImage}
              alt="Food preview"
              className="w-full h-auto max-h-[80vh] object-contain rounded-2xl shadow-2xl"
              onError={(e) => { e.target.src = 'https://via.placeholder.com/500?text=No+Image'; }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default CartSidebar;