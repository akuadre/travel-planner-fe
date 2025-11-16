import React, { useState, useEffect } from "react";
import {
  X,
  Calendar,
  MapPin,
  Clock,
  FileText,
  Zap,
  Plus,
  Star,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { itineraryService } from "../services/itineraryService";

const ItineraryForm = ({ destinationId, itinerary, onClose, onSave }) => {
  const isEdit = Boolean(itinerary);

  const [formData, setFormData] = useState({
    destination_id: destinationId,
    day_number: 1,
    location: "",
    description: "",
    schedule_time: "",
    activities: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showActivitySuggestions, setShowActivitySuggestions] = useState(false);

  // Activity suggestions untuk auto-complete
  const activitySuggestions = [
    "Hotel Check-in",
    "Breakfast",
    "Lunch",
    "Dinner",
    "Sightseeing",
    "Museum Visit",
    "Shopping",
    "Hiking",
    "Beach Time",
    "Photo Session",
    "Transport",
    "Rest",
    "Swimming",
    "Cultural Tour",
    "Food Tour",
    "Adventure",
  ];

  useEffect(() => {
    if (isEdit) {
      setFormData({
        destination_id: destinationId,
        day_number: itinerary.day_number,
        location: itinerary.location,
        description: itinerary.description,
        schedule_time: itinerary.schedule_time || "",
        activities: itinerary.activities || "",
      });
    }
  }, [itinerary, destinationId, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const addActivitySuggestion = (activity) => {
    const currentActivities = formData.activities
      ? formData.activities
          .split(",")
          .map((a) => a.trim())
          .filter((a) => a)
      : [];

    if (!currentActivities.includes(activity)) {
      const newActivities = [...currentActivities, activity].join(", ");
      setFormData((prev) => ({
        ...prev,
        activities: newActivities,
      }));
    }

    setShowActivitySuggestions(false);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.day_number || formData.day_number < 1) {
      newErrors.day_number = "Valid day number is required";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
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
      console.error("Failed to save itinerary:", error);
      alert("Failed to save itinerary. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ItineraryForm.jsx - FULL VERSION DENGAN FIX
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col border border-gray-200/60"
        >
          {/* 🔥 FIX 2: Header dengan rounded top */}
          <div className="bg-gradient-to-r from-blue-500 to-cyan-400 p-6 text-white flex-shrink-0 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Calendar className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">
                    {isEdit ? "Edit Activity" : "Plan New Activity"}
                  </h2>
                  <p className="text-blue-100 text-sm opacity-90">
                    {isEdit
                      ? "Update your travel plan"
                      : "Add to your adventure"}
                  </p>
                </div>
              </div>
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 hover:bg-white/20 rounded-xl transition-all"
              >
                <X className="h-5 w-5" />
              </motion.button>
            </div>
          </div>

          {/* 🔥 FIX 1: Form dengan scrollbar selalu visible */}
          <div className="flex-1 overflow-y-auto always-visible-scrollbar">
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Day Number */}
              <div className="space-y-2">
                <label
                  htmlFor="day_number"
                  className="flex items-center gap-2 text-sm font-semibold text-gray-700"
                >
                  <Calendar className="h-4 w-4 text-blue-500" />
                  Day Number *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="day_number"
                    name="day_number"
                    value={formData.day_number}
                    onChange={handleChange}
                    min="1"
                    max="30"
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
                      errors.day_number
                        ? "border-red-300 bg-red-50"
                        : "border-gray-200 hover:border-gray-300 focus:border-blue-500"
                    }`}
                  />
                  {errors.day_number && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-600 text-sm mt-2 flex items-center gap-1"
                    >
                      ⚠️ {errors.day_number}
                    </motion.p>
                  )}
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <label
                  htmlFor="location"
                  className="flex items-center gap-2 text-sm font-semibold text-gray-700"
                >
                  <MapPin className="h-4 w-4 text-green-500" />
                  Location *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
                      errors.location
                        ? "border-red-300 bg-red-50"
                        : "border-gray-200 hover:border-gray-300 focus:border-blue-500"
                    }`}
                    placeholder="Where will this activity take place?"
                  />
                  {errors.location && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-600 text-sm mt-2 flex items-center gap-1"
                    >
                      ⚠️ {errors.location}
                    </motion.p>
                  )}
                </div>
              </div>

              {/* Schedule Time */}
              <div className="space-y-2">
                <label
                  htmlFor="schedule_time"
                  className="flex items-center gap-2 text-sm font-semibold text-gray-700"
                >
                  <Clock className="h-4 w-4 text-purple-500" />
                  Schedule Time
                </label>
                <input
                  type="time"
                  id="schedule_time"
                  name="schedule_time"
                  value={formData.schedule_time}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label
                  htmlFor="description"
                  className="flex items-center gap-2 text-sm font-semibold text-gray-700"
                >
                  <FileText className="h-4 w-4 text-orange-500" />
                  Description *
                </label>
                <div className="relative">
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none ${
                      errors.description
                        ? "border-red-300 bg-red-50"
                        : "border-gray-200 hover:border-gray-300 focus:border-blue-500"
                    }`}
                    placeholder="Describe what you'll be doing at this location..."
                  />
                  {errors.description && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-600 text-sm mt-2 flex items-center gap-1"
                    >
                      ⚠️ {errors.description}
                    </motion.p>
                  )}
                </div>
              </div>

              {/* Activities */}
              <div className="space-y-2">
                <label
                  htmlFor="activities"
                  className="flex items-center gap-2 text-sm font-semibold text-gray-700"
                >
                  <Zap className="h-4 w-4 text-yellow-500" />
                  Activities
                  <span className="text-xs text-gray-500 font-normal">
                    (Optional)
                  </span>
                </label>

                <div className="relative">
                  <textarea
                    id="activities"
                    name="activities"
                    value={formData.activities}
                    onChange={handleChange}
                    rows="2"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                    placeholder="Add specific activities or click + for suggestions"
                    onFocus={() => setShowActivitySuggestions(true)}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowActivitySuggestions(!showActivitySuggestions)
                    }
                    className="absolute right-3 top-3 p-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <AnimatePresence>
                  {showActivitySuggestions && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-gray-50 rounded-xl p-3 border border-gray-200"
                    >
                      <p className="text-xs text-gray-600 mb-2 font-medium">
                        Quick Add:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {activitySuggestions.map((activity) => (
                          <motion.button
                            key={activity}
                            type="button"
                            onClick={() => addActivitySuggestion(activity)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all"
                          >
                            + {activity}
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4 pb-2 sticky bottom-0 bg-white">
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-400 text-white py-3 px-6 rounded-xl hover:from-blue-600 hover:to-cyan-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl font-semibold flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Star className="h-4 w-4" />
                      {isEdit ? "Update Activity" : "Add Activity"}
                    </>
                  )}
                </motion.button>

                <motion.button
                  type="button"
                  onClick={onClose}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all font-semibold"
                >
                  Cancel
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ItineraryForm;
