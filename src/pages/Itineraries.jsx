import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  Plus,
  Calendar,
  MapPin,
  Clock,
  Edit,
  Trash2,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Navigation,
  Compass,
  Plane,
  Camera,
  Utensils,
  Hotel,
  Mountain,
  Star,
  Zap,
  Eye,
  List,
  Grid,
  DollarSign,
} from "lucide-react";
import ItineraryForm from "../components/ItineraryForm";
import { motion, AnimatePresence } from "framer-motion";
import { itineraryService } from "../services/itineraryService";
import {
  destinationService,
  STORAGE_BASE_URL,
} from "../services/destinationService";

// 🔥 NEW: Skeleton Loading Components - IMPROVED
const SkeletonStats = () => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
    {[1, 2, 3, 4].map((item) => (
      <div
        key={item}
        className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm"
      >
        <div className="flex items-center justify-between">
          <div className="space-y-2 flex-1">
            <div className="h-8 bg-gray-200 rounded-lg animate-pulse w-20"></div>
            <div className="h-4 bg-gray-100 rounded animate-pulse w-32"></div>
          </div>
          <div className="p-3 rounded-xl bg-gray-200 animate-pulse">
            <div className="h-6 w-6"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const SkeletonTimelineView = () => (
  <div className="relative">
    <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400/30 via-purple-400/30 to-cyan-400/30 rounded-full"></div>

    <div className="space-y-6">
      {[1, 2, 3].map((day) => (
        <div key={day} className="relative flex items-start gap-6">
          {/* Timeline Dot Skeleton */}
          <div className="relative z-10 flex-shrink-0 w-16 h-16 bg-gray-200 rounded-2xl animate-pulse"></div>

          {/* Day Content Skeleton */}
          <div className="flex-1 bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="h-6 bg-gray-200 rounded animate-pulse w-40"></div>
              <div className="flex items-center gap-2">
                <div className="h-6 bg-gray-200 rounded-full animate-pulse w-20"></div>
                <div className="h-8 w-8 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
            </div>

            {/* Activities Skeleton */}
            <div className="space-y-4">
              {[1, 2].map((activity) => (
                <div
                  key={activity}
                  className="flex items-start gap-4 p-4 bg-gray-50/50 rounded-xl border border-gray-200/50"
                >
                  <div className="flex-shrink-0">
                    <div className="h-10 bg-gray-200 rounded-lg animate-pulse w-20"></div>
                  </div>
                  <div className="flex-shrink-0 p-3 bg-gray-200 rounded-xl animate-pulse">
                    <div className="h-5 w-5"></div>
                  </div>
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="h-5 bg-gray-200 rounded animate-pulse w-48"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-64"></div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-32"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const SkeletonGridView = () => (
  <div className="space-y-6">
    {/* Day Navigation Skeleton */}
    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
      <div className="h-6 bg-gray-200 rounded animate-pulse w-48 mb-4"></div>
      <div className="flex flex-wrap gap-3">
        {[1, 2, 3].map((day) => (
          <div
            key={day}
            className="h-12 bg-gray-200 rounded-xl animate-pulse w-24"
          ></div>
        ))}
      </div>
    </div>

    {/* Selected Day Header Skeleton */}
    <div className="bg-gradient-to-r from-blue-500 to-cyan-400 rounded-2xl p-6 text-white">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 bg-blue-400/50 rounded animate-pulse w-64"></div>
          <div className="h-4 bg-blue-400/50 rounded animate-pulse w-48"></div>
        </div>
        <div className="text-right space-y-1">
          <div className="h-8 bg-blue-400/50 rounded animate-pulse w-12"></div>
          <div className="h-4 bg-blue-400/50 rounded animate-pulse w-16"></div>
        </div>
      </div>
    </div>

    {/* Activities Grid Skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((activity) => (
        <div
          key={activity}
          className="bg-white rounded-2xl border border-gray-200 overflow-hidden"
        >
          {/* Activity Header Skeleton */}
          <div className="bg-gradient-to-r from-blue-500 to-cyan-400 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                  <div className="h-5 w-5 bg-white/50 rounded animate-pulse"></div>
                </div>
                <div className="space-y-1">
                  <div className="h-5 bg-white/50 rounded animate-pulse w-32"></div>
                  <div className="h-3 bg-white/50 rounded animate-pulse w-20"></div>
                </div>
              </div>
              <div className="h-5 w-5 bg-white/50 rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Activity Content Skeleton */}
          <div className="p-4 space-y-3">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>

            {/* Tags Skeleton */}
            <div className="flex flex-wrap gap-2">
              <div className="h-6 bg-gray-200 rounded-full animate-pulse w-16"></div>
              <div className="h-6 bg-gray-200 rounded-full animate-pulse w-20"></div>
            </div>

            {/* Action Buttons Skeleton */}
            <div className="flex gap-2 pt-3 border-t border-gray-100">
              <div className="flex-1 h-8 bg-gray-200 rounded-xl animate-pulse"></div>
              <div className="flex-1 h-8 bg-gray-200 rounded-xl animate-pulse"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const SkeletonAllDestinations = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
    {[1, 2, 3, 4, 5].map((item) => (
      <div
        key={item}
        className="bg-white rounded-2xl border border-gray-200 overflow-hidden"
      >
        {/* Destination Image Skeleton */}
        <div className="h-48 bg-gray-200 relative overflow-hidden animate-pulse">
          <div className="absolute top-4 right-4">
            <div className="h-6 bg-gray-300 rounded-full animate-pulse w-20"></div>
          </div>
        </div>

        {/* Destination Info Skeleton */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <div className="h-4 w-4 bg-gray-200 rounded mr-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
            </div>
            <div className="flex items-center">
              <div className="h-4 w-4 bg-gray-200 rounded mr-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
            </div>
            <div className="flex items-center col-span-2">
              <div className="h-4 w-4 bg-gray-200 rounded mr-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
            </div>
          </div>

          {/* Action Buttons Skeleton */}
          <div className="flex gap-3">
            <div className="flex-1 h-10 bg-gray-200 rounded-xl animate-pulse"></div>
            <div className="flex-1 h-10 bg-gray-200 rounded-xl animate-pulse"></div>
          </div>
        </div>
      </div>
    ))}

    {/* Skeleton for Add Destination Card */}
    <div className="bg-white rounded-2xl border-2 border-dashed border-gray-300 overflow-hidden">
      <div className="flex flex-col items-center justify-center p-8 h-full min-h-[300px] text-center">
        <div className="w-20 h-20 bg-gray-200 rounded-2xl flex items-center justify-center mb-4 animate-pulse"></div>
        <div className="h-6 bg-gray-200 rounded animate-pulse w-40 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded animate-pulse w-56 mb-4"></div>
        <div className="h-12 bg-gray-200 rounded-xl animate-pulse w-32"></div>
      </div>
    </div>
  </div>
);

// 🔥 NEW: Add Destination Card Component
const AddDestinationCard = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-2xl border-2 border-dashed border-gray-300 overflow-hidden hover:border-blue-400 hover:shadow-xl transition-all duration-300 group transform hover:-translate-y-2"
  >
    <Link
      to="/destinations/new"
      className="flex flex-col items-center justify-center p-8 h-full min-h-[300px] text-center"
    >
      <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl flex items-center justify-center mb-4 group-hover:from-blue-200 group-hover:to-cyan-200 transition-all">
        <Plus className="h-10 w-10 text-blue-500" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">
        Tambah Destinasi Baru
      </h3>
      <p className="text-gray-600 mb-4 leading-relaxed">
        Mulai petualangan baru dengan merencanakan destinasi perjalanan Anda
      </p>
      <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-xl hover:from-blue-600 hover:to-cyan-500 transition-all font-semibold">
        <Plus className="h-5 w-5 mr-2" />
        Buat Destinasi
      </div>
    </Link>
  </motion.div>
);

const Itineraries = () => {
  const [searchParams] = useSearchParams();
  const destinationId = searchParams.get("destination");

  const [destinations, setDestinations] = useState([]);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedDays, setExpandedDays] = useState(new Set());
  const [showForm, setShowForm] = useState(false);
  const [editingItinerary, setEditingItinerary] = useState(null);
  const [viewMode, setViewMode] = useState("timeline");
  const [selectedDay, setSelectedDay] = useState(null);

  // Check if we're in single destination mode or all destinations mode
  const isSingleDestinationMode = Boolean(destinationId);

  useEffect(() => {
    loadData();
  }, [destinationId]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      if (isSingleDestinationMode) {
        // Mode 1: Single destination with itineraries
        const destData = await destinationService.getById(destinationId);
        setSelectedDestination(destData);

        const itinerariesData = await itineraryService.getByDestination(
          destinationId
        );
        setItineraries(itinerariesData);

        if (itinerariesData.length > 0) {
          const firstDay = Math.min(
            ...itinerariesData.map((i) => i.day_number)
          );
          setExpandedDays(new Set([firstDay]));
          setSelectedDay(firstDay);
        }
      } else {
        // Mode 2: All destinations (for itinerary management)
        const destinationsData = await destinationService.getAll();
        setDestinations(destinationsData);
      }
    } catch (error) {
      console.error("Failed to load data:", error);
      setError("Gagal memuat data. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const toggleDay = (dayNumber) => {
    setExpandedDays((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(dayNumber)) {
        newSet.delete(dayNumber);
      } else {
        newSet.add(dayNumber);
      }
      return newSet;
    });
    setSelectedDay(dayNumber);
  };

  const handleDelete = async (itineraryId) => {
    if (
      window.confirm(
        "Apakah Anda yakin ingin menghapus item rencana perjalanan ini?"
      )
    ) {
      try {
        await itineraryService.delete(itineraryId);
        setItineraries((prev) =>
          prev.filter((item) => item.id !== itineraryId)
        );
        // Refresh the data
        loadData();
      } catch (error) {
        console.error("Failed to delete itinerary:", error);
        alert("Gagal menghapus item rencana perjalanan.");
      }
    }
  };

  const groupItinerariesByDay = (itineraries) => {
    const grouped = {};
    itineraries.forEach((item) => {
      if (!grouped[item.day_number]) {
        grouped[item.day_number] = [];
      }
      grouped[item.day_number].push(item);
    });

    return Object.keys(grouped)
      .sort((a, b) => parseInt(a) - parseInt(b))
      .reduce((acc, day) => {
        acc[day] = grouped[day].sort((a, b) => {
          const timeA = a.schedule_time || "00:00";
          const timeB = b.schedule_time || "00:00";
          return timeA.localeCompare(timeB);
        });
        return acc;
      }, {});
  };

  const formatTime = (timeString) => {
    if (!timeString) return "Sepanjang hari";
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatDuration = (durationDays) => {
    if (durationDays === 1) return "1 hari";
    return `${durationDays} hari`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getActivityIcon = (activityType) => {
    const type = activityType?.toLowerCase() || "";
    if (
      type.includes("food") ||
      type.includes("restaurant") ||
      type.includes("eat") ||
      type.includes("makan")
    )
      return Utensils;
    if (
      type.includes("hotel") ||
      type.includes("accommodation") ||
      type.includes("stay") ||
      type.includes("penginapan")
    )
      return Hotel;
    if (
      type.includes("photo") ||
      type.includes("sightseeing") ||
      type.includes("view") ||
      type.includes("wisata")
    )
      return Camera;
    if (
      type.includes("hiking") ||
      type.includes("mountain") ||
      type.includes("nature") ||
      type.includes("alam")
    )
      return Mountain;
    if (
      type.includes("flight") ||
      type.includes("travel") ||
      type.includes("transport") ||
      type.includes("perjalanan")
    )
      return Plane;
    return Navigation;
  };

  const getDayColor = (dayNumber) => {
    const colors = [
      "from-blue-500 to-cyan-400",
      "from-purple-500 to-pink-400",
      "from-green-500 to-emerald-400",
      "from-orange-500 to-amber-400",
      "from-red-500 to-rose-400",
      "from-indigo-500 to-purple-400",
      "from-teal-500 to-cyan-400",
    ];
    return colors[(dayNumber - 1) % colors.length];
  };

  const getImageUrl = (photoPath) => {
    if (!photoPath) return null;
    if (photoPath.startsWith("http")) return photoPath;
    return `${STORAGE_BASE_URL}/destinations/${photoPath}`;
  };

  // MODE 1: Single Destination Timeline View
  const SingleDestinationTimelineView = ({ groupedItineraries }) => (
    <div className="relative">
      <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400/30 via-purple-400/30 to-cyan-400/30 rounded-full"></div>

      <div className="space-y-6">
        {Object.keys(groupedItineraries).map((dayNumber) => (
          <div key={dayNumber} className="relative flex items-start gap-6">
            {/* Timeline Dot */}
            <div
              className={`relative z-10 flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br ${getDayColor(
                dayNumber
              )} shadow-lg`}
            >
              <div className="text-white font-bold text-sm">
                Hari {dayNumber}
              </div>
            </div>

            {/* Day Content */}
            <div className="flex-1 bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  Petualangan Hari {dayNumber}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {groupedItineraries[dayNumber].length} aktivitas
                  </span>
                  <button
                    onClick={() => toggleDay(parseInt(dayNumber))}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    {expandedDays.has(parseInt(dayNumber)) ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {expandedDays.has(parseInt(dayNumber)) && (
                <div className="space-y-4">
                  {groupedItineraries[dayNumber].map((itinerary) => {
                    const ActivityIcon = getActivityIcon(itinerary.activities);
                    return (
                      <motion.div
                        key={itinerary.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-start gap-4 p-4 bg-gray-50/50 rounded-xl border border-gray-200/50 hover:border-blue-200 hover:bg-blue-50/30 transition-all group/item"
                      >
                        {/* Time Badge */}
                        <div className="flex-shrink-0">
                          <div className="bg-white px-3 py-2 rounded-lg border border-gray-300 shadow-sm">
                            <Clock className="h-4 w-4 text-blue-600 inline mr-2" />
                            <span className="text-sm font-medium text-gray-700">
                              {formatTime(itinerary.schedule_time)}
                            </span>
                          </div>
                        </div>

                        {/* Activity Icon */}
                        <div className="flex-shrink-0 p-3 bg-white rounded-xl border border-gray-200 shadow-sm">
                          <ActivityIcon className="h-5 w-5 text-blue-600" />
                        </div>

                        {/* Activity Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                                {itinerary.location}
                                {itinerary.activities?.includes(
                                  "highlight"
                                ) && (
                                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                )}
                              </h4>
                              <p className="text-gray-600 mb-2 text-sm leading-relaxed">
                                {itinerary.description}
                              </p>
                              {itinerary.activities && (
                                <div className="flex items-center gap-2">
                                  <Zap className="h-3 w-3 text-orange-500" />
                                  <span className="text-xs text-gray-500 font-medium">
                                    {itinerary.activities}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="flex gap-2 ml-4 opacity-0 group-hover/item:opacity-100 transition-opacity">
                              <button
                                onClick={() => setEditingItinerary(itinerary)}
                                className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-all"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(itinerary.id)}
                                className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // MODE 1: Single Destination Grid View
  const SingleDestinationGridView = ({ groupedItineraries }) => {
    const [selectedDay, setSelectedDay] = useState(
      Object.keys(groupedItineraries)[0] || "1"
    );

    // Get all unique days
    const allDays = Object.keys(groupedItineraries).sort(
      (a, b) => parseInt(a) - parseInt(b)
    );

    // Get activities for selected day
    const selectedDayActivities = groupedItineraries[selectedDay] || [];

    return (
      <div className="space-y-6">
        {/* Day Navigation */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Pilih Hari untuk Melihat Aktivitas
          </h3>
          <div className="flex flex-wrap gap-3">
            {allDays.map((dayNumber) => (
              <motion.button
                key={dayNumber}
                onClick={() => setSelectedDay(dayNumber)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-3 rounded-xl border-2 transition-all font-semibold ${
                  selectedDay === dayNumber
                    ? "bg-gradient-to-r from-blue-500 to-cyan-400 text-white border-transparent shadow-lg"
                    : "bg-white text-gray-700 border-gray-300 hover:border-blue-300 hover:bg-blue-50"
                }`}
              >
                Hari {dayNumber}
                <span className="ml-2 text-sm opacity-80">
                  ({groupedItineraries[dayNumber].length})
                </span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Selected Day Header */}
        <motion.div
          key={selectedDay}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-500 to-cyan-400 rounded-2xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                Rencana Perjalanan Hari {selectedDay}
              </h2>
              <p className="text-blue-100 opacity-90">
                {selectedDayActivities.length} aktivitas direncanakan untuk hari
                ini
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">
                {selectedDayActivities.length}
              </div>
              <div className="text-blue-100 text-sm">Aktivitas</div>
            </div>
          </div>
        </motion.div>

        {/* Activities Grid */}
        {selectedDayActivities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {selectedDayActivities.map((itinerary, index) => {
              const ActivityIcon = getActivityIcon(itinerary.activities);

              return (
                <motion.div
                  key={itinerary.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300 group transform hover:-translate-y-2"
                >
                  {/* Activity Header */}
                  <div
                    className={`bg-gradient-to-r ${getDayColor(
                      selectedDay
                    )} p-4 text-white`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                          <ActivityIcon className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg line-clamp-1">
                            {itinerary.location}
                          </h3>
                          <p className="text-white/80 text-sm flex items-center gap-1 mt-1">
                            <Clock className="h-3 w-3" />
                            {formatTime(itinerary.schedule_time)}
                          </p>
                        </div>
                      </div>
                      {itinerary.activities?.includes("highlight") && (
                        <Star className="h-5 w-5 text-yellow-300 fill-current" />
                      )}
                    </div>
                  </div>

                  {/* Activity Content */}
                  <div className="p-4">
                    <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                      {itinerary.description}
                    </p>

                    {/* Activities Tags */}
                    {itinerary.activities && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                          {itinerary.activities
                            .split(",")
                            .map((activity) => activity.trim())
                            .filter((activity) => activity)
                            .map((activity, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                              >
                                <Zap className="h-3 w-3 mr-1" />
                                {activity}
                              </span>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-3 border-t border-gray-100">
                      <motion.button
                        onClick={() => setEditingItinerary(itinerary)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors text-sm font-medium"
                      >
                        <Edit className="h-3 w-3" />
                        Edit
                      </motion.button>
                      <motion.button
                        onClick={() => handleDelete(itinerary.id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors text-sm font-medium"
                      >
                        <Trash2 className="h-3 w-3" />
                        Hapus
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-white rounded-2xl border border-gray-200"
          >
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Tidak Ada Aktivitas untuk Hari {selectedDay}
            </h3>
            <p className="text-gray-600 mb-4">
              Belum ada aktivitas yang direncanakan untuk hari ini.
            </p>
            <motion.button
              onClick={() => setShowForm(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors text-sm font-medium"
            >
              <Plus className="h-4 w-4 mr-2" />
              Tambah Aktivitas
            </motion.button>
          </motion.div>
        )}

        {/* Day Summary */}
        {selectedDayActivities.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Ringkasan Hari {selectedDay}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <div className="text-2xl font-bold text-blue-600">
                  {selectedDayActivities.length}
                </div>
                <div className="text-sm text-blue-800">Total Aktivitas</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <div className="text-2xl font-bold text-green-600">
                  {
                    selectedDayActivities.filter(
                      (activity) =>
                        activity.schedule_time &&
                        activity.schedule_time < "12:00"
                    ).length
                  }
                </div>
                <div className="text-sm text-green-800">Pagi</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-xl">
                <div className="text-2xl font-bold text-orange-600">
                  {
                    selectedDayActivities.filter(
                      (activity) =>
                        activity.schedule_time &&
                        activity.schedule_time >= "12:00" &&
                        activity.schedule_time < "18:00"
                    ).length
                  }
                </div>
                <div className="text-sm text-orange-800">Siang</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-xl">
                <div className="text-2xl font-bold text-purple-600">
                  {
                    selectedDayActivities.filter(
                      (activity) =>
                        activity.schedule_time &&
                        activity.schedule_time >= "18:00"
                    ).length
                  }
                </div>
                <div className="text-sm text-purple-800">Malam</div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    );
  };

  // MODE 2: All Destinations Grid View (for itinerary management) - UPDATED
  const AllDestinationsGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {destinations.map((destination) => {
        const imageUrl = getImageUrl(destination.photo);

        return (
          <motion.div
            key={destination.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300 group transform hover:-translate-y-2"
          >
            {/* Destination Image */}
            <div className="h-48 relative overflow-hidden">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={destination.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-cyan-300 flex items-center justify-center">
                  <Plane className="h-16 w-16 text-white opacity-80" />
                </div>
              )}

              {/* Fallback image */}
              {imageUrl && (
                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-cyan-300 flex items-center justify-center absolute inset-0 hidden">
                  <Plane className="h-16 w-16 text-white opacity-80" />
                </div>
              )}

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

              {/* Status Badge */}
              <div
                className={`absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm ${
                  destination.is_achieved
                    ? "bg-green-500/90 text-white"
                    : "bg-orange-500/90 text-white"
                }`}
              >
                {destination.is_achieved ? "Tercapai" : "Perencanaan"}
              </div>

              {/* Title Overlay */}
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-xl font-bold text-white line-clamp-2">
                  {destination.title}
                </h3>
              </div>
            </div>

            {/* Destination Info */}
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                  <span className="text-sm font-medium">
                    {formatDate(destination.departure_date)}
                  </span>
                </div>

                <div className="flex items-center text-gray-600">
                  <MapPin className="h-4 w-4 mr-2 text-green-500" />
                  <span className="text-sm font-medium">
                    {destination.duration_days} hari
                  </span>
                </div>

                <div className="flex items-center text-gray-600 col-span-2">
                  <DollarSign className="h-4 w-4 mr-2 text-purple-500" />
                  <span className="text-sm font-medium">
                    {formatCurrency(destination.budget)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Link
                  to={`/itineraries?destination=${destination.id}`}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-400 text-white py-2.5 px-4 rounded-xl text-center hover:from-blue-600 hover:to-cyan-500 transition-all font-medium text-sm shadow-lg hover:shadow-xl"
                >
                  Kelola Rencana
                </Link>
                <Link
                  to={`/destinations/${destination.id}`}
                  className="flex-1 border border-gray-300 text-gray-700 py-2.5 px-4 rounded-xl text-center hover:bg-gray-50 transition-colors font-medium text-sm"
                >
                  Lihat Detail
                </Link>
              </div>
            </div>
          </motion.div>
        );
      })}

      {/* 🔥 NEW: Add Destination Card at the end */}
      <AddDestinationCard />
    </div>
  );
  // 🔥 NEW: Skeleton Loading State - UPDATED
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-cyan-50/30">
        {/* Header Skeleton */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/60 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-24 h-10 bg-gray-200 rounded-xl animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-8 bg-gray-200 rounded animate-pulse w-64"></div>
                  <div className="h-4 bg-gray-100 rounded animate-pulse w-48"></div>
                </div>
              </div>
              {isSingleDestinationMode && (
                <div className="flex items-center gap-4">
                  <div className="w-32 h-10 bg-gray-200 rounded-xl animate-pulse"></div>
                  <div className="w-40 h-12 bg-gray-200 rounded-xl animate-pulse"></div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Skeleton */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {isSingleDestinationMode ? (
            // MODE 1: Single Destination Skeleton
            <>
              <SkeletonStats />
              <AnimatePresence mode="wait">
                <motion.div
                  key={viewMode}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {viewMode === "timeline" ? (
                    <SkeletonTimelineView />
                  ) : (
                    <SkeletonGridView />
                  )}
                </motion.div>
              </AnimatePresence>
            </>
          ) : (
            // MODE 2: All Destinations Skeleton - UPDATED
            <>
              <SkeletonStats />
              <SkeletonAllDestinations />
            </>
          )}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50/30 to-cyan-50/30">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Compass className="h-10 w-10 text-red-600" />
          </div>
          <div className="text-red-600 text-lg font-medium mb-4">{error}</div>
          <button
            onClick={loadData}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-xl hover:from-blue-600 hover:to-cyan-500 transition-all shadow-lg font-semibold mr-3"
          >
            <RefreshCw className="h-5 w-5 mr-2" />
            Coba Lagi
          </button>
          <Link
            to="/destinations"
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Kembali ke Destinasi
          </Link>
        </div>
      </div>
    );
  }

  const groupedItineraries = groupItinerariesByDay(itineraries);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-cyan-50/30">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-sm border-b border-gray-200/60 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link
                to={isSingleDestinationMode ? "/destinations" : "/home"}
                className="inline-flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 bg-white border border-gray-300 rounded-xl hover:border-gray-400 transition-all shadow-sm hover:shadow-md"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Kembali
              </Link>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  {isSingleDestinationMode
                    ? selectedDestination?.title || "Rencana Perjalanan"
                    : "Semua Rencana Perjalanan"}
                  <span className="ml-1 text-white">
                    {isSingleDestinationMode ? "📍" : "🗺️"}
                  </span>
                </h1>
                <p className="text-gray-600 mt-1">
                  {isSingleDestinationMode
                    ? "Kelola aktivitas dan jadwal perjalanan Anda"
                    : "Kelola rencana perjalanan untuk semua destinasi Anda"}
                </p>
              </div>
            </div>

            {isSingleDestinationMode && (
              <div className="flex items-center gap-4">
                {/* View Mode Toggle */}
                <div className="flex bg-gray-100 rounded-xl p-1">
                  {[
                    { key: "timeline", label: "Timeline", icon: List },
                    { key: "grid", label: "Grid", icon: Grid },
                  ].map((view) => (
                    <motion.button
                      key={view.key}
                      onClick={() => setViewMode(view.key)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                        viewMode === view.key
                          ? "bg-white shadow-md text-blue-600"
                          : "text-gray-600 hover:text-gray-800"
                      }`}
                    >
                      <view.icon className="h-4 w-4" />
                      <span className="text-sm font-medium">{view.label}</span>
                    </motion.button>
                  ))}
                </div>

                <motion.button
                  onClick={() => setShowForm(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-xl hover:from-blue-600 hover:to-cyan-500 transition-all shadow-lg hover:shadow-xl font-semibold"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Tambah Aktivitas
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {isSingleDestinationMode ? (
          // MODE 1: Single Destination with Itineraries
          <>
            {/* Trip Overview Cards */}
            {selectedDestination && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
              >
                {[
                  {
                    icon: Calendar,
                    value: formatDate(selectedDestination.departure_date),
                    label: "Tanggal Keberangkatan",
                    color: "blue",
                  },
                  {
                    icon: Clock,
                    value: formatDuration(selectedDestination.duration_days),
                    label: "Durasi Perjalanan",
                    color: "green",
                  },
                  {
                    icon: MapPin,
                    value: Object.keys(groupedItineraries).length,
                    label: "Hari Terencana",
                    color: "purple",
                  },
                  {
                    icon: Zap,
                    value: itineraries.length,
                    label: "Total Aktivitas",
                    color: "orange",
                  },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-gray-900">
                          {stat.value}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {stat.label}
                        </p>
                      </div>
                      <div
                        className={`p-3 rounded-xl bg-${stat.color}-100 group-hover:scale-110 transition-transform`}
                      >
                        <stat.icon
                          className={`h-6 w-6 text-${stat.color}-600`}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Itinerary Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={viewMode}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {itineraries.length === 0 ? (
                  // Empty State for Single Destination
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-16 bg-white rounded-3xl border border-gray-200 shadow-sm"
                  >
                    <div className="max-w-md mx-auto">
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Compass className="h-12 w-12 text-blue-500" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        Siap untuk Petualangan? 🗺️
                      </h3>
                      <p className="text-gray-600 mb-6 text-lg">
                        Perjalanan {selectedDestination?.duration_days} hari
                        Anda ke {selectedDestination?.title} menanti! Mulai
                        rencanakan pengalaman menakjubkan Anda.
                      </p>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <button
                          onClick={() => setShowForm(true)}
                          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-xl hover:from-blue-600 hover:to-cyan-500 transition-all shadow-lg hover:shadow-xl font-semibold text-lg"
                        >
                          <Plus className="h-6 w-6 mr-2" />
                          Rencanakan Aktivitas Pertama
                        </button>
                      </motion.div>
                    </div>
                  </motion.div>
                ) : viewMode === "timeline" ? (
                  <SingleDestinationTimelineView
                    groupedItineraries={groupedItineraries}
                  />
                ) : (
                  <SingleDestinationGridView
                    groupedItineraries={groupedItineraries}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </>
        ) : (
          // MODE 2: All Destinations Grid View
          <>
            {/* Stats for All Destinations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
            >
              {[
                {
                  icon: MapPin,
                  value: destinations.length,
                  label: "Total Destinasi",
                  color: "blue",
                },
                {
                  icon: Calendar,
                  value: destinations.filter((d) => !d.is_achieved).length,
                  label: "Perencanaan",
                  color: "orange",
                },
                {
                  icon: Star,
                  value: destinations.filter((d) => d.is_achieved).length,
                  label: "Tercapai",
                  color: "green",
                },
                {
                  icon: Zap,
                  value: formatCurrency(
                    destinations.reduce(
                      (sum, d) => sum + parseFloat(d.budget),
                      0
                    )
                  ),
                  label: "Total Budget",
                  color: "purple",
                },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
                    </div>
                    <div
                      className={`p-3 rounded-xl bg-${stat.color}-100 group-hover:scale-110 transition-transform`}
                    >
                      <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* All Destinations Grid */}
            {destinations.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16 bg-white rounded-3xl border border-gray-200 shadow-sm"
              >
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Compass className="h-12 w-12 text-blue-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    Belum Ada Destinasi 🗺️
                  </h3>
                  <p className="text-gray-600 mb-6 text-lg">
                    Mulai dengan membuat destinasi pertama Anda untuk
                    merencanakan perjalanan yang menakjubkan!
                  </p>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to="/destinations/new"
                      className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-xl hover:from-blue-600 hover:to-cyan-500 transition-all shadow-lg hover:shadow-xl font-semibold text-lg"
                    >
                      <Plus className="h-6 w-6 mr-2" />
                      Buat Destinasi Pertama
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            ) : (
              <AllDestinationsGridView />
            )}
          </>
        )}
      </div>

      {/* Itinerary Form Modal */}
      <AnimatePresence>
        {(showForm || editingItinerary) && (
          <ItineraryForm
            destinationId={destinationId}
            itinerary={editingItinerary}
            onClose={() => {
              setShowForm(false);
              setEditingItinerary(null);
            }}
            onSave={() => {
              loadData();
              setShowForm(false);
              setEditingItinerary(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Itineraries;
