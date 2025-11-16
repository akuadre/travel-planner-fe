import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  MapPin,
  Calendar,
  DollarSign,
  CheckCircle,
  XCircle,
  Plane,
  Mountain,
  Compass,
  Navigation,
  Sparkles,
  Globe,
  TrendingUp,
  Clock,
  Users,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  destinationService,
  STORAGE_BASE_URL,
} from "../services/destinationService";

const Home = () => {
  const [destinations, setDestinations] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeView, setActiveView] = useState("grid"); // grid atau timeline

  // Load destinations dari API
  useEffect(() => {
    loadDestinations();
  }, []);

  const loadDestinations = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await destinationService.getAll();
      setDestinations(data);
    } catch (error) {
      console.error("Failed to load destinations:", error);
      setError("Failed to load destinations. Please try again.");
      setDestinations([]);
    } finally {
      setLoading(false);
    }
  };

  // Function untuk get full image URL
  const getImageUrl = (photoPath) => {
    if (!photoPath) return null;

    // Jika sudah full URL, return langsung
    if (photoPath.startsWith("http")) {
      return photoPath;
    }

    // Jika hanya nama file, combine dengan base URL
    return `${STORAGE_BASE_URL}/destinations/${photoPath}`;
  };

  // Filter destinations
  const filteredDestinations = destinations.filter((destination) => {
    const matchesSearch = destination.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      (filter === "achieved" && destination.is_achieved) ||
      (filter === "not_achieved" && !destination.is_achieved);

    return matchesSearch && matchesFilter;
  });

  // Calculate stats dengan lebih detail
  const stats = {
    total: destinations.length,
    achieved: destinations.filter((d) => d.is_achieved).length,
    planning: destinations.filter((d) => !d.is_achieved).length,
    totalBudget: destinations.reduce((sum, d) => sum + parseFloat(d.budget), 0),
    totalDays: destinations.reduce(
      (sum, d) => sum + parseInt(d.duration_days),
      0
    ),
    upcoming: destinations.filter(
      (dest) => new Date(dest.departure_date) > new Date() && !dest.is_achieved
    ).length,
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Get time until departure
  const getTimeUntilDeparture = (dateString) => {
    const today = new Date();
    const departure = new Date(dateString);
    const diffTime = departure - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "Past trip";
    if (diffDays === 0) return "Today!";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays < 7) return `${diffDays} days`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks`;
    return `${Math.ceil(diffDays / 30)} months`;
  };

  // Timeline View Component
  const TimelineView = () => (
    <div className="relative">
      {/* Timeline Line */}
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-400 to-cyan-400"></div>

      <div className="space-y-8">
        {filteredDestinations.map((destination, index) => (
          <motion.div
            key={destination.id}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative flex items-start gap-6 group"
          >
            {/* Timeline Dot */}
            <div
              className={`relative z-10 flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center ${
                destination.is_achieved
                  ? "bg-green-500 shadow-lg shadow-green-500/25"
                  : "bg-gradient-to-br from-blue-500 to-cyan-400 shadow-lg shadow-blue-500/25"
              }`}
            >
              {destination.is_achieved ? (
                <CheckCircle className="h-6 w-6 text-white" />
              ) : (
                <Navigation className="h-6 w-6 text-white" />
              )}
            </div>

            {/* Content Card */}
            <motion.div
              className="flex-1 bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02]"
              whileHover={{ y: -4 }}
            >
              {/* Jika mau tambahkan image di timeline view */}
              {destination.photo && (
                <div className="mb-4">
                  <img
                    src={getImageUrl(destination.photo)}
                    alt={destination.title}
                    className="w-full h-32 object-cover rounded-xl"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                </div>
              )}

              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {destination.title}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(destination.departure_date)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{destination.duration_days} days</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      <span>{formatCurrency(destination.budget)}</span>
                    </div>
                  </div>
                </div>

                <div
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    destination.is_achieved
                      ? "bg-green-100 text-green-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {destination.is_achieved
                    ? "Completed"
                    : getTimeUntilDeparture(destination.departure_date)}
                </div>
              </div>

              {/* Progress Bar untuk upcoming trips */}
              {!destination.is_achieved && (
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Journey Progress</span>
                    <span>
                      {getTimeUntilDeparture(destination.departure_date)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.random() * 60 + 20}%` }}
                      transition={{ duration: 1, delay: index * 0.2 }}
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Link
                  to={`/destinations/${destination.id}`}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-400 text-white py-2.5 px-4 rounded-xl text-center hover:from-blue-600 hover:to-cyan-500 transition-all font-medium text-sm shadow-lg hover:shadow-xl"
                >
                  Explore Journey
                </Link>
                <Link
                  to={`/itineraries?destination=${destination.id}`}
                  className="flex-1 border border-gray-300 text-gray-700 py-2.5 px-4 rounded-xl text-center hover:bg-gray-50 transition-colors font-medium text-sm"
                >
                  Plan Itinerary
                </Link>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const GridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {filteredDestinations.map((destination) => {
        const imageUrl = getImageUrl(destination.photo);

        return (
          <div
            key={destination.id}
            className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300 group transform hover:-translate-y-2"
          >
            {/* Destination Image - UPDATED */}
            <div className="h-48 relative overflow-hidden">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={destination.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    // Fallback jika image gagal load
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-cyan-300 flex items-center justify-center">
                  <Plane className="h-16 w-16 text-white opacity-80" />
                </div>
              )}

              {/* Fallback image yang hidden awalnya */}
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
                {destination.is_achieved ? (
                  <span className="flex items-center">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Completed
                  </span>
                ) : (
                  <span className="flex items-center">
                    <XCircle className="h-3 w-3 mr-1" />
                    Planning
                  </span>
                )}
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
                    {destination.duration_days} days
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
                  to={`/destinations/${destination.id}`}
                  className="flex-1 bg-blue-500 text-white py-2.5 px-4 rounded-xl text-center hover:bg-blue-600 transition-colors font-medium text-sm"
                >
                  View Details
                </Link>
                <Link
                  to={`/itineraries?destination=${destination.id}`}
                  className="flex-1 border border-gray-300 text-gray-700 py-2.5 px-4 rounded-xl text-center hover:bg-gray-50 transition-colors font-medium text-sm"
                >
                  Itinerary
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-gray-600">Charting your adventures...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-4">{error}</div>
          <button
            onClick={loadDestinations}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-xl hover:from-blue-600 hover:to-cyan-500 transition-all shadow-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Enhanced Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-cyan-400/10 rounded-3xl p-8 mb-8 border border-blue-200/30 backdrop-blur-sm overflow-hidden"
      >
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-300/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-300/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 flex items-center justify-between">
          <div>
            <motion.h1
              className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span className="text-white">🗺️</span> Your Travel Journey
            </motion.h1>
            <motion.p
              className="text-gray-600 text-lg max-w-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Track your adventures, plan future journeys, and relive memories
              in one beautiful timeline
            </motion.p>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Link
              to="/destinations/new"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-xl hover:from-blue-600 hover:to-cyan-500 transition-all shadow-lg hover:shadow-xl font-semibold"
            >
              <Plus className="h-5 w-5 mr-2" />
              New Journey
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Enhanced Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
        {[
          {
            icon: Globe,
            value: stats.total,
            label: "Total Trips",
            color: "blue",
          },
          {
            icon: CheckCircle,
            value: stats.achieved,
            label: "Completed",
            color: "green",
          },
          {
            icon: Navigation,
            value: stats.planning,
            label: "Planning",
            color: "orange",
          },
          {
            icon: TrendingUp,
            value: stats.upcoming,
            label: "Upcoming",
            color: "purple",
          },
          {
            icon: Clock,
            value: `${stats.totalDays}+`,
            label: "Total Days",
            color: "cyan",
          },
          {
            icon: DollarSign,
            value: formatCurrency(stats.totalBudget),
            label: "Total Budget",
            color: "pink",
          },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-600 mt-1">{stat.label}</p>
              </div>
              <div
                className={`p-2 rounded-lg bg-${stat.color}-100 group-hover:scale-110 transition-transform`}
              >
                <stat.icon className={`h-5 w-5 text-${stat.color}-600`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Enhanced Search and View Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm mb-8"
      >
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex-1 w-full lg:max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search your journeys..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50/50"
              />
            </div>
          </div>

          <div className="flex gap-3">
            {/* View Toggle */}
            <div className="flex bg-gray-100 rounded-xl p-1">
              {[
                { key: "grid", label: "Grid", icon: Compass },
                { key: "timeline", label: "Timeline", icon: Navigation },
              ].map((view) => (
                <motion.button
                  key={view.key}
                  onClick={() => setActiveView(view.key)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    activeView === view.key
                      ? "bg-white shadow-md text-blue-600"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  <view.icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{view.label}</span>
                </motion.button>
              ))}
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2">
              {[
                { key: "all", label: "All", color: "blue" },
                { key: "achieved", label: "Completed", color: "green" },
                { key: "not_achieved", label: "Planning", color: "orange" },
              ].map((filterOption) => (
                <motion.button
                  key={filterOption.key}
                  onClick={() => setFilter(filterOption.key)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 rounded-xl border transition-all font-medium text-sm ${
                    filter === filterOption.key
                      ? `bg-${filterOption.color}-500 text-white border-${filterOption.color}-500 shadow-md`
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {filterOption.label}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Dynamic Content Area */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeView}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {filteredDestinations.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 bg-white rounded-2xl border border-gray-200 shadow-sm"
            >
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="h-10 w-10 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {searchTerm || filter !== "all"
                    ? "No journeys found"
                    : "Your adventure timeline is empty"}
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm || filter !== "all"
                    ? "Try adjusting your search or filter criteria"
                    : "Start your first amazing journey and watch your timeline come to life!"}
                </p>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/destinations/new"
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-xl hover:from-blue-600 hover:to-cyan-500 transition-all shadow-lg font-semibold"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Begin Your Journey
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          ) : activeView === "timeline" ? (
            <TimelineView />
          ) : (
            <GridView />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Home;
