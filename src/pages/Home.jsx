import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Award,
  Target,
  Zap,
  Globe,
  Clock,
  DollarSign,
  Calendar,
  Compass,
  Navigation,
  ChevronRight,
  Play,
  Pause,
  Plane,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  destinationService,
  STORAGE_BASE_URL,
} from "../services/destinationService";

const Home = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeStory, setActiveStory] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const timerRef = useRef(null);

  const loadDestinations = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await destinationService.getAll();
      setDestinations(data);
    } catch (error) {
      console.error("Failed to load destinations:", error);
      setError("Gagal memuat data destinasi. Silakan coba lagi.");
      setDestinations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDestinations();
  }, [loadDestinations]);

  // Calculate stats
  const stats = {
    total: destinations.length,
    achieved: destinations.filter((d) => d.is_achieved).length,
    planning: destinations.filter((d) => !d.is_achieved).length,
    totalBudget: destinations.reduce(
      (sum, d) => sum + parseFloat(d.budget || 0),
      0
    ),
    totalDays: destinations.reduce(
      (sum, d) => sum + parseInt(d.duration_days || 0),
      0
    ),
    upcoming: destinations.filter(
      (dest) => new Date(dest.departure_date) > new Date() && !dest.is_achieved
    ).length,
  };

  // Get featured destinations
  const featuredDestinations = destinations
    .filter((d) => !d.is_achieved)
    .slice(0, 3)
    .concat(destinations.filter((d) => d.is_achieved).slice(0, 3))
    .slice(0, 3);

  const upcomingTrips = destinations
    .filter(
      (dest) => new Date(dest.departure_date) > new Date() && !dest.is_achieved
    )
    .sort((a, b) => new Date(a.departure_date) - new Date(b.departure_date))
    .slice(0, 3);

  // Timer effect - HARUS SETELAH featuredDestinations didefinisikan
  useEffect(() => {
    // Clear existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (!isPlaying || featuredDestinations.length === 0) return;

    // Set new timer
    timerRef.current = setInterval(() => {
      setActiveStory((prev) => (prev + 1) % featuredDestinations.length);
    }, 5000);

    // Cleanup function
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isPlaying, featuredDestinations.length]);

  // Handle manual story change
  const handleStoryChange = useCallback(
    (index) => {
      // Clear and restart timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      setActiveStory(index);

      if (isPlaying) {
        timerRef.current = setInterval(() => {
          setActiveStory((prev) => (prev + 1) % featuredDestinations.length);
        }, 5000);
      }
    },
    [isPlaying, featuredDestinations.length]
  );

  // Handle play/pause
  const handlePlayPause = useCallback(() => {
    if (isPlaying) {
      // Pause
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    } else {
      // Play
      if (!timerRef.current && featuredDestinations.length > 0) {
        timerRef.current = setInterval(() => {
          setActiveStory((prev) => (prev + 1) % featuredDestinations.length);
        }, 5000);
      }
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying, featuredDestinations.length]);

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

  const getDaysUntil = (dateString) => {
    const today = new Date();
    const departure = new Date(dateString);
    const diffTime = departure - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getImageUrl = (photoPath) => {
    if (!photoPath) return null;
    if (photoPath.startsWith("http")) return photoPath;
    return `${STORAGE_BASE_URL}/destinations/${photoPath}`;
  };

  const StoryCarousel = () => {
    if (featuredDestinations.length === 0) return null;

    return (
      <div className="relative h-80 rounded-3xl overflow-hidden mb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <div className="relative w-full h-full">
              {featuredDestinations[activeStory]?.photo ? (
                <img
                  src={getImageUrl(featuredDestinations[activeStory].photo)}
                  alt={featuredDestinations[activeStory].title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-cyan-300 flex items-center justify-center">
                  <Plane className="h-20 w-20 text-white opacity-80" />
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        featuredDestinations[activeStory]?.is_achieved
                          ? "bg-green-500/90"
                          : "bg-orange-500/90"
                      }`}
                    >
                      {featuredDestinations[activeStory]?.is_achieved
                        ? "Kenangan"
                        : "Akan Datang"}
                    </div>
                    <div className="flex items-center text-sm opacity-90">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDate(
                        featuredDestinations[activeStory]?.departure_date
                      )}
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold mb-2">
                    {featuredDestinations[activeStory]?.title}
                  </h3>

                  <p className="text-white/80 mb-4 line-clamp-2">
                    {featuredDestinations[activeStory]?.is_achieved
                      ? "Perjalanan tak terlupakan penuh pengalaman seru"
                      : `Berangkat dalam ${getDaysUntil(
                          featuredDestinations[activeStory]?.departure_date
                        )} hari - Siap petualangan!`}
                  </p>

                  <Link
                    to={`/destinations/${featuredDestinations[activeStory]?.id}`}
                    className="inline-flex items-center px-6 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl hover:bg-white/30 transition-all text-white font-semibold"
                  >
                    Lihat Cerita
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Story Controls */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-4">
          <div className="flex gap-2">
            {featuredDestinations.map((_, index) => (
              <button
                key={index}
                onClick={() => handleStoryChange(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === activeStory ? "bg-white w-6" : "bg-white/50"
                }`}
              />
            ))}
          </div>

          <button
            onClick={handlePlayPause}
            className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
          >
            {isPlaying ? (
              <Pause className="h-4 w-4 text-white" />
            ) : (
              <Play className="h-4 w-4 text-white" />
            )}
          </button>
        </div>
      </div>
    );
  };

  const TripHighlights = () => {
    const completedTrips = destinations
      .filter((d) => d.is_achieved)
      .slice(0, 2);

    if (completedTrips.length === 0) return null;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {completedTrips.map((trip) => (
          <div
            key={trip.id}
            className="bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl p-6 text-white relative overflow-hidden"
          >
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-white/20 rounded-xl">
                  <Award className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Perjalanan Selesai</h3>
                  <p className="text-white/80 text-sm">Berhasil dikunjungi</p>
                </div>
              </div>

              <h4 className="text-xl font-bold mb-2">{trip.title}</h4>
              <p className="text-white/80 mb-4">
                {trip.duration_days} hari penuh petualangan
              </p>

              <div className="flex items-center justify-between">
                <span className="text-sm">
                  {formatDate(trip.departure_date)}
                </span>
                <div className="text-sm bg-white/20 px-3 py-1 rounded-full">
                  {formatCurrency(trip.budget)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const QuickStats = () => (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {[
        {
          icon: Globe,
          value: stats.total,
          label: "Total Perjalanan",
          color: "blue",
        },
        {
          icon: Award,
          value: stats.achieved,
          label: "Tercapai",
          color: "green",
        },
        {
          icon: Target,
          value: stats.upcoming,
          label: "Akan Datang",
          color: "orange",
        },
        {
          icon: Zap,
          value: stats.totalDays,
          label: "Total Hari",
          color: "purple",
        },
      ].map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900 mb-1">
                {stat.value}
              </p>
              <p className="text-sm font-semibold text-gray-600">
                {stat.label}
              </p>
            </div>
            <div
              className={`p-3 rounded-xl bg-${stat.color}-100 group-hover:scale-110 transition-transform`}
            >
              <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  const UpcomingTrips = () => (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          Perjalanan Mendatang
        </h2>
        <Link
          to="/destinations"
          className="text-blue-500 hover:text-blue-600 font-semibold text-sm flex items-center gap-1"
        >
          Lihat Semua
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="space-y-4">
        {upcomingTrips.map((trip) => (
          <div
            key={trip.id}
            className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-blue-300 transition-all group"
          >
            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-400 rounded-xl flex items-center justify-center text-white font-bold text-sm">
              {getDaysUntil(trip.departure_date)}h
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900">{trip.title}</h3>
              <p className="text-sm text-gray-600">
                {formatDate(trip.departure_date)} • {trip.duration_days} hari
              </p>
            </div>

            <div className="text-right">
              <p className="font-semibold text-gray-900">
                {formatCurrency(trip.budget)}
              </p>
            </div>
          </div>
        ))}

        {upcomingTrips.length === 0 && (
          <div className="text-center py-8">
            <Compass className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 mb-4">Belum ada perjalanan mendatang</p>
            <Link
              to="/destinations/new"
              className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors text-sm font-semibold"
            >
              <Plus className="h-4 w-4 mr-2" />
              Rencanakan Perjalanan
            </Link>
          </div>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50/30 to-cyan-50/30">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360, scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
          >
            <Compass className="h-8 w-8 text-white" />
          </motion.div>
          <p className="text-gray-600 font-medium">
            Memuat dashboard perjalanan...
          </p>
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
            onClick={loadDestinations}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-xl hover:from-blue-600 hover:to-cyan-500 transition-all shadow-lg font-semibold"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

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
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Dashboard Perjalanan
                  <span className="ml-1 text-white">🌟</span>
                </h1>
                <p className="text-gray-600 mt-1">
                  Ringkasan perjalanan dan rencana Anda
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/destinations/new"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-xl hover:from-blue-600 hover:to-cyan-500 transition-all shadow-lg hover:shadow-xl font-semibold"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Tambah Destinasi
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Story Carousel */}
        <StoryCarousel />

        {/* Quick Stats */}
        <QuickStats />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="xl:col-span-2 space-y-8">
            {/* Trip Highlights */}
            <TripHighlights />

            {/* Progress Section */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Progress Perjalanan
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="font-bold text-gray-900">{stats.totalDays}</p>
                  <p className="text-sm text-gray-600">Total Hari</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="font-bold text-gray-900">
                    {formatCurrency(stats.totalBudget)}
                  </p>
                  <p className="text-sm text-gray-600">Total Budget</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <UpcomingTrips />

            {/* Quick Actions */}
            <div className="bg-blue-500 rounded-2xl p-6 text-white">
              <h3 className="font-bold text-lg mb-4">Aksi Cepat</h3>
              <div className="space-y-3">
                <Link
                  to="/destinations/new"
                  className="flex items-center gap-3 p-3 bg-white/20 rounded-xl hover:bg-white/30 transition-all"
                >
                  <Plus className="h-5 w-5" />
                  <span>Perjalanan Baru</span>
                </Link>

                <Link
                  to="/destinations"
                  className="flex items-center gap-3 p-3 bg-white/20 rounded-xl hover:bg-white/30 transition-all"
                >
                  <Compass className="h-5 w-5" />
                  <span>Destinasi</span>
                </Link>

                <Link
                  to="/itineraries"
                  className="flex items-center gap-3 p-3 bg-white/20 rounded-xl hover:bg-white/30 transition-all"
                >
                  <Navigation className="h-5 w-5" />
                  <span>Rencana Perjalanan</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
