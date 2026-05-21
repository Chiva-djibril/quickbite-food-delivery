import { useState } from 'react';
import { Plus, Star, ZoomIn, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const MenuCard = ({ item }) => {
  const { addToCart } = useCart();
  const price = Number(item.price) || 0;
  const [showPreview, setShowPreview] = useState(false);

  const handleAdd = () => {
    addToCart(item);
    toast.success(`${item.name} added! 🛒`);
  };

  return (
    <>
      <div className="card group hover:shadow-xl dark:hover:shadow-orange-500/10 transition-all duration-300">
        {/* Clickable image with zoom preview */}
        <div 
          className="relative overflow-hidden h-48 cursor-pointer"
          onClick={() => setShowPreview(true)}
        >
          <img
            src={item.image_url}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400';
            }}
          />
          {/* Zoom overlay on hover */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full">
              <ZoomIn className="h-6 w-6 text-white" />
            </div>
          </div>
          
          {item.category && (
            <div className="absolute top-3 right-3 bg-white dark:bg-gray-800 rounded-full px-2 py-1 text-xs font-semibold text-orange-500 shadow">
              {item.category}
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-gray-800 dark:text-white text-lg leading-tight">{item.name}</h3>
            <div className="flex items-center space-x-1 text-yellow-400">
              <Star className="h-4 w-4 fill-current" />
              <span className="text-xs text-gray-500 dark:text-gray-400">4.5</span>
            </div>
          </div>

          <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-2">{item.description}</p>

          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-orange-500">
              ${price.toFixed(2)}
            </span>
            <button
              onClick={handleAdd}
              className="flex items-center space-x-1 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full transition-colors duration-200 font-semibold text-sm"
            >
              <Plus className="h-4 w-4" />
              <span>Add</span>
            </button>
          </div>
        </div>
      </div>

      {/* Full Image Preview Modal */}
      {showPreview && (
        <div 
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
          onClick={() => setShowPreview(false)}
        >
          <div className="relative max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => setShowPreview(false)}
              className="absolute -top-4 -right-4 bg-white dark:bg-gray-800 rounded-full p-2 shadow-xl z-10 hover:bg-gray-100"
            >
              <X className="h-6 w-6 text-gray-800 dark:text-white" />
            </button>
            <img
              src={item.image_url}
              alt={item.name}
              className="w-full h-auto max-h-[70vh] object-contain rounded-2xl shadow-2xl"
              onError={(e) => { e.target.src = 'https://via.placeholder.com/600?text=No+Image'; }}
            />
            <div className="mt-4 text-center text-white">
              <h3 className="text-2xl font-bold">{item.name}</h3>
              <p className="text-gray-300 mt-1">{item.description}</p>
              <p className="text-orange-400 text-xl font-bold mt-2">${price.toFixed(2)}</p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAdd();
                  setShowPreview(false);
                }}
                className="mt-4 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-full transition-all"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MenuCard;