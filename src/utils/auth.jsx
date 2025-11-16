import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/authService";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        console.log("🔐 Loading user, token exists:", !!token);

        if (token) {
          const userData = await authService.getUser();
          console.log("✅ User loaded:", userData);
          setUser(userData);
        }
      } catch (error) {
        console.error("❌ Failed to load user:", error);
        localStorage.removeItem("auth_token");
      } finally {
        setLoading(false);
        console.log("🏁 Auth loading finished");
      }
    };

    loadUser();
  }, []);

  // utils/auth.jsx - PERBAIKI BAGIAN INI
  const login = async (email, password) => {
    try {
      console.log("🔐 Attempting login for:", email);
      const response = await authService.login(email, password);
      console.log("✅ Login response:", response);

      // 🔥 SESUAIKAN DENGAN LARAVEL RESPONSE
      const token = response.access_token;
      const userData = response.user;

      console.log("💾 Token to save:", token);
      console.log("👤 User data:", userData);

      if (!token || !userData) {
        throw new Error("No access_token or user data received from server");
      }

      setUser(userData);
      localStorage.setItem("auth_token", token);
      console.log("✅ Token saved successfully");

      return { success: true };
    } catch (error) {
      console.error("❌ Login error:", error);
      localStorage.removeItem("auth_token");
      return {
        success: false,
        message:
          error.message || "Login failed. Please check your credentials.",
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      console.log("👤 Attempting registration for:", email);
      const response = await authService.register(name, email, password);
      console.log("✅ Register response:", response);

      // 🔥 SESUAIKAN DENGAN LARAVEL RESPONSE
      const token = response.access_token;
      const userData = response.user;

      setUser(userData);
      localStorage.setItem("auth_token", token);

      return { success: true };
    } catch (error) {
      console.error("❌ Register error:", error);
      return {
        success: false,
        message: error.message || "Registration failed. Please try again.",
      };
    }
  };

  const logout = async () => {
    try {
      console.log("🚪 Attempting logout");
      await authService.logout();
    } catch (error) {
      console.error("❌ Logout error:", error);
    } finally {
      setUser(null);
      localStorage.removeItem("auth_token");
      console.log("✅ Logout completed");
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
