import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, Link, useLocation } from "react-router-dom";
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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  STORAGE_BASE_URL,
  destinationService,
} from "../services/destinationService";
import Notification, { useNotification } from "../components/Notification";

const DestinationForm = () => {
  const location = useLocation();
  const formKey = location.key || "default";

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
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isMobile, setIsMobile] = useState(false);

  const { notification, showNotification, dismissNotification } =
    useNotification();

  const calendarRef = useRef(null);

  const getDateStatus = () => {
    if (!formData.departure_date) return "EMPTY";

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dep = new Date(formData.departure_date);
    dep.setHours(0, 0, 0, 0);

    if (dep < today) return "PAST";
    if (dep > today) return "FUTURE";
    return "TODAY";
  };

  const dateStatus = getDateStatus();
  const isToggleDisabled = dateStatus === "PAST";

  useEffect(() => {
    const resetForm = () => {
      setFormData({
        title: "",
        departure_date: "",
        budget: "",
        duration_days: "",
        is_achieved: false,
        photo: null,
      });
      setPhotoPreview(null);
      setSelectedDate(new Date());
      setErrors({});
      setSubmitError("");
    };

    if (id) {
      // Edit mode: Load destination
      loadDestination();
    } else {
      // Create mode: Reset form
      resetForm();
    }

    return () => {
      // console.log("🧽 Component cleanup");
    };
  }, [id]);

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Handle click outside calendar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowDatePicker(false);
      }
    };

    if (showDatePicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDatePicker]);

  useEffect(() => {
    if (formData.departure_date) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const departureDate = new Date(formData.departure_date);
      departureDate.setHours(0, 0, 0, 0);

      if (departureDate < today && !formData.is_achieved) {
        setFormData((prev) => ({
          ...prev,
          is_achieved: true,
        }));
        showNotification(
          "Perjalanan di masa lalu tidak bisa ditandai perencanaan. Status diubah ke 'Selesai'.",
          "warning"
        );
      }

      if (departureDate >= today && formData.is_achieved) {
        setFormData((prev) => ({
          ...prev,
          is_achieved: false,
        }));
        // showNotification(
        //   "Perjalanan di masa depan tidak bisa ditandai selesai. Status diubah ke 'Perencanaan'.",
        //   "warning"
        // );
      }
    }
  }, [formData.departure_date]);

  const loadDestination = async () => {
    try {
      setLoading(true);
      const destination = await destinationService.getById(id);

      const formatBudgetForInput = (budget) => {
        if (!budget && budget !== 0) return "";
        return budget.toString();
      };

      const formatDateForInput = (dateString) => {
        if (!dateString) return "";
        try {
          const date = new Date(dateString);
          const timezoneOffset = date.getTimezoneOffset() * 60000;
          const localDate = new Date(date.getTime() - timezoneOffset);
          const year = localDate.getFullYear();
          const month = String(localDate.getMonth() + 1).padStart(2, "0");
          const day = String(localDate.getDate()).padStart(2, "0");
          return `${year}-${month}-${day}`;
        } catch (error) {
          console.error("Error formatting date:", error);
          return "";
        }
      };

      setFormData({
        title: destination.title || "",
        departure_date: formatDateForInput(destination.departure_date),
        budget: formatBudgetForInput(destination.budget),
        duration_days: destination.duration_days || "",
        is_achieved: destination.is_achieved || false,
        photo: null,
      });

      if (destination.departure_date) {
        setSelectedDate(new Date(destination.departure_date));
      }

      if (destination.photo) {
        const previewUrl = `${STORAGE_BASE_URL}/destinations/${destination.photo}`;
        setPhotoPreview(previewUrl);
      } else {
        setPhotoPreview(null);
      }
    } catch (error) {
      console.error("Failed to load destination:", error);
      setSubmitError("Gagal memuat data destinasi.");
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

  const handleBudgetChange = (e) => {
    const { value } = e.target;
    const rawValue = value.replace(/[^\d]/g, "");

    setFormData((prev) => ({
      ...prev,
      budget: rawValue,
    }));

    if (errors.budget) {
      setErrors((prev) => ({ ...prev, budget: "" }));
    }
  };

  const handleDateSelect = (date) => {
    const localDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );

    const year = localDate.getFullYear();
    const month = String(localDate.getMonth() + 1).padStart(2, "0");
    const day = String(localDate.getDate()).padStart(2, "0");

    const formattedDate = `${year}-${month}-${day}`;

    setFormData((prev) => ({ ...prev, departure_date: formattedDate }));
    setSelectedDate(localDate);
    setShowDatePicker(false);
  };

  const formatBudgetDisplay = (budget) => {
    if (!budget) return "";
    const num = parseInt(budget);
    if (isNaN(num)) return "";
    return num.toLocaleString("id-ID");
  };

  const incrementBudget = () => {
    const currentBudget = parseInt(formData.budget || "0");
    const newBudget = currentBudget + 100000;
    setFormData((prev) => ({
      ...prev,
      budget: newBudget.toString(),
    }));
  };

  const decrementBudget = () => {
    const currentBudget = parseInt(formData.budget || "0");
    if (currentBudget > 0) {
      const newBudget = Math.max(0, currentBudget - 100000);
      setFormData((prev) => ({
        ...prev,
        budget: newBudget.toString(),
      }));
    }
  };

  const incrementDuration = () => {
    const currentDays = parseInt(formData.duration_days || "0");
    const newDays = currentDays + 1;
    if (newDays <= 365) {
      setFormData((prev) => ({
        ...prev,
        duration_days: newDays.toString(),
      }));
    }
  };

  const decrementDuration = () => {
    const currentDays = parseInt(formData.duration_days || "0");
    if (currentDays > 1) {
      setFormData((prev) => ({
        ...prev,
        duration_days: (currentDays - 1).toString(),
      }));
    } else if (currentDays === 1) {
      setFormData((prev) => ({
        ...prev,
        duration_days: "0",
      }));
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          photo: "Harap pilih file gambar",
        }));
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          photo: "Ukuran gambar harus kurang dari 2MB",
        }));
        return;
      }

      setFormData((prev) => ({ ...prev, photo: file }));
      setErrors((prev) => ({ ...prev, photo: "" }));

      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target.result);
      };
      reader.onerror = () => {
        console.error("Failed to read file");
        setErrors((prev) => ({ ...prev, photo: "Gagal membaca file gambar" }));
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
      newErrors.title = "Judul destinasi wajib diisi";
    } else if (formData.title.trim().length < 3) {
      newErrors.title = "Judul destinasi minimal 3 karakter";
    }

    if (!formData.departure_date) {
      newErrors.departure_date = "Tanggal keberangkatan wajib diisi";
    }
    // else {
    //   const selectedDate = new Date(formData.departure_date + "T12:00:00");
    //   const today = new Date();
    //   today.setHours(12, 0, 0, 0);

    //   if (selectedDate < today) {
    //     newErrors.departure_date =
    //       "Tanggal keberangkatan tidak boleh di masa lalu";
    //   }
    // }

    if (!formData.budget || parseFloat(formData.budget) <= 0) {
      newErrors.budget = "Budget yang valid wajib diisi";
    } else if (parseFloat(formData.budget) > 1000000000) {
      newErrors.budget = "Budget terlalu besar (maksimal 1 miliar)";
    }

    if (!formData.duration_days || parseInt(formData.duration_days) <= 0) {
      newErrors.duration_days = "Durasi yang valid wajib diisi";
    } else if (parseInt(formData.duration_days) > 365) {
      newErrors.duration_days = "Durasi maksimal 365 hari";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isFormComplete = () => {
    return (
      formData.title.trim() &&
      formData.departure_date &&
      formData.budget &&
      parseFloat(formData.budget) > 0 &&
      formData.duration_days &&
      parseInt(formData.duration_days) > 0
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    if (!validateForm()) {
      showNotification("Harap periksa form untuk kesalahan", "error");
      return;
    }

    setLoading(true);

    try {
      const submitData = new FormData();
      submitData.append("title", formData.title);
      submitData.append("departure_date", formData.departure_date);
      submitData.append("budget", parseFloat(formData.budget));
      submitData.append("duration_days", parseInt(formData.duration_days));
      submitData.append("is_achieved", formData.is_achieved ? "1" : "0");

      if (formData.photo && formData.photo instanceof File) {
        submitData.append("photo", formData.photo);
      }

      let result;
      if (isEdit) {
        result = await destinationService.update(id, submitData);
        showNotification("Destinasi berhasil diperbarui!", "success");
      } else {
        result = await destinationService.create(submitData);
        showNotification("Destinasi berhasil dibuat!", "success");
      }

      // setTimeout(() => {
      //   navigate("/destinations");
      // }, 1500);

      navigate("/destinations");
    } catch (error) {
      let errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Gagal menyimpan destinasi. Silakan coba lagi.";

      if (error.response?.data?.errors) {
        const validationErrors = error.response.data.errors;
        errorMessage = Object.values(validationErrors).flat().join(", ");
      }

      showNotification(errorMessage, "error");
      setSubmitError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEdit) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat destinasi...</p>
        </div>
      </div>
    );
  }

  // Skeleton loading untuk initial load
  const SkeletonHeader = () => (
    <motion.div className="bg-gradient-to-br from-blue-500/10 to-cyan-400/10 rounded-xl md:rounded-2xl p-4 md:p-6 mb-4 md:mb-6 border border-blue-200/30">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="w-6 h-6 md:w-8 md:h-8 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="space-y-1.5 md:space-y-2">
            <div className="h-6 md:h-8 bg-gray-200 rounded animate-pulse w-32 md:w-48"></div>
            <div className="h-3 md:h-4 bg-gray-200 rounded animate-pulse w-24 md:w-36"></div>
          </div>
        </div>
        <div className="h-7 md:h-8 bg-gray-200 rounded-full animate-pulse w-24 md:w-32"></div>
      </div>
    </motion.div>
  );

  const SkeletonForm = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
      {/* Left Column */}
      <div className="lg:col-span-1 space-y-4 md:space-y-6">
        {/* Photo Upload Skeleton */}
        <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 border border-gray-200 shadow-sm">
          <div className="h-6 md:h-7 bg-gray-200 rounded animate-pulse w-32 md:w-40 mb-3 md:mb-4"></div>
          <div className="border-2 border-dashed border-gray-300 rounded-lg md:rounded-xl p-4 md:p-8 text-center">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-200 rounded-xl md:rounded-2xl mx-auto mb-2 md:mb-3 animate-pulse"></div>
            <div className="h-3 md:h-4 bg-gray-200 rounded animate-pulse w-24 md:w-32 mx-auto mb-2 md:mb-3"></div>
            <div className="h-8 md:h-10 bg-gray-200 rounded-lg md:rounded-xl animate-pulse w-24 md:w-32 mx-auto"></div>
          </div>
        </div>

        {/* Status Skeleton */}
        <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 border border-gray-200 shadow-sm">
          <div className="h-6 md:h-7 bg-gray-200 rounded animate-pulse w-28 md:w-36 mb-3 md:mb-4"></div>
          <div className="flex items-center justify-between">
            <div className="space-y-1.5 md:space-y-2">
              <div className="h-4 md:h-5 bg-gray-200 rounded animate-pulse w-24 md:w-32"></div>
              <div className="h-3 md:h-4 bg-gray-200 rounded animate-pulse w-20 md:w-28"></div>
            </div>
            <div className="h-6 w-12 md:h-7 md:w-14 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="lg:col-span-2 space-y-4 md:space-y-6">
        <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 border border-gray-200 shadow-sm">
          {/* Title Skeleton */}
          <div className="mb-4 md:mb-6">
            <div className="h-4 md:h-5 bg-gray-200 rounded animate-pulse w-28 md:w-32 mb-2 md:mb-3"></div>
            <div className="h-10 md:h-12 bg-gray-200 rounded-lg md:rounded-xl animate-pulse"></div>
          </div>

          {/* Date Skeleton */}
          <div className="mb-4 md:mb-6">
            <div className="h-4 md:h-5 bg-gray-200 rounded animate-pulse w-36 md:w-44 mb-2 md:mb-3"></div>
            <div className="h-10 md:h-12 bg-gray-200 rounded-lg md:rounded-xl animate-pulse"></div>
          </div>

          {/* Budget & Duration Row Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            <div>
              <div className="h-4 md:h-5 bg-gray-200 rounded animate-pulse w-20 md:w-24 mb-2 md:mb-3"></div>
              <div className="h-10 md:h-12 bg-gray-200 rounded-lg md:rounded-xl animate-pulse"></div>
            </div>
            <div>
              <div className="h-4 md:h-5 bg-gray-200 rounded animate-pulse w-28 md:w-32 mb-2 md:mb-3"></div>
              <div className="h-10 md:h-12 bg-gray-200 rounded-lg md:rounded-xl animate-pulse"></div>
            </div>
          </div>

          {/* Submit Buttons Skeleton */}
          <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
              <div className="h-10 md:h-12 bg-gray-200 rounded-lg md:rounded-xl animate-pulse flex-1"></div>
              <div className="h-10 md:h-12 bg-gray-200 rounded-lg md:rounded-xl animate-pulse w-20 md:w-24"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading && !isEdit) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-cyan-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 md:py-6">
          <SkeletonHeader />
          <SkeletonForm />
        </div>
      </div>
    );
  }

  return (
    <div
      key={formKey}
      className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-cyan-50/30"
    >
      {/* Notification Component */}
      <Notification
        notification={notification}
        onDismiss={dismissNotification}
      />

      {/* Hero Header - Responsive */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-blue-500/10 to-cyan-400/10 rounded-xl md:rounded-2xl p-4 md:p-6 mb-4 md:mb-6 border border-blue-200/30 backdrop-blur-sm"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 md:gap-4">
          <div className="flex items-center gap-3 md:gap-4">
            <Link
              to="/destinations"
              className="inline-flex items-center p-2 text-gray-600 hover:text-gray-900 bg-white border border-gray-300 rounded-lg md:rounded-xl hover:border-gray-400 transition-all shadow-sm hover:shadow-md"
            >
              <ArrowLeft className="h-4 w-4 md:h-5 md:w-5" />
            </Link>
            <div>
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">
                {isEdit ? "Edit Destinasi" : "Rencanakan Petualangan Baru"}
                <span className="ml-1">{isEdit ? "📝" : "🗺️"}</span>
              </h1>
              <p className="text-gray-600 text-xs md:text-sm lg:text-base">
                {isEdit
                  ? "Perbarui detail perjalanan Anda"
                  : "Tambahkan destinasi baru ke rencana perjalanan Anda"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1 md:py-1.5 rounded-full text-xs md:text-sm font-medium ${
                formData.is_achieved
                  ? "bg-green-100 text-green-800"
                  : "bg-orange-100 text-orange-800"
              }`}
            >
              {formData.is_achieved ? (
                <>
                  <CheckCircle className="h-3 w-3 md:h-4 md:w-4" />
                  <span className="hidden sm:inline">Tercapai</span>
                  <span className="sm:hidden">✓</span>
                </>
              ) : (
                <>
                  <XCircle className="h-3 w-3 md:h-4 md:w-4" />
                  <span className="hidden sm:inline">Perencanaan</span>
                  <span className="sm:hidden">✗</span>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Form Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 md:py-6">
        {submitError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 md:p-4 mb-4 md:mb-6">
            <p className="text-red-800 text-xs md:text-sm">{submitError}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Left Column - Photo & Status (Mobile: di atas) */}
          <div className="lg:col-span-1 space-y-4 md:space-y-6">
            {/* Photo Upload Card - Responsive */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 border border-gray-200 shadow-sm"
            >
              <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4 flex items-center gap-2">
                <Camera className="h-4 w-4 md:h-5 md:w-5 text-blue-500" />
                <span>Foto Destinasi</span>
              </h3>

              <div className="space-y-3 md:space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg md:rounded-xl p-3 md:p-4 text-center group">
                  {photoPreview ? (
                    <div className="relative">
                      <img
                        src={photoPreview}
                        alt="Preview"
                        className="w-full h-32 md:h-48 object-cover rounded-lg mx-auto"
                      />
                      <button
                        type="button"
                        onClick={removePhoto}
                        className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                      >
                        <X className="h-3 w-3 md:h-4 md:w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="py-4 md:py-8">
                      <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-100 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-2 md:mb-3">
                        <Camera className="h-5 w-5 md:h-8 md:w-8 text-blue-500" />
                      </div>
                      <p className="text-xs md:text-sm text-gray-600 mb-2 md:mb-3">
                        {isEdit
                          ? "Ganti foto destinasi"
                          : "Unggah foto destinasi"}
                      </p>
                      <label className="inline-flex items-center px-3 py-1.5 md:px-4 md:py-2 bg-blue-500 text-white rounded-lg md:rounded-xl hover:bg-blue-600 transition-all cursor-pointer shadow-md hover:shadow-lg text-xs md:text-sm">
                        <Upload className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                        {isEdit ? "Ganti Foto" : "Pilih File"}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoChange}
                          className="hidden"
                        />
                      </label>
                      <p className="text-xs text-gray-500 mt-2">
                        PNG, JPG maksimal 2MB
                      </p>
                    </div>
                  )}
                </div>
                {errors.photo && (
                  <p className="text-red-600 text-xs md:text-sm text-center">
                    {errors.photo}
                  </p>
                )}
              </div>
            </motion.div>

            {/* Status Toggle Card - Responsive */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 border border-gray-200 shadow-sm"
            >
              <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">
                Status Perjalanan
              </h3>

              <label
                className={`flex items-center justify-between group
                ${
                  isToggleDisabled
                    ? "cursor-not-allowed opacity-70"
                    : "cursor-pointer"
                }
              `}
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm md:text-base font-medium text-gray-900 truncate">
                    Tandai sebagai Selesai
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {dateStatus === "PAST" &&
                      "🔒 Status terkunci karena perjalanan sudah lewat"}
                    {dateStatus === "FUTURE" &&
                      "📝 Perjalanan dijadwalkan di masa mendatang"}
                    {dateStatus === "TODAY" &&
                      (formData.is_achieved
                        ? "✅ Perjalanan ini telah selesai"
                        : "📝 Perjalanan berlangsung hari ini")}
                    {dateStatus === "EMPTY" &&
                      "📅 Pilih tanggal untuk mengatur status"}
                  </div>
                </div>
                <div className="relative flex-shrink-0">
                  <input
                    type="checkbox"
                    name="is_achieved"
                    checked={formData.is_achieved}
                    onChange={handleChange}
                    disabled={isToggleDisabled}
                    className="sr-only"
                  />
                  <div
                    className={`w-10 h-5 md:w-12 md:h-6 rounded-full transition-colors duration-300
                    ${formData.is_achieved ? "bg-green-500" : "bg-gray-300"}
                    ${
                      !isToggleDisabled && !formData.is_achieved
                        ? "group-hover:bg-gray-400"
                        : ""
                    }
                  `}
                  ></div>

                  <div
                    className={`absolute left-0.5 top-0.5 md:left-1 md:top-1 bg-white w-4 h-4 md:w-4 md:h-4 rounded-full transition-transform duration-300
                      ${
                        formData.is_achieved
                          ? "transform translate-x-5 md:translate-x-6"
                          : ""
                      }
                      ${isToggleDisabled ? "opacity-60" : ""}
                    `}
                  ></div>
                </div>
              </label>

              <div className="mt-3 md:mt-4 p-2 md:p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-800 leading-tight">
                  {!formData.departure_date ? (
                    "📅 Pilih tanggal untuk melihat status"
                  ) : (
                    <>
                      <span className="font-semibold">Status: </span>
                      {(() => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);

                        const departureDate = new Date(formData.departure_date);
                        departureDate.setHours(0, 0, 0, 0);

                        const diffDays = Math.ceil(
                          (departureDate - today) / (1000 * 60 * 60 * 24)
                        );

                        if (diffDays < 0) {
                          return `Perjalanan ini sudah lewat ${Math.abs(
                            diffDays
                          )} hari yang lalu`;
                        } else if (diffDays === 0) {
                          return "Perjalanan berlangsung hari ini";
                        } else if (diffDays === 1) {
                          return "Perjalanan akan dimulai besok";
                        } else {
                          return `Perjalanan akan dimulai dalam ${diffDays} hari`;
                        }
                      })()}
                    </>
                  )}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Form Fields (Mobile: di bawah) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-4 md:space-y-6"
          >
            <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 border border-gray-200 shadow-sm">
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                {/* Title Field */}
                <div>
                  <label
                    htmlFor="title"
                    className="block text-xs md:text-sm font-medium text-gray-700 mb-2 md:mb-3"
                  >
                    <span>
                      Judul Destinasi
                      <span className="ml-1 text-red-600">*</span>
                    </span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 md:px-4 md:py-3 border rounded-lg md:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50/50 text-xs md:text-sm ${
                      errors.title ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="contoh: Petualangan Bali yang Menakjubkan"
                  />
                  {errors.title && (
                    <p className="text-red-600 text-xs md:text-sm mt-1 md:mt-2">
                      {errors.title}
                    </p>
                  )}
                </div>

                {/* Departure Date Field */}
                <div>
                  <label
                    htmlFor="departure_date"
                    className="block text-xs md:text-sm font-medium text-gray-700 mb-2 md:mb-3 flex items-center gap-2"
                  >
                    <Calendar className="h-3 w-3 md:h-4 md:w-4 text-blue-500" />
                    <span>
                      Tanggal Keberangkatan
                      <span className="ml-1 text-red-600">*</span>
                    </span>
                  </label>

                  <div className="relative date-picker-container">
                    <div
                      onClick={() => setShowDatePicker(!showDatePicker)}
                      className={`w-full pl-10 md:pl-12 pr-3 md:pr-4 py-2 md:py-3 border rounded-lg md:rounded-xl cursor-pointer transition-all bg-gray-50/50 text-xs md:text-sm ${
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
                        : "Pilih tanggal keberangkatan"}
                    </div>

                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center shadow-sm">
                        <Calendar className="h-3 w-3 md:h-4 md:w-4 text-white" />
                      </div>
                    </div>

                    {showDatePicker && (
                      <motion.div
                        ref={calendarRef}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute top-full left-0 right-0 mt-1 md:mt-2 bg-white border border-gray-200 rounded-lg md:rounded-xl shadow-2xl z-50 p-3 md:p-4"
                      >
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 mb-3 md:mb-4">
                          <div className="flex gap-2">
                            <select
                              value={selectedDate.getMonth()}
                              onChange={(e) => {
                                const newDate = new Date(selectedDate);
                                newDate.setMonth(parseInt(e.target.value));
                                setSelectedDate(newDate);
                              }}
                              className="px-2 py-1.5 md:px-3 md:py-2 border border-gray-300 rounded-lg text-xs md:text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex-1"
                            >
                              {[
                                { short: "Jan", full: "Januari" },
                                { short: "Feb", full: "Februari" },
                                { short: "Mar", full: "Maret" },
                                { short: "Apr", full: "April" },
                                { short: "Mei", full: "Mei" },
                                { short: "Jun", full: "Juni" },
                                { short: "Jul", full: "Juli" },
                                { short: "Agu", full: "Agustus" },
                                { short: "Sep", full: "September" },
                                { short: "Okt", full: "Oktober" },
                                { short: "Nov", full: "November" },
                                { short: "Des", full: "Desember" },
                              ].map((month, index) => (
                                <option key={month.short} value={index}>
                                  {isMobile ? month.short : month.full}
                                </option>
                              ))}
                            </select>

                            <select
                              value={selectedDate.getFullYear()}
                              onChange={(e) => {
                                const newDate = new Date(selectedDate);
                                newDate.setFullYear(parseInt(e.target.value));
                                setSelectedDate(newDate);
                              }}
                              className="px-2 py-1.5 md:px-3 md:py-2 border border-gray-300 rounded-lg text-xs md:text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex-1"
                            >
                              {Array.from({ length: 5 }, (_, i) => {
                                const year = new Date().getFullYear() + i;
                                return (
                                  <option key={year} value={year}>
                                    {year}
                                  </option>
                                );
                              })}
                            </select>
                          </div>

                          <button
                            onClick={() => setShowDatePicker(false)}
                            className="text-gray-400 hover:text-gray-600 p-1 self-end md:self-auto"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-7 gap-1 mb-1 md:mb-2">
                          {["M", "S", "S", "R", "K", "J", "S"].map(
                            (day, index) => (
                              <div
                                key={`day-header-${index}`}
                                className="text-center text-xs font-medium text-gray-500 py-1 md:py-2"
                              >
                                {day}
                              </div>
                            )
                          )}
                        </div>

                        <div className="grid grid-cols-7 gap-1">
                          {(() => {
                            const currentDate = selectedDate;
                            const year = currentDate.getFullYear();
                            const month = currentDate.getMonth();
                            const firstDay = new Date(year, month, 1).getDay();
                            const daysInMonth = new Date(
                              year,
                              month + 1,
                              0
                            ).getDate();
                            const adjustedFirstDay =
                              firstDay === 0 ? 6 : firstDay - 1;

                            const days = [];

                            for (let i = 0; i < adjustedFirstDay; i++) {
                              days.push(
                                <div key={`empty-${i}`} className="p-1"></div>
                              );
                            }

                            for (let day = 1; day <= daysInMonth; day++) {
                              const date = new Date(year, month, day);
                              const dateYear = date.getFullYear();
                              const dateMonth = String(
                                date.getMonth() + 1
                              ).padStart(2, "0");
                              const dateDay = String(date.getDate()).padStart(
                                2,
                                "0"
                              );
                              const dateFormatted = `${dateYear}-${dateMonth}-${dateDay}`;
                              const isSelected =
                                formData.departure_date === dateFormatted;

                              days.push(
                                <button
                                  key={day}
                                  type="button"
                                  onClick={() => handleDateSelect(date)}
                                  className={`p-1 md:p-2 rounded text-xs md:text-sm font-medium transition-all ${
                                    isSelected
                                      ? "bg-blue-500 text-white"
                                      : "text-gray-700 hover:bg-gray-100"
                                  }`}
                                >
                                  {day}
                                </button>
                              );
                            }

                            return days;
                          })()}
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {errors.departure_date && (
                    <p className="text-red-600 text-xs md:text-sm mt-1 md:mt-2">
                      {errors.departure_date}
                    </p>
                  )}
                </div>

                {/* Budget & Duration Fields - Responsive Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                  {/* Budget Field */}
                  <div>
                    <label
                      htmlFor="budget"
                      className="block text-xs md:text-sm font-medium text-gray-700 mb-2 md:mb-3 flex items-center gap-2"
                    >
                      <DollarSign className="h-3 w-3 md:h-4 md:w-4 text-green-500" />
                      <span>
                        Total Budget
                        <span className="ml-1 text-red-600">*</span>
                      </span>
                    </label>

                    <div className="flex gap-2">
                      <motion.button
                        type="button"
                        onClick={decrementBudget}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={parseInt(formData.budget || "0") <= 0}
                        className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-lg md:rounded-xl flex items-center justify-center hover:from-red-600 hover:to-red-700 transition-all shadow-lg flex-shrink-0 border border-red-400 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Minus className="h-3 w-3 md:h-4 md:w-4" />
                      </motion.button>

                      <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-2 md:left-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 font-medium text-xs md:text-sm">
                            Rp
                          </span>
                        </div>
                        <input
                          type="text"
                          id="budget"
                          name="budget"
                          value={formatBudgetDisplay(formData.budget)}
                          onChange={handleBudgetChange}
                          className={`w-full pl-8 md:pl-10 pr-3 md:pr-4 py-2 md:py-3 border rounded-lg md:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50/50 text-right font-medium text-gray-900 text-xs md:text-sm ${
                            errors.budget ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="0"
                        />
                      </div>

                      <motion.button
                        type="button"
                        onClick={incrementBudget}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={
                          parseInt(formData.budget || "0") >= 1000000000
                        }
                        className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg md:rounded-xl flex items-center justify-center hover:from-green-600 hover:to-green-700 transition-all shadow-lg flex-shrink-0 border border-green-400 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Plus className="h-3 w-3 md:h-4 md:w-4" />
                      </motion.button>
                    </div>

                    <div className="flex justify-between items-center mt-1 md:mt-2">
                      <span className="text-xs text-gray-500">
                        Sesuaikan dengan 100.000
                      </span>
                      {formData.budget && (
                        <span className="text-xs font-medium text-blue-600 bg-blue-50 px-1.5 py-0.5 md:px-2 md:py-1 rounded">
                          Rp {formatBudgetDisplay(formData.budget)}
                        </span>
                      )}
                    </div>

                    {errors.budget && (
                      <p className="text-red-600 text-xs md:text-sm mt-1 md:mt-2">
                        {errors.budget}
                      </p>
                    )}
                  </div>

                  {/* Duration Field */}
                  <div>
                    <label
                      htmlFor="duration_days"
                      className="block text-xs md:text-sm font-medium text-gray-700 mb-2 md:mb-3 flex items-center gap-2"
                    >
                      <MapPin className="h-3 w-3 md:h-4 md:w-4 text-purple-500" />
                      Durasi Perjalanan *
                    </label>

                    <div className="flex gap-2">
                      <motion.button
                        type="button"
                        onClick={decrementDuration}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={parseInt(formData.duration_days || "0") <= 0}
                        className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg md:rounded-xl flex items-center justify-center hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg flex-shrink-0 border border-purple-400 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Minus className="h-3 w-3 md:h-4 md:w-4" />
                      </motion.button>

                      <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-2 md:left-3 flex items-center pointer-events-none">
                          <MapPin className="h-3 w-3 md:h-4 md:w-4 text-purple-500" />
                        </div>
                        <input
                          type="number"
                          id="duration_days"
                          name="duration_days"
                          value={formData.duration_days}
                          onChange={handleChange}
                          min="0"
                          max="365"
                          className={`w-full pl-8 md:pl-10 pr-10 md:pr-12 py-2 md:py-3 border rounded-lg md:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50/50 text-center font-medium text-gray-900 text-xs md:text-sm appearance-none ${
                            errors.duration_days
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="0"
                          style={{
                            MozAppearance: "textfield",
                            WebkitAppearance: "none",
                            appearance: "none",
                          }}
                        />

                        <div className="absolute inset-y-0 right-2 md:right-3 flex items-center pointer-events-none">
                          <span className="text-xs md:text-sm font-medium text-purple-600 bg-white/80 px-1 py-0.5 md:px-2 md:py-1 rounded border border-purple-200">
                            hari
                          </span>
                        </div>
                      </div>

                      <motion.button
                        type="button"
                        onClick={incrementDuration}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={
                          parseInt(formData.duration_days || "0") >= 365
                        }
                        className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg md:rounded-xl flex items-center justify-center hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg flex-shrink-0 border border-purple-400 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Plus className="h-3 w-3 md:h-4 md:w-4" />
                      </motion.button>
                    </div>

                    <div className="flex justify-between items-center mt-1 md:mt-2">
                      <span className="text-xs text-gray-500">0-365 hari</span>
                      {formData.duration_days && (
                        <span className="text-xs font-medium text-purple-600 bg-purple-50 px-1.5 py-0.5 md:px-2 md:py-1 rounded">
                          {formData.duration_days} hari
                        </span>
                      )}
                    </div>

                    {errors.duration_days && (
                      <p className="text-red-600 text-xs md:text-sm mt-1 md:mt-2">
                        {errors.duration_days}
                      </p>
                    )}
                  </div>
                </div>

                {/* Submit Buttons - Responsive */}
                <div className="flex flex-col sm:flex-row gap-2 md:gap-3 pt-4 md:pt-6 border-t border-gray-200">
                  <motion.button
                    type="submit"
                    disabled={loading || !isFormComplete()}
                    whileHover={
                      !loading && isFormComplete() ? { scale: 1.02 } : {}
                    }
                    whileTap={
                      !loading && isFormComplete() ? { scale: 0.98 } : {}
                    }
                    className={`inline-flex items-center px-4 py-2.5 md:px-6 md:py-3 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all shadow-lg flex-1 justify-center text-xs md:text-sm ${
                      loading || !isFormComplete()
                        ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-500 to-cyan-400 text-white hover:from-blue-600 hover:to-cyan-500 hover:shadow-xl"
                    }`}
                  >
                    <Save className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                    {loading
                      ? "Menyimpan..."
                      : isEdit
                      ? "Perbarui Destinasi"
                      : "Buat Destinasi"}
                  </motion.button>

                  <Link
                    to="/destinations"
                    className="inline-flex items-center justify-center px-4 py-2.5 md:px-6 md:py-3 border border-gray-300 text-gray-700 rounded-lg md:rounded-xl hover:bg-gray-50 transition-all font-medium text-xs md:text-sm"
                  >
                    Batal
                  </Link>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DestinationForm;
