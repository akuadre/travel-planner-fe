import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  CheckCircle, 
  XCircle,
  Calendar,
  DollarSign,
  MapPin,
  Download,
  Upload
} from 'lucide-react';
import { motion } from 'framer-motion';

const Destinations = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedDestinations, setSelectedDestinations] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'departure_date', direction: 'asc' });

  // Mock data - nanti ganti dengan API
  const mockDestinations = [
    {
      id: 1,
      title: 'Trip ke Gunung Bromo',
      photo: null,
      departure_date: '2024-03-15',
      budget: 2500000,
      duration_days: 3,
      is_achieved: true,
      created_at: '2024-01-15'
    },
    {
      id: 2,
      title: 'Liburan ke Pantai Kuta Bali',
      photo: null,
      departure_date: '2024-04-20',
      budget: 5000000,
      duration_days: 5,
      is_achieved: false,
      created_at: '2024-01-20'
    },
    {
      id: 3,
      title: 'Camping di Gunung Cikuray',
      photo: null,
      departure_date: '2024-05-10',
      budget: 1500000,
      duration_days: 2,
      is_achieved: false,
      created_at: '2024-02-01'
    },
    {
      id: 4,
      title: 'City Tour Jakarta',
      photo: null,
      departure_date: '2024-06-01',
      budget: 3000000,
      duration_days: 4,
      is_achieved: true,
      created_at: '2024-02-05'
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
    const matchesStatus = 
      statusFilter === 'all' || 
      (statusFilter === 'achieved' && destination.is_achieved) ||
      (statusFilter === 'not_achieved' && !destination.is_achieved);
    
    return matchesSearch && matchesStatus;
  });

  // Sort destinations
  const sortedDestinations = [...filteredDestinations].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // Handle sort
  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  // Handle selection
  const toggleDestinationSelection = (id) => {
    setSelectedDestinations(prev =>
      prev.includes(id)
        ? prev.filter(destId => destId !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedDestinations.length === sortedDestinations.length) {
      setSelectedDestinations([]);
    } else {
      setSelectedDestinations(sortedDestinations.map(d => d.id));
    }
  };

  // Handle delete
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this destination?')) {
      setDestinations(prev => prev.filter(d => d.id !== id));
      setSelectedDestinations(prev => prev.filter(destId => destId !== id));
    }
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedDestinations.length} destinations?`)) {
      setDestinations(prev => prev.filter(d => !selectedDestinations.includes(d.id)));
      setSelectedDestinations([]);
    }
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
      month: 'short',
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
              <h1 className="text-3xl font-bold text-gray-900">All Destinations</h1>
              <p className="text-gray-600 mt-2">Manage your travel destinations</p>
            </div>
            <div className="flex gap-3">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <Download className="h-5 w-5 mr-2" />
                Export
              </button>
              <Link
                to="/destinations/new"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Destination
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 justify-between">
            {/* Search Input */}
            <div className="flex-1 relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search destinations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Filter and Status */}
            <div className="flex gap-3">
              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="achieved">Achieved</option>
                <option value="not_achieved">Planning</option>
              </select>

              {/* Sort Options */}
              <select
                value={`${sortConfig.key}-${sortConfig.direction}`}
                onChange={(e) => {
                  const [key, direction] = e.target.value.split('-');
                  setSortConfig({ key, direction });
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg"
            >
              <div className="flex items-center justify-between">
                <p className="text-blue-800">
                  {selectedDestinations.length} destination(s) selected
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleBulkDelete}
                    className="inline-flex items-center px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete Selected
                  </button>
                  <button
                    onClick={() => setSelectedDestinations([])}
                    className="px-3 py-1 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Clear Selection
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Destinations Table */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          {sortedDestinations.length === 0 ? (
            // Empty State
            <div className="text-center py-12">
              <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No destinations found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Get started by creating your first destination'
                }
              </p>
              <Link
                to="/destinations/new"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Destination
              </Link>
            </div>
          ) : (
            // Table
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                      <input
                        type="checkbox"
                        checked={selectedDestinations.length === sortedDestinations.length && sortedDestinations.length > 0}
                        onChange={toggleSelectAll}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Destination
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('departure_date')}
                    >
                      <div className="flex items-center">
                        Departure Date
                        {sortConfig.key === 'departure_date' && (
                          <span className="ml-1">
                            {sortConfig.direction === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('budget')}
                    >
                      <div className="flex items-center">
                        Budget
                        {sortConfig.key === 'budget' && (
                          <span className="ml-1">
                            {sortConfig.direction === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedDestinations.map((destination, index) => (
                    <motion.tr
                      key={destination.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      {/* Checkbox */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedDestinations.includes(destination.id)}
                          onChange={() => toggleDestinationSelection(destination.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>

                      {/* Destination Info */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            {destination.photo ? (
                              <img
                                src={destination.photo}
                                alt={destination.title}
                                className="h-10 w-10 rounded-lg object-cover"
                              />
                            ) : (
                              <MapPin className="h-5 w-5 text-white" />
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
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
                        <div className="flex items-center text-sm text-gray-900">
                          <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                          {formatDate(destination.departure_date)}
                        </div>
                      </td>

                      {/* Budget */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
                          {formatCurrency(destination.budget)}
                        </div>
                      </td>

                      {/* Duration */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                          {destination.duration_days} days
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          destination.is_achieved
                            ? 'bg-green-100 text-green-800'
                            : 'bg-orange-100 text-orange-800'
                        }`}>
                          {destination.is_achieved ? (
                            <>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Achieved
                            </>
                          ) : (
                            <>
                              <XCircle className="h-3 w-3 mr-1" />
                              Planning
                            </>
                          )}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button className="text-blue-600 hover:text-blue-900 transition-colors">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-900 transition-colors">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(destination.id)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination (Optional) */}
        {sortedDestinations.length > 0 && (
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{sortedDestinations.length}</span> destinations
            </p>
            {/* Add pagination controls here if needed */}
          </div>
        )}
      </div>
    </div>
  );
};

export default Destinations;