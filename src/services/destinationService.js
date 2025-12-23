import api from "./api";

// export const STORAGE_BASE_URL = "http://localhost:8000/storage";
export const STORAGE_BASE_URL = import.meta.env.VITE_STORAGE_BASE_URL || "http://localhost:8000/storage";

// 🔥 CACHING SYSTEM
let destinationsCache = null;
let lastFetchTime = 0;
const CACHE_DURATION = 10000; // 10 detik

export const destinationService = {
  // Get all destinations for current user - WITH CACHE
  getAll: async () => {
    // 🔥 Cek cache masih valid
    const now = Date.now();
    if (destinationsCache && (now - lastFetchTime) < CACHE_DURATION) {
      return Promise.resolve(destinationsCache);
    }
    
    try {
      const response = await api.get("/destinations");
      destinationsCache = response.data;
      lastFetchTime = now;
      return response.data;
    } catch (error) {
      console.error('❌ Failed to load destinations:', error);
      throw error;
    }
  },

  // Clear cache ketika ada perubahan data
  clearCache: () => {
    destinationsCache = null;
    lastFetchTime = 0;
  },

  // Get single destination - NO CACHE untuk detail
  getById: async (id) => {
    const response = await api.get(`/destinations/${id}`);
    return response.data;
  },

  // Create new destination - FIXED VERSION
  create: async (destinationData) => {
    const formData = new FormData();

    const response = await api.post("/destinations", destinationData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    
    // 🔥 Clear cache setelah create
    destinationService.clearCache();
    return response.data;
  },

  // services/destinationService.js - PERBAIKI update method
  update: async (id, formData) => {
    try {
      formData.append("_method", "PUT");

      const response = await api.post(`/destinations/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      // 🔥 Clear cache setelah update
      destinationService.clearCache();
      return response.data;
    } catch (error) {
      console.error("❌ Update failed:", error);
      throw error;
    }
  },

  // Delete destination
  delete: async (id) => {
    const response = await api.delete(`/destinations/${id}`);
    
    // 🔥 Clear cache setelah delete
    destinationService.clearCache();
    return response.data;
  },

  // Bulk delete
  bulkDelete: async (ids) => {
    const response = await api.post("/destinations/bulk-delete", { ids });
    
    // 🔥 Clear cache setelah bulk delete
    destinationService.clearCache();
    return response.data;
  },

  // Bulk update - FIXED VERSION
  bulkUpdate: async (ids, updateData) => {
    const response = await api.post("/destinations/bulk-update", {
      ids,
      ...updateData,
      is_achieved: updateData.is_achieved ? 1 : 0,
    });
    
    // 🔥 Clear cache setelah bulk update
    destinationService.clearCache();
    return response.data;
  },
};