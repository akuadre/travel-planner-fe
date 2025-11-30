import React, { useState, useEffect, useRef } from "react";
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
  MoreVertical,
  Plane,
  Compass,
  ChevronDown,
  ArrowLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  STORAGE_BASE_URL,
  destinationService,
} from "../services/destinationService";

// 🔥 IMPROVED: Realistic Skeleton Loading Components
const SkeletonStats = () => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    {[1, 2, 3, 4].map((item) => (
      <div
        key={item}
        className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm"
      >
        <div className="flex items-center justify-between">
          <div className="space-y-2 flex-1">
            <div className="h-8 bg-gray-200 rounded-lg animate-pulse w-16"></div>
            <div className="h-4 bg-gray-100 rounded animate-pulse w-24"></div>
          </div>
          <div className="p-3 rounded-xl bg-gray-200 animate-pulse">
            <div className="h-6 w-6"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const SkeletonSearchBar = () => (
  <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-6">
    <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
      <div className="flex-1 w-full lg:max-w-md">
        <div className="relative">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            <div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="w-full pl-12 pr-4 py-3.5 bg-gray-100 rounded-xl animate-pulse"></div>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
        <div className="flex gap-2">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="w-24 h-10 bg-gray-200 rounded-xl animate-pulse"
            ></div>
          ))}
        </div>
        <div className="w-48 h-10 bg-gray-200 rounded-xl animate-pulse"></div>
      </div>
    </div>
  </div>
);

