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
  MapPin
} from 'lucide-react';
import { motion } from 'framer-motion';
import { destinationService } from '../services/destinationService';

const DestinationForm = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Untuk edit mode
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

  // Load destination data untuk edit mode
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
        photo: null // Reset photo, user harus upload baru jika mau ganti
      });

      // Set photo preview jika ada foto
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
    
    // Clear error ketika user mulai type
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, photo: 'Please select an image file' }));
        return;
      }

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, photo: 'Image size should be less than 2MB' }));
        return;
      }

      setFormData(prev => ({ ...prev, photo: file }));
      setErrors(prev => ({ ...prev, photo: '' }));

      // Create preview
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-6">
            <Link
              to="/destinations"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 mr-4"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Destinations
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEdit ? 'Edit Destination' : 'Add New Destination'}
            </h1>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border overflow-hidden"
        >
          {submitError && (
            <div className="bg-red-50 border-b border-red-200 px-6 py-4">
              <p className="text-red-800">{submitError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Photo Upload */}
              <div className="lg:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Destination Photo
                </label>
                
                <div className="space-y-4">
                  {/* Photo Preview/Upload Area */}
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-gray-400 transition-colors">
                    {photoPreview ? (
                      <div className="relative">
                        <img
                          src={photoPreview}
                          alt="Preview"
                          className="w-full h-48 object-cover rounded-lg mx-auto"
                        />
                        <button
                          type="button"
                          onClick={removePhoto}
                          className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div>
                        <Camera className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-sm text-gray-600 mb-2">
                          Upload a destination photo
                        </p>
                        <label className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
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
                    <p className="text-red-600 text-sm">{errors.photo}</p>
                  )}

                  {/* Status Toggle */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <label className="flex items-center cursor-pointer">
                      <div className="relative">
                        <input
                          type="checkbox"
                          name="is_achieved"
                          checked={formData.is_achieved}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <div className={`block w-14 h-8 rounded-full transition-colors ${
                          formData.is_achieved ? 'bg-green-500' : 'bg-gray-300'
                        }`}></div>
                        <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${
                          formData.is_achieved ? 'transform translate-x-6' : ''
                        }`}></div>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          Mark as Achieved
                        </div>
                        <div className="text-xs text-gray-500">
                          This trip has been completed
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Right Column - Form Fields */}
              <div className="lg:col-span-2 space-y-6">
                {/* Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Destination Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.title ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., Trip to Bali, Mountain Hiking, etc."
                  />
                  {errors.title && (
                    <p className="text-red-600 text-sm mt-1">{errors.title}</p>
                  )}
                </div>

                {/* Date and Budget Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Departure Date */}
                  <div>
                    <label htmlFor="departure_date" className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="h-4 w-4 inline mr-2" />
                      Departure Date *
                    </label>
                    <input
                      type="date"
                      id="departure_date"
                      name="departure_date"
                      value={formData.departure_date}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.departure_date ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.departure_date && (
                      <p className="text-red-600 text-sm mt-1">{errors.departure_date}</p>
                    )}
                  </div>

                  {/* Budget */}
                  <div>
                    <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
                      <DollarSign className="h-4 w-4 inline mr-2" />
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
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.budget ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="0"
                    />
                    {errors.budget && (
                      <p className="text-red-600 text-sm mt-1">{errors.budget}</p>
                    )}
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <label htmlFor="duration_days" className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="h-4 w-4 inline mr-2" />
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
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.duration_days ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="How many days?"
                  />
                  {errors.duration_days && (
                    <p className="text-red-600 text-sm mt-1">{errors.duration_days}</p>
                  )}
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-3 pt-6 border-t">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Save className="h-5 w-5 mr-2" />
                    {loading ? 'Saving...' : (isEdit ? 'Update Destination' : 'Create Destination')}
                  </button>
                  
                  <Link
                    to="/destinations"
                    className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </Link>
                </div>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default DestinationForm;