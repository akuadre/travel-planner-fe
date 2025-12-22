import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Map,
  AlertCircle,
  Home,
  Search,
  ArrowLeft,
  Calendar,
  DollarSign,
  MapPin,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Users,
  Navigation,
  Plane,
  Compass,
  Clock,
  Tag,
  Globe,
  Heart,
  Share2,
  Download,
  ChevronRight,
  Pin,
  Activity,
  FileText,
  Star,
  RefreshCw,
} from "lucide-react";
import { motion } from "framer-motion";

import {
  STORAGE_BASE_URL,
  destinationService,
} from "../services/destinationService";

// 🔥 SKELETON LOADING COMPONENTS
const SkeletonHeader = () => (
  <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/60 shadow-sm">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-24 h-9 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="min-w-0 flex-1">
            <div className="h-6 bg-gray-200 rounded animate-pulse mb-2 w-48"></div>
            <div className="h-4 bg-gray-100 rounded animate-pulse w-32"></div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="w-px h-6 bg-gray-300 mx-1"></div>
          <div className="w-32 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="w-20 h-8 bg-gray-200 rounded-lg animate-pulse ml-1"></div>
        </div>
      </div>
    </div>
  </div>
);

const SkeletonHeroCard = () => (
  <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-6">
    {/* Image Skeleton */}
    <div className="relative h-48 sm:h-56 bg-gray-200 animate-pulse"></div>

    {/* Stats Skeleton */}
    <div className="p-4 sm:p-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="space-y-2">
            <div className="flex items-center">
              <div className="h-3.5 w-3.5 bg-gray-200 rounded mr-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
            </div>
            <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
          </div>
        ))}
      </div>

      {/* Description Skeleton */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="h-4 bg-gray-200 rounded animate-pulse w-20 mb-3"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
        </div>
      </div>
    </div>
  </div>
);

const SkeletonTimelineSection = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center">
        <div className="h-4 w-4 bg-gray-200 rounded mr-2 animate-pulse"></div>
        <div className="h-6 bg-gray-200 rounded animate-pulse w-32"></div>
      </div>
      <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
    </div>

    <div className="space-y-3">
      {[1, 2, 3].map((item) => (
        <div key={item} className="flex items-start">
          <div className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded-full animate-pulse mr-3"></div>
          <div className="flex-1">
            <div className="h-5 bg-gray-200 rounded animate-pulse w-24 mb-1"></div>
            <div className="h-3 bg-gray-200 rounded animate-pulse w-32"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const SkeletonActionsSection = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
    <div className="flex items-center mb-4">
      <div className="h-4 w-4 bg-gray-200 rounded mr-2 animate-pulse"></div>
      <div className="h-6 bg-gray-200 rounded animate-pulse w-40"></div>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {[1, 2].map((item) => (
        <div
          key={item}
          className="flex items-center justify-between p-3 bg-gray-100 rounded-lg animate-pulse"
        >
          <div className="flex items-center">
            <div className="h-4 w-4 bg-gray-200 rounded mr-3"></div>
            <div>
              <div className="h-5 bg-gray-200 rounded animate-pulse w-32 mb-1"></div>
              <div className="h-3 bg-gray-200 rounded animate-pulse w-24"></div>
            </div>
          </div>
          <div className="h-4 w-4 bg-gray-200 rounded"></div>
        </div>
      ))}
    </div>
  </div>
);

const SkeletonSidebarCard = () => (
  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl shadow-sm border border-blue-100 p-5">
    <div className="h-6 bg-gray-200 rounded animate-pulse w-32 mb-4"></div>

    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
        <div className="h-6 bg-gray-200 rounded-full animate-pulse w-24"></div>
      </div>

      <div className="flex items-center justify-between">
        <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
        <div className="w-24">
          <div className="w-full bg-gray-200 rounded-full h-1.5 animate-pulse"></div>
        </div>
      </div>
    </div>
  </div>
);

const SkeletonAdditionalInfo = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
    <div className="h-6 bg-gray-200 rounded animate-pulse w-32 mb-4"></div>

    <div className="space-y-3">
      {[1, 2, 3].map((item) => (
        <div key={item} className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-3.5 w-3.5 bg-gray-200 rounded mr-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
          </div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
        </div>
      ))}

      <div className="pt-3 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-8"></div>
        </div>
      </div>
    </div>
  </div>
);

const DestinationDetailSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-cyan-50/30">
    <SkeletonHeader />

    <div className="max-w-5xl mx-auto mt-4 px-4 sm:px-6 lg:px-8 py-6">
      <SkeletonHeroCard />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <SkeletonTimelineSection />
          <SkeletonActionsSection />
        </div>

        <div className="space-y-6">
          <SkeletonSidebarCard />
          <SkeletonAdditionalInfo />
        </div>
      </div>
    </div>
  </div>
);

