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

  // Create new destination
  create: async (destinationData) => {
    const formData = new FormData();

    // Append all fields to FormData
    Object.keys(destinationData).forEach((key) => {
      if (destinationData[key] !== null && destinationData[key] !== undefined) {
        formData.append(key, destinationData[key]);
      }
    });

    const response = await api.post("/destinations", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Update destination
  update: async (id, destinationData) => {
    const formData = new FormData();

    Object.keys(destinationData).forEach((key) => {
      if (destinationData[key] !== null && destinationData[key] !== undefined) {
        formData.append(key, destinationData[key]);
      }
    });

    formData.append("_method", "PUT"); // For Laravel

    const response = await api.post(`/destinations/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
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

  // Bulk update
  bulkUpdate: async (ids, updateData) => {
    const response = await api.post("/destinations/bulk-update", {
      ids,
      ...updateData,
    });
    return response.data;
  },
};
