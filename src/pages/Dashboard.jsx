import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { 
  ShoppingBag, Package, Clock, TrendingUp, ArrowRight, 
  UtensilsCrossed, Sparkles, ChefHat, Star 
} from 'lucide-react';

const Dashboard = () => {
  const { user, token } = useAuth();
  const { cartCount } = useCart();
  const [orders, setOrders] = useState([]);
  const [popularItems, setPopularItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, menuRes] = await Promise.all([
          axios.get('http://localhost:5000/api/orders/my-orders', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('http://localhost:5000/api/menu')
        ]);
        setOrders(ordersRes.data);
        setPopularItems(menuRes.data.slice(0, 4));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const totalSpent = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
  const pendingCount = orders.filter(o => o.status === 'pending' || o.status === 'preparing').length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white ">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* WELCOME BANNER */}
      <section 
        className="relative overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(234,88,12,0.85), rgba(220,38,38,0.85)), url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="text-white">
              <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-3 py-1 mb-3">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-semibold">Welcome back!</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2 drop-shadow-2xl">
                Hi, {user?.fullname?.split(' ')[0]}! 
              </h1>
              <p className="text-orange-100 text-lg drop-shadow-lg">
                What would you like to order today?
              </p>
            </div>

            <div className="flex space-x-3">
              <Link to="/menu" className="bg-white text-orange-500 font-bold py-3 px-6 rounded-full hover:bg-orange-50 transition-all flex items-center space-x-2 shadow-2xl hover:scale-105">
                <UtensilsCrossed className="h-5 w-5" />
                <span>Browse Menu</span>
              </Link>
              {cartCount > 0 && (
                <Link to="/menu" className="bg-white/20 backdrop-blur-md border-2 border-white/40 text-white font-bold py-3 px-6 rounded-full hover:bg-white hover:text-orange-500 transition-all flex items-center space-x-2">
                  <ShoppingBag className="h-5 w-5" />
                  <span>Cart ({cartCount})</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-black dark:bg-black">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          {[
            { icon: Package, value: orders.length, label: 'Total Orders', color: 'from-black to-black' },
            { icon: Clock, value: pendingCount, label: 'Active Orders', color: 'from-black to-black' },
            { icon: TrendingUp, value: `$${totalSpent.toFixed(2)}`, label: 'Total Spent', color: 'from-black to-black' }
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 hover:shadow-xl hover:-translate-y-1 transition-all border border-gray-100 dark:border-gray-800">
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <p className="text-3xl font-bold text-gray-800 dark:text-white mb-1">{stat.value}</p>
                <p className="text-gray-500 dark:text-gray-400">{stat.label}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* RECENT ORDERS */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-800">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Recent Orders</h2>
                <Link to="/orders" className="text-orange-500 hover:text-orange-600 font-semibold text-sm flex items-center space-x-1">
                  <span>View All</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-16 w-16 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400 font-medium">No orders yet</p>
                  <p className="text-gray-400 text-sm mt-1">Start by browsing our menu</p>
                  <Link to="/menu" className="inline-block mt-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors">
                    Browse Menu
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.slice(0, 5).map(order => {
                    const items = Array.isArray(order.items) ? order.items : [];
                    const statusColors = {
                      pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
                      preparing: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
                      delivered: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
                      cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    };
                    return (
                      <div key={order.id} className="flex items-center justify-between p-4 bg-orange-50 dark:bg-gray-800 rounded-xl hover:bg-orange-100 dark:hover:bg-gray-700 transition-all border border-orange-100 dark:border-gray-700">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-1">
                            <p className="font-bold text-gray-800 dark:text-white">Order #{order.id}</p>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${statusColors[order.status]}`}>
                              {order.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {items.length} item{items.length !== 1 ? 's' : ''} • {new Date(order.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <p className="font-bold text-orange-500 text-lg">
                          ${(Number(order.total) || 0).toFixed(2)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* POPULAR ITEMS */}
          <div>
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-800">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Popular Items</h2>
                <ChefHat className="h-5 w-5 text-orange-500" />
              </div>

              <div className="space-y-3">
                {popularItems.map(item => (
                  <Link key={item.id} to="/menu"
                    className="flex items-center space-x-3 p-3 rounded-xl hover:bg-orange-50 dark:hover:bg-gray-800 transition-colors">
                    <img src={item.image_url} alt={item.name}
                      className="w-14 h-14 rounded-lg object-cover shadow-md"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/56'; }} />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 dark:text-white truncate">{item.name}</p>
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span className="text-xs text-gray-500 dark:text-gray-400">4.5 • {item.category}</span>
                      </div>
                    </div>
                    <p className="font-bold text-orange-500">
                      ${(Number(item.price) || 0).toFixed(2)}
                    </p>
                  </Link>
                ))}
              </div>

              <Link to="/menu"
                className="mt-4 w-full inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-orange-500/30">
                <span>View Full Menu</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;