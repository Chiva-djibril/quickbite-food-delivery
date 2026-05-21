import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Clock, Shield, Truck, Star, ChefHat, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import Logo from '../components/Logo';

const Landing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') navigate('/admin/dashboard');
      else navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* HEADER */}
      <header className="bg-white dark:bg-black backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-orange-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Logo size={42} showText={true} textSize="text-2xl" />
            <div className="flex items-center space-x-3">
              <Link to="/login" className="text-gray-700 dark:text-white hover:text-orange-500 font-semibold px-4 py-2 transition-colors">
                Login
              </Link>
              <Link to="/register" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2 rounded-lg transition-colors shadow-md">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section 
        className="relative min-h-[90vh] flex items-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.4)), url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-6">
                <Sparkles className="h-4 w-4 text-yellow-300" />
                <span className="text-sm font-semibold">#1 Food Delivery in Country</span>
              </div>
              <h1 className="text-orange-100 text-5xl md:text-7xl font-extrabold leading-tight mb-6 drop-shadow-2xl text-white">
                Hungry?<br />
                We've got<br />
                <span className="text-orange-400">you covered!</span>
              </h1>
              <p className="text-xl mb-8 text-gray-100 max-w-lg drop-shadow-lg">
                Order delicious meals from QuickBite and get them delivered hot and fresh to your doorstep in minutes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register" className="inline-flex items-center justify-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-full transition-all text-lg shadow-2xl shadow-orange-500/50 hover:scale-105">
                  <span>Get Started Free</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link to="/login" className="inline-flex items-center justify-center bg-transparent backdrop-blur-md border-2 border-white/30 text-white font-bold py-4 px-8 rounded-full hover:bg-white hover:text-orange-500 transition-all text-lg">
                  Sign In
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/20">
                <div>
                  <p className="text-3xl font-bold">500+</p>
                  <p className="text-sm text-gray-300">Happy Customers</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">50+</p>
                  <p className="text-sm text-gray-300">Menu Items</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">30min</p>
                  <p className="text-sm text-gray-300">Delivery Time</p>
                </div>
              </div>
            </div>

            <div className="hidden lg:flex justify-center relative">
              <div className="relative">
                <div className="absolute -top-8 -left-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-2xl animate-float">
                  <div className="flex items-center space-x-3">
                    <Star className="h-8 w-8 text-yellow-400 fill-current" />
                    <div className="text-white">
                      <p className="font-bold text-lg">4.9 Rating</p>
                      <p className="text-xs text-gray-300">500+ Reviews</p>
                    </div>
                  </div>
                </div>
                <img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80" alt="Pizza"
                  className="w-96 h-96 object-cover rounded-3xl shadow-2xl border-4 border-white/20" />
                <div className="absolute -bottom-8 -right-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-2xl animate-float-delay">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-8 w-8 text-orange-400" />
                    <div className="text-white">
                      <p className="font-bold text-lg">30 Min</p>
                      <p className="text-xs text-gray-300">Avg Delivery</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-black relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
              Why Choose <span className="text-orange-500">QuickBite?</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg">Experience the best food delivery service</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Truck, title: 'Fast Delivery', desc: 'Hot food delivered in 30 minutes or less', color: 'bg-black' },
              { icon: Shield, title: 'Safe & Hygienic', desc: 'Prepared in clean, certified kitchens', color: 'bg-black' },
              { icon: ChefHat, title: 'Top Chefs', desc: 'Made by experienced professional chefs', color: 'bg-black' }
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={i} 
                  className="feature-card bg-black p-8 rounded-3xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all border-2 border-gray-800"
                >
                  <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-300">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* WHAT WE OFFER - WHITE in light, BLACK in dark */}
      <section className="py-20 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
              What We <span className="text-orange-500">Offer</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg">Explore our delicious categories</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Main Course', emoji: '', img: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400' },
              { name: 'Soups', emoji: '', img: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400' },
              { name: 'Snacks', emoji: '', img: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400' },
              { name: 'Drinks', emoji: '', img: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400' },
            ].map((cat, i) => (
              <div 
                key={i} 
                className="relative h-48 rounded-3xl overflow-hidden cursor-pointer group shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2"
                style={{
                  backgroundImage: `url(${cat.img})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent group-hover:from-orange-500/80 transition-all"></div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="text-4xl mb-1">{cat.emoji}</div>
                  <p className="font-bold text-lg">{cat.name}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/register" className="inline-flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-10 rounded-full transition-all shadow-2xl shadow-orange-500/30 text-lg hover:scale-105">
              <span>Sign Up to Order Now</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA - Stays orange */}
      <section 
        className="py-24 relative"
        style={{
          backgroundImage: `linear-gradient(rgba(234,88,12,0.85), rgba(220,38,38,0.85)), url('https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1920&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-5xl font-bold mb-4 drop-shadow-2xl">Ready to Get Started?</h2>
          <p className="text-xl text-orange-100 mb-8 drop-shadow-lg">
            Join thousands of food lovers who order with QuickBite every day!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="bg-white text-orange-500 font-bold py-4 px-10 rounded-full hover:bg-orange-50 transition-all text-lg shadow-2xl hover:scale-105">
              Create Free Account
            </Link>
            <Link to="/login" className="bg-white/10 backdrop-blur-md border-2 border-white text-white font-bold py-4 px-10 rounded-full hover:bg-white hover:text-orange-500 transition-all text-lg">
              Already a Member?
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER - WHITE in light, BLACK in dark */}
      <footer className="bg-gray-50 dark:bg-black text-gray-600 dark:text-gray-400 py-12 border-t border-orange-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-4">
            <Logo size={50} showText={true} textSize="text-2xl" />
          </div>
          <p className="mb-4">Delivering happiness, one meal at a time.</p>
          <div className="flex justify-center space-x-6 text-sm mb-6">
            <Link to="/login" className="hover:text-orange-500">Login</Link>
            <Link to="/register" className="hover:text-orange-500">Register</Link>
            <Link to="/admin/login" className="hover:text-orange-500">Admin</Link>
          </div>
          <p className="text-xs text-gray-500">© 2026 QuickBite. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;