const DestinationNotFound = ({ error, onRetry }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50/30 to-cyan-50/30 p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        {/* Floating Animation */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="relative mb-8"
        >
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-red-100 to-orange-100 rounded-3xl flex items-center justify-center shadow-xl">
            <div className="relative">
              <Compass className="h-16 w-16 text-red-500" />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0"
              >
                <Navigation className="h-8 w-8 text-orange-500 absolute top-0 left-1/2 transform -translate-x-1/2" />
              </motion.div>
            </div>
          </div>

          {/* Floating particles */}
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              animate={{
                x: [0, 50, 0],
                y: [0, -30, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
              }}
              className={`absolute w-4 h-4 bg-blue-400/30 rounded-full ${
                i === 1
                  ? "top-4 left-8"
                  : i === 2
                  ? "top-12 right-6"
                  : "bottom-4 left-12"
              }`}
            />
          ))}
        </motion.div>

        {/* Error Content */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-full text-sm font-semibold mb-4">
              <AlertCircle className="h-4 w-4" />
              <span>DESTINATION NOT FOUND</span>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              Uh oh! We're lost 🗺️
            </h1>

            <p className="text-gray-600 mb-6 leading-relaxed">
              {error ||
                "The travel destination you're looking for has wandered off the map. Maybe it's exploring new territories!"}
            </p>

            {/* Animated progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-8 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* <motion.button
                onClick={onRetry}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-xl hover:from-blue-600 hover:to-cyan-500 transition-all shadow-lg font-semibold"
              >
                <RefreshCw className="h-5 w-5 mr-2" />
                Try Again
              </motion.button> */}

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1"
              >
                <Link
                  to="/destinations"
                  className="inline-flex items-center justify-center w-full px-6 py-3 bg-white text-gray-700 border-2 border-gray-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all font-semibold"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Back to Destinations
                </Link>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Fun fact */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-6 text-sm text-gray-500"
        >
          <p>
            ✨ Fun Fact: The average traveler visits 4 destinations per trip!
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

const DestinationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    loadDestination();
  }, [id]);

  const loadDestination = async () => {
    try {
      setLoading(true);
      const data = await destinationService.getById(id);
      setDestination(data);
    } catch (error) {
      console.error("Failed to load destination:", error);
      setError("Destinasi tidak ditemukan");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 GANTI LOADING STATE MENJADI SKELETON
  if (loading) {
    return <DestinationDetailSkeleton />;
  }

  // 🔥 ERROR STATE
  if (error || !destination) {
    return (
      <DestinationNotFound
        error={error || "Destinasi tidak ditemukan"}
        onRetry={loadDestination}
      />
    );
  }

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDestination();
    setTimeout(() => setRefreshing(false), 500);
  };

  const handleDelete = async () => {
    if (window.confirm("Apakah Anda yakin ingin menghapus destinasi ini?")) {
      try {
        await destinationService.delete(id);
        navigate("/destinations");
      } catch (error) {
        console.error("Failed to delete destination:", error);
        alert("Gagal menghapus destinasi");
      }
    }
  };

  const toggleStatus = async () => {
    if (!destination) return;

    try {
      const updatedDestination = await destinationService.update(
        destination.id,
        {
          is_achieved: !destination.is_achieved,
        }
      );
      setDestination(updatedDestination);
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Gagal memperbarui status");
    }
  };

  const getImageUrl = (photoPath) => {
    if (!photoPath) return null;
    if (photoPath.startsWith("http")) return photoPath;
    return `${STORAGE_BASE_URL}/destinations/${photoPath}`;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getDaysUntilTrip = () => {
    if (!destination) return 0;
    const today = new Date();
    const departure = new Date(destination.departure_date);
    const diffTime = departure - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const imageUrl = getImageUrl(destination.photo);
  const daysUntilTrip = getDaysUntilTrip();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-cyan-50/30">
      {/* Compact Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-sm border-b border-gray-200/60 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link
                to="/destinations"
                className="inline-flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-all hover:shadow-sm"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Kembali
              </Link>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
                  {destination.title}
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 truncate">
                  Detail perjalanan & rencana
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Compact Action Buttons */}
              <motion.button
                onClick={handleRefresh}
                disabled={refreshing}
                whileHover={{ scale: refreshing ? 1 : 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex gap-2 items-center px-3 py-2 text-gray-600 bg-gray-100 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-colors"
                title="Refresh"
              >
                <span className="text-sm">Refresh</span>
                <RefreshCw
                  className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
                />
              </motion.button>

              <div className="w-px h-6 bg-gray-300 mx-1" />

              <motion.button
                onClick={toggleStatus}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`inline-flex items-center px-3 py-1.5 text-sm rounded-lg transition-all font-medium ${
                  destination.is_achieved
                    ? "bg-orange-100 text-orange-700 hover:bg-orange-200"
                    : "bg-green-100 text-green-700 hover:bg-green-200"
                }`}
              >
                {destination.is_achieved ? (
                  <>
                    <XCircle className="h-3 w-3 mr-1" />
                    <span className="hidden sm:inline">Tandai Planning</span>
                    <span className="sm:hidden">Planning</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-3 w-3 mr-1" />
                    <span className="hidden sm:inline">Tandai Selesai</span>
                    <span className="sm:hidden">Selesai</span>
                  </>
                )}
              </motion.button>

              <Link
                to={`/destinations/${id}/edit`}
                className="inline-flex items-center px-3 py-1.5 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-all font-medium ml-1"
              >
                <Edit className="h-3 w-3 mr-1" />
                <span className="hidden sm:inline">Edit</span>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content - Compact Design */}
      <div className="max-w-5xl mx-auto mt-2 px-4 sm:px-6 py-6">
        {/* Hero Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-6"
        >
          {/* Compact Hero Image */}
          <div className="relative h-48 sm:h-56 bg-gray-200 overflow-hidden">
            {imageUrl ? (
              <>
                {/* Shimmer Effect */}
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent z-10"
                  style={{
                    animation: "shimmer 2s infinite",
                    transform: "translateX(-100%)",
                  }}
                ></div>

                <img
                  src={imageUrl}
                  alt={destination.title}
                  className="w-full h-full object-cover relative z-0"
                  onLoad={(e) => {
                    e.target.previousSibling.style.display = "none";
                  }}
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                    e.target.previousSibling.style.display = "none";
                  }}
                />
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Plane className="h-12 w-12 text-gray-400 opacity-40" />
              </div>
            )}

            {/* Fallback jika image gagal */}
            {imageUrl && (
              <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center absolute inset-0 hidden">
                <Plane className="h-12 w-12 text-gray-500 opacity-60" />
              </div>
            )}

            {/* Overlay & Info */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent p-4 z-20">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
                    {destination.title}
                  </h2>
                  {destination.location && (
                    <div className="flex items-center text-white/90 text-sm">
                      <Pin className="h-3 w-3 mr-1" />
                      <span>{destination.location}</span>
                    </div>
                  )}
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    destination.is_achieved
                      ? "bg-green-500/90 text-white"
                      : daysUntilTrip > 0
                      ? "bg-blue-500/90 text-white"
                      : "bg-orange-500/90 text-white"
                  }`}
                >
                  {destination.is_achieved
                    ? "Selesai"
                    : daysUntilTrip > 0
                    ? `${daysUntilTrip} hari lagi`
                    : "Lewat jadwal"}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="space-y-1">
                <div className="flex items-center text-gray-600 text-sm">
                  <Calendar className="h-3.5 w-3.5 mr-2 text-blue-500" />
                  <span className="font-medium">Tanggal</span>
                </div>
                <p className="text-gray-900 font-semibold text-sm sm:text-base">
                  {formatDate(destination.departure_date)}
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center text-gray-600 text-sm">
                  <Clock className="h-3.5 w-3.5 mr-2 text-purple-500" />
                  <span className="font-medium">Durasi</span>
                </div>
                <p className="text-gray-900 font-semibold text-sm sm:text-base">
                  {destination.duration_days} hari
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center text-gray-600 text-sm">
                  <DollarSign className="h-3.5 w-3.5 mr-2 text-green-500" />
                  <span className="font-medium">Budget</span>
                </div>
                <p className="text-gray-900 font-semibold text-sm sm:text-base">
                  {formatCurrency(destination.budget)}
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center text-gray-600 text-sm">
                  <Activity className="h-3.5 w-3.5 mr-2 text-orange-500" />
                  <span className="font-medium">Aktivitas</span>
                </div>
                <p className="text-gray-900 font-semibold text-sm sm:text-base">
                  {destination.itineraries?.length || 0}
                </p>
              </div>
            </div>

            {/* Description - Compact */}
            {destination.description && (
              <div className="mt-6 pt-6 border-t border-gray-100">
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                  <FileText className="h-3.5 w-3.5 mr-2 text-gray-500" />
                  Catatan
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
                  {destination.description}
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Two-Column Layout untuk Desktop, Single Column untuk Mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Trip Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-gray-900 flex items-center">
                  <Navigation className="h-4 w-4 mr-2 text-blue-500" />
                  Timeline Perjalanan
                </h3>
                <span className="text-xs text-gray-500">
                  {destination.duration_days} hari
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <Calendar className="h-3.5 w-3.5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      Keberangkatan
                    </p>
                    <p className="text-xs text-gray-600">
                      {formatDate(destination.departure_date)}
                    </p>
                  </div>
                </div>

                {Array.from({
                  length: Math.min(destination.duration_days, 3),
                }).map((_, i) => (
                  <div key={i} className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-xs font-medium text-gray-600">
                        D+{i + 1}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        Hari {i + 1}
                      </p>
                      <p className="text-xs text-gray-600">
                        {destination.itineraries?.filter(
                          (it) => it.day_number === i + 1
                        ).length || 0}{" "}
                        aktivitas
                      </p>
                    </div>
                  </div>
                ))}

                {destination.duration_days > 3 && (
                  <div className="text-center pt-2">
                    <span className="text-xs text-gray-500">
                      +{destination.duration_days - 3} hari lainnya
                    </span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-5"
            >
              <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center">
                <Activity className="h-4 w-4 mr-2 text-green-500" />
                Kelola Perjalanan
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Link
                  to={`/itineraries?destination=${destination.id}`}
                  className="flex items-center justify-between p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group"
                >
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-blue-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Rencana Perjalanan
                      </p>
                      <p className="text-xs text-gray-600">
                        {destination.itineraries?.length || 0} aktivitas
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                </Link>

                <Link
                  to={`/destinations/${id}/edit`}
                  className="flex items-center justify-between p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors group"
                >
                  <div className="flex items-center">
                    <Edit className="h-4 w-4 text-purple-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Edit Details
                      </p>
                      <p className="text-xs text-gray-600">Perbarui info</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                </Link>

                <button
                  onClick={handleDelete}
                  className="flex items-center justify-between p-3 bg-red-50 hover:bg-red-100 rounded-lg transition-colors group"
                >
                  <div className="flex items-center">
                    <Trash2 className="h-4 w-4 text-red-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Hapus</p>
                      <p className="text-xs text-gray-600">Destinasi ini</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                </button>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Side Info */}
          <div className="space-y-6">
            {/* Status Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl shadow-sm border border-blue-100 p-5"
            >
              <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center">
                <Star className="h-4 w-4 mr-2 text-blue-500" />
                Status Perjalanan
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status:</span>
                  <span
                    className={`text-sm font-medium px-2.5 py-1 rounded-full ${
                      destination.is_achieved
                        ? "bg-green-100 text-green-800"
                        : "bg-orange-100 text-orange-800"
                    }`}
                  >
                    {destination.is_achieved ? "Tercapai" : "Dalam Perencanaan"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Progress:</span>
                  <div className="w-24">
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full ${
                          destination.is_achieved
                            ? "bg-green-500 w-full"
                            : "bg-blue-500"
                        }`}
                        style={{
                          width: destination.is_achieved ? "100%" : "60%",
                        }}
                      />
                    </div>
                  </div>
                </div>

                {!destination.is_achieved && daysUntilTrip > 0 && (
                  <div className="bg-blue-100/50 rounded-lg p-3 mt-3">
                    <p className="text-xs text-blue-800 font-medium">
                      🎯 {daysUntilTrip} hari menuju keberangkatan!
                    </p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Additional Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-5"
            >
              <h3 className="text-base font-semibold text-gray-900 mb-4">
                Info Tambahan
              </h3>

              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0 text-sm">
                  <div className="flex items-center">
                    <Globe className="h-3.5 w-3.5 mr-2 text-gray-400 flex-shrink-0" />
                    <span className="text-gray-600 whitespace-nowrap">
                      Dibuat pada:
                    </span>
                  </div>
                  <span className="text-gray-900 sm:ml-auto truncate">
                    {new Date(destination.created_at).toLocaleDateString(
                      "id-ID",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }
                    )}
                  </span>
                </div>

                <div className="pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Total Aktivitas:</span>
                    <span className="font-semibold text-blue-600">
                      {destination.itineraries?.length || 0}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Export Options */}
            {/* <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-sm border border-gray-200 p-5"
            >
              <h3 className="text-base font-semibold text-gray-900 mb-3">Ekspor Data</h3>
              <div className="space-y-2">
                <button className="w-full flex items-center justify-center text-sm text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg py-2.5 transition-colors">
                  <Download className="h-3.5 w-3.5 mr-2" />
                  PDF Itinerary
                </button>
                <button className="w-full flex items-center justify-center text-sm text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg py-2.5 transition-colors">
                  <Download className="h-3.5 w-3.5 mr-2" />
                  Excel Budget
                </button>
              </div>
            </motion.div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationDetail;
