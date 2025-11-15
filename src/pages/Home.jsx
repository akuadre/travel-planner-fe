import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, MapPin, Calendar, DollarSign, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
  const [destinations, setDestinations] = useState([]);
  const [filter, setFilter] = useState('all'); // all, achieved, not_achieved
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Mock data - nanti ganti dengan API call
  const mockDestinations = [
    {
      id: 1,
      title: 'Trip ke Gunung Bromo',
      photo: null,
      departure_date: '2024-03-15',
      budget: 2500000,
      duration_days: 3,
      is_achieved: true
    },
    {
      id: 2,
      title: 'Liburan ke Pantai Kuta Bali',
      photo: null,
      departure_date: '2024-04-20',
      budget: 5000000,
      duration_days: 5,
      is_achieved: false
    },
    {
      id: 3,
      title: 'Camping di Gunung Cikuray',
      photo: null,
      departure_date: '2024-05-10',
      budget: 1500000,
      duration_days: 2,
      is_achieved: false
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setDestinations(mockDestinations);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter destinations
  const filteredDestinations = destinations.filter(destination => {
    const matchesSearch = destination.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'achieved' && destination.is_achieved) ||
      (filter === 'not_achieved' && !destination.is_achieved);
    
    return matchesSearch && matchesFilter;
  });

  // Calculate stats
  const stats = {
    total: destinations.length,
    achieved: destinations.filter(d => d.is_achieved).length,
    totalBudget: destinations.reduce((sum, d) => sum + d.budget, 0)
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Travel Plans</h1>
              <p className="text-gray-600 mt-2">Manage and track your upcoming adventures</p>
            </div>
            <Link
              to="/destinations"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Destination
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Destinations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border p-6"
          >
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <MapPin className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Destinations</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </motion.div>

          {/* Achieved Destinations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm border p-6"
          >
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Achieved</p>
                <p className="text-2xl font-bold text-gray-900">{stats.achieved}</p>
              </div>
            </div>
          </motion.div>

          {/* Total Budget */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm border p-6"
          >
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Budget</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(stats.totalBudget)}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search destinations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  filter === 'all'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('achieved')}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  filter === 'achieved'
                    ? 'bg-green-600 text-white border-green-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                Achieved
              </button>
              <button
                onClick={() => setFilter('not_achieved')}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  filter === 'not_achieved'
                    ? 'bg-orange-600 text-white border-orange-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                Planning
              </button>
            </div>
          </div>
        </div>

        {/* Destinations Grid */}
        {filteredDestinations.length === 0 ? (
          // Empty State
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="max-w-md mx-auto">
              <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No destinations found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || filter !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Start by adding your first travel destination'
                }
              </p>
              <Link
                to="/destinations"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Your First Destination
              </Link>
            </div>
          </motion.div>
        ) : (
          // Destinations Grid
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredDestinations.map((destination, index) => (
              <motion.div
                key={destination.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-all duration-300"
              >
                {/* Destination Image */}
                <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 relative">
                  {destination.photo ? (
                    <img
                      src={destination.photo}
                      alt={destination.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <MapPin className="h-12 w-12 text-white opacity-50" />
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium ${
                    destination.is_achieved
                      ? 'bg-green-100 text-green-800'
                      : 'bg-orange-100 text-orange-800'
                  }`}>
                    {destination.is_achieved ? (
                      <span className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Achieved
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <XCircle className="h-4 w-4 mr-1" />
                        Planning
                      </span>
                    )}
                  </div>
                </div>

                {/* Destination Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {destination.title}
                  </h3>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span className="text-sm">{formatDate(destination.departure_date)}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                      <DollarSign className="h-4 w-4 mr-2" />
                      <span className="text-sm">{formatCurrency(destination.budget)}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span className="text-sm">{destination.duration_days} days</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Link
                      to={`/destinations/${destination.id}`}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-center hover:bg-blue-700 transition-colors"
                    >
                      View Details
                    </Link>
                    <Link
                      to={`/itineraries?destination=${destination.id}`}
                      className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg text-center hover:bg-gray-50 transition-colors"
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
    </div>
  );
};

export default Home;