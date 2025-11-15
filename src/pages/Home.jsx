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
} from "lucide-react";
import { motion } from "framer-motion";
import { destinationService } from "../services/destinationService";

const Home = () => {
  const [destinations, setDestinations] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load destinations from API
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

  // Helper function untuk active button classes
  const getActiveButtonClass = (color) => {
    const colorMap = {
      blue: "bg-blue-500 text-white border-blue-500 shadow-md",
      green: "bg-green-500 text-white border-green-500 shadow-md",
      orange: "bg-orange-500 text-white border-orange-500 shadow-md",
      gray: "bg-gray-500 text-white border-gray-500 shadow-md",
      red: "bg-red-500 text-white border-red-500 shadow-md",
      purple: "bg-purple-500 text-white border-purple-500 shadow-md",
    };

    return colorMap[color] || colorMap.blue; // fallback ke blue
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

  // Calculate stats
  const stats = {
    total: destinations.length,
    achieved: destinations.filter((d) => d.is_achieved).length,
    totalBudget: destinations.reduce((sum, d) => sum + parseFloat(d.budget), 0),
    planning: destinations.filter((d) => !d.is_achieved).length,
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your adventures...</p>
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
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section dengan Glassmorphism */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-blue-500/10 to-cyan-400/10 rounded-2xl p-8 mb-8 border border-blue-200/30 backdrop-blur-sm"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome to Your Travel Planner 🗺️
            </h1>
            <p className="text-gray-600 text-lg">
              Plan, track, and relive your adventures in one place
            </p>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/destinations/new"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-xl hover:from-blue-600 hover:to-cyan-500 transition-all shadow-lg hover:shadow-xl"
            >
              <Plus className="h-5 w-5 mr-2" />
              New Destination
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Overview - Compact & Modern */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-sm text-gray-600 mt-1">Total Trips</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Compass className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {stats.achieved}
              </p>
              <p className="text-sm text-gray-600 mt-1">Completed</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {stats.planning}
              </p>
              <p className="text-sm text-gray-600 mt-1">Planning</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <XCircle className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(stats.totalBudget)}
              </p>
              <p className="text-sm text-gray-600 mt-1">Total Budget</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Search and Filter Section - Compact */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm mb-8"
      >
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex-1 w-full lg:max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search destinations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50/50"
              />
            </div>
          </div>

          <div className="flex gap-2">
            {[
              { key: "all", label: "All", color: "gray" },
              { key: "achieved", label: "Completed", color: "green" },
              { key: "not_achieved", label: "Planning", color: "orange" },
            ].map((filterOption) => (
              <motion.button
                key={filterOption.key}
                onClick={() => setFilter(filterOption.key)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-xl border transition-all font-medium ${
                  filter === filterOption.key
                    ? getActiveButtonClass(filterOption.color)
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                {filterOption.label}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Destinations Grid */}
      {filteredDestinations.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 bg-white rounded-2xl border border-gray-200 shadow-sm"
        >
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Mountain className="h-10 w-10 text-blue-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              {searchTerm || filter !== "all"
                ? "No destinations found"
                : "No adventures yet"}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filter !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Start planning your first amazing journey"}
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/destinations/new"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-xl hover:from-blue-600 hover:to-cyan-500 transition-all shadow-lg"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create Your First Destination
              </Link>
            </motion.div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          {filteredDestinations.map((destination, index) => (
            <motion.div
              key={destination.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{
                y: -8,
                transition: { type: "spring", stiffness: 300 },
              }}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300 group"
            >
              {/* Destination Image */}
              <div className="h-48 relative overflow-hidden">
                {destination.photo ? (
                  <img
                    src={destination.photo}
                    alt={destination.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-400 to-cyan-300 flex items-center justify-center">
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
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Home;
