import api from './api';

export const itineraryService = {
  // Get itineraries by destination
  getByDestination: async (destinationId) => {
    try {
      console.log('Fetching itineraries for destination:', destinationId);
      const response = await api.get(`/destinations/${destinationId}/itineraries`);
      console.log('Itineraries response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching itineraries:', error);
      throw error;
    }
  },

  // Get single itinerary
  getById: async (id) => {
    try {
      const response = await api.get(`/itineraries/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching itinerary:', error);
      throw error;
    }
  },

  // Create new itinerary
  create: async (itineraryData) => {
    try {
      const response = await api.post('/itineraries', itineraryData);
      return response.data;
    } catch (error) {
      console.error('Error creating itinerary:', error);
      throw error;
    }
  },

  // Update itinerary
  update: async (id, itineraryData) => {
    try {
      const response = await api.put(`/itineraries/${id}`, itineraryData);
      return response.data;
    } catch (error) {
      console.error('Error updating itinerary:', error);
      throw error;
    }
  },

  // Delete itinerary
  delete: async (id) => {
    try {
      const response = await api.delete(`/itineraries/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting itinerary:', error);
      throw error;
    }
  }
};