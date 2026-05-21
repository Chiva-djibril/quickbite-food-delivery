import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { 
  CreditCard, Lock, ArrowLeft, MapPin, ShoppingBag,
  CheckCircle, Shield, Smartphone, Wallet, Banknote,
  Calendar, User
} from 'lucide-react';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, cartTotal, clearCart } = useCart();
  const { user, token } = useAuth();
  
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [processing, setProcessing] = useState(false);
  
  // Card details
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardType, setCardType] = useState('');
  
  // Mobile money
  const [mobileProvider, setMobileProvider] = useState('mtn');
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    if (cart.length === 0) {
      navigate('/menu');
    }
  }, [cart, navigate]);

  // Format card number with spaces
  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/g, '');
    if (value.length > 16) value = value.substr(0, 16);
    const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
    setCardNumber(formatted);
    
    // Detect card type
    if (/^4/.test(value)) setCardType('Visa');
    else if (/^5[1-5]/.test(value)) setCardType('MasterCard');
    else if (/^3[47]/.test(value)) setCardType('Amex');
    else if (/^6/.test(value)) setCardType('Discover');
    else setCardType('');
  };

  // Format expiry MM/YY
  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length >= 2) {
      value = value.substr(0, 2) + '/' + value.substr(2, 2);
    }
    setExpiryDate(value);
  };

  const proceedToPayment = () => {
    if (!address.trim()) {
      toast.error('Please enter delivery address');
      return;
    }
    setStep(2);
  };

  const handlePayment = async () => {
    // Validate based on payment method
    if (paymentMethod === 'card') {
      if (cardNumber.replace(/\s/g, '').length < 13) {
        toast.error('Invalid card number');
        return;
      }
      if (!cardHolder.trim() || cardHolder.length < 3) {
        toast.error('Enter card holder name');
        return;
      }
      if (!expiryDate || expiryDate.length < 5) {
        toast.error('Invalid expiry date');
        return;
      }
      if (!cvv || cvv.length < 3) {
        toast.error('Invalid CVV');
        return;
      }
    } else if (paymentMethod === 'mobile_money') {
      if (!phoneNumber || phoneNumber.length < 10) {
        toast.error('Enter valid phone number');
        return;
      }
    }

    setProcessing(true);

    // Simulate payment processing time
    await new Promise(resolve => setTimeout(resolve, 2500));

    try {
      const orderItems = cart.map(item => ({
        menu_item_id: item.id,
        quantity: item.quantity
      }));

      const paymentData = {
        items: orderItems,
        delivery_address: address,
        payment_method: paymentMethod,
        amount: cartTotal
      };

      if (paymentMethod === 'card') {
        paymentData.card_number = cardNumber;
        paymentData.card_holder = cardHolder;
      } else if (paymentMethod === 'mobile_money') {
        paymentData.phone_number = phoneNumber;
      }

      const { data } = await axios.post(
        'http://localhost:5000/api/payment/process',
        paymentData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(data.message);
      clearCart();
      
      setTimeout(() => {
        navigate('/orders');
      }, 1500);
      
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <button onClick={() => navigate('/menu')}
          className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-orange-500 mb-6">
          <ArrowLeft className="h-5 w-5" />
          <span className="font-medium">Back to Menu</span>
        </button>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className={`flex items-center space-x-2 ${step >= 1 ? 'text-orange-500' : 'text-gray-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-orange-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
              {step > 1 ? <CheckCircle className="h-6 w-6" /> : '1'}
            </div>
            <span className="font-bold hidden sm:inline">Delivery</span>
          </div>
          <div className={`w-20 h-1 mx-2 ${step >= 2 ? 'bg-orange-500' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
          <div className={`flex items-center space-x-2 ${step >= 2 ? 'text-orange-500' : 'text-gray-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-orange-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
              2
            </div>
            <span className="font-bold hidden sm:inline">Payment</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* MAIN CONTENT */}
          <div className="lg:col-span-2">
            {step === 1 ? (
              /* STEP 1: Address */
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border-2 border-orange-100 dark:border-gray-800 shadow-lg">
                <div className="flex items-center space-x-2 mb-4">
                  <MapPin className="h-6 w-6 text-orange-500" />
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">Delivery Address</h3>
                </div>
                
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your full delivery address including street, building, and any landmarks..."
                  rows="5"
                  className="w-full p-4 border-2 border-orange-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl focus:outline-none focus:border-orange-500 resize-none"
                />

                <button
                  onClick={proceedToPayment}
                  disabled={!address.trim()}
                  className="w-full mt-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-4 rounded-xl transition-all shadow-xl shadow-orange-500/30 disabled:opacity-50 flex items-center justify-center space-x-2 text-lg"
                >
                  <CreditCard className="h-5 w-5" />
                  <span>Proceed to Payment</span>
                </button>
              </div>
            ) : (
              /* STEP 2: Payment */
              <div className="space-y-4">
                {/* Payment Method Selection */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border-2 border-orange-100 dark:border-gray-800 shadow-lg">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Select Payment Method</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      onClick={() => setPaymentMethod('card')}
                      className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center space-y-2 ${
                        paymentMethod === 'card'
                          ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 shadow-lg'
                          : 'border-gray-200 dark:border-gray-700 hover:border-orange-300'
                      }`}
                    >
                      <CreditCard className={`h-8 w-8 ${paymentMethod === 'card' ? 'text-orange-500' : 'text-gray-400'}`} />
                      <span className="font-bold text-sm text-gray-800 dark:text-white">Credit Card</span>
                    </button>

                    <button
                      onClick={() => setPaymentMethod('mobile_money')}
                      className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center space-y-2 ${
                        paymentMethod === 'mobile_money'
                          ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 shadow-lg'
                          : 'border-gray-200 dark:border-gray-700 hover:border-orange-300'
                      }`}
                    >
                      <Smartphone className={`h-8 w-8 ${paymentMethod === 'mobile_money' ? 'text-orange-500' : 'text-gray-400'}`} />
                      <span className="font-bold text-sm text-gray-800 dark:text-white">Mobile Money</span>
                    </button>

                    <button
                      onClick={() => setPaymentMethod('cash_on_delivery')}
                      className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center space-y-2 ${
                        paymentMethod === 'cash_on_delivery'
                          ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 shadow-lg'
                          : 'border-gray-200 dark:border-gray-700 hover:border-orange-300'
                      }`}
                    >
                      <Banknote className={`h-8 w-8 ${paymentMethod === 'cash_on_delivery' ? 'text-orange-500' : 'text-gray-400'}`} />
                      <span className="font-bold text-sm text-gray-800 dark:text-white">Cash on Delivery</span>
                    </button>
                  </div>
                </div>

                {/* CARD PAYMENT FORM */}
                {paymentMethod === 'card' && (
                  <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border-2 border-orange-100 dark:border-gray-800 shadow-lg">
                    {/* Visual Card Preview */}
                    <div className="bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 rounded-2xl p-6 mb-6 text-white shadow-2xl shadow-orange-500/30 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
                      
                      <div className="relative z-10">
                        <div className="flex justify-between items-start mb-8">
                          <div className="w-12 h-9 bg-yellow-400 rounded-md"></div>
                          <span className="font-bold text-lg">{cardType || 'CARD'}</span>
                        </div>
                        
                        <p className="text-2xl font-mono tracking-wider mb-6">
                          {cardNumber || '•••• •••• •••• ••••'}
                        </p>
                        
                        <div className="flex justify-between items-end">
                          <div>
                            <p className="text-xs opacity-80">CARD HOLDER</p>
                            <p className="font-bold uppercase">{cardHolder || 'YOUR NAME'}</p>
                          </div>
                          <div>
                            <p className="text-xs opacity-80">EXPIRES</p>
                            <p className="font-bold">{expiryDate || 'MM/YY'}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card Form */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-white mb-2">Card Number</label>
                        <div className="relative">
                          <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="text"
                            value={cardNumber}
                            onChange={handleCardNumberChange}
                            placeholder="1234 5678 9012 3456"
                            className="w-full pl-12 pr-4 py-3 border-2 border-orange-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl focus:outline-none focus:border-orange-500 font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-white mb-2">Card Holder Name</label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="text"
                            value={cardHolder}
                            onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                            placeholder="The name of CARD Ownner"
                            className="w-full pl-12 pr-4 py-3 border-2 border-orange-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl focus:outline-none focus:border-orange-500 uppercase"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 dark:text-white mb-2">Expiry Date</label>
                          <div className="relative">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                              type="text"
                              value={expiryDate}
                              onChange={handleExpiryChange}
                              placeholder="MM/YY"
                              maxLength="5"
                              className="w-full pl-12 pr-4 py-3 border-2 border-orange-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl focus:outline-none focus:border-orange-500 font-mono"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-gray-700 dark:text-white mb-2">CVV</label>
                          <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                              type="text"
                              value={cvv}
                              onChange={(e) => setCvv(e.target.value.replace(/[^0-9]/g, '').substr(0, 4))}
                              placeholder="123"
                              maxLength="4"
                              className="w-full pl-12 pr-4 py-3 border-2 border-orange-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl focus:outline-none focus:border-orange-500 font-mono"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* MOBILE MONEY FORM */}
                {paymentMethod === 'mobile_money' && (
                  <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border-2 border-orange-100 dark:border-gray-800 shadow-lg">
                    <h4 className="font-bold text-gray-800 dark:text-white mb-4">Select Provider</h4>
                    
                    <div className="grid grid-cols-3 gap-3 mb-6">
                      {[
                        { id: 'mtn', name: 'MTN MoMo', color: 'from-yellow-400 to-yellow-500' },
                        { id: 'airtel', name: 'Airtel Money', color: 'from-red-500 to-red-600' },
                        { id: 'mpesa', name: 'M-Pesa', color: 'from-green-500 to-green-600' }
                      ].map(provider => (
                        <button
                          key={provider.id}
                          onClick={() => setMobileProvider(provider.id)}
                          className={`p-3 rounded-xl border-2 transition-all ${
                            mobileProvider === provider.id
                              ? 'border-orange-500 shadow-lg'
                              : 'border-gray-200 dark:border-gray-700'
                          }`}
                        >
                          <div className={`bg-gradient-to-br ${provider.color} h-12 rounded-lg flex items-center justify-center mb-2`}>
                            <Smartphone className="h-6 w-6 text-white" />
                          </div>
                          <p className="text-xs font-bold text-gray-800 dark:text-white">{provider.name}</p>
                        </button>
                      ))}
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-white mb-2">Phone Number</label>
                      <div className="relative">
                        <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9+]/g, ''))}
                          placeholder="+250 7XX XXX XXX"
                          className="w-full pl-12 pr-4 py-3 border-2 border-orange-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl focus:outline-none focus:border-orange-500"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-2">📱 You'll receive a payment prompt on this number</p>
                    </div>
                  </div>
                )}

                {/* CASH ON DELIVERY INFO */}
                {paymentMethod === 'cash_on_delivery' && (
                  <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 border-2 border-orange-100 dark:border-gray-800 shadow-lg">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full mb-4">
                        <Banknote className="h-10 w-10 text-green-500" />
                      </div>
                      <h4 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Cash on Delivery</h4>
                      <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Pay <span className="font-bold text-orange-500">${cartTotal.toFixed(2)}</span> in cash when your order arrives.
                      </p>
                      
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-500/30 rounded-xl p-4 text-left">
                        <p className="text-sm font-bold text-yellow-800 dark:text-yellow-300 mb-2">⚠️ Please Note:</p>
                        <ul className="text-sm text-yellow-700 dark:text-yellow-400 space-y-1">
                          <li>• Have exact cash ready</li>
                          <li>• Order will be marked as paid upon delivery</li>
                          <li>• No card payment accepted at delivery</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* PAY BUTTON */}
                <button
                  onClick={handlePayment}
                  disabled={processing}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-4 rounded-xl transition-all shadow-xl shadow-orange-500/30 disabled:opacity-50 flex items-center justify-center space-x-2 text-lg"
                >
                  {processing ? (
                    <>
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                      <span>
                        {paymentMethod === 'card' && 'Processing Payment...'}
                        {paymentMethod === 'mobile_money' && 'Sending Payment Request...'}
                        {paymentMethod === 'cash_on_delivery' && 'Placing Order...'}
                      </span>
                    </>
                  ) : (
                    <>
                      <Lock className="h-5 w-5" />
                      <span>
                        {paymentMethod === 'cash_on_delivery' 
                          ? `Place Order ($${cartTotal.toFixed(2)})` 
                          : `Pay $${cartTotal.toFixed(2)} & Place Order`}
                      </span>
                    </>
                  )}
                </button>

                {/* Security Note */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-500/30 rounded-xl p-4">
                  <div className="flex items-start space-x-3">
                    <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-blue-900 dark:text-blue-300">🔒 100% Secure Payment</p>
                      <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
                        Your payment information is encrypted and secure. We never store your card details.
                      </p>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => setStep(1)} 
                  className="w-full text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500 font-semibold flex items-center justify-center space-x-1 py-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Change Address</span>
                </button>
              </div>
            )}
          </div>

          {/* ORDER SUMMARY SIDEBAR */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border-2 border-orange-100 dark:border-gray-800 shadow-lg sticky top-6">
              <div className="flex items-center space-x-2 mb-4">
                <ShoppingBag className="h-6 w-6 text-orange-500" />
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">Order Summary</h3>
              </div>

              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                {cart.map(item => {
                  const price = Number(item.price) || 0;
                  return (
                    <div key={item.id} className="flex items-center space-x-3 pb-3 border-b border-orange-100 dark:border-gray-800">
                      <img 
                        src={item.image_url} 
                        alt={item.name}
                        className="w-12 h-12 rounded-lg object-cover"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/48'; }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 dark:text-white text-sm truncate">{item.name}</p>
                        <p className="text-xs text-gray-500">×{item.quantity}</p>
                      </div>
                      <p className="font-bold text-orange-500 text-sm">
                        ${(price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-2 pt-3 border-t-2 border-orange-100 dark:border-gray-800">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>Subtotal:</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>Delivery Fee:</span>
                  <span className="text-green-500 font-semibold">FREE</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t-2 border-orange-100 dark:border-gray-800">
                  <span className="text-lg font-bold text-gray-800 dark:text-white">Total:</span>
                  <span className="text-2xl font-bold text-orange-500">${cartTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;