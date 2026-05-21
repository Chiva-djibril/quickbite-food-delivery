import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { User, Mail, Phone, MapPin, Camera, Save, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, token, login } = useAuth();
  const navigate = useNavigate();
  
  const [form, setForm] = useState({
    fullname: user?.fullname || '',
    phone: user?.phone || '',
    address: user?.address || '',
    profile_picture: user?.profile_picture || ''
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const { data } = await axios.post(
        'http://localhost:5000/api/upload',
        formData,
        { 
          headers: { 
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}` 
          } 
        }
      );
      setForm({ ...form, profile_picture: data.url });
      toast.success('Picture uploaded! Click Save to apply.');
    } catch (err) {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data } = await axios.put(
        'http://localhost:5000/api/auth/profile',
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      login(data.user, token);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error('Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => navigate(-1)} 
          className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white mb-6 transition-colors">
          <ArrowLeft className="h-5 w-5" />
          <span className="font-medium">Back</span>
        </button>

        <div className="bg-white dark:bg-black border-2 border-black dark:border-white rounded-3xl overflow-hidden">
          <div className="bg-black dark:bg-white p-8 text-center">
            <h1 className="text-3xl font-bold text-white dark:text-black mb-1">My Profile</h1>
            <p className="text-gray-300 dark:text-gray-700 text-sm">Update your information</p>
          </div>

          <div className="p-8">
            <div className="flex flex-col items-center mb-8">
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-black dark:border-white bg-gray-100 dark:bg-gray-900">
                  {form.profile_picture ? (
                    <img 
                      src={form.profile_picture} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/128?text=User'; }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-black dark:bg-white">
                      <User className="h-16 w-16 text-white dark:text-black" />
                    </div>
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-black dark:bg-white text-white dark:text-black p-3 rounded-full cursor-pointer hover:scale-110 transition-transform shadow-lg">
                  <Camera className="h-5 w-5" />
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
              {uploading && (
                <p className="text-sm text-gray-500 mt-3">Uploading...</p>
              )}
              <p className="text-xs text-gray-400 mt-2">Click camera to change picture</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-black dark:text-white mb-2">Email (cannot change)</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input type="email" disabled value={user?.email}
                    className="w-full pl-12 pr-4 py-3 bg-gray-100 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 rounded-xl text-gray-500 cursor-not-allowed" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-black dark:text-white mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input type="text" required
                    value={form.fullname}
                    onChange={(e) => setForm({ ...form, fullname: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-white dark:bg-black border-2 border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:border-black dark:focus:border-white text-black dark:text-white" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-black dark:text-white mb-2">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-white dark:bg-black border-2 border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:border-black dark:focus:border-white text-black dark:text-white" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-black dark:text-white mb-2">Address</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-3 h-5 w-5 text-gray-400" />
                  <textarea rows="3"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-white dark:bg-black border-2 border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:border-black dark:focus:border-white text-black dark:text-white resize-none" />
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black font-bold py-3.5 rounded-xl transition-all shadow-lg disabled:opacity-50 flex items-center justify-center space-x-2">
                {loading ? (
                  <div className="animate-spin h-5 w-5 border-2 border-white dark:border-black border-t-transparent rounded-full"></div>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;