import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut,
  User,
  Settings,
  Clock,
  ChevronDown,
  Sun,
  Moon,
} from "lucide-react";
import { useAuth } from "../../utils/auth";

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState("--:--");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();

  // Get dynamic page titles
  const getPageTitle = () => {
    const titles = {
      '/home': 'Travel Dashboard',
      '/destinations': 'My Destinations', 
      '/itineraries': 'Trip Itineraries',
      '/destinations/new': 'Add Destination',
    };
    
    if (location.pathname.startsWith('/destinations/') && location.pathname.includes('/edit')) {
      return 'Edit Destination';
    }
    
    return titles[location.pathname] || 'Travel Planner';
  };

  const getPageDescription = () => {
    const descriptions = {
      '/home': 'Manage and track your travel adventures',
      '/destinations': 'Create and organize your dream destinations',
      '/itineraries': 'Plan your trip activities and schedules',
      '/destinations/new': 'Add a new destination to your travel plans',
    };
    
    if (location.pathname.startsWith('/destinations/') && location.pathname.includes('/edit')) {
      return 'Update your destination details';
    }
    
    return descriptions[location.pathname] || 'Your personal travel planning companion';
  };

  // Update clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("en-US", { 
          hour: "2-digit", 
          minute: "2-digit",
          hour12: true 
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsDropdownOpen(false);
    navigate("/login");
  };

  const getInitials = (name) => {
    if (!name) return "T";
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // Implement dark mode logic here if needed
  };

  return (
    <header
      className="fixed top-0 left-72 right-0 h-20 bg-white/90 backdrop-blur-md z-30 shadow-sm border-b border-slate-200/60"
    >
      <div className="flex justify-between items-center h-full px-8">
        {/* Page Title dengan animasi */}
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-6"
        >
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              {getPageTitle()}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {getPageDescription()}
            </p>
          </div>
        </motion.div>

        {/* Right Section - Time & User */}
        <div className="flex items-center gap-4">
          {/* Time Display - Design yang berbeda */}
          <motion.div 
            className="flex items-center gap-3 bg-slate-100/80 rounded-2xl px-4 py-2.5 border border-slate-200/60"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Clock size={18} className="text-blue-500" />
            <span className="font-semibold text-slate-700 text-sm font-mono">
              {currentTime}
            </span>
          </motion.div>

          {/* Dark Mode Toggle */}
          <motion.button
            onClick={toggleDarkMode}
            className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </motion.button>

          {/* User Profile Dropdown - Design yang berbeda */}
          <div className="relative" ref={dropdownRef}>
            <motion.button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-3 p-2 rounded-2xl hover:bg-slate-100/80 transition-all duration-200 border border-transparent hover:border-slate-200/60"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-right hidden sm:block">
                <p className="font-semibold text-sm text-slate-800">
                  {user?.name || "Traveler"}
                </p>
                <p className="text-xs text-slate-500">
                  {user?.email || "Adventurer"}
                </p>
              </div>
              
              {/* Avatar dengan design baru */}
              <div className="relative">
                <motion.div 
                  className="w-11 h-11 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  {getInitials(user?.name)}
                </motion.div>
                <motion.div 
                  className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white shadow"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              
              <motion.div
                animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown size={18} className="text-slate-400" />
              </motion.div>
            </motion.button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  className="absolute right-0 mt-3 w-72 rounded-2xl shadow-xl bg-white/95 backdrop-blur-md border border-slate-200/60 z-40 overflow-hidden"
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  {/* Header dengan gradient */}
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-400 p-4 text-white">
                    <p className="font-semibold text-sm">
                      {user?.name || "Traveler"}
                    </p>
                    <p className="text-xs text-blue-100 opacity-90">
                      {user?.email || "Adventurer"}
                    </p>
                    <p className="text-xs text-blue-200 mt-1">
                      ✈️ Travel Enthusiast
                    </p>
                  </div>
                  
                  <div className="p-2">
                    {/* Menu Items */}
                    <Link
                      to="/profile"
                      className="flex items-center w-full px-3 py-3 text-sm text-slate-700 rounded-lg hover:bg-slate-100/80 transition-colors group"
                    >
                      <User size={18} className="mr-3 text-slate-500 group-hover:text-blue-500" /> 
                      My Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center w-full px-3 py-3 text-sm text-slate-700 rounded-lg hover:bg-slate-100/80 transition-colors group"
                    >
                      <Settings size={18} className="mr-3 text-slate-500 group-hover:text-blue-500" /> 
                      Settings
                    </Link>
                    
                    {/* Logout Button */}
                    <div className="border-t border-slate-200/60 mt-2 pt-2">
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-3 py-3 text-sm text-red-600 rounded-lg hover:bg-red-50/80 transition-colors group"
                      >
                        <LogOut size={18} className="mr-3 group-hover:scale-110 transition-transform" /> 
                        Sign Out
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;