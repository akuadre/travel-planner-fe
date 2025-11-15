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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { itineraryService } from "../services/itineraryService";
import { destinationService } from "../services/destinationService";

const Itineraries = () => {
  const [searchParams] = useSearchParams();
  const destinationId = searchParams.get("destination");

  const [destination, setDestination] = useState(null);
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedDays, setExpandedDays] = useState(new Set());
  const [showForm, setShowForm] = useState(false);
  const [editingItinerary, setEditingItinerary] = useState(null);

  useEffect(() => {
    if (!destinationId) {
      setError(
        "Destination ID is missing. Please go back to destinations and select a destination."
      );
      setLoading(false);
      return;
    }
  }, [destinationId]);

  useEffect(() => {
    if (destinationId) {
      loadData();
    }
  }, [destinationId]);

  const loadData = async (retryCount = 0) => {
    try {
      setLoading(true);
      setError("");

      const destData = await destinationService.getById(destinationId);
      setDestination(destData);

      try {
        const itinerariesData = await itineraryService.getByDestination(
          destinationId
        );
        setItineraries(itinerariesData);

        if (itinerariesData.length > 0) {
          const firstDay = Math.min(
            ...itinerariesData.map((i) => i.day_number)
          );
          setExpandedDays(new Set([firstDay]));
        }
      } catch (itineraryError) {
        if (retryCount < 3) {
          console.log(`Retrying itinerary load... Attempt ${retryCount + 1}`);
          setTimeout(() => loadData(retryCount + 1), 1000 * (retryCount + 1));
          return;
        }
        throw itineraryError;
      }
    } catch (error) {
      console.error("Final load error:", error);
      setError("Failed to load data after multiple attempts.");
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
  };

  const handleDelete = async (itineraryId) => {
    if (
      window.confirm("Are you sure you want to delete this itinerary item?")
    ) {
      try {
        await itineraryService.delete(itineraryId);
        setItineraries((prev) =>
          prev.filter((item) => item.id !== itineraryId)
        );
      } catch (error) {
        console.error("Failed to delete itinerary:", error);
        alert("Failed to delete itinerary item.");
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

    // Sort days and sort items within each day by time
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
    if (!timeString) return "All day";

    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;

    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatDuration = (durationDays) => {
    if (durationDays === 1) return "1 day";
    return `${durationDays} days`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading itinerary...</p>
          <p className="text-sm text-gray-500 mt-2">
            Destination ID: {destinationId}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-lg mb-4">{error}</div>
          <Link
            to="/destinations"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Destinations
          </Link>
        </div>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Destination not found</p>
          <Link
            to="/destinations"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Destinations
          </Link>
        </div>
      </div>
    );
  }

  const groupedItineraries = groupItinerariesByDay(itineraries);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-6">
            <Link
              to="/destinations"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 mr-6"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Destinations
            </Link>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">
                {destination.title} - Itinerary
              </h1>
              <p className="text-gray-600 mt-1">
                {formatDuration(destination.duration_days)} trip •{" "}
                {itineraries.length} activities planned
              </p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Activity
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Trip Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Departure Date</p>
                <p className="font-semibold text-gray-900">
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
              <Clock className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Trip Duration</p>
                <p className="font-semibold text-gray-900">
                  {formatDuration(destination.duration_days)}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <MapPin className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Activities Planned</p>
                <p className="font-semibold text-gray-900">
                  {itineraries.length} items across{" "}
                  {Object.keys(groupedItineraries).length} days
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Itinerary Days */}
        <div className="space-y-4">
          {Object.keys(groupedItineraries).length === 0 ? (
            // Empty State
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 bg-white rounded-xl shadow-sm border"
            >
              <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No itinerary planned yet
              </h3>
              <p className="text-gray-600 mb-6">
                Start planning your {destination.duration_days}-day adventure by
                adding activities
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-5 w-5 mr-2" />
                Plan Your First Activity
              </button>
            </motion.div>
          ) : (
            // Itinerary Days List
            Object.keys(groupedItineraries).map((dayNumber) => (
              <motion.div
                key={dayNumber}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm border overflow-hidden"
              >
                {/* Day Header */}
                <button
                  onClick={() => toggleDay(parseInt(dayNumber))}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center">
                    <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mr-4">
                      Day {dayNumber}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {groupedItineraries[dayNumber].length} activities planned
                    </h3>
                  </div>
                  {expandedDays.has(parseInt(dayNumber)) ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </button>

                {/* Day Activities */}
                <AnimatePresence>
                  {expandedDays.has(parseInt(dayNumber)) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t"
                    >
                      {groupedItineraries[dayNumber].map((itinerary, index) => (
                        <motion.div
                          key={itinerary.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start p-6 border-b last:border-b-0 hover:bg-gray-50 transition-colors"
                        >
                          {/* Time */}
                          <div className="w-24 flex-shrink-0">
                            <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                              {formatTime(itinerary.schedule_time)}
                            </div>
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-1">
                                  {itinerary.location}
                                </h4>
                                <p className="text-gray-600 mb-2">
                                  {itinerary.description}
                                </p>
                                {itinerary.activities && (
                                  <p className="text-sm text-gray-500">
                                    Activities: {itinerary.activities}
                                  </p>
                                )}
                              </div>
                              <div className="flex gap-2 ml-4">
                                <button
                                  onClick={() => setEditingItinerary(itinerary)}
                                  className="text-green-600 hover:text-green-900 transition-colors"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(itinerary.id)}
                                  className="text-red-600 hover:text-red-900 transition-colors"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))
          )}
        </div>
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