const SkeletonTable = () => (
  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gradient-to-r from-gray-50 to-gray-100/50 border-b border-gray-200">
          <tr>
            {[1, 2, 3, 4, 5, 6, 7].map((item) => (
              <th key={item} className="px-6 py-4">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {[1, 2, 3].map((row) => (
            <tr key={row} className="hover:bg-blue-50/30 transition-colors">
              {/* Checkbox */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
              </td>

              {/* Destination Info */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-14 h-14 bg-gray-200 rounded-xl animate-pulse"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-5 bg-gray-200 rounded animate-pulse w-32"></div>
                    <div className="h-3 bg-gray-100 rounded animate-pulse w-24"></div>
                  </div>
                </div>
              </td>

              {/* Departure Date */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-28"></div>
              </td>

              {/* Budget */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
              </td>

              {/* Duration */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="h-6 bg-gray-200 rounded-full animate-pulse w-16"></div>
              </td>

              {/* Status */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="h-8 bg-gray-200 rounded-xl animate-pulse w-24"></div>
              </td>

              {/* Actions */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex gap-3">
                  <div className="h-8 bg-gray-200 rounded-xl animate-pulse w-16"></div>
                  <div className="h-8 bg-gray-200 rounded-xl animate-pulse w-8"></div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
      <div className="flex items-center justify-between">
        <div className="h-4 bg-gray-200 rounded animate-pulse w-40"></div>
        <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
      </div>
    </div>
  </div>
);

// 🔥 NEW: Empty State Skeleton untuk ketika tidak ada data
const SkeletonEmptyState = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="text-center py-20 bg-white rounded-2xl border border-gray-200 shadow-sm"
  >
    <div className="max-w-md mx-auto">
      <div className="w-24 h-24 bg-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6 animate-pulse"></div>
      <div className="h-8 bg-gray-200 rounded animate-pulse w-64 mx-auto mb-4"></div>
      <div className="h-4 bg-gray-200 rounded animate-pulse w-48 mx-auto mb-8"></div>
      <div className="h-12 bg-gray-200 rounded-2xl animate-pulse w-48 mx-auto"></div>
    </div>
  </motion.div>
);

// 🔥 NEW: Header Skeleton yang lebih realistis
const SkeletonHeader = () => (
  <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/60 shadow-sm">
    <div className="max-w-7xl mx-auto px-6 py-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="w-32 h-10 bg-gray-200 rounded-xl animate-pulse"></div>
          <div className="space-y-2">
            <div className="h-8 bg-gray-200 rounded animate-pulse w-64"></div>
            <div className="h-4 bg-gray-100 rounded animate-pulse w-48"></div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-32 h-10 bg-gray-200 rounded-xl animate-pulse"></div>
          <div className="w-40 h-12 bg-gray-200 rounded-xl animate-pulse"></div>
        </div>
      </div>
    </div>
  </div>
);

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
  const [activeDropdown, setActiveDropdown] = useState(null);

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
      setError("Gagal memuat destinasi. Silakan coba lagi.");
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
    if (window.confirm("Apakah Anda yakin ingin menghapus destinasi ini?")) {
      setOperationLoading(id);
      try {
        await destinationService.delete(id);
        setDestinations((prev) => prev.filter((d) => d.id !== id));
        setSelectedDestinations((prev) =>
          prev.filter((destId) => destId !== id)
        );
      } catch (error) {
        console.error("Failed to delete destination:", error);
        alert("Gagal menghapus destinasi. Silakan coba lagi.");
      } finally {
        setOperationLoading(null);
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedDestinations.length === 0) return;

    if (
      window.confirm(
        `Apakah Anda yakin ingin menghapus ${selectedDestinations.length} destinasi?`
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
        alert("Gagal menghapus destinasi. Silakan coba lagi.");
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
      alert("Gagal memperbarui status");
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
    console.log("🔄 Attempting to toggle status:", {
      id,
      currentStatus,
      newStatus: !currentStatus,
    });

    try {
      setOperationLoading(id);

      const formData = new FormData();
      formData.append("is_achieved", !currentStatus ? "1" : "0");

      console.log("📤 Sending update request...");
      const response = await destinationService.update(id, formData);
      console.log("✅ Update successful:", response);

      setDestinations((prev) =>
        prev.map((d) =>
          d.id === id ? { ...d, is_achieved: !currentStatus } : d
        )
      );
    } catch (error) {
      console.error("❌ Update failed:", {
        error,
        response: error.response,
        data: error.response?.data,
      });

      alert(
        `Gagal memperbarui status: ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setOperationLoading(null);
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

  const getImageUrl = (photoPath) => {
    if (!photoPath) return null;
    if (photoPath.startsWith("http")) return photoPath;
    return `${STORAGE_BASE_URL}/destinations/${photoPath}`;
  };

  // Action Dropdown Component - FIXED VERSION
  const ActionDropdown = ({ destination }) => {
    const dropdownRef = useRef(null);

    // Handle click outside untuk close dropdown
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target)
        ) {
          setActiveDropdown(null);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
      <AnimatePresence>
        {activeDropdown === destination.id && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="absolute right-0 top-12 z-[9999] w-56 bg-white rounded-xl shadow-2xl border border-gray-200/80 backdrop-blur-sm overflow-hidden"
          >
            <div className="p-2 space-y-1">
              <Link
                to={`/destinations/${destination.id}`}
                className="flex items-center w-full px-4 py-3 text-sm text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors group"
                onClick={() => setActiveDropdown(null)}
              >
                <Eye className="h-4 w-4 mr-3 text-gray-400 group-hover:text-blue-500" />
                Lihat Detail
              </Link>

              <Link
                to={`/destinations/${destination.id}/edit`}
                className="flex items-center w-full px-4 py-3 text-sm text-gray-700 rounded-lg hover:bg-green-50 hover:text-green-600 transition-colors group"
                onClick={() => setActiveDropdown(null)}
              >
                <Edit className="h-4 w-4 mr-3 text-gray-400 group-hover:text-green-500" />
                Edit Destinasi
              </Link>

              <Link
                to={`/itineraries?destination=${destination.id}`}
                className="flex items-center w-full px-4 py-3 text-sm text-gray-700 rounded-lg hover:bg-purple-50 hover:text-purple-600 transition-colors group"
                onClick={() => setActiveDropdown(null)}
              >
                <Calendar className="h-4 w-4 mr-3 text-gray-400 group-hover:text-purple-500" />
                Rencana Perjalanan
              </Link>

              <button
                onClick={() => {
                  toggleStatus(destination.id, destination.is_achieved);
                  setActiveDropdown(null);
                }}
                className="flex items-center w-full px-4 py-3 text-sm text-gray-700 rounded-lg hover:bg-orange-50 hover:text-orange-600 transition-colors group"
              >
                {destination.is_achieved ? (
                  <>
                    <XCircle className="h-4 w-4 mr-3 text-gray-400 group-hover:text-orange-500" />
                    Tandai Perencanaan
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-3 text-gray-400 group-hover:text-orange-500" />
                    Tandai Selesai
                  </>
                )}
              </button>

              <div className="border-t border-gray-200 my-1"></div>

              <button
                onClick={() => {
                  handleDelete(destination.id);
                  setActiveDropdown(null);
                }}
                disabled={operationLoading === destination.id}
                className="flex items-center w-full px-4 py-3 text-sm text-red-600 rounded-lg hover:bg-red-50 transition-colors group disabled:opacity-50"
              >
                {operationLoading === destination.id ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-red-500 border-t-transparent rounded-full mr-3"></div>
                    Menghapus...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-3" />
                    Hapus Destinasi
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  // 🔥 IMPROVED: Skeleton Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-cyan-50/30">
        <SkeletonHeader />

        {/* Main Content Skeleton */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <SkeletonStats />
          <SkeletonSearchBar />

          {/* Conditional skeleton based on data availability */}
          {destinations.length === 0 ? (
            <SkeletonEmptyState />
          ) : (
            <SkeletonTable />
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
            onClick={loadDestinations}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-xl hover:from-blue-600 hover:to-cyan-500 transition-all shadow-lg font-semibold mr-3"
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
              <Link
                to="/home"
                className="inline-flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 bg-white border border-gray-300 rounded-xl hover:border-gray-400 transition-all shadow-sm hover:shadow-md"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Kembali
              </Link>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Manajemen Destinasi
                  <span className="ml-1 text-white">📍</span>
                </h1>
                <p className="text-gray-600 mt-1">
                  Kelola dan atur semua destinasi perjalanan Anda
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <motion.button
                onClick={handleRefresh}
                disabled={refreshing}
                whileHover={{ scale: refreshing ? 1 : 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-5 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all disabled:opacity-50 font-medium"
              >
                <RefreshCw
                  className={`h-5 w-5 mr-2 ${refreshing ? "animate-spin" : ""}`}
                />
                Muat Ulang
              </motion.button>

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
        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {[
            {
              icon: Compass,
              value: destinations.length,
              label: "Total Destinasi",
              color: "blue",
              bgColor: "bg-blue-100",
              textColor: "text-blue-600",
            },
            {
              icon: CheckCircle,
              value: destinations.filter((d) => d.is_achieved).length,
              label: "Tercapai",
              color: "green",
              bgColor: "bg-green-100",
              textColor: "text-green-600",
            },
            {
              icon: XCircle,
              value: destinations.filter((d) => !d.is_achieved).length,
              label: "Perencanaan",
              color: "orange",
              bgColor: "bg-orange-100",
              textColor: "text-orange-600",
            },
            {
              icon: DollarSign,
              value: formatCurrency(
                destinations.reduce((sum, d) => sum + parseFloat(d.budget), 0)
              ),
              label: "Total Budget",
              color: "purple",
              bgColor: "bg-purple-100",
              textColor: "text-purple-600",
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
                  className={`p-3 rounded-xl ${stat.bgColor} group-hover:scale-110 transition-transform`}
                >
                  <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Search and Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-6"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex-1 w-full lg:max-w-md">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari destinasi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50/50"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <div className="flex gap-2">
                {[
                  { key: "all", label: "Semua", color: "blue" },
                  { key: "achieved", label: "Tercapai", color: "green" },
                  {
                    key: "not_achieved",
                    label: "Perencanaan",
                    color: "orange",
                  },
                ].map((filterOption) => (
                  <motion.button
                    key={filterOption.key}
                    onClick={() => setStatusFilter(filterOption.key)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-2.5 rounded-xl border-2 transition-all font-medium text-sm ${
                      statusFilter === filterOption.key
                        ? `bg-${filterOption.color}-500 text-white border-${filterOption.color}-500 shadow-lg shadow-${filterOption.color}-500/25`
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
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
                className="px-4 py-2.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white font-medium"
              >
                <option value="departure_date-asc">
                  Tanggal: Lama ke Baru
                </option>
                <option value="departure_date-desc">
                  Tanggal: Baru ke Lama
                </option>
                <option value="title-asc">Judul: A-Z</option>
                <option value="title-desc">Judul: Z-A</option>
                <option value="budget-asc">Budget: Rendah ke Tinggi</option>
                <option value="budget-desc">Budget: Tinggi ke Rendah</option>
              </select>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedDestinations.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-6 p-5 bg-gradient-to-r from-blue-500/10 to-cyan-400/10 border border-blue-200 rounded-2xl"
            >
              <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                <p className="text-blue-800 font-semibold text-lg">
                  {selectedDestinations.length} destinasi dipilih
                </p>
                <div className="flex flex-wrap gap-3">
                  <motion.button
                    onClick={() => handleBulkStatusUpdate(true)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center px-4 py-2.5 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all shadow-lg shadow-green-500/25 font-medium"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Tandai Selesai
                  </motion.button>
                  <motion.button
                    onClick={() => handleBulkStatusUpdate(false)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center px-4 py-2.5 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/25 font-medium"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Tandai Perencanaan
                  </motion.button>
                  <motion.button
                    onClick={handleBulkDelete}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center px-4 py-2.5 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all shadow-lg shadow-red-500/25 font-medium"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Hapus yang Dipilih
                  </motion.button>
                  <button
                    onClick={() => setSelectedDestinations([])}
                    className="px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium"
                  >
                    Hapus Pilihan
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
            className="text-center py-20 bg-white rounded-2xl border border-gray-200 shadow-sm"
          >
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Plane className="h-12 w-12 text-blue-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {searchTerm || statusFilter !== "all"
                  ? "Tidak ada destinasi ditemukan"
                  : "Belum ada destinasi"}
              </h3>
              <p className="text-gray-600 mb-8 text-lg">
                {searchTerm || statusFilter !== "all"
                  ? "Coba sesuaikan pencarian atau kriteria filter Anda"
                  : "Mulai rencanakan perjalanan pertama Anda yang menakjubkan"}
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/destinations/new"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-2xl hover:from-blue-600 hover:to-cyan-500 transition-all shadow-xl text-lg font-semibold"
                >
                  <Plus className="h-6 w-6 mr-3" />
                  Tambah Destinasi Pertama
                </Link>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100/50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-14">
                      <input
                        type="checkbox"
                        checked={
                          selectedDestinations.length ===
                            sortedDestinations.length &&
                          sortedDestinations.length > 0
                        }
                        onChange={toggleSelectAll}
                        className="rounded border-gray-300 text-blue-500 focus:ring-blue-500 w-4 h-4"
                      />
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[250px]">
                      Destinasi
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[120px]">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Keberangkatan
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[120px]">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Budget
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[100px]">
                      Durasi
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[120px]">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[140px]">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedDestinations.map((destination, index) => {
                    const imageUrl = getImageUrl(destination.photo);

                    return (
                      <motion.tr
                        key={destination.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-blue-50/30 transition-colors group"
                      >
                        {/* Checkbox */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedDestinations.includes(
                              destination.id
                            )}
                            onChange={() =>
                              toggleDestinationSelection(destination.id)
                            }
                            className="rounded border-gray-300 text-blue-500 focus:ring-blue-500 w-4 h-4"
                          />
                        </td>

                        {/* Destination Info */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-4">
                            <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-blue-400 to-cyan-300 rounded-xl flex items-center justify-center shadow-md overflow-hidden">
                              {imageUrl ? (
                                <img
                                  src={imageUrl}
                                  alt={destination.title}
                                  className="w-14 h-14 object-cover"
                                />
                              ) : (
                                <Plane className="h-6 w-6 text-white" />
                              )}
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors text-lg">
                                {destination.title}
                              </div>
                              <div className="text-sm text-gray-500">
                                Dibuat {formatDate(destination.created_at)}
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
                          <div className="text-sm font-medium text-gray-900 bg-gray-100 px-3 py-1 rounded-full inline-block">
                            {destination.duration_days} hari
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <motion.button
                            onClick={() =>
                              toggleStatus(
                                destination.id,
                                destination.is_achieved
                              )
                            }
                            disabled={operationLoading === destination.id}
                            whileHover={{
                              scale:
                                operationLoading === destination.id ? 1 : 1.05,
                            }}
                            whileTap={{ scale: 0.95 }}
                            className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm ${
                              destination.is_achieved
                                ? "bg-green-500 text-white hover:bg-green-600 shadow-green-500/25"
                                : "bg-orange-500 text-white hover:bg-orange-600 shadow-orange-500/25"
                            } ${
                              operationLoading === destination.id
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                          >
                            {operationLoading === destination.id ? (
                              <>
                                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                                Memproses...
                              </>
                            ) : destination.is_achieved ? (
                              <>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Tercapai
                              </>
                            ) : (
                              <>
                                <XCircle className="h-4 w-4 mr-2" />
                                Perencanaan
                              </>
                            )}
                          </motion.button>
                        </td>

                        {/* Actions - FIXED VERSION */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex gap-3">
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Link
                                to={`/destinations/${destination.id}`}
                                className="inline-flex items-center px-4 py-2.5 bg-blue-500 text-white hover:bg-blue-600 rounded-xl transition-colors shadow-lg shadow-blue-500/25 font-medium text-sm"
                                title="Lihat Detail"
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                Lihat
                              </Link>
                            </motion.div>

                            {/* 🔥 FIXED: Container dengan position relative */}
                            <div className="relative">
                              <motion.button
                                onClick={() =>
                                  setActiveDropdown(
                                    activeDropdown === destination.id
                                      ? null
                                      : destination.id
                                  )
                                }
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="inline-flex items-center px-3 py-2.5 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-xl transition-colors font-medium text-sm"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </motion.button>

                              {/* Dropdown akan muncul tepat di bawah tombol titik tiga */}
                              <ActionDropdown destination={destination} />
                            </div>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Menampilkan{" "}
                  <span className="font-semibold text-gray-900">
                    {sortedDestinations.length}
                  </span>{" "}
                  dari{" "}
                  <span className="font-semibold text-gray-900">
                    {destinations.length}
                  </span>{" "}
                  destinasi
                </p>
                <div className="text-sm text-gray-600">
                  {selectedDestinations.length > 0 && (
                    <span className="font-semibold text-blue-600">
                      {selectedDestinations.length} dipilih
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Destinations;
