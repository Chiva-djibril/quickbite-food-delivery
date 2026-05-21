import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Shield, Truck, Star } from 'lucide-react';

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-extrabold leading-tight mb-6">
                Delicious Food,<br />
                <span className="text-yellow-300">Delivered Fast!</span>
              </h1>
              <p className="text-xl mb-8 text-orange-100">
                Order your favorite meals from our restaurant and get them delivered 
                hot and fresh to your doorstep.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/menu"
                  className="inline-flex items-center justify-center space-x-2 bg-white text-orange-500 font-bold py-3 px-8 rounded-full hover:bg-orange-50 transition-colors text-lg"
                >
                  <span>Order Now</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-full hover:bg-white hover:text-orange-500 transition-colors text-lg"
                >
                  Sign Up Free
                </Link>
              </div>
            </div>

            <div className="hidden lg:flex justify-center">
              <div className="relative">
                <div className="w-80 h-80 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <img
                    src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400"
                    alt="Delicious Food"
                    className="w-72 h-72 object-cover rounded-full"
                  />
                </div>
                
                <div className="absolute -top-4 -left-4 bg-white text-gray-800 rounded-xl p-3 shadow-lg">
                  <div className="flex items-center space-x-2">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <div>
                      <p className="font-bold text-sm">4.9 Rating</p>
                      <p className="text-xs text-gray-500">200+ Reviews</p>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 bg-white text-gray-800 rounded-xl p-3 shadow-lg">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-orange-500" />
                    <div>
                      <p className="font-bold text-sm">30 Min</p>
                      <p className="text-xs text-gray-500">Delivery</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Why Choose <span className="text-orange-500">QuickBite?</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Truck className="h-10 w-10 text-orange-500" />,
                title: 'Fast Delivery',
                desc: 'Get your food delivered in 30 minutes or less, hot and fresh.'
              },
              {
                icon: <Shield className="h-10 w-10" />,
                title: 'Safe & Hygienic',
                desc: 'All our food is prepared in a clean, safe kitchen environment.'
              },
              {
                icon: <Star className="h-10 w-10 text-orange-500" />,
                title: 'Best Quality',
                desc: 'We use only the freshest ingredients for the best taste.'
              }
            ].map((feature, i) => (
              <div key={i} className="text-center p-6 rounded-xl bg-orange-50 hover:shadow-md transition-shadow">
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Popular <span className="text-orange-500">Categories</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Main Course', emoji: '', color: 'bg-red-100' },
              { name: 'Soups', emoji: '', color: 'bg-yellow-100' },
              { name: 'Snacks', emoji: '', color: 'bg-green-100' },
              { name: 'Drinks', emoji: '', color: 'bg-blue-100' },
            ].map((cat, i) => (
              <Link key={i} to="/menu" className={`${cat.color} rounded-2xl p-6 text-center hover:shadow-md transition-shadow cursor-pointer`}>
                <div className="text-5xl mb-3">{cat.emoji}</div>
                <p className="font-bold text-gray-800">{cat.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-orange-500 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Order?</h2>
          <p className="text-xl text-orange-100 mb-8">
            Join thousands of happy customers and enjoy amazing food today!
          </p>
          <Link
            to="/menu"
            className="inline-flex items-center space-x-2 bg-white text-orange-500 font-bold py-4 px-10 rounded-full hover:bg-orange-50 transition-colors text-lg"
          >
            <span>Browse Menu</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-2xl font-bold text-white mb-2">
            Quick<span className="text-orange-500">Bite</span>
          </p>
          <p className="mb-4">Delivering happiness, one meal at a time.</p>
          <div className="flex justify-center space-x-6 text-sm">
            <Link to="/menu" className="hover:text-orange-500 transition-colors">Menu</Link>
            <Link to="/login" className="hover:text-orange-500 transition-colors">Login</Link>
            <Link to="/admin/login" className="hover:text-orange-500 transition-colors">Admin</Link>
          </div>
          <p className="mt-6 text-xs text-gray-500">© 2024 QuickBite. All rights reserved.</p>
          </div>
      </footer>
    </div>
  );
};

export default Home;