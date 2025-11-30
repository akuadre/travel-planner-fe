import api from "./api";

export const STORAGE_BASE_URL = "http://localhost:8000/storage";

export const destinationService = {
  // Get all destinations for current user
  getAll: async () => {
    const response = await api.get("/destinations");
    return response.data;
  },

  // Get single destination
  getById: async (id) => {
    const response = await api.get(`/destinations/${id}`);
    return response.data;
  },

  // Create new destination - FIXED VERSION
  create: async (destinationData) => {
    const formData = new FormData();

    console.log("Creating destination with data:", {
      title: destinationData.get("title"),
      departure_date: destinationData.get("departure_date"),
      budget: destinationData.get("budget"),
      duration_days: destinationData.get("duration_days"),
      is_achieved: destinationData.get("is_achieved"),
      hasPhoto: destinationData.get("photo") ? "Yes" : "No",
    });

    // Append all fields to FormData
    for (let [key, value] of destinationData.entries()) {
      console.log(`FormData - ${key}:`, value);
    }

    const response = await api.post("/destinations", destinationData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // services/destinationService.js - PERBAIKI update method
  update: async (id, formData) => {
    try {
      console.log("🔄 Updating destination:", id);

      // Debug: Log semua data di FormData
      for (let [key, value] of formData.entries()) {
        if (key === "photo") {
          console.log(`📸 Photo:`, value.name, value.type, value.size);
        } else {
          console.log(`📦 ${key}:`, value);
        }
      }

      // JANGAN buat FormData baru, pakai yang dari parameter
      formData.append("_method", "PUT");

      const response = await api.post(`/destinations/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("✅ Update successful:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Update failed:", error);
      throw error;
    }
  },

  // Delete destination
  delete: async (id) => {
    const response = await api.delete(`/destinations/${id}`);
    return response.data;
  },

  // Bulk delete
  bulkDelete: async (ids) => {
    const response = await api.post("/destinations/bulk-delete", { ids });
    return response.data;
  },

  // Bulk update - FIXED VERSION
  bulkUpdate: async (ids, updateData) => {
    const response = await api.post("/destinations/bulk-update", {
      ids,
      ...updateData,
      // Convert boolean for bulk update too
      is_achieved: updateData.is_achieved ? 1 : 0,
    });
    return response.data;
  },
};
