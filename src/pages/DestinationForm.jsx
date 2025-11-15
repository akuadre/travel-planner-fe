import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Upload, 
  X, 
  Camera,
  Calendar,
  DollarSign,
  MapPin,
  Plane,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { destinationService } from '../services/destinationService';

const DestinationForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    departure_date: '',
    budget: '',
    duration_days: '',
    is_achieved: false,
    photo: null
  });

  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (isEdit) {
      loadDestination();
    }
  }, [id]);

  const loadDestination = async () => {
    try {
      setLoading(true);
      const destination = await destinationService.getById(id);
      
      setFormData({
        title: destination.title || '',
        departure_date: destination.departure_date || '',
        budget: destination.budget || '',
        duration_days: destination.duration_days || '',
        is_achieved: destination.is_achieved || false,
        photo: null
      });

      if (destination.photo) {
        setPhotoPreview(`http://localhost:8000/storage/${destination.photo}`);
      }
    } catch (error) {
      console.error('Failed to load destination:', error);
      setSubmitError('Failed to load destination data.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, photo: 'Please select an image file' }));
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, photo: 'Image size should be less than 2MB' }));
        return;
      }

      setFormData(prev => ({ ...prev, photo: file }));
      setErrors(prev => ({ ...prev, photo: '' }));

      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setFormData(prev => ({ ...prev, photo: null }));
    setPhotoPreview(null);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Destination title is required';
    }

    if (!formData.departure_date) {
      newErrors.departure_date = 'Departure date is required';
    } else {
      const selectedDate = new Date(formData.departure_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.departure_date = 'Departure date cannot be in the past';
      }
    }

    if (!formData.budget || parseFloat(formData.budget) <= 0) {
      newErrors.budget = 'Valid budget is required';
    }

    if (!formData.duration_days || parseInt(formData.duration_days) <= 0) {
      newErrors.duration_days = 'Valid duration is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const submitData = {
        ...formData,
        budget: parseFloat(formData.budget),
        duration_days: parseInt(formData.duration_days)
      };

      if (isEdit) {
        await destinationService.update(id, submitData);
      } else {
        await destinationService.create(submitData);
      }

      navigate('/destinations');
    } catch (error) {
      console.error('Failed to save destination:', error);
      setSubmitError(error.message || 'Failed to save destination. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEdit) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading destination...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-blue-500/10 to-cyan-400/10 rounded-2xl p-6 mb-6 border border-blue-200/30 backdrop-blur-sm"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/destinations"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {isEdit ? 'Edit Destination' : 'Plan New Adventure'}
              </h1>
              <p className="text-gray-600">
                {isEdit ? 'Update your travel details' : 'Add a new destination to your travel plans'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
              formData.is_achieved 
                ? 'bg-green-100 text-green-800' 
                : 'bg-orange-100 text-orange-800'
            }`}>
              {formData.is_achieved ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Completed
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4" />
                  Planning
                </>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Form Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Photo & Status */}
        <div className="lg:col-span-1 space-y-6">
          {/* Photo Upload Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Camera className="h-5 w-5 text-blue-500" />
              Destination Photo
            </h3>
            
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-gray-400 transition-colors group">
                {photoPreview ? (
                  <div className="relative">
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg mx-auto group-hover:scale-105 transition-transform duration-300"
                    />
                    <button
                      type="button"
                      onClick={removePhoto}
                      className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="py-8">
                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <Camera className="h-8 w-8 text-blue-500" />
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Upload destination photo
                    </p>
                    <label className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all cursor-pointer shadow-md hover:shadow-lg">
                      <Upload className="h-4 w-4 mr-2" />
                      Choose File
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                      />
                    </label>
                    <p className="text-xs text-gray-500 mt-2">
                      PNG, JPG up to 2MB
                    </p>
                  </div>
                )}
              </div>

              {errors.photo && (
                <p className="text-red-600 text-sm text-center">{errors.photo}</p>
              )}
            </div>
          </motion.div>

          {/* Status Toggle Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Trip Status
            </h3>
            
            <label className="flex items-center justify-between cursor-pointer group">
              <div>
                <div className="text-sm font-medium text-gray-900">
                  Mark as Completed
                </div>
                <div className="text-xs text-gray-500">
                  This trip has been finished
                </div>
              </div>
              <div className="relative">
                <input
                  type="checkbox"
                  name="is_achieved"
                  checked={formData.is_achieved}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div className={`w-12 h-6 rounded-full transition-colors duration-300 ${
                  formData.is_achieved ? 'bg-green-500' : 'bg-gray-300 group-hover:bg-gray-400'
                }`}></div>
                <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ${
                  formData.is_achieved ? 'transform translate-x-6' : ''
                }`}></div>
              </div>
            </label>
          </motion.div>
        </div>

        {/* Right Column - Form Fields */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 space-y-6"
        >
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            {submitError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                <p className="text-red-800 text-sm">{submitError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-3">
                  Destination Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50/50 ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Amazing Bali Adventure, Tokyo City Exploration..."
                />
                {errors.title && (
                  <p className="text-red-600 text-sm mt-2">{errors.title}</p>
                )}
              </div>

              {/* Date and Budget Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Departure Date */}
                <div>
                  <label htmlFor="departure_date" className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    Departure Date *
                  </label>
                  <input
                    type="date"
                    id="departure_date"
                    name="departure_date"
                    value={formData.departure_date}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50/50 ${
                      errors.departure_date ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.departure_date && (
                    <p className="text-red-600 text-sm mt-2">{errors.departure_date}</p>
                  )}
                </div>

                {/* Budget */}
                <div>
                  <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-500" />
                    Total Budget *
                  </label>
                  <input
                    type="number"
                    id="budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    min="0"
                    step="1000"
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50/50 ${
                      errors.budget ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0"
                  />
                  {errors.budget && (
                    <p className="text-red-600 text-sm mt-2">{errors.budget}</p>
                  )}
                </div>
              </div>

              {/* Duration */}
              <div>
                <label htmlFor="duration_days" className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-purple-500" />
                  Trip Duration (Days) *
                </label>
                <input
                  type="number"
                  id="duration_days"
                  name="duration_days"
                  value={formData.duration_days}
                  onChange={handleChange}
                  min="1"
                  max="365"
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50/50 ${
                    errors.duration_days ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="How many days will your trip be?"
                />
                {errors.duration_days && (
                  <p className="text-red-600 text-sm mt-2">{errors.duration_days}</p>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-6 border-t border-gray-200">
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-xl hover:from-blue-600 hover:to-cyan-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl flex-1 justify-center"
                >
                  <Save className="h-5 w-5 mr-2" />
                  {loading ? 'Saving...' : (isEdit ? 'Update Destination' : 'Create Destination')}
                </motion.button>
                
                <Link
                  to="/destinations"
                  className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DestinationForm;