import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Calendar,
  DollarSign,
  MapPin,
  Download,
  RefreshCw,
  Filter,
  SortAsc,
  Plane,
  Compass,
} from "lucide-react";
import { motion } from "framer-motion";
import { destinationService } from "../services/destinationService";

const Destinations = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedDestinations, setSelectedDestinations] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: "departure_date",
    direction: "asc",
  });
  const [refreshing, setRefreshing] = useState(false);
  const [operationLoading, setOperationLoading] = useState(null);

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

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDestinations();
    setRefreshing(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this destination?")) {
      setOperationLoading(id);
      try {
        await destinationService.delete(id);
        setDestinations((prev) => prev.filter((d) => d.id !== id));
        setSelectedDestinations((prev) =>
          prev.filter((destId) => destId !== id)
        );
      } catch (error) {
        console.error("Failed to delete destination:", error);
        alert("Failed to delete destination. Please try again.");
      } finally {
        setOperationLoading(null);
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedDestinations.length === 0) return;

    if (
      window.confirm(
        `Are you sure you want to delete ${selectedDestinations.length} destinations?`
      )
    ) {
      try {
        await destinationService.bulkDelete(selectedDestinations);
        setDestinations((prev) =>
          prev.filter((d) => !selectedDestinations.includes(d.id))
        );
        setSelectedDestinations([]);
      } catch (error) {
        console.error("Failed to delete destinations:", error);
        alert("Failed to delete destinations. Please try again.");
      }
    }
  };

  const handleBulkStatusUpdate = async (newStatus) => {
    if (selectedDestinations.length === 0) return;

    try {
      await destinationService.bulkUpdate(selectedDestinations, {
        is_achieved: newStatus,
      });
      setDestinations((prev) =>
        prev.map((d) =>
          selectedDestinations.includes(d.id)
            ? { ...d, is_achieved: newStatus }
            : d
        )
      );
      setSelectedDestinations([]);
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Failed to update status");
    }
  };

  // Filter destinations
  const filteredDestinations = destinations.filter((destination) => {
    const matchesSearch = destination.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "achieved" && destination.is_achieved) ||
      (statusFilter === "not_achieved" && !destination.is_achieved);

    return matchesSearch && matchesStatus;
  });

  // Sort destinations
  const sortedDestinations = [...filteredDestinations].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  // Handle sort
  const handleSort = (key) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === "asc"
          ? "desc"
          : "asc",
    });
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      await destinationService.update(id, {
        is_achieved: !currentStatus,
      });
      setDestinations((prev) =>
        prev.map((d) =>
          d.id === id ? { ...d, is_achieved: !currentStatus } : d
        )
      );
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Failed to update status");
    }
  };

  // Handle selection
  const toggleDestinationSelection = (id) => {
    setSelectedDestinations((prev) =>
      prev.includes(id) ? prev.filter((destId) => destId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedDestinations.length === sortedDestinations.length) {
      setSelectedDestinations([]);
    } else {
      setSelectedDestinations(sortedDestinations.map((d) => d.id));
    }
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

  const handleExport = () => {
    // Implement export to CSV/Excel
    console.log("Export functionality to be implemented");
  };

  // Helper function untuk active button classes
  const getActiveButtonClass = (color) => {
    const colorMap = {
      blue: "bg-blue-500 text-white border-blue-500 shadow-md",
      green: "bg-green-500 text-white border-green-500 shadow-md", 
      orange: "bg-orange-500 text-white border-orange-500 shadow-md",
    };
    
    return colorMap[color] || colorMap.blue;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your destinations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-blue-500/10 to-cyan-400/10 rounded-2xl p-6 mb-6 border border-blue-200/30 backdrop-blur-sm"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Your Destinations 🗺️
            </h1>
            <p className="text-gray-600 text-lg">
              Manage and organize all your travel plans
            </p>
          </div>
          <div className="flex gap-3">
            <motion.button
              onClick={handleRefresh}
              disabled={refreshing}
              whileHover={{ scale: refreshing ? 1 : 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all disabled:opacity-50"
            >
              <RefreshCw
                className={`h-5 w-5 mr-2 ${refreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </motion.button>
            <motion.button
              onClick={handleExport}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all"
            >
              <Download className="h-5 w-5 mr-2" />
              Export
            </motion.button>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/destinations/new"
                className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-xl hover:from-blue-600 hover:to-cyan-500 transition-all shadow-lg hover:shadow-xl"
              >
                <Plus className="h-5 w-5 mr-2" />
                New Destination
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">{destinations.length}</p>
              <p className="text-sm text-gray-600 mt-1">Total</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Compass className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {destinations.filter(d => d.is_achieved).length}
              </p>
              <p className="text-sm text-gray-600 mt-1">Completed</p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {destinations.filter(d => !d.is_achieved).length}
              </p>
              <p className="text-sm text-gray-600 mt-1">Planning</p>
            </div>
            <div className="p-2 bg-orange-100 rounded-lg">
              <XCircle className="h-5 w-5 text-orange-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(destinations.reduce((sum, d) => sum + parseFloat(d.budget), 0))}
              </p>
              <p className="text-sm text-gray-600 mt-1">Total Budget</p>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <DollarSign className="h-5 w-5 text-purple-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Search and Filter Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm mb-6"
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

          <div className="flex gap-3">
            <div className="flex gap-2">
              {[
                { key: "all", label: "All", color: "blue" },
                { key: "achieved", label: "Completed", color: "green" },
                { key: "not_achieved", label: "Planning", color: "orange" },
              ].map((filterOption) => (
                <motion.button
                  key={filterOption.key}
                  onClick={() => setStatusFilter(filterOption.key)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 rounded-xl border transition-all font-medium ${
                    statusFilter === filterOption.key
                      ? getActiveButtonClass(filterOption.color)
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {filterOption.label}
                </motion.button>
              ))}
            </div>

            <select
              value={`${sortConfig.key}-${sortConfig.direction}`}
              onChange={(e) => {
                const [key, direction] = e.target.value.split("-");
                setSortConfig({ key, direction });
              }}
              className="px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50/50"
            >
              <option value="departure_date-asc">Date: Oldest First</option>
              <option value="departure_date-desc">Date: Newest First</option>
              <option value="title-asc">Title: A-Z</option>
              <option value="title-desc">Title: Z-A</option>
              <option value="budget-asc">Budget: Low to High</option>
              <option value="budget-desc">Budget: High to Low</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedDestinations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-4 p-4 bg-gradient-to-r from-blue-500/10 to-cyan-400/10 border border-blue-200 rounded-xl"
          >
            <div className="flex items-center justify-between">
              <p className="text-blue-800 font-medium">
                {selectedDestinations.length} destination(s) selected
              </p>
              <div className="flex gap-2">
                <motion.button
                  onClick={() => handleBulkStatusUpdate(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center px-3 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all"
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Mark Completed
                </motion.button>
                <motion.button
                  onClick={() => handleBulkStatusUpdate(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center px-3 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-all"
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Mark Planning
                </motion.button>
                <motion.button
                  onClick={handleBulkDelete}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center px-3 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete Selected
                </motion.button>
                <button
                  onClick={() => setSelectedDestinations([])}
                  className="px-3 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all"
                >
                  Clear
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Destinations Table */}
      {sortedDestinations.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 bg-white rounded-2xl border border-gray-200 shadow-sm"
        >
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Plane className="h-10 w-10 text-blue-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              {searchTerm || statusFilter !== "all" 
                ? "No destinations found" 
                : "No destinations yet"
              }
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Start planning your first amazing journey"
              }
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-12">
                    <input
                      type="checkbox"
                      checked={
                        selectedDestinations.length ===
                          sortedDestinations.length &&
                        sortedDestinations.length > 0
                      }
                      onChange={toggleSelectAll}
                      className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Destination
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort("departure_date")}
                  >
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Departure
                      {sortConfig.key === "departure_date" && (
                        <SortAsc className={`h-3 w-3 ${sortConfig.direction === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort("budget")}
                  >
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      Budget
                      {sortConfig.key === "budget" && (
                        <SortAsc className={`h-3 w-3 ${sortConfig.direction === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      Duration
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedDestinations.map((destination, index) => (
                  <motion.tr
                    key={destination.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    {/* Checkbox */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedDestinations.includes(destination.id)}
                        onChange={() => toggleDestinationSelection(destination.id)}
                        className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                      />
                    </td>

                    {/* Destination Info */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-300 rounded-xl flex items-center justify-center shadow-md">
                          {destination.photo ? (
                            <img
                              src={destination.photo}
                              alt={destination.title}
                              className="w-12 h-12 rounded-xl object-cover"
                            />
                          ) : (
                            <Plane className="h-6 w-6 text-white" />
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {destination.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            Created {formatDate(destination.created_at)}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Departure Date */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatDate(destination.departure_date)}
                      </div>
                    </td>

                    {/* Budget */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        {formatCurrency(destination.budget)}
                      </div>
                    </td>

                    {/* Duration */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {destination.duration_days} days
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <motion.button
                        onClick={() => toggleStatus(destination.id, destination.is_achieved)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                          destination.is_achieved
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : "bg-orange-100 text-orange-800 hover:bg-orange-200"
                        }`}
                      >
                        {destination.is_achieved ? (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Completed
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3 mr-1" />
                            Planning
                          </>
                        )}
                      </motion.button>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                          <Link
                            to={`/destinations/${destination.id}`}
                            className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                          <Link
                            to={`/destinations/${destination.id}/edit`}
                            className="p-2 text-green-500 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                          <button
                            onClick={() => handleDelete(destination.id)}
                            disabled={operationLoading === destination.id}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                            title="Delete"
                          >
                            {operationLoading === destination.id ? (
                              <div className="animate-spin h-4 w-4 border-2 border-red-500 border-t-transparent rounded-full"></div>
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </button>
                        </motion.div>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing <span className="font-semibold">{sortedDestinations.length}</span> destinations
              </p>
              <div className="text-sm text-gray-600">
                Total: <span className="font-semibold">{destinations.length}</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Destinations;