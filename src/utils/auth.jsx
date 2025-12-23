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

  // 🔥 SELALU FETCH USER DARI API SAJA
  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      
      const response = await authService.getUser();
      
      if (response && response.user) {
        setUser(response.user);
      } else {
        console.error("❌ Invalid API response");
        setUser(null);
        localStorage.removeItem("auth_token");
      }
    } catch (error) {
      console.error("❌ Failed to fetch user:", error);
      setUser(null);
      localStorage.removeItem("auth_token");
    } finally {
      setLoading(false);
    }
  };

  // Load user on mount
  useEffect(() => {
    fetchUser();
  }, []);

  // 🔥 LOGIN: Simpan token saja, fetch user setelahnya
  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      
      if (!response.access_token) {
        throw new Error("No access token received");
      }

      // Simpan token
      localStorage.setItem("auth_token", response.access_token);
      
      // Fetch user dari API dengan token yang baru
      await fetchUser();
      
      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      localStorage.removeItem("auth_token");
      setUser(null);
      return {
        success: false,
        message: error.message || "Login failed",
      };
    }
  };

  // 🔥 REGISTER: Sama seperti login
  const register = async (name, email, password) => {
    try {
      const response = await authService.register(name, email, password);
      
      if (!response.access_token) {
        throw new Error("No access token received");
      }

      // Simpan token
      localStorage.setItem("auth_token", response.access_token);
      
      // Fetch user dari API
      await fetchUser();
      
      return { success: true };
    } catch (error) {
      console.error("Register error:", error);
      localStorage.removeItem("auth_token");
      setUser(null);
      return {
        success: false,
        message: error.message || "Registration failed",
      };
    }
  };

  // 🔥 LOGOUT: Clear semua
  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      localStorage.removeItem("auth_token");
    }
  };

  // 🔥 Refresh user data manually jika perlu
  const refreshUser = async () => {
    await fetchUser();
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    refreshUser, // tambah fungsi refresh
    isAuthenticated: !!user, // helper
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};