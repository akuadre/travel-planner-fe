import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
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
  XCircle,
  Plus,
  Minus,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  STORAGE_BASE_URL,
  destinationService,
} from "../services/destinationService";

const DestinationForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    title: "",
    departure_date: "",
    budget: "",
    duration_days: "",
    is_achieved: false,
    photo: null,
  });

  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    if (isEdit) {
      loadDestination();
    }
  }, [id]);

  const loadDestination = async () => {
    try {
      setLoading(true);
      const destination = await destinationService.getById(id);

      // Robust budget formatting function
      const formatBudgetForInput = (budget) => {
        if (!budget && budget !== 0) return "";

        // Convert to number first
        const numBudget =
          typeof budget === "string" ? parseFloat(budget) : Number(budget);

        // Check if it's a whole number (no decimal places)
        if (Number.isInteger(numBudget)) {
          return numBudget.toString();
        }

        // If it has decimal places, check if they are just .00
        if (numBudget % 1 === 0) {
          return Math.floor(numBudget).toString();
        }

        // For other decimal values, return as is but remove trailing .00 if present
        return numBudget.toString().replace(/\.00$/, "");
      };

      // Fix departure date format for input[type="date"]
      const formatDateForInput = (dateString) => {
        if (!dateString) return "";

        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "";

        // Format to YYYY-MM-DD for input[type="date"]
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
      };

      setFormData({
        title: destination.title || "",
        departure_date: formatDateForInput(destination.departure_date), // Fixed date format
        budget: formatBudgetForInput(destination.budget),
        duration_days: destination.duration_days || "",
        is_achieved: destination.is_achieved || false,
        photo: null,
      });

      if (destination.photo) {
        setPhotoPreview(`${destination.photo}`);
      }
    } catch (error) {
      console.error("Failed to load destination:", error);
      setSubmitError("Failed to load destination data.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Modern budget handlers with +/- buttons
  const handleBudgetChange = (e) => {
    const { value } = e.target;

    // Remove formatting to get raw number
    const rawValue = value.replace(/[^\d]/g, "");

    setFormData((prev) => ({
      ...prev,
      budget: rawValue,
    }));

    if (errors.budget) {
      setErrors((prev) => ({ ...prev, budget: "" }));
    }
  };

  // Custom date selection handler
  const handleDateSelect = (date) => {
    const formattedDate = date.toISOString().split("T")[0];
    setFormData((prev) => ({ ...prev, departure_date: formattedDate }));
    setShowDatePicker(false);
  };

  // Custom Date Picker Component
  const CustomDatePicker = () => {
    const today = new Date();
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const days = [];
    for (let i = 1; i <= nextMonth.getDate(); i++) {
      days.push(i);
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 p-4"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-gray-900">Select Date</h3>
          <button
            onClick={() => setShowDatePicker(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {["M", "T", "W", "T", "F", "S", "S"].map((day) => (
            <div
              key={day}
              className="text-center text-xs font-medium text-gray-500 py-2"
            >
              {day}
            </div>
          ))}
          {days.map((day) => {
            const date = new Date(today.getFullYear(), today.getMonth(), day);
            const isSelected =
              formData.departure_date === date.toISOString().split("T")[0];
            const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));

            return (
              <button
                key={day}
                onClick={() => !isPast && handleDateSelect(date)}
                disabled={isPast}
                className={`p-2 rounded-lg text-sm font-medium transition-all ${
                  isSelected
                    ? "bg-blue-500 text-white"
                    : isPast
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </motion.div>
    );
  };

  // Format budget for display with thousands separators
  const formatBudgetDisplay = (budget) => {
    if (!budget) return "";
    const num = parseInt(budget);
    if (isNaN(num)) return "";
    return num.toLocaleString("id-ID");
  };

  const incrementBudget = () => {
    const currentBudget = parseInt(formData.budget || "0");
    const newBudget = currentBudget + 100000; // Increment by 100,000
    setFormData((prev) => ({
      ...prev,
      budget: newBudget.toString(),
    }));
  };

  const decrementBudget = () => {
    const currentBudget = parseInt(formData.budget || "0");
    if (currentBudget > 0) {
      const newBudget = Math.max(0, currentBudget - 100000); // Decrement by 100,000, minimum 0
      setFormData((prev) => ({
        ...prev,
        budget: newBudget.toString(),
      }));
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          photo: "Please select an image file",
        }));
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          photo: "Image size should be less than 2MB",
        }));
        return;
      }

      setFormData((prev) => ({ ...prev, photo: file }));
      setErrors((prev) => ({ ...prev, photo: "" }));

      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setFormData((prev) => ({ ...prev, photo: null }));
    setPhotoPreview(null);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Destination title is required";
    }

    if (!formData.departure_date) {
      newErrors.departure_date = "Departure date is required";
    } else {
      const selectedDate = new Date(formData.departure_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        newErrors.departure_date = "Departure date cannot be in the past";
      }
    }

    if (!formData.budget || parseFloat(formData.budget) <= 0) {
      newErrors.budget = "Valid budget is required";
    }

    if (!formData.duration_days || parseInt(formData.duration_days) <= 0) {
      newErrors.duration_days = "Valid duration is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const submitData = {
        ...formData,
        budget: parseFloat(formData.budget),
        duration_days: parseInt(formData.duration_days),
      };

      if (isEdit) {
        await destinationService.update(id, submitData);
      } else {
        await destinationService.create(submitData);
      }

      navigate("/destinations");
    } catch (error) {
      console.error("Failed to save destination:", error);
      setSubmitError(
        error.message || "Failed to save destination. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (photoPath) => {
    if (!photoPath) return null;
    if (photoPath.startsWith("http")) return photoPath;
    return `${STORAGE_BASE_URL}/destinations/${photoPath}`;
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

  const imageUrl = getImageUrl(photoPreview);

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
                {isEdit ? "Edit Destination" : "Plan New Adventure"}
              </h1>
              <p className="text-gray-600">
                {isEdit
                  ? "Update your travel details"
                  : "Add a new destination to your travel plans"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div
              className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                formData.is_achieved
                  ? "bg-green-100 text-green-800"
                  : "bg-orange-100 text-orange-800"
              }`}
            >
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
                      src={imageUrl}
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
                <p className="text-red-600 text-sm text-center">
                  {errors.photo}
                </p>
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
                <div
                  className={`w-12 h-6 rounded-full transition-colors duration-300 ${
                    formData.is_achieved
                      ? "bg-green-500"
                      : "bg-gray-300 group-hover:bg-gray-400"
                  }`}
                ></div>
                <div
                  className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ${
                    formData.is_achieved ? "transform translate-x-6" : ""
                  }`}
                ></div>
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
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-3"
                >
                  <span>
                    Destination Title
                    <span className="ml-1 text-red-600">*</span>
                  </span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50/50 ${
                    errors.title ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="e.g., Amazing Bali Adventure, Tokyo City Exploration..."
                />
                {errors.title && (
                  <p className="text-red-600 text-sm mt-2">{errors.title}</p>
                )}
              </div>

              {/* Modern Inputs - 2 ROW LAYOUT */}
              <div className="space-y-6">
                {/* Row 1: Departure Date - Full Width */}
                <div>
                  <label
                    htmlFor="departure_date"
                    className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2"
                  >
                    <Calendar className="h-4 w-4 text-blue-500" />
                    <span>
                      Departure Date
                      <span className="ml-1 text-red-600">*</span>
                    </span>
                  </label>

                  <div className="relative date-picker-container max-w-2xl">
                    {/* Custom text input that triggers date picker */}
                    <div
                      onClick={() => setShowDatePicker(!showDatePicker)}
                      className={`w-full pl-12 pr-4 py-3 border rounded-xl cursor-pointer transition-all bg-gray-50/50 group-hover:border-blue-300 ${
                        errors.departure_date
                          ? "border-red-500"
                          : "border-gray-300"
                      } ${
                        formData.departure_date
                          ? "text-gray-900"
                          : "text-gray-500"
                      }`}
                    >
                      {formData.departure_date
                        ? new Date(formData.departure_date).toLocaleDateString(
                            "id-ID",
                            {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )
                        : "Select departure date"}
                    </div>

                    {/* Calendar Icon */}
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center shadow-sm">
                        <Calendar className="h-4 w-4 text-white" />
                      </div>
                    </div>

                    {/* Custom Date Picker */}
                    {showDatePicker && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 p-4"
                      >
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="font-semibold text-gray-900">
                            Select Date
                          </h3>
                          <button
                            onClick={() => setShowDatePicker(false)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-7 gap-1">
                          {["M", "T", "W", "T", "F", "S", "S"].map((day) => (
                            <div
                              key={day}
                              className="text-center text-xs font-medium text-gray-500 py-2"
                            >
                              {day}
                            </div>
                          ))}
                          {Array.from({ length: 31 }, (_, i) => i + 1).map(
                            (day) => {
                              const today = new Date();
                              const date = new Date(
                                today.getFullYear(),
                                today.getMonth(),
                                day
                              );
                              const isSelected =
                                formData.departure_date ===
                                date.toISOString().split("T")[0];
                              const isPast =
                                date <
                                new Date(new Date().setHours(0, 0, 0, 0));

                              return (
                                <button
                                  key={day}
                                  onClick={() =>
                                    !isPast && handleDateSelect(date)
                                  }
                                  disabled={isPast}
                                  className={`p-2 rounded-lg text-sm font-medium transition-all ${
                                    isSelected
                                      ? "bg-blue-500 text-white"
                                      : isPast
                                      ? "text-gray-300 cursor-not-allowed"
                                      : "text-gray-700 hover:bg-gray-100"
                                  }`}
                                >
                                  {day}
                                </button>
                              );
                            }
                          )}
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {errors.departure_date && (
                    <p className="text-red-600 text-sm mt-2">
                      {errors.departure_date}
                    </p>
                  )}
                </div>

                {/* Row 2: Budget & Duration - Side by Side */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Budget */}
                  <div>
                    <label
                      htmlFor="budget"
                      className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2"
                    >
                      <DollarSign className="h-4 w-4 text-green-500" />
                      <span>
                        Total Budget
                        <span className="ml-1 text-red-600">*</span>
                      </span>
                    </label>

                    <div className="flex gap-2">
                      {/* Minus Button */}
                      <motion.button
                        type="button"
                        onClick={decrementBudget}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl flex items-center justify-center hover:from-red-600 hover:to-red-700 transition-all shadow-lg flex-shrink-0 border border-red-400"
                      >
                        <Minus className="h-5 w-5" />
                      </motion.button>

                      {/* Input Field with Currency */}
                      <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 font-medium text-sm">
                            Rp
                          </span>
                        </div>
                        <input
                          type="text"
                          id="budget"
                          name="budget"
                          value={formatBudgetDisplay(formData.budget)}
                          onChange={handleBudgetChange}
                          className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50/50 text-right font-medium text-gray-900 ${
                            errors.budget ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="0"
                        />
                      </div>

                      {/* Plus Button */}
                      <motion.button
                        type="button"
                        onClick={incrementBudget}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl flex items-center justify-center hover:from-green-600 hover:to-green-700 transition-all shadow-lg flex-shrink-0 border border-green-400"
                      >
                        <Plus className="h-5 w-5" />
                      </motion.button>
                    </div>

                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-500">
                        Adjust by 100,000
                      </span>
                      {formData.budget && (
                        <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
                          Rp {formatBudgetDisplay(formData.budget)}
                        </span>
                      )}
                    </div>

                    {errors.budget && (
                      <p className="text-red-600 text-sm mt-2">
                        {errors.budget}
                      </p>
                    )}
                  </div>

                  {/* Duration */}
                  <div>
                    <label
                      htmlFor="duration_days"
                      className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2"
                    >
                      <MapPin className="h-4 w-4 text-purple-500" />
                      Trip Duration *
                    </label>

                    <div className="flex gap-2">
                      {/* Minus Button */}
                      <motion.button
                        type="button"
                        onClick={() => {
                          const currentDays = parseInt(
                            formData.duration_days || "1"
                          );
                          if (currentDays > 1) {
                            setFormData((prev) => ({
                              ...prev,
                              duration_days: (currentDays - 1).toString(),
                            }));
                          }
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={parseInt(formData.duration_days || "1") <= 1}
                        className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl flex items-center justify-center hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg flex-shrink-0 border border-purple-400 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Minus className="h-5 w-5" />
                      </motion.button>

                      {/* Duration Display - Hide default arrows */}
                      <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                          <MapPin className="h-4 w-4 text-purple-500" />
                        </div>
                        <input
                          type="number"
                          id="duration_days"
                          name="duration_days"
                          value={formData.duration_days}
                          onChange={handleChange}
                          min="1"
                          max="365"
                          className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50/50 text-center font-medium text-gray-900 appearance-none ${
                            errors.duration_days
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="0"
                          // Hide default arrows for all browsers
                          style={{
                            MozAppearance: "textfield",
                            WebkitAppearance: "none",
                            appearance: "none",
                          }}
                        />

                        {/* Hide spinner arrows for Webkit browsers */}
                        <style jsx>{`
                          input[type="number"]::-webkit-outer-spin-button,
                          input[type="number"]::-webkit-inner-spin-button {
                            -webkit-appearance: none;
                            margin: 0;
                          }
                        `}</style>

                        {/* Days Label */}
                        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                          <span className="text-sm font-medium text-purple-600 bg-white/80 px-2 py-1 rounded-lg border border-purple-200">
                            days
                          </span>
                        </div>
                      </div>

                      {/* Plus Button */}
                      <motion.button
                        type="button"
                        onClick={() => {
                          const currentDays = parseInt(
                            formData.duration_days || "1"
                          );
                          if (currentDays < 365) {
                            setFormData((prev) => ({
                              ...prev,
                              duration_days: (currentDays + 1).toString(),
                            }));
                          }
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={
                          parseInt(formData.duration_days || "1") >= 365
                        }
                        className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl flex items-center justify-center hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg flex-shrink-0 border border-purple-400 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Plus className="h-5 w-5" />
                      </motion.button>
                    </div>

                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-500">1-365 days</span>
                      {formData.duration_days && (
                        <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-lg">
                          {formData.duration_days} days
                        </span>
                      )}
                    </div>

                    {errors.duration_days && (
                      <p className="text-red-600 text-sm mt-2">
                        {errors.duration_days}
                      </p>
                    )}
                  </div>
                </div>
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
                  {loading
                    ? "Saving..."
                    : isEdit
                    ? "Update Destination"
                    : "Create Destination"}
                </motion.button>

                <Link
                  to="/destinations"
                  className="inline-flex items-center px-18 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium"
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
