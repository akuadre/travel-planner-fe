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
  Menu,
  FileText,
  ChevronsUpDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  STORAGE_BASE_URL,
  destinationService,
} from "../services/destinationService";
import Notification, { useNotification } from "../components/Notification";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";

// 🔥 Mobile: 1 kolom, Tablet: 2 kolom, Desktop: 4 kolom
const SkeletonStats = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
    {[1, 2, 3, 4].map((item) => (
      <div
        key={item}
        className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 border border-gray-200 shadow-sm"
      >
        <div className="flex items-center justify-between">
          <div className="space-y-1.5 md:space-y-2 flex-1">
            <div className="h-6 md:h-8 bg-gray-200 rounded-lg animate-pulse w-12 md:w-16"></div>
            <div className="h-3 md:h-4 bg-gray-100 rounded animate-pulse w-16 md:w-24"></div>
          </div>
          <div className="p-2 md:p-3 rounded-lg md:rounded-xl bg-gray-200 animate-pulse">
            <div className="h-4 w-4 md:h-6 md:w-6"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const SkeletonSearchBar = () => (
  <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 border border-gray-200 shadow-sm mb-4 md:mb-6">
    <div className="flex flex-col lg:flex-row gap-3 md:gap-4 items-center justify-between">
      <div className="flex-1 w-full lg:max-w-md">
        <div className="relative">
          <div className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2">
            <div className="h-4 md:h-5 w-4 md:w-5 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="w-full pl-10 md:pl-12 pr-3 md:pr-4 py-2.5 md:py-3.5 bg-gray-100 rounded-xl animate-pulse"></div>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 md:gap-3 w-full lg:w-auto">
        <div className="flex gap-1.5 md:gap-2">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="w-16 md:w-20 lg:w-24 h-8 md:h-10 bg-gray-200 rounded-xl animate-pulse"
            ></div>
          ))}
        </div>
        <div className="w-full sm:w-36 md:w-48 h-8 md:h-10 bg-gray-200 rounded-xl animate-pulse"></div>
      </div>
    </div>
  </div>
);

