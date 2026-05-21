import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Logo from '../components/Logo';
import {
  LayoutDashboard, ShoppingBag, Users, DollarSign,
  Clock, LogOut, UtensilsCrossed, Menu, X, RefreshCw,
  Plus, Edit2, Trash2, TrendingUp, TrendingDown,
  UserCheck, Calendar, Award, Eye, BarChart3, Activity,
  Package, Star, Zap, Sparkles
} from 'lucide-react';

const statusOptions = ['pending', 'preparing', 'delivered', 'cancelled'];
const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  preparing: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  delivered: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
};

const UserAvatar = ({ user, size = 'md' }) => {
  const sizes = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg'
  };
  
  if (user?.profile_picture) {
    return (
      <img 
        src={user.profile_picture} 
        alt={user.fullname}
        className={`${sizes[size]} rounded-full object-cover border-2 border-orange-500`}
        onError={(e) => { e.target.style.display = 'none'; }}
      />
    );
  }
  
  return (
    <div className={`${sizes[size]} bg-gradient-to-br from-orange-400 to-red-500 text-white rounded-full flex items-center justify-center font-bold shadow-md`}>
      {user?.fullname?.charAt(0).toUpperCase() || '?'}
    </div>
  );
};

const AdminDashboard = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const [stats, setStats] = useState({
    totalOrders: 0, todayOrders: 0, totalRevenue: 0, totalCustomers: 0, pendingOrders: 0
  });
  const [detailedStats, setDetailedStats] = useState({
    activeUsers: 0, newThisWeek: 0, totalCustomers: 0,
    topCustomers: [], topItems: [], revenueByDay: [],
    ordersByStatus: {}, thisMonth: { revenue: 0, orders: 0 },
    lastMonth: { revenue: 0, orders: 0 }, averageOrderValue: 0
  });
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerOrders, setCustomerOrders] = useState([]);
  
  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchUser, setSearchUser] = useState('');

  const [showMenuForm, setShowMenuForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [menuForm, setMenuForm] = useState({
    name: '', description: '', price: '', category: '', image_url: '', available: true
  });

  useEffect(() => {
    if (activeTab === 'dashboard') loadDashboardData();
    if (activeTab === 'orders') fetchOrders();
    if (activeTab === 'menu') fetchMenu();
    if (activeTab === 'customers') fetchCustomers();
  }, [activeTab]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const statsRes = await axios.get('http://localhost:5000/api/orders/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(statsRes.data);
      
      try {
        const detailedRes = await axios.get('http://localhost:5000/api/customers/stats/detailed', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDetailedStats(detailedRes.data);
      } catch (e) { console.error(e); }
    } catch (err) {
      toast.error('Failed to load');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const url = selectedDate ? `http://localhost:5000/api/orders/all?date=${selectedDate}` : 'http://localhost:5000/api/orders/all';
      const { data } = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
      setOrders(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchMenu = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/menu');
      setMenuItems(data);
    } catch (err) { console.error(err); }
  };

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('http://localhost:5000/api/customers', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCustomers(data);
    } catch (err) { toast.error('Failed to load customers'); }
    finally { setLoading(false); }
  };

  const viewCustomerOrders = async (customer) => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/customers/${customer.id}/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSelectedCustomer(customer);
      setCustomerOrders(data);
    } catch (err) { toast.error('Failed'); }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${orderId}/status`, { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Updated!');
      fetchOrders();
    } catch (err) { toast.error('Failed'); }
  };

  const handleMenuSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await axios.put(`http://localhost:5000/api/menu/${editingItem.id}`, menuForm,
          { headers: { Authorization: `Bearer ${token}` } });
        toast.success('Updated!');
      } else {
        await axios.post('http://localhost:5000/api/menu', menuForm,
          { headers: { Authorization: `Bearer ${token}` } });
        toast.success('Added!');
      }
      setShowMenuForm(false);
      setEditingItem(null);
      setMenuForm({ name: '', description: '', price: '', category: '', image_url: '', available: true });
      fetchMenu();
    } catch (err) { toast.error('Failed'); }
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setMenuForm({
      name: item.name, description: item.description || '', price: item.price,
      category: item.category || '', image_url: item.image_url || '', available: !!item.available
    });
    setShowMenuForm(true);
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/menu/${id}`,
        { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Deleted!');
      fetchMenu();
    } catch (err) { toast.error('Failed'); }
  };

  const handleDeleteCustomer = async (id) => {
    if (!window.confirm('Delete this customer?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/customers/${id}`,
        { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Deleted!');
      fetchCustomers();
    } catch (err) { toast.error('Has orders, cannot delete'); }
  };

  const handleLogout = () => { logout(); navigate('/admin/login'); };

  const navItems = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'menu', label: 'Menu Items', icon: UtensilsCrossed },
  ];

  const calcGrowth = (current, previous) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous * 100).toFixed(1);
  };

  const filteredCustomers = customers.filter(c =>
    c.fullname?.toLowerCase().includes(searchUser.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchUser.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-orange-50/30 dark:bg-black flex">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* SIDEBAR - Warm Dark with Orange Accents */}
      <aside className={`fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-gray-900 to-black text-white z-30 transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} border-r border-orange-500/20`}>
        <div className="p-6 border-b border-orange-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Logo size={36} />
              <div>
                <p className="font-bold text-lg text-white">QuickBite</p>
                <p className="text-xs text-orange-400">Admin Panel</p>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-4 border-b border-orange-500/20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center font-bold shadow-lg shadow-orange-500/30">
              {user?.username?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div>
              <p className="font-semibold text-white">{user?.username || 'Admin'}</p>
              <p className="text-xs text-orange-400">Administrator</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <button key={item.id}
                onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all text-left ${
                  activeTab === item.id 
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/30' 
                    : 'text-gray-400 hover:bg-orange-500/10 hover:text-orange-400'
                }`}>
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-orange-500/20">
          <button onClick={handleLogout} className="w-full flex items-center space-x-3 px-4 py-3 text-gray-400 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-colors">
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 lg:ml-64">
        {/* Header with warm orange tint */}
        <header className="bg-white dark:bg-black shadow-sm sticky top-0 z-10 border-b border-orange-100 dark:border-orange-500/20">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-600 dark:text-white">
                <Menu className="h-6 w-6" />
              </button>
              <h1 className="text-xl font-bold text-gray-800 dark:text-white capitalize flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-orange-500" />
                <span>{activeTab}</span>
              </h1>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </header>

        <main className="p-6">
          {/* DASHBOARD TAB - Warm Orange Theme */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {loading ? (
                <div className="text-center py-20">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mx-auto"></div>
                </div>
              ) : (
                <>
                  {/* Welcome Banner */}
                  <div className="relative overflow-hidden rounded-3xl shadow-xl"
                    style={{
                      backgroundImage: `linear-gradient(rgba(234,88,12,0.85), rgba(220,38,38,0.75)), url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920&q=80')`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}>
                    <div className="p-8 text-white">
                      <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-3 py-1 mb-3">
                        <Sparkles className="h-4 w-4" />
                        <span className="text-sm font-semibold">Admin,{user?.username} </span>
                      </div>
                      { /*<h2 className="text-3xl font-bold mb-2">Hi, {user?.username}! </h2> */}
                      <p className="text-orange-50">Here's what's happening with QuickBite today</p>
                    </div>
                  </div>

                  {/* Top Stats - Soft Orange Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border-2 border-orange-100 dark:border-orange-500/20 shadow-sm hover:shadow-xl hover:shadow-orange-500/10 hover:-translate-y-1 transition-all">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                          <DollarSign className="h-6 w-6 text-white" />
                        </div>
                        {detailedStats.thisMonth.revenue > 0 && (
                          <span className="text-xs font-bold px-2 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 flex items-center space-x-1">
                            <TrendingUp className="h-3 w-3" />
                            <span>{calcGrowth(detailedStats.thisMonth.revenue, detailedStats.lastMonth.revenue)}%</span>
                          </span>
                        )}
                      </div>
                      <p className="text-3xl font-bold text-gray-800 dark:text-white">${stats.totalRevenue.toFixed(2)}</p>
                      <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Total Revenue</p>
                    </div>

                    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border-2 border-orange-100 dark:border-orange-500/20 shadow-sm hover:shadow-xl hover:shadow-orange-500/10 hover:-translate-y-1 transition-all">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                          <Users className="h-6 w-6 text-white" />
                        </div>
                        {detailedStats.newThisWeek > 0 && (
                          <span className="text-xs font-bold px-2 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                            +{detailedStats.newThisWeek}
                          </span>
                        )}
                      </div>
                      <p className="text-3xl font-bold text-gray-800 dark:text-white">{stats.totalCustomers}</p>
                      <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Total Customers</p>
                    </div>

                    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border-2 border-orange-100 dark:border-orange-500/20 shadow-sm hover:shadow-xl hover:shadow-orange-500/10 hover:-translate-y-1 transition-all">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                          <UserCheck className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-xs font-bold px-2 py-1 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                          30 days
                        </span>
                      </div>
                      <p className="text-3xl font-bold text-gray-800 dark:text-white">{detailedStats.activeUsers}</p>
                      <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Active Users</p>
                    </div>

                    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border-2 border-orange-100 dark:border-orange-500/20 shadow-sm hover:shadow-xl hover:shadow-orange-500/10 hover:-translate-y-1 transition-all">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                          <ShoppingBag className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-xs font-bold px-2 py-1 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                          Today
                        </span>
                      </div>
                      <p className="text-3xl font-bold text-gray-800 dark:text-white">{stats.todayOrders}</p>
                      <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Today's Orders</p>
                    </div>
                  </div>

                  {/* Gradient Highlight Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 text-white shadow-xl shadow-orange-500/20">
                      <Activity className="h-10 w-10 mb-3 opacity-80" />
                      <p className="text-3xl font-bold">${detailedStats.averageOrderValue.toFixed(2)}</p>
                      <p className="text-orange-100 text-sm mt-1">Average Order Value</p>
                    </div>

                    <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white shadow-xl shadow-orange-500/20">
                      <Calendar className="h-10 w-10 mb-3 opacity-80" />
                      <p className="text-3xl font-bold">${detailedStats.thisMonth.revenue.toFixed(2)}</p>
                      <p className="text-amber-100 text-sm mt-1">This Month Revenue</p>
                    </div>

                    <div className="bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl p-6 text-white shadow-xl shadow-rose-500/20">
                      <Clock className="h-10 w-10 mb-3 opacity-80" />
                      <p className="text-3xl font-bold">{stats.pendingOrders}</p>
                      <p className="text-rose-100 text-sm mt-1">Pending Orders</p>
                    </div>
                  </div>

                  {/* Charts */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border-2 border-orange-100 dark:border-orange-500/20 shadow-sm">
                      <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center space-x-2 mb-4">
                        <BarChart3 className="h-5 w-5 text-orange-500" />
                        <span>Revenue Last 7 Days</span>
                      </h3>
                      <div className="space-y-3">
                        {detailedStats.revenueByDay.length === 0 ? (
                          <div className="text-center py-12">
                            <BarChart3 className="h-12 w-12 text-orange-200 mx-auto mb-2" />
                            <p className="text-gray-400">No data yet</p>
                          </div>
                        ) : (
                          detailedStats.revenueByDay.map((day, i) => {
                            const maxRev = Math.max(...detailedStats.revenueByDay.map(d => d.revenue), 1);
                            const percentage = (day.revenue / maxRev) * 100;
                            return (
                              <div key={i}>
                                <div className="flex justify-between text-sm mb-1">
                                  <span className="text-gray-600 dark:text-gray-400 font-medium">
                                    {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                  </span>
                                  <span className="font-bold text-gray-800 dark:text-white">${day.revenue.toFixed(2)}</span>
                                </div>
                                <div className="w-full bg-orange-50 dark:bg-gray-800 rounded-full h-3">
                                  <div className="bg-gradient-to-r from-orange-400 to-red-500 h-3 rounded-full transition-all shadow-sm"
                                    style={{ width: `${percentage}%` }}></div>
                                </div>
                                <p className="text-xs text-gray-400 mt-1">{day.orders} orders</p>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>

                    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border-2 border-orange-100 dark:border-orange-500/20 shadow-sm">
                      <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center space-x-2 mb-4">
                        <Package className="h-5 w-5 text-orange-500" />
                        <span>Orders by Status</span>
                      </h3>
                      {Object.keys(detailedStats.ordersByStatus).length === 0 ? (
                        <div className="text-center py-12">
                          <Package className="h-12 w-12 text-orange-200 mx-auto mb-2" />
                          <p className="text-gray-400">No orders yet</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {Object.entries(detailedStats.ordersByStatus).map(([status, count]) => {
                            const total = Object.values(detailedStats.ordersByStatus).reduce((a, b) => a + b, 0);
                            const percentage = total > 0 ? (count / total) * 100 : 0;
                            const colors = {
                              delivered: 'from-green-400 to-emerald-500',
                              preparing: 'from-blue-400 to-cyan-500',
                              pending: 'from-yellow-400 to-amber-500',
                              cancelled: 'from-red-400 to-rose-500'
                            };
                            return (
                              <div key={status}>
                                <div className="flex justify-between text-sm mb-1">
                                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase ${statusColors[status]}`}>
                                    {status}
                                  </span>
                                  <span className="font-bold text-gray-800 dark:text-white">{count} ({percentage.toFixed(1)}%)</span>
                                </div>
                                <div className="w-full bg-orange-50 dark:bg-gray-800 rounded-full h-3">
                                  <div className={`bg-gradient-to-r ${colors[status]} h-3 rounded-full transition-all shadow-sm`}
                                    style={{ width: `${percentage}%` }}></div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Top Customers & Items */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border-2 border-orange-100 dark:border-orange-500/20 shadow-sm">
                      <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center space-x-2 mb-4">
                        <Award className="h-5 w-5 text-orange-500" />
                        <span>Top 5 Customers</span>
                      </h3>
                      <div className="space-y-3">
                        {detailedStats.topCustomers.length === 0 ? (
                          <div className="text-center py-12">
                            <Award className="h-12 w-12 text-orange-200 mx-auto mb-2" />
                            <p className="text-gray-400">No data yet</p>
                          </div>
                        ) : (
                          detailedStats.topCustomers.map((customer, i) => (
                            <div key={customer.id} className="flex items-center space-x-3 p-3 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-900/10 transition-colors border border-orange-100 dark:border-orange-500/20">
                              <div className="relative">
                                <UserAvatar user={customer} size="md" />
                                <span className={`absolute -top-1 -right-1 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white dark:border-gray-900 ${
                                  i === 0 ? 'bg-yellow-500' : i === 1 ? 'bg-gray-400' : i === 2 ? 'bg-orange-700' : 'bg-blue-500'
                                }`}>
                                  {i + 1}
                                </span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-bold text-gray-800 dark:text-white truncate">{customer.fullname}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{customer.email}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-orange-500">${customer.total_spent.toFixed(2)}</p>
                                <p className="text-xs text-gray-400">{customer.orders_count} orders</p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border-2 border-orange-100 dark:border-orange-500/20 shadow-sm">
                      <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center space-x-2 mb-4">
                        <Star className="h-5 w-5 text-orange-500" />
                        <span>Best Selling Items</span>
                      </h3>
                      <div className="space-y-3">
                        {detailedStats.topItems.length === 0 ? (
                          <div className="text-center py-12">
                            <Star className="h-12 w-12 text-orange-200 mx-auto mb-2" />
                            <p className="text-gray-400">No sales yet</p>
                          </div>
                        ) : (
                          detailedStats.topItems.map((item) => (
                            <div key={item.id} className="flex items-center space-x-3 p-3 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-900/10 transition-colors border border-orange-100 dark:border-orange-500/20">
                              <img src={item.image_url} alt={item.name}
                                className="w-12 h-12 rounded-lg object-cover border-2 border-orange-200"
                                onError={(e) => { e.target.src = 'https://via.placeholder.com/48'; }} />
                              <div className="flex-1 min-w-0">
                                <p className="font-bold text-gray-800 dark:text-white truncate">{item.name}</p>
                                <p className="text-xs text-gray-500">{item.total_sold} sold</p>
                              </div>
                              <p className="font-bold text-orange-500">${item.revenue.toFixed(2)}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border-2 border-orange-100 dark:border-orange-500/20 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center space-x-2">
                      <Zap className="h-5 w-5 text-orange-500" />
                      <span>Quick Actions</span>
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <button onClick={() => setActiveTab('orders')}
                        className="flex flex-col items-center space-y-2 p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-900/10 hover:from-orange-100 hover:to-orange-200 dark:hover:from-orange-900/30 rounded-xl transition-all border border-orange-200 dark:border-orange-500/20">
                        <ShoppingBag className="h-6 w-6 text-orange-600" />
                        <span className="text-sm font-semibold text-gray-800 dark:text-white">Orders</span>
                      </button>
                      <button onClick={() => setActiveTab('customers')}
                        className="flex flex-col items-center space-y-2 p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10 hover:from-blue-100 hover:to-blue-200 dark:hover:from-blue-900/30 rounded-xl transition-all border border-blue-200 dark:border-blue-500/20">
                        <Users className="h-6 w-6 text-blue-600" />
                        <span className="text-sm font-semibold text-gray-800 dark:text-white">Customers</span>
                      </button>
                      <button onClick={() => setActiveTab('menu')}
                        className="flex flex-col items-center space-y-2 p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/10 hover:from-green-100 hover:to-green-200 dark:hover:from-green-900/30 rounded-xl transition-all border border-green-200 dark:border-green-500/20">
                        <UtensilsCrossed className="h-6 w-6 text-green-600" />
                        <span className="text-sm font-semibold text-gray-800 dark:text-white">Menu</span>
                      </button>
                      <button onClick={() => { setActiveTab('menu'); setShowMenuForm(true); }}
                        className="flex flex-col items-center space-y-2 p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/10 hover:from-purple-100 hover:to-purple-200 dark:hover:from-purple-900/30 rounded-xl transition-all border border-purple-200 dark:border-purple-500/20">
                        <Plus className="h-6 w-6 text-purple-600" />
                        <span className="text-sm font-semibold text-gray-800 dark:text-white">Add Item</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* CUSTOMERS TAB */}
          {activeTab === 'customers' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border-2 border-orange-100 dark:border-orange-500/20 shadow-sm">
                <input type="text" placeholder="🔍 Search by name or email..."
                  value={searchUser}
                  onChange={(e) => setSearchUser(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-orange-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl focus:outline-none focus:border-orange-500" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-2xl p-4 shadow-xl shadow-orange-500/20">
                  <p className="text-3xl font-bold">{customers.length}</p>
                  <p className="text-sm opacity-90">Total Customers</p>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-2xl p-4 shadow-xl shadow-green-500/20">
                  <p className="text-3xl font-bold">{customers.filter(c => c.is_active).length}</p>
                  <p className="text-sm opacity-90">Active (30 days)</p>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-2xl p-4 shadow-xl shadow-blue-500/20">
                  <p className="text-3xl font-bold">{customers.filter(c => c.total_orders > 0).length}</p>
                  <p className="text-sm opacity-90">Made Orders</p>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500 mx-auto"></div>
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border-2 border-orange-100 dark:border-orange-500/20 shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                        <tr>
                          <th className="text-left p-4 font-bold text-sm">Customer</th>
                          <th className="text-left p-4 font-bold text-sm">Contact</th>
                          <th className="text-center p-4 font-bold text-sm">Orders</th>
                          <th className="text-center p-4 font-bold text-sm">Spent</th>
                          <th className="text-center p-4 font-bold text-sm">Status</th>
                          <th className="text-left p-4 font-bold text-sm">Joined</th>
                          <th className="text-center p-4 font-bold text-sm">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredCustomers.length === 0 ? (
                          <tr>
                            <td colSpan="7" className="text-center py-12 text-gray-400">
                              <Users className="h-12 w-12 mx-auto mb-2 opacity-30" />
                              No customers found
                            </td>
                          </tr>
                        ) : (
                          filteredCustomers.map(customer => (
                            <tr key={customer.id} className="border-b border-orange-50 dark:border-gray-800 hover:bg-orange-50/50 dark:hover:bg-orange-900/10">
                              <td className="p-4">
                                <div className="flex items-center space-x-3">
                                  <UserAvatar user={customer} size="md" />
                                  <div>
                                    <p className="font-bold text-gray-800 dark:text-white">{customer.fullname}</p>
                                    <p className="text-xs text-gray-500">ID: {customer.id}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="p-4 text-sm">
                                <p className="text-gray-700 dark:text-gray-300">{customer.email}</p>
                                <p className="text-xs text-gray-500">{customer.phone || 'No phone'}</p>
                              </td>
                              <td className="p-4 text-center">
                                <span className="font-bold text-gray-800 dark:text-white text-lg">{customer.total_orders}</span>
                              </td>
                              <td className="p-4 text-center">
                                <span className="font-bold text-orange-500">${customer.total_spent.toFixed(2)}</span>
                              </td>
                              <td className="p-4 text-center">
                                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${
                                  customer.is_active
                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                    : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                                }`}>
                                  {customer.is_active ? '● ACTIVE' : '○ INACTIVE'}
                                </span>
                              </td>
                              <td className="p-4 text-sm text-gray-500 dark:text-gray-400">
                                {new Date(customer.created_at).toLocaleDateString()}
                              </td>
                              <td className="p-4 text-center">
                                <div className="flex justify-center space-x-2">
                                  <button onClick={() => viewCustomerOrders(customer)}
                                    className="p-2 bg-gradient-to-br from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-lg transition-all shadow-md hover:shadow-lg hover:scale-105"
                                    title="View Orders">
                                    <Eye className="h-4 w-4" />
                                  </button>
                                  <button onClick={() => handleDeleteCustomer(customer.id)}
                                    className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all shadow-md hover:scale-105"
                                    title="Delete">
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <div>
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between border-2 border-orange-100 dark:border-orange-500/20 shadow-sm">
                <div className="flex items-center space-x-3 flex-wrap gap-2">
                  <label className="text-sm font-bold text-gray-600 dark:text-white">Filter by Date:</label>
                  <input type="date" value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="border-2 border-orange-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500" />
                  <button onClick={fetchOrders} className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md">Apply</button>
                  {selectedDate && (
                    <button onClick={() => { setSelectedDate(''); fetchOrders(); }} className="text-sm text-gray-500 hover:text-red-500">
                      Clear
                    </button>
                  )}
                </div>
                <button onClick={fetchOrders} className="flex items-center space-x-2 text-sm text-orange-500 font-semibold hover:text-orange-600">
                  <RefreshCw className="h-4 w-4" />
                  <span>Refresh</span>
                </button>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500 mx-auto"></div>
                </div>
              ) : orders.length === 0 ? (
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-12 text-center border-2 border-orange-100 dark:border-orange-500/20">
                  <ShoppingBag className="h-16 w-16 text-orange-200 mx-auto mb-4" />
                  <p className="text-gray-500">No orders found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map(order => {
                    const items = Array.isArray(order.items) ? order.items : [];
                    return (
                      <div key={order.id} className="bg-white dark:bg-gray-900 rounded-2xl p-6 border-2 border-orange-100 dark:border-orange-500/20 shadow-sm hover:shadow-lg hover:shadow-orange-500/10 transition-all">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
                          <div>
                            <div className="flex items-center space-x-3 mb-1">
                              <h3 className="font-bold text-gray-800 dark:text-white">Order #{order.id}</h3>
                              <span className={`text-xs px-2 py-1 rounded-full font-bold uppercase ${statusColors[order.status]}`}>
                                {order.status}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                               {order.fullname} |  {order.email}
                            </p>
                            <p className="text-sm text-gray-500"> {new Date(order.created_at).toLocaleString()}</p>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className="text-lg font-bold text-orange-500">
                              ${(Number(order.total) || 0).toFixed(2)}
                            </span>
                            <select value={order.status}
                              onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                              className="border-2 border-orange-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500">
                              {statusOptions.map(s => (
                                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="border-t-2 border-orange-50 dark:border-gray-800 pt-3">
                          <div className="flex flex-wrap gap-2">
                            {items.map((item, idx) => (
                              <span key={idx} className="bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 text-xs px-3 py-1 rounded-full font-semibold border border-orange-200 dark:border-orange-500/30">
                                {item.name} ×{item.quantity}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* MENU TAB */}
          {activeTab === 'menu' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <p className="text-gray-700 dark:text-white font-semibold">{menuItems.length} items in menu</p>
                <button onClick={() => {
                  setShowMenuForm(true);
                  setEditingItem(null);
                  setMenuForm({ name: '', description: '', price: '', category: '', image_url: '', available: true });
                }}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center space-x-2 shadow-md hover:shadow-lg">
                  <Plus className="h-4 w-4" />
                  <span>Add Item</span>
                </button>
              </div>

              {showMenuForm && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                  <div className="bg-white dark:bg-gray-900 border-2 border-orange-200 dark:border-orange-500/30 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 flex items-center justify-between">
                      <h2 className="text-xl font-bold text-white">{editingItem ? 'Edit Item' : 'Add Item'}</h2>
                      <button onClick={() => setShowMenuForm(false)} className="text-white hover:bg-white/20 p-2 rounded-full">
                        <X className="h-6 w-6" />
                      </button>
                    </div>
                    <form onSubmit={handleMenuSubmit} className="p-6 space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-white mb-1">Name *</label>
                        <input required type="text" value={menuForm.name}
                          onChange={(e) => setMenuForm({ ...menuForm, name: e.target.value })}
                          className="w-full border-2 border-orange-100 dark:border-gray-700 rounded-xl px-4 py-2.5 focus:outline-none focus:border-orange-500 dark:bg-gray-800 dark:text-white" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-white mb-1">Description</label>
                        <textarea value={menuForm.description}
                          onChange={(e) => setMenuForm({ ...menuForm, description: e.target.value })}
                          className="w-full border-2 border-orange-100 dark:border-gray-700 rounded-xl px-4 py-2.5 focus:outline-none focus:border-orange-500 dark:bg-gray-800 dark:text-white h-20 resize-none" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 dark:text-white mb-1">Price *</label>
                          <input required type="number" step="0.01" value={menuForm.price}
                            onChange={(e) => setMenuForm({ ...menuForm, price: e.target.value })}
                            className="w-full border-2 border-orange-100 dark:border-gray-700 rounded-xl px-4 py-2.5 focus:outline-none focus:border-orange-500 dark:bg-gray-800 dark:text-white" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 dark:text-white mb-1">Category</label>
                          <input type="text" value={menuForm.category}
                            onChange={(e) => setMenuForm({ ...menuForm, category: e.target.value })}
                            className="w-full border-2 border-orange-100 dark:border-gray-700 rounded-xl px-4 py-2.5 focus:outline-none focus:border-orange-500 dark:bg-gray-800 dark:text-white" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-white mb-2">Image</label>
                        <label className="flex items-center justify-center w-full p-4 border-2 border-dashed border-orange-300 dark:border-orange-500/30 rounded-xl cursor-pointer hover:bg-orange-50 dark:hover:bg-orange-900/10 transition-colors">
                          <input type="file" accept="image/*" className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files[0];
                              if (!file) return;
                              const formData = new FormData();
                              formData.append('image', file);
                              try {
                                const { data } = await axios.post('http://localhost:5000/api/upload', formData,
                                  { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` } });
                                setMenuForm({ ...menuForm, image_url: data.url });
                                toast.success('Uploaded!');
                              } catch (err) { toast.error('Failed'); }
                            }} />
                          <div className="text-center">
                            <Plus className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                            <p className="text-sm font-semibold text-gray-700 dark:text-white">Upload from computer</p>
                          </div>
                        </label>
                        <input type="text" value={menuForm.image_url}
                          onChange={(e) => setMenuForm({ ...menuForm, image_url: e.target.value })}
                          className="w-full mt-3 border-2 border-orange-100 dark:border-gray-700 rounded-xl px-4 py-2.5 focus:outline-none focus:border-orange-500 dark:bg-gray-800 dark:text-white"
                          placeholder="Or paste URL" />
                        {menuForm.image_url && (
                          <img src={menuForm.image_url} className="w-full h-40 object-cover rounded-xl mt-3 border-2 border-orange-200" />
                        )}
                      </div>
                      <div className="flex items-center space-x-3">
                        <input type="checkbox" id="available" checked={menuForm.available}
                          onChange={(e) => setMenuForm({ ...menuForm, available: e.target.checked })}
                          className="w-4 h-4 accent-orange-500" />
                        <label htmlFor="available" className="text-sm font-semibold text-gray-700 dark:text-white">Available</label>
                      </div>
                      <div className="flex space-x-3 pt-2">
                        <button type="submit" className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 rounded-xl shadow-md">
                          {editingItem ? 'Update' : 'Add'}
                        </button>
                        <button type="button" onClick={() => setShowMenuForm(false)} className="flex-1 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 text-gray-700 dark:text-white font-bold py-3 rounded-xl">
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {menuItems.map(item => {
                  const itemPrice = Number(item.price) || 0;
                  return (
                    <div key={item.id} className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border-2 border-orange-100 dark:border-orange-500/20 shadow-sm hover:shadow-xl hover:shadow-orange-500/10 hover:-translate-y-1 transition-all">
                      <div className="relative h-40 overflow-hidden">
                        <img src={item.image_url} alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/400'; }} />
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-bold text-gray-800 dark:text-white">{item.name}</h3>
                            {item.category && (
                              <span className="text-xs bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-0.5 rounded-full">
                                {item.category}
                              </span>
                            )}
                          </div>
                          <span className="font-bold text-orange-500">${itemPrice.toFixed(2)}</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{item.description}</p>
                        <div className="flex space-x-2">
                          <button onClick={() => handleEditItem(item)}
                            className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-2 rounded-lg text-sm font-semibold flex items-center justify-center space-x-1 shadow-md">
                            <Edit2 className="h-4 w-4" />
                            <span>Edit</span>
                          </button>
                          <button onClick={() => handleDeleteItem(item.id)}
                            className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-sm font-semibold flex items-center justify-center space-x-1 shadow-md">
                            <Trash2 className="h-4 w-4" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Customer Orders Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedCustomer(null)}>
          <div className="bg-white dark:bg-gray-900 border-2 border-orange-200 dark:border-orange-500/30 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <UserAvatar user={selectedCustomer} size="lg" />
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedCustomer.fullname}</h2>
                  <p className="text-orange-100 text-sm">{selectedCustomer.email}</p>
                  <p className="text-xs text-orange-200">{selectedCustomer.phone || 'No phone'}</p>
                </div>
              </div>
              <button onClick={() => setSelectedCustomer(null)} className="text-white hover:bg-white/20 p-2 rounded-full">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {customerOrders.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-16 w-16 text-orange-200 mx-auto mb-3" />
                  <p className="text-gray-500">No orders yet</p>
                </div>
              ) : (
                customerOrders.map(order => {
                  const items = Array.isArray(order.items) ? order.items : [];
                  return (
                    <div key={order.id} className="bg-orange-50 dark:bg-orange-900/10 border-2 border-orange-100 dark:border-orange-500/20 rounded-xl p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-bold text-gray-800 dark:text-white">Order #{order.id}</h3>
                          <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleString()}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full font-bold uppercase ${statusColors[order.status]}`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="border-t-2 border-orange-100 dark:border-orange-500/20 pt-3 space-y-1">
                        {items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span className="text-gray-700 dark:text-gray-300">{item.name} ×{item.quantity}</span>
                            <span className="font-semibold text-gray-800 dark:text-white">${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="border-t-2 border-orange-100 dark:border-orange-500/20 pt-2 mt-2 flex justify-between font-bold">
                        <span className="text-gray-800 dark:text-white">Total:</span>
                        <span className="text-orange-500">${order.total.toFixed(2)}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;