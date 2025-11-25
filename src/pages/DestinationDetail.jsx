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

  const getImageUrl = (photoPath) => {
    if (!photoPath) return null;
    if (photoPath.startsWith("http")) return photoPath;
    return `${STORAGE_BASE_URL}/destinations/${photoPath}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat destinasi...</p>
        </div>
      </div>
    );
  }

  if (error || !destination) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">
            {error || "Destinasi tidak ditemukan"}
          </p>
          <Link
            to="/destinations"
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Destinasi
          </Link>
        </div>
      </div>
    );
  }

  const imageUrl = getImageUrl(destination.photo);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/destinations"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Kembali ke Destinasi
          </Link>
          <div className="flex gap-2">
            <Link
              to={`/destinations/${id}/edit`}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-md"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Hapus
            </button>
          </div>
        </div>

        {/* Destination Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          {/* Image */}
          <div className="h-64 bg-gradient-to-br from-blue-500 to-purple-600 relative">
            {destination.photo ? (
              <img
                src={imageUrl}
                alt={destination.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <MapPin className="h-16 w-16 text-white opacity-50" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-3xl font-bold text-gray-900">
                {destination.title}
              </h1>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  destination.is_achieved
                    ? "bg-green-100 text-green-800"
                    : "bg-orange-100 text-orange-800"
                }`}
              >
                {destination.is_achieved ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Tercapai
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 mr-1" />
                    Perencanaan
                  </>
                )}
              </span>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="flex items-center">
                <Calendar className="h-6 w-6 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Tanggal Keberangkatan</p>
                  <p className="font-semibold">
                    {new Date(destination.departure_date).toLocaleDateString(
                      "id-ID",
                      {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <DollarSign className="h-6 w-6 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Budget</p>
                  <p className="font-semibold">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }).format(destination.budget)}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <MapPin className="h-6 w-6 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Durasi</p>
                  <p className="font-semibold">
                    {destination.duration_days} hari
                  </p>
                </div>
              </div>
            </div>

            {/* Itinerary Link */}
            <div className="border-t pt-6">
              <Link
                to={`/itineraries?destination=${destination.id}`}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
              >
                <MapPin className="h-5 w-5 mr-2" />
                Lihat Rencana Perjalanan ({destination.itineraries?.length || 0} aktivitas)
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DestinationDetail;