const SkeletonTable = () => (
  <div className="bg-white rounded-xl md:rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full min-w-full">
        <thead className="bg-gradient-to-r from-gray-50 to-gray-100/50 border-b border-gray-200">
          <tr>
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <th key={item} className="px-4 md:px-6 py-3 md:py-4">
                <div className="h-3 md:h-4 bg-gray-200 rounded animate-pulse w-12 md:w-20"></div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {[1, 2, 3].map((row) => (
            <tr key={row} className="hover:bg-blue-50/30 transition-colors">
              {/* Checkbox */}
              <td className="px-4 md:px-6 py-3 md:py-4">
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
              </td>

              {/* Destination Info - Mobile: stacked */}
              <td className="px-4 md:px-6 py-3 md:py-4">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="flex-shrink-0 w-10 h-10 md:w-14 md:h-14 bg-gray-200 rounded-lg md:rounded-xl animate-pulse"></div>
                  <div className="space-y-1.5 md:space-y-2 flex-1 min-w-0">
                    <div className="h-4 md:h-5 bg-gray-200 rounded animate-pulse w-20 md:w-32"></div>
                    <div className="h-3 bg-gray-100 rounded animate-pulse w-16 md:w-24"></div>
                  </div>
                </div>
              </td>

              {/* Date & Budget - Mobile: combine */}
              <td className="px-4 md:px-6 py-3 md:py-4">
                <div className="space-y-1">
                  <div className="h-3 md:h-4 bg-gray-200 rounded animate-pulse w-16 md:w-28"></div>
                  <div className="h-3 md:h-4 bg-gray-200 rounded animate-pulse w-12 md:w-20"></div>
                </div>
              </td>

              {/* Duration */}
              <td className="px-4 md:px-6 py-3 md:py-4">
                <div className="h-6 bg-gray-200 rounded-full animate-pulse w-12 md:w-16"></div>
              </td>

              {/* Status */}
              <td className="px-4 md:px-6 py-3 md:py-4">
                <div className="h-7 md:h-8 bg-gray-200 rounded-xl animate-pulse w-16 md:w-24"></div>
              </td>

              {/* Actions */}
              <td className="px-4 md:px-6 py-3 md:py-4">
                <div className="flex gap-2 md:gap-3">
                  <div className="h-7 md:h-8 bg-gray-200 rounded-xl animate-pulse w-12 md:w-16"></div>
                  <div className="h-7 md:h-8 bg-gray-200 rounded-xl animate-pulse w-7 md:w-8"></div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div className="px-4 md:px-6 py-3 md:py-4 border-t border-gray-200 bg-gray-50">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="h-3 md:h-4 bg-gray-200 rounded animate-pulse w-32 md:w-40"></div>
        <div className="h-3 md:h-4 bg-gray-200 rounded animate-pulse w-24 md:w-32"></div>
      </div>
    </div>
  </div>
);

const SkeletonEmptyState = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="text-center py-12 md:py-20 bg-white rounded-xl md:rounded-2xl border border-gray-200 shadow-sm"
  >
    <div className="max-w-md mx-auto px-4">
      <div className="w-16 h-16 md:w-24 md:h-24 bg-gray-200 rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto mb-4 md:mb-6 animate-pulse"></div>
      <div className="h-6 md:h-8 bg-gray-200 rounded animate-pulse w-40 md:w-64 mx-auto mb-3 md:mb-4"></div>
      <div className="h-3 md:h-4 bg-gray-200 rounded animate-pulse w-32 md:w-48 mx-auto mb-6 md:mb-8"></div>
      <div className="h-10 md:h-12 bg-gray-200 rounded-xl md:rounded-2xl animate-pulse w-32 md:w-48 mx-auto"></div>
    </div>
  </motion.div>
);

const SkeletonHeader = () => (
  <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/60 shadow-sm">
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 md:gap-6">
          <div className="w-24 md:w-32 h-8 md:h-10 bg-gray-200 rounded-xl animate-pulse"></div>
          <div className="space-y-1.5 md:space-y-2">
            <div className="h-6 md:h-8 bg-gray-200 rounded animate-pulse w-40 md:w-64"></div>
            <div className="h-3 md:h-4 bg-gray-100 rounded animate-pulse w-32 md:w-48"></div>
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden sm:block w-24 md:w-32 h-8 md:h-10 bg-gray-200 rounded-xl animate-pulse"></div>
          <div className="w-32 md:w-40 h-10 md:h-12 bg-gray-200 rounded-xl animate-pulse"></div>
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
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [bulkDeleteModalOpen, setBulkDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null); // { id, title }
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    notification,
    notificationKey,
    showNotification,
    dismissNotification,
  } = useNotification();

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Load destinations from API
  useEffect(() => {
    loadDestinations();
  }, []);

  useEffect(() => {
    if (formSubmitted) {
      loadDestinations();
      setFormSubmitted(false);
    }
  }, [formSubmitted]);

  // Helper function untuk cek apakah destinasi sudah lewat
  const isPastDestination = (destination) => {
    const departureDate = new Date(destination.departure_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return departureDate < today;
  };

  // Helper function untuk cek apakah bisa diubah ke perencanaan
  const canChangeToPlanning = (destination) => {
    if (!destination.is_achieved) return true; // Sudah perencanaan
    return !isPastDestination(destination); // Hanya bisa jika belum lewat
  };

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

  // 🔥 DELETE FUNCTIONS WITH MODAL
  const handleDeleteClick = (destination) => {
    setDeleteTarget({
      id: destination.id,
      title: destination.title,
    });
    setDeleteModalOpen(true);
  };

  const handleBulkDeleteClick = () => {
    if (selectedDestinations.length === 0) return;
    setBulkDeleteModalOpen(true);
  };

  const executeDelete = async (id) => {
    setIsDeleting(true);
    try {
      await destinationService.delete(id);
      setDestinations((prev) => prev.filter((d) => d.id !== id));
      setSelectedDestinations((prev) => prev.filter((destId) => destId !== id));
      showNotification("Destinasi berhasil dihapus", "success");
      return true;
    } catch (error) {
      console.error("Failed to delete destination:", error);
      showNotification("Gagal menghapus destinasi", "error");
      return false;
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
      setDeleteTarget(null);
    }
  };

  const executeBulkDelete = async () => {
    if (selectedDestinations.length === 0) return;

    setIsDeleting(true);
    try {
      await destinationService.bulkDelete(selectedDestinations);
      setDestinations((prev) =>
        prev.filter((d) => !selectedDestinations.includes(d.id))
      );
      showNotification(
        `${selectedDestinations.length} destinasi berhasil dihapus`,
        "success"
      );
      setSelectedDestinations([]);
      return true;
    } catch (error) {
      console.error("Failed to delete destinations:", error);
      showNotification("Gagal menghapus destinasi", "error");
      return false;
    } finally {
      setIsDeleting(false);
      setBulkDeleteModalOpen(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (deleteTarget) {
      await executeDelete(deleteTarget.id);
    }
  };

  const handleConfirmBulkDelete = async () => {
    await executeBulkDelete();
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadDestinations();
      showNotification("Data destinasi berhasil dimuat ulang", "success");
    } catch (error) {
      showNotification("Gagal memuat ulang data", "error");
    } finally {
      setRefreshing(false);
    }
  };

  const handleBulkStatusUpdate = async (newStatus) => {
    if (selectedDestinations.length === 0) return;

    try {
      // 🔥 Cek untuk bulk update dari "selesai" ke "perencanaan" (newStatus = false)
      if (!newStatus) {
        const selectedDests = destinations.filter(
          (d) => selectedDestinations.includes(d.id) && d.is_achieved
        );

        // 🔥 Cari yang tanggalnya sudah lewat
        const pastDests = selectedDests.filter((dest) => {
          const departureDate = new Date(dest.departure_date);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return departureDate < today;
        });

        if (pastDests.length > 0) {
          showNotification(
            `Tidak dapat mengubah ${pastDests.length} destinasi masa lalu menjadi perencanaan`,
            "error"
          );
          return;
        }
      }

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

      const statusText = newStatus ? "selesai" : "perencanaan";
      showNotification(
        `${selectedDestinations.length} destinasi ditandai ${statusText}`,
        "success"
      );
    } catch (error) {
      console.error("Failed to update status:", error);
      showNotification("Gagal memperbarui status", "error");
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
      // 🔥 Cari destinasi yang akan diupdate
      const destination = destinations.find((d) => d.id === id);
      if (!destination) return;

      const departureDate = new Date(destination.departure_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // 🔥 SKENARIO 1: Ingin mengubah dari "selesai" ke "perencanaan"
      if (currentStatus) {
        // Jika tanggal sudah lewat, TIDAK BOLEH diubah
        if (departureDate < today) {
          showNotification(
            "Tidak dapat mengubah status destinasi masa lalu menjadi perencanaan",
            "error"
          );
          return;
        }
      }
      // 🔥 SKENARIO 2: Ingin mengubah dari "perencanaan" ke "selesai"
      else {
        // Jika tanggal belum lewat, TIDAK BOLEH diubah otomatis
        // (optional: bisa ditambahkan konfirmasi)
        if (departureDate > today) {
          // Boleh tetap lanjut, tapi mungkin tambahkan konfirmasi
          // showNotification(
          //   "Mengubah status destinasi masa depan menjadi selesai",
          //   "warning"
          // );
        }
      }

      setOperationLoading(id);

      const formData = new FormData();
      formData.append("is_achieved", !currentStatus ? "1" : "0");

      await destinationService.update(id, formData);

      setDestinations((prev) =>
        prev.map((d) =>
          d.id === id ? { ...d, is_achieved: !currentStatus } : d
        )
      );

      const statusText = !currentStatus ? "selesai" : "perencanaan";
      showNotification(
        `Status destinasi berhasil diubah menjadi ${statusText}`,
        "success"
      );
    } catch (error) {
      console.error("Update failed:", error);
      showNotification(
        `Gagal memperbarui status: ${
          error.response?.data?.message || error.message
        }`,
        "error"
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

  const getActiveButtonClasses = (color) => {
    switch (color) {
      case "blue":
        return "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/25 hover:bg-blue-700 hover:border-blue-700";
      case "green":
        return "bg-green-600 text-white border-green-600 shadow-lg shadow-green-600/25 hover:bg-green-700 hover:border-green-700";
      case "orange":
        return "bg-orange-600 text-white border-orange-600 shadow-lg shadow-orange-600/25 hover:bg-orange-700 hover:border-orange-700";
      default:
        return "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/25";
    }
  };

  // Action Dropdown Component - FIXED VERSION
  const ActionDropdown = ({ destination }) => {
    const dropdownRef = useRef(null);

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
            className={`absolute ${
              isMobile ? "left-0" : "right-0"
            } top-12 z-[9999] w-56 bg-white rounded-xl shadow-2xl border border-gray-200/80 backdrop-blur-sm overflow-hidden`}
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
                disabled={
                  operationLoading === destination.id ||
                  (destination.is_achieved &&
                    new Date(destination.departure_date) <
                      new Date(new Date().setHours(0, 0, 0, 0)))
                }
                className="flex items-center w-full px-4 py-3 text-sm text-gray-700 rounded-lg hover:bg-orange-50 hover:text-orange-600 transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
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

              {/* 🔥 INI YANG BENAR - panggil handleDeleteClick */}
              <button
                onClick={() => {
                  handleDeleteClick(destination); // 🔥 GANTI INI
                  setActiveDropdown(null);
                }}
                disabled={isDeleting}
                className="flex items-center w-full px-4 py-3 text-sm text-red-600 rounded-lg hover:bg-red-50 transition-colors group disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4 mr-3" />
                Hapus Destinasi
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 md:py-6 lg:py-8">
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
        <div className="text-center max-w-md px-4">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Compass className="h-8 w-8 md:h-10 md:w-10 text-red-600" />
          </div>
          <div className="text-red-600 text-base md:text-lg font-medium mb-4">
            {error}
          </div>
          <button
            onClick={loadDestinations}
            className="inline-flex items-center px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-xl hover:from-blue-600 hover:to-cyan-500 transition-all shadow-lg font-semibold mr-3 text-sm md:text-base"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-cyan-50/30">
      {/* DELETE CONFIRMATION MODALS */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setDeleteTarget(null);
        }}
        onConfirm={handleConfirmDelete}
        title={deleteTarget?.title}
        isLoading={isDeleting}
      />

      <DeleteConfirmationModal
        isOpen={bulkDeleteModalOpen}
        onClose={() => setBulkDeleteModalOpen(false)}
        onConfirm={handleConfirmBulkDelete}
        isBulk={true}
        itemCount={selectedDestinations.length}
        isLoading={isDeleting}
      />

      {/* 🔥 NOTIFICATION COMPONENT */}
      <Notification
        notification={notification}
        notificationKey={notificationKey}
        onDismiss={dismissNotification}
      />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-sm border-b border-gray-200/60 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 md:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 md:gap-6">
              <Link
                to="/home"
                className="inline-flex items-center px-3 py-1.5 md:px-4 md:py-2 text-gray-600 hover:text-gray-900 bg-white border border-gray-300 rounded-lg md:rounded-xl hover:border-gray-400 transition-all shadow-sm hover:shadow-md text-sm md:text-base"
              >
                <ArrowLeft className="h-4 w-4 md:h-5 md:w-5 mr-1 md:mr-2" />
                <span className="hidden sm:inline">Kembali</span>
              </Link>
              <div>
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Manajemen Destinasi
                  <span className="ml-1 hidden sm:inline text-white">📍</span>
                </h1>
                <p className="text-gray-600 mt-1 text-xs md:text-sm lg:text-base">
                  Kelola dan atur semua destinasi perjalanan Anda
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
              <motion.button
                onClick={handleRefresh}
                disabled={refreshing}
                whileHover={{ scale: refreshing ? 1 : 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="hidden sm:inline-flex items-center px-3 py-2 md:px-5 md:py-3 border border-gray-300 text-gray-700 rounded-lg md:rounded-xl hover:bg-gray-50 transition-all disabled:opacity-50 font-medium text-sm md:text-base"
              >
                <RefreshCw
                  className={`hidden sm:inline md:h-5 md:w-5 mr-1 md:mr-2 ${
                    refreshing ? "animate-spin" : ""
                  }`}
                />
                <span className="hidden sm:inline">Muat Ulang</span>
              </motion.button>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="hidden sm:block"
              >
                <Link
                  to="/destinations/new"
                  className="inline-flex items-center px-4 py-2.5 md:px-6 md:py-3 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-lg md:rounded-xl hover:from-blue-600 hover:to-cyan-500 transition-all shadow-lg hover:shadow-xl font-semibold text-sm md:text-base"
                >
                  <Plus className="h-4 w-4 md:h-5 md:w-5 mr-1 md:mr-2" />
                  <span className="hidden md:inline">Tambah Destinasi</span>
                  <span className="md:hidden">Tambah</span>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 md:py-6 lg:py-8">
        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8"
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
              className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                  <p className="text-xs md:text-sm text-gray-600 mt-1">
                    {stat.label}
                  </p>
                </div>
                <div
                  className={`p-2 md:p-3 rounded-lg md:rounded-xl ${stat.bgColor} group-hover:scale-110 transition-transform`}
                >
                  <stat.icon
                    className={`h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 ${stat.textColor}`}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Search and Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 border border-gray-200 shadow-sm mb-4 md:mb-6"
        >
          <div className="flex flex-col lg:flex-row gap-3 md:gap-4 items-center justify-between">
            <div className="flex-1 w-full lg:max-w-md">
              <div className="relative">
                <Search className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari destinasi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 md:pl-12 pr-3 md:pr-4 py-2.5 md:py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50/50 text-sm md:text-base"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 md:gap-3 w-full lg:w-auto">
              <div className="flex flex-wrap gap-1.5 md:gap-2">
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
                    className={`px-3 py-1.5 md:px-4 md:py-2.5 rounded-lg md:rounded-xl border-2 transition-all font-medium text-xs md:text-sm whitespace-nowrap ${
                      statusFilter === filterOption.key
                        ? getActiveButtonClasses(filterOption.color)
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                    }`}
                  >
                    {filterOption.label}
                  </motion.button>
                ))}
              </div>

              {/* 🔥 VERSI SELECT YANG BENAR TANPA DIV DALAM OPTION */}
              <div className="relative w-full sm:w-48 md:w-56 lg:w-64">
                <select
                  value={`${sortConfig.key}-${sortConfig.direction}`}
                  onChange={(e) => {
                    const [key, direction] = e.target.value.split("-");
                    setSortConfig({ key, direction });
                  }}
                  className="appearance-none w-full px-4 py-2.5 pl-10 pr-10 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white font-medium text-sm cursor-pointer hover:border-blue-400 transition-all duration-200 shadow-sm hover:shadow-md"
                  style={{
                    backgroundImage: `none`,
                  }}
                >
                  {/* Hanya text biasa dalam option, tidak ada div/span */}
                  <option value="departure_date-asc" className="py-2">
                    📅 Tanggal: Lama ke Baru
                  </option>
                  <option value="departure_date-desc" className="py-2">
                    📅 Tanggal: Baru ke Lama
                  </option>
                  <option value="title-asc" className="py-2">
                    🅰️ Judul: A-Z
                  </option>
                  <option value="title-desc" className="py-2">
                    🅰️ Judul: Z-A
                  </option>
                  <option value="budget-asc" className="py-2">
                    💰 Budget: Rendah ke Tinggi
                  </option>
                  <option value="budget-desc" className="py-2">
                    💰 Budget: Tinggi ke Rendah
                  </option>
                </select>

                {/* Left icon */}
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <ChevronsUpDown className="h-4 w-4 text-blue-500" />
                </div>

                {/* Right arrow */}
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <ChevronDown className="h-3.5 w-3.5 text-gray-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedDestinations.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-4 md:mt-6 p-3 md:p-5 bg-gradient-to-r from-blue-500/10 to-cyan-400/10 border border-blue-200 rounded-xl md:rounded-2xl"
            >
              <div className="flex flex-col lg:flex-row gap-3 md:gap-4 items-center justify-between">
                <p className="text-blue-800 font-semibold text-sm md:text-lg">
                  {selectedDestinations.length} destinasi dipilih
                </p>
                <div className="flex flex-wrap gap-2 md:gap-3">
                  <motion.button
                    onClick={() => handleBulkStatusUpdate(true)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center px-3 py-1.5 md:px-4 md:py-2.5 bg-green-500 text-white rounded-lg md:rounded-xl hover:bg-green-600 transition-all shadow-lg shadow-green-500/25 font-medium text-xs md:text-sm"
                  >
                    <CheckCircle className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                    Tandai Selesai
                  </motion.button>
                  <motion.button
                    onClick={() => handleBulkStatusUpdate(false)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={selectedDestinations.some((id) => {
                      const dest = destinations.find((d) => d.id === id);
                      return (
                        dest &&
                        dest.is_achieved &&
                        new Date(dest.departure_date) <
                          new Date(new Date().setHours(0, 0, 0, 0))
                      );
                    })}
                    className="inline-flex items-center px-3 py-1.5 md:px-4 md:py-2.5 bg-orange-500 text-white rounded-lg md:rounded-xl hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/25 font-medium text-xs md:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <XCircle className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                    Tandai Perencanaan
                  </motion.button>
                  {/* 🔥 UPDATED: Gunakan modal untuk bulk delete */}
                  <motion.button
                    onClick={handleBulkDeleteClick}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={isDeleting}
                    className="inline-flex items-center px-3 py-1.5 md:px-4 md:py-2.5 bg-red-500 text-white rounded-lg md:rounded-xl hover:bg-red-600 transition-all shadow-lg shadow-red-500/25 font-medium text-xs md:text-sm disabled:opacity-50"
                  >
                    <Trash2 className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                    {isDeleting ? "Menghapus..." : "Hapus"}
                  </motion.button>
                  <button
                    onClick={() => setSelectedDestinations([])}
                    className="px-3 py-1.5 md:px-4 md:py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg md:rounded-xl hover:bg-gray-50 transition-all font-medium text-xs md:text-sm"
                  >
                    Batalkan
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Mobile Add Button - Tampil di bawah filter di mobile */}
        <div className="sm:hidden mb-4">
          <Link
            to="/destinations/new"
            className="w-full inline-flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-xl hover:from-blue-600 hover:to-cyan-500 transition-all shadow-lg hover:shadow-xl font-semibold"
          >
            <Plus className="h-5 w-5 mr-2" />
            Tambah Destinasi Baru
          </Link>
        </div>

        {/* Destinations Table */}
        {sortedDestinations.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8 md:py-12 lg:py-20 bg-white rounded-xl md:rounded-2xl border border-gray-200 shadow-sm"
          >
            <div className="max-w-md mx-auto px-4">
              <div className="w-16 h-16 md:w-20 lg:w-24 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-lg">
                <Plane className="h-8 w-8 md:h-10 md:w-10 lg:h-12 lg:w-12 text-blue-500" />
              </div>
              <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 mb-3 md:mb-4">
                {searchTerm || statusFilter !== "all"
                  ? "Tidak ada destinasi ditemukan"
                  : "Belum ada destinasi"}
              </h3>
              <p className="text-gray-600 mb-6 md:mb-8 text-sm md:text-base lg:text-lg">
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
                  className="inline-flex items-center px-6 py-3 md:px-8 md:py-4 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-xl md:rounded-2xl hover:from-blue-600 hover:to-cyan-500 transition-all shadow-xl text-base md:text-lg font-semibold"
                >
                  <Plus className="h-5 w-5 md:h-6 md:w-6 mr-2 md:mr-3" />
                  Tambah Destinasi Pertama
                </Link>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl md:rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100/50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-12 md:w-14">
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
                    <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[180px] md:min-w-[250px]">
                      Destinasi
                    </th>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[100px] md:min-w-[120px]">
                      <div className="flex items-center gap-1 md:gap-2">
                        <Calendar className="h-3 w-3 md:h-4 md:w-4" />
                        <span className="hidden sm:inline">Keberangkatan</span>
                      </div>
                    </th>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[90px] md:min-w-[120px]">
                      <div className="flex items-center gap-1 md:gap-2">
                        <DollarSign className="h-3 w-3 md:h-4 md:w-4" />
                        <span className="hidden sm:inline">Budget</span>
                      </div>
                    </th>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[80px] md:min-w-[100px]">
                      Durasi
                    </th>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[100px] md:min-w-[120px]">
                      Status
                    </th>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[110px] md:min-w-[140px]">
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
                        <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap">
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
                        <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 md:gap-3 lg:gap-4">
                            <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-blue-400 to-cyan-300 rounded-lg md:rounded-xl flex items-center justify-center shadow-md overflow-hidden">
                              {imageUrl ? (
                                <img
                                  src={imageUrl}
                                  alt={destination.title}
                                  className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 object-cover"
                                />
                              ) : (
                                <Plane className="h-5 w-5 md:h-6 md:w-6 text-white" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors text-sm md:text-base lg:text-lg truncate">
                                {destination.title}
                              </div>
                              <div className="text-xs text-gray-500 truncate">
                                Dibuat {formatDate(destination.created_at)}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Departure Date */}
                        <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap">
                          <div className="text-xs md:text-sm font-medium text-gray-900">
                            {formatDate(destination.departure_date)}
                          </div>
                        </td>

                        {/* Budget */}
                        <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap">
                          <div className="text-xs md:text-sm font-semibold text-gray-900">
                            {formatCurrency(destination.budget)}
                          </div>
                        </td>

                        {/* Duration */}
                        <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap">
                          <div className="text-xs md:text-sm font-medium text-gray-900 bg-gray-100 px-2 md:px-3 py-1 rounded-full inline-block">
                            {destination.duration_days} hari
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <motion.button
                              onClick={() =>
                                toggleStatus(
                                  destination.id,
                                  destination.is_achieved
                                )
                              }
                              disabled={
                                operationLoading === destination.id ||
                                (destination.is_achieved &&
                                  new Date(destination.departure_date) <
                                    new Date(new Date().setHours(0, 0, 0, 0)))
                              }
                              whileHover={{
                                scale:
                                  operationLoading === destination.id
                                    ? 1
                                    : 1.05,
                              }}
                              whileTap={{ scale: 0.95 }}
                              className={`inline-flex items-center px-3 py-1.5 md:px-4 md:py-2 rounded-lg md:rounded-xl text-xs md:text-sm font-semibold transition-all shadow-sm ${
                                destination.is_achieved
                                  ? "bg-green-500 text-white hover:bg-green-600 shadow-green-500/25"
                                  : "bg-orange-500 text-white hover:bg-orange-600 shadow-orange-500/25"
                              } ${
                                operationLoading === destination.id ||
                                (destination.is_achieved &&
                                  new Date(destination.departure_date) <
                                    new Date(new Date().setHours(0, 0, 0, 0)))
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                              title={
                                destination.is_achieved &&
                                new Date(destination.departure_date) <
                                  new Date(new Date().setHours(0, 0, 0, 0))
                                  ? "Destinasi masa lalu tidak dapat diubah ke perencanaan"
                                  : ""
                              }
                            >
                              {operationLoading === destination.id ? (
                                <>
                                  <div className="animate-spin h-3 w-3 md:h-4 md:w-4 border-2 border-white border-t-transparent rounded-full mr-1 md:mr-2"></div>
                                  <span className="hidden sm:inline">
                                    Memproses...
                                  </span>
                                </>
                              ) : destination.is_achieved ? (
                                <>
                                  <CheckCircle className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                                  <span className="hidden sm:inline">
                                    Tercapai
                                  </span>
                                  <span className="sm:hidden">✓</span>
                                </>
                              ) : (
                                <>
                                  <XCircle className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                                  <span className="hidden sm:inline">
                                    Perencanaan
                                  </span>
                                  <span className="sm:hidden">✗</span>
                                </>
                              )}
                            </motion.button>

                            {/* 🔥 TAMBAHKAN INDIKATOR JIKA SUDAH LEWAT */}
                            {new Date(destination.departure_date) <
                              new Date(new Date().setHours(0, 0, 0, 0)) && (
                              <span
                                className="text-xs text-gray-500 italic"
                                title="Destinasi masa lalu"
                              >
                                (lalu)
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Actions - FIXED VERSION */}
                        <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap">
                          <div className="flex gap-2 md:gap-3">
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Link
                                to={`/destinations/${destination.id}`}
                                className="inline-flex items-center px-3 py-1.5 md:px-4 md:py-2.5 bg-blue-500 text-white hover:bg-blue-600 rounded-lg md:rounded-xl transition-colors shadow-lg shadow-blue-500/25 font-medium text-xs md:text-sm"
                                title="Lihat Detail"
                              >
                                <Eye className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                                <span className="hidden sm:inline">Lihat</span>
                              </Link>
                            </motion.div>

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
                                className="inline-flex items-center px-2 py-1.5 md:px-3 md:py-2.5 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg md:rounded-xl transition-colors font-medium text-xs md:text-sm"
                              >
                                <MoreVertical className="h-3 w-3 md:h-4 md:w-4" />
                              </motion.button>

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
            <div className="px-4 md:px-6 py-3 md:py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                <p className="text-xs md:text-sm text-gray-600">
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
                <div className="text-xs md:text-sm text-gray-600">
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
