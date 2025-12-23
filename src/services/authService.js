import api from "./api";

export const authService = {
  login: async (email, password) => {
    try {
      const response = await api.post("/login", {
        email,
        password,
      });

      const data = response.data;

      if (data.access_token && data.user) {
        return data; // structure: { access_token, token_type, user }
      }

      throw new Error("Invalid response structure from server");
    } catch (error) {
      console.error("Login service error:", error);
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Login failed";
      throw new Error(message);
    }
  },

  register: async (name, email, password) => {
    try {
      const response = await api.post("/register", {
        name,
        email,
        password,
        password_confirmation: password,
      });

      const data = response.data;

      if (data.access_token && data.user) {
        return data; // structure: { access_token, token_type, user }
      }

      throw new Error("Invalid response structure from server");
    } catch (error) {
      console.error("Register service error:", error);
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Registration failed";
      throw new Error(message);
    }
  },

  // Get current user
  getUser: async () => {
    try {
      const response = await api.get("/user");
      return response.data;
    } catch (error) {
      console.error("Get user service error:", error);
      throw new Error("Failed to get user data");
    }
  },

  // Logout user
  logout: async () => {
    try {
      const response = await api.post("/logout");
      return response.data;
    } catch (error) {
      console.error("Logout service error:", error);
      throw new Error("Logout failed");
    }
  },
};
