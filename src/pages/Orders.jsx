import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Package, Clock, CheckCircle, XCircle, ChefHat, Calendar, Filter, X } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const statusConfig = {
  pending: { color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', icon: Clock, label: 'Pending' },
  preparing: { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', icon: ChefHat, label: 'Preparing' },
  delivered: { color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', icon: CheckCircle, label: 'Delivered' },
  cancelled: { color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', icon: XCircle, label: 'Cancelled' }
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const { token } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/orders/my-orders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(data);
        setFilteredOrders(data);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [token]);

  // Filter orders by date and status
  useEffect(() => {
    let filtered = [...orders];

    if (selectedDate) {
      const dateStr = selectedDate.toISOString().split('T')[0];
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.created_at).toISOString().split('T')[0];
        return orderDate === dateStr;
      });
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  }, [selectedDate, statusFilter, orders]);

  const clearFilters = () => {
    setSelectedDate(null);
    setStatusFilter('all');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            My <span className="text-orange-500">Orders</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Track all your orders here</p>
        </div>

        {/* FILTERS BAR */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-5 mb-6 border-2 border-orange-100 dark:border-gray-800">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-wrap">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-orange-500" />
              <span className="font-bold text-gray-700 dark:text-white">Filters:</span>
            </div>

            {/* Custom Date Picker */}
            <div className="flex items-center space-x-2">
              <label className="text-sm font-semibold text-gray-600 dark:text-gray-400 flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>Date:</span>
              </label>
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                dateFormat="MMM dd, yyyy"
                placeholderText="Pick a date"
                todayButton="TODAY"
                isClearable
                showPopperArrow={false}
                maxDate={new Date()}
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center space-x-2">
              <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">Status:</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-sm font-medium"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="preparing">Preparing</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Clear Button */}
            {(selectedDate || statusFilter !== 'all') && (
              <button
                onClick={clearFilters}
                className="flex items-center space-x-1 text-sm text-red-500 hover:text-red-700 font-semibold ml-auto"
              >
                <X className="h-4 w-4" />
                <span>Clear Filters</span>
              </button>
            )}
          </div>

          {/* Results Count */}
          <div className="mt-3 pt-3 border-t border-orange-100 dark:border-gray-800">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Showing <span className="font-bold text-orange-500">{filteredOrders.length}</span> of {orders.length} orders
            </p>
          </div>
        </div>

        {/* ORDERS LIST */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-2xl shadow-lg border-2 border-orange-100 dark:border-gray-800">
            <Package className="h-20 w-20 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-500 dark:text-gray-400">
              {orders.length === 0 ? 'No orders yet' : 'No orders match your filters'}
            </h3>
            <p className="text-gray-400 mt-2">
              {orders.length === 0 ? 'Start ordering delicious food!' : 'Try adjusting your filters'}
            </p>
            {orders.length === 0 && (
              <a href="/menu" className="inline-block mt-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg">
                Browse Menu
              </a>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map(order => {
              const config = statusConfig[order.status] || statusConfig.pending;
              const StatusIcon = config.icon;
              const items = Array.isArray(order.items) ? order.items : [];

              return (
                <div key={order.id} className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 border-2 border-orange-100 dark:border-gray-800 hover:shadow-xl hover:shadow-orange-500/10 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
                    <div>
                      <h3 className="font-bold text-lg text-gray-800 dark:text-white">Order #{order.id}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-2 mt-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(order.created_at).toLocaleString()}</span>
                      </p>
                      {order.delivery_address && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">📍 {order.delivery_address}</p>
                      )}
                    </div>
                    <span className={`inline-flex items-center space-x-1 px-3 py-1.5 rounded-full text-sm font-bold ${config.color}`}>
                      <StatusIcon className="h-4 w-4" />
                      <span>{config.label}</span>
                    </span>
                  </div>

                  <div className="border-t-2 border-orange-100 dark:border-gray-800 pt-4 mb-4">
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">Order Items</p>
                    <div className="space-y-2">
                      {items.map((item, idx) => {
                        const itemPrice = Number(item.price) || 0;
                        const itemQty = Number(item.quantity) || 0;
                        return (
                          <div key={idx} className="flex justify-between items-center text-sm py-2 px-3 bg-orange-50 dark:bg-gray-800 rounded-lg">
                            <span className="text-gray-700 dark:text-gray-300 font-medium">
                              {item.name} <span className="text-gray-400 dark:text-gray-500">×{itemQty}</span>
                            </span>
                            <span className="font-bold text-gray-800 dark:text-white">
                              ${(itemPrice * itemQty).toFixed(2)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="border-t-2 border-orange-100 dark:border-gray-800 pt-3 flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400 font-medium">Total Amount</span>
                    <span className="text-2xl font-bold text-orange-500">
                      ${(Number(order.total) || 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;