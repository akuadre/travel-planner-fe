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
  Calendar as CalendarIcon,
  Menu,
  Bell,
  Search,
  Home,
} from "lucide-react";
import { useAuth } from "../../utils/auth";

const Header = ({ toggleSidebar }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState("--:--");
  const [currentDate, setCurrentDate] = useState("");
  const [currentDay, setCurrentDay] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();

  // Get dynamic page titles
  const getPageTitle = () => {
    const titles = {
      "/home": "Dashboard",
      "/destinations": "Destinasi",
      "/itineraries": "Rencana Perjalanan",
      "/destinations/new": "Tambah Destinasi",
    };

    if (
      location.pathname.startsWith("/destinations/") &&
      location.pathname.includes("/edit")
    ) {
      return "Edit Destinasi";
    }

    return titles[location.pathname] || "Travel Planner";
  };

  const getPageDescription = () => {
    const descriptions = {
      "/home": "Kelola petualangan perjalananmu",
      "/destinations": "Atur destinasi impianmu",
      "/itineraries": "Rencanakan aktivitas perjalanan",
      "/destinations/new": "Tambahkan destinasi baru",
    };

    if (
      location.pathname.startsWith("/destinations/") &&
      location.pathname.includes("/edit")
    ) {
      return "Perbarui detail destinasi";
    }

    return descriptions[location.pathname] || "Pendamping perencanaanmu";
  };

  // Update time dan date
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      setCurrentTime(`${hours}:${minutes}`);

      const formattedDate = now.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      setCurrentDate(formattedDate);

      const formattedDay = now.toLocaleDateString("id-ID", {
        weekday: "long",
      });
      setCurrentDay(formattedDay);
    };

    updateDateTime();
    const timer = setInterval(updateDateTime, 1000);
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
    if (!name) return "P";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 lg:h-20 bg-white/95 backdrop-blur-md z-30 shadow-sm border-b border-slate-200/60 lg:pl-72">
      <div className="h-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-full gap-4">
          {/* Left Section: Menu Button + Title */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* Menu Button */}
            <motion.button
              onClick={toggleSidebar}
              className="lg:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors flex-shrink-0"
              whileTap={{ scale: 0.9 }}
            >
              <Menu size={20} />
            </motion.button>

            {/* Page Title & Description */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                {/* Home Link untuk mobile */}
                {location.pathname !== "/home" && (
                  <Link
                    to="/home"
                    className="md:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <Home size={18} className="text-slate-600" />
                  </Link>
                )}

                <div className="min-w-0 flex-1">
                  <motion.div
                    key={location.pathname}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h1 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent truncate">
                      {getPageTitle()}
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5 hidden sm:block truncate">
                      {getPageDescription()}
                    </p>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section: Actions & User */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Date & Time Display */}
            <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
              {/* Desktop - Full Date */}
              <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-xl border border-blue-100">
                <CalendarIcon size={16} className="text-blue-500" />
                <div className="text-sm">
                  <div className="font-semibold text-slate-800">
                    {currentDay}
                  </div>
                  <div className="text-xs text-slate-600">{currentDate}</div>
                </div>
              </div>

              {/* Mobile & Tablet - Compact Date */}
              <div className="md:hidden flex items-center gap-1 px-2 py-1.5 bg-blue-50 rounded-lg border border-blue-100">
                <CalendarIcon size={14} className="text-blue-500" />
                <span className="text-xs font-semibold text-slate-700">
                  {currentDate.split(" ")[0]} {/* Hanya tanggal (angka) */}
                </span>
              </div>

              {/* Time - Selalu tampil */}
              <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-slate-50 rounded-lg sm:rounded-xl border border-slate-200">
                <Clock size={14} className="sm:size-4 text-blue-500" />
                <div className="text-xs sm:text-sm">
                  <span className="font-semibold text-slate-800 font-mono">
                    {currentTime}
                  </span>
                  <span className="text-xs text-slate-500 ml-0.5 sm:ml-1">
                    WIB
                  </span>
                </div>
              </div>
            </div>

            {/* Dark Mode Toggle */}
            {/* <motion.button
              onClick={toggleDarkMode}
              className="hidden sm:block p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              whileTap={{ scale: 0.9 }}
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </motion.button> */}

            {/* User Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <motion.button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 p-1.5 sm:p-2 rounded-xl hover:bg-slate-100 transition-colors"
                whileTap={{ scale: 0.95 }}
              >
                {/* Avatar */}
                <div className="relative">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl sm:rounded-2xl flex items-center justify-center text-white font-bold text-sm sm:text-base shadow-md">
                    {getInitials(user?.name)}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full border-2 border-white shadow-sm"></div>
                </div>

                {/* User info - Desktop only */}
                <div className="hidden lg:block text-left">
                  <p className="text-sm font-semibold text-slate-800 truncate max-w-[120px]">
                    {user?.name || "Petualang"}
                  </p>
                  <p className="text-xs text-slate-500 truncate max-w-[120px]">
                    {user?.email || "penjelajah@travel.com"}
                  </p>
                </div>

                {/* Dropdown arrow - Desktop only */}
                <ChevronDown
                  size={16}
                  className="hidden lg:block text-slate-400 transition-transform duration-200"
                  style={{
                    transform: isDropdownOpen
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                  }}
                />
              </motion.button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    className="absolute right-0 mt-2 w-64 sm:w-72 rounded-xl shadow-xl bg-white/95 backdrop-blur-md border border-slate-200/60 z-40 overflow-hidden"
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    {/* User Info Header */}
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-400 p-4 text-white">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                          <span className="font-bold text-lg">
                            {getInitials(user?.name)}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-sm">
                            {user?.name || "Petualang"}
                          </p>
                          <p className="text-xs text-blue-100 opacity-90">
                            {user?.email || "penjelajah@travel.com"}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-blue-200 mt-2">
                        ✈️ {user?.name?.split(" ")[0] || "Petualang"} Traveler
                      </p>
                    </div>

                    {/* Dropdown Menu Items */}
                    <div className="p-2">
                      <button
                        disabled
                        className="flex items-center w-full px-3 py-3 text-sm text-slate-400 rounded-lg cursor-not-allowed!"
                      >
                        <User size={16} className="mr-3 text-slate-300" />
                        Profil Saya
                        <span className="ml-auto text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded">
                          Soon
                        </span>
                      </button>

                      <button
                        disabled
                        className="flex items-center w-full px-3 py-3 text-sm text-slate-400 rounded-lg cursor-not-allowed!"
                      >
                        <Settings size={16} className="mr-3 text-slate-300" />
                        Pengaturan
                        <span className="ml-auto text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded">
                          Soon
                        </span>
                      </button>

                      {/* Theme Toggle in dropdown for mobile */}
                      {/* <button
                        onClick={toggleDarkMode}
                        className="sm:hidden flex items-center w-full px-3 py-3 text-sm text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                      >
                        {isDarkMode ? (
                          <Sun size={16} className="mr-3 text-slate-500" />
                        ) : (
                          <Moon size={16} className="mr-3 text-slate-500" />
                        )}
                        {isDarkMode ? "Mode Terang" : "Mode Gelap"}
                      </button> */}

                      <div className="border-t border-slate-200 mt-2 pt-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-3 py-3 text-sm text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          <LogOut size={16} className="mr-3" />
                          Keluar
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
