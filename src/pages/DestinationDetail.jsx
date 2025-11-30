import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
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
  RefreshCw,
} from "lucide-react";
import { motion } from "framer-motion";

import {
  STORAGE_BASE_URL,
  destinationService,
} from "../services/destinationService";

const DestinationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

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
      const updatedDestination = await destinationService.update(destination.id, {
        is_achieved: !destination.is_achieved,
      });
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
          <p className="text-gray-600 font-medium">Memuat destinasi Anda...</p>
        </div>
      </div>
    );
  }

  if (error || !destination) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50/30 to-cyan-50/30">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Compass className="h-10 w-10 text-red-600" />
          </div>
          <div className="text-red-600 text-lg font-medium mb-4">
            {error || "Destinasi tidak ditemukan"}
          </div>
          <div className="flex gap-3 justify-center">
            <button
              onClick={loadDestination}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-xl hover:from-blue-600 hover:to-cyan-500 transition-all shadow-lg font-semibold"
            >
              Coba Lagi
            </button>
            <Link
              to="/destinations"
              className="inline-flex items-center px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all font-semibold"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Kembali
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const imageUrl = getImageUrl(destination.photo);

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
                to="/destinations"
                className="inline-flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 bg-white border border-gray-300 rounded-xl hover:border-gray-400 transition-all shadow-sm hover:shadow-md"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Kembali ke Destinasi
              </Link>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Detail Destinasi
                  <span className="ml-1 text-white">📍</span>
                </h1>
                <p className="text-gray-600 mt-1">
                  Lihat dan kelola detail destinasi perjalanan Anda
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

              <motion.button
                onClick={toggleStatus}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`inline-flex items-center px-6 py-3 rounded-xl transition-all shadow-lg font-semibold ${
                  destination.is_achieved
                    ? "bg-orange-500 hover:bg-orange-600 text-white"
                    : "bg-green-500 hover:bg-green-600 text-white"
                }`}
              >
                {destination.is_achieved ? (
                  <>
                    <XCircle className="h-5 w-5 mr-2" />
                    Tandai Perencanaan
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Tandai Selesai
                  </>
                )}
              </motion.button>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={`/destinations/${id}/edit`}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-xl hover:from-blue-600 hover:to-cyan-500 transition-all shadow-lg hover:shadow-xl font-semibold"
                >
                  <Edit className="h-5 w-5 mr-2" />
                  Edit Destinasi
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Destination Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
        >
          {/* Hero Image Section */}
          <div className="relative h-96 bg-gradient-to-br from-blue-500 to-cyan-400">
            {destination.photo ? (
              <img
                src={imageUrl}
                alt={destination.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Plane className="h-24 w-24 text-white opacity-30" />
              </div>
            )}
            <div className="absolute bottom-6 left-8 right-8">
              <div className="flex items-end justify-between">
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
                    {destination.title}
                  </h1>
                  {destination.location && (
                    <div className="flex items-center text-white text-lg opacity-90">
                      <Navigation className="h-5 w-5 mr-2" />
                      <span>{destination.location}</span>
                    </div>
                  )}
                </div>
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  className={`inline-flex items-center px-4 py-2 rounded-full text-lg font-semibold shadow-lg ${
                    destination.is_achieved
                      ? "bg-green-500 text-white shadow-green-500/25"
                      : "bg-orange-500 text-white shadow-orange-500/25"
                  }`}
                >
                  {destination.is_achieved ? (
                    <>
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Tercapai
                    </>
                  ) : (
                    <>
                      <XCircle className="h-5 w-5 mr-2" />
                      Dalam Perencanaan
                    </>
                  )}
                </motion.span>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8">
            {/* Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
            >
              {[
                {
                  icon: Calendar,
                  value: new Date(destination.departure_date).toLocaleDateString("id-ID", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }),
                  label: "Tanggal Keberangkatan",
                  color: "blue",
                  bgColor: "bg-blue-100",
                  textColor: "text-blue-600",
                },
                {
                  icon: DollarSign,
                  value: new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 0,
                  }).format(destination.budget),
                  label: "Budget Perjalanan",
                  color: "green",
                  bgColor: "bg-green-100",
                  textColor: "text-green-600",
                },
                {
                  icon: MapPin,
                  value: `${destination.duration_days} Hari`,
                  label: "Durasi Perjalanan",
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

            {/* Additional Information */}
            {(destination.description || destination.travelers_count) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
              >
                {destination.description && (
                  <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Deskripsi</h3>
                    <p className="text-gray-700 leading-relaxed">
                      {destination.description}
                    </p>
                  </div>
                )}
                
                {destination.travelers_count && (
                  <div className="bg-gradient-to-br from-orange-50 to-amber-100 p-6 rounded-2xl border border-orange-100">
                    <div className="flex items-center">
                      <Users className="h-8 w-8 text-orange-600 mr-4" />
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Jumlah Traveler</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {destination.travelers_count} Orang
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="border-t border-gray-200 pt-8"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Rencana Perjalanan</h3>
                  <p className="text-gray-600 mt-1">
                    Kelola itinerary dan aktivitas perjalanan Anda
                  </p>
                </div>
                <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-semibold">
                  {destination.itineraries?.length || 0} Aktivitas
                </span>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1"
                >
                  <Link
                    to={`/itineraries?destination=${destination.id}`}
                    className="inline-flex items-center justify-center w-full px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-xl hover:from-blue-600 hover:to-cyan-500 transition-all shadow-lg hover:shadow-xl text-lg font-semibold"
                  >
                    <MapPin className="h-6 w-6 mr-3" />
                    Lihat & Kelola Rencana Perjalanan
                  </Link>
                </motion.div>

                <motion.button
                  onClick={handleDelete}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center justify-center px-8 py-4 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all shadow-lg hover:shadow-xl text-lg font-semibold"
                >
                  <Trash2 className="h-6 w-6 mr-3" />
                  Hapus Destinasi
                </motion.button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DestinationDetail;