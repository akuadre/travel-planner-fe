import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';
import { itineraryService } from '../services/itineraryService';

const ItineraryForm = ({ destinationId, itinerary, onClose, onSave }) => {
  const isEdit = Boolean(itinerary);

  const [formData, setFormData] = useState({
    destination_id: destinationId,
    day_number: 1,
    location: '',
    description: '',
    schedule_time: '',
    activities: ''
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEdit) {
      setFormData({
        destination_id: destinationId,
        day_number: itinerary.day_number,
        location: itinerary.location,
        description: itinerary.description,
        schedule_time: itinerary.schedule_time || '',
        activities: itinerary.activities || ''
      });
    }
  }, [itinerary, destinationId, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.day_number || formData.day_number < 1) {
      newErrors.day_number = 'Valid day number is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      if (isEdit) {
        await itineraryService.update(itinerary.id, formData);
      } else {
        await itineraryService.create(formData);
      }
      
      onSave();
    } catch (error) {
      console.error('Failed to save itinerary:', error);
      alert('Failed to save itinerary. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">
            {isEdit ? 'Edit Activity' : 'Add New Activity'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Day Number */}
          <div>
            <label htmlFor="day_number" className="block text-sm font-medium text-gray-700 mb-2">
              Day Number *
            </label>
            <input
              type="number"
              id="day_number"
              name="day_number"
              value={formData.day_number}
              onChange={handleChange}
              min="1"
              max="30"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.day_number ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.day_number && (
              <p className="text-red-600 text-sm mt-1">{errors.day_number}</p>
            )}
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
              Location *
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.location ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., Hotel, Restaurant, Tourist Spot"
            />
            {errors.location && (
              <p className="text-red-600 text-sm mt-1">{errors.location}</p>
            )}
          </div>

          {/* Schedule Time */}
          <div>
            <label htmlFor="schedule_time" className="block text-sm font-medium text-gray-700 mb-2">
              Schedule Time
            </label>
            <input
              type="time"
              id="schedule_time"
              name="schedule_time"
              value={formData.schedule_time}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Describe what you'll be doing..."
            />
            {errors.description && (
              <p className="text-red-600 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          {/* Activities */}
          <div>
            <label htmlFor="activities" className="block text-sm font-medium text-gray-700 mb-2">
              Activities
            </label>
            <textarea
              id="activities"
              name="activities"
              value={formData.activities}
              onChange={handleChange}
              rows="2"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Specific activities (optional)"
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Saving...' : (isEdit ? 'Update Activity' : 'Add Activity')}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default ItineraryForm;