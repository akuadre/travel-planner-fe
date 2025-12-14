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
} from "lucide-react";
import { useAuth } from "../../utils/auth";

const Header = ({ isMobile, toggleSidebar }) => {
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
      "/home": "Dashboard Perjalanan",
      "/destinations": "Destinasi Saya",
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
      "/home": "Kelola dan lacak petualangan perjalananmu",
      "/destinations": "Buat dan atur destinasi impianmu",
      "/itineraries": "Rencanakan aktivitas dan jadwal perjalananmu",
      "/destinations/new": "Tambahkan destinasi baru ke rencana perjalananmu",
    };

    if (
      location.pathname.startsWith("/destinations/") &&
      location.pathname.includes("/edit")
    ) {
      return "Perbarui detail destinasi Anda";
    }

    return (
      descriptions[location.pathname] ||
      "Pendamping perencanaan perjalanan pribadimu"
    );
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

      const formattedDay = now.toLocaleDateString("id-ID", { weekday: "long" });
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

  // Responsive header height
  const headerHeight = isMobile ? "h-16" : "h-20";

  return (
    <header
      className={`
      fixed top-0 left-0 right-0 ${headerHeight} 
      bg-white/90 backdrop-blur-md z-30 shadow-sm border-b border-slate-200/60
      ${isMobile ? "pl-0 xl:pl-72" : "pl-0 xl:pl-72"}
    `}
    >
      <div className="flex justify-between items-center h-full px-4 xl:px-8">
        {/* Left section - Menu button for mobile + Title */}
        <div className="flex items-center gap-4">
          {isMobile && (
            <motion.button
              onClick={toggleSidebar}
              className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              whileTap={{ scale: 0.9 }}
            >
              <Menu size={24} />
            </motion.button>
          )}

          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-4"
          >
            <div>
              <h1 className="text-base md:text-lg lg:text-xl xl:text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                {" "}
                {/* 👈 text-base untuk mobile */}
                {getPageTitle()}
              </h1>
              {!isMobile && (
                <p className="text-sm text-slate-500 mt-1">
                  {getPageDescription()}
                </p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Right Section - Time, Date & User */}
        <div className="flex items-center gap-3">
          {/* Date & Time Display - Responsive */}
          {!isMobile && (
            <motion.div
              className="hidden md:flex items-center gap-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Waktu Card */}
              <motion.div
                className="hidden md:flex items-center gap-3 bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl px-4 py-2.5 border border-slate-200/60 shadow-sm"
                whileHover={{ scale: 1.02 }}
              >
                <Clock size={18} className="text-blue-500" />
                <div className="text-right">
                  <p className="font-semibold text-slate-700 text-sm font-mono">
                    {currentTime}{" "}
                    <span className="text-xs text-slate-500">WIB</span>
                  </p>
                </div>
              </motion.div>

              {/* Tanggal Card */}
              <div className="hidden lg:flex items-center gap-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl px-4 py-2.5 border border-blue-100/60 shadow-sm">
                <CalendarIcon size={18} className="text-blue-500" />
                <div className="text-right">
                  <p className="font-semibold text-slate-800 text-sm">
                    {currentDay}
                  </p>
                  <p className="text-xs text-slate-600">{currentDate}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Mobile time display */}
          {isMobile && (
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Clock size={16} className="text-blue-500" />
              <span className="font-mono">{currentTime}</span>
            </div>
          )}

          {/* Dark Mode Toggle */}
          <motion.button
            onClick={toggleDarkMode}
            className="hidden sm:block p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </motion.button>

          {/* User Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <motion.button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 p-2 rounded-2xl hover:bg-slate-100/80 transition-all duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="hidden sm:block text-right">
                <p className="font-semibold text-sm text-slate-800">
                  {isMobile
                    ? getInitials(user?.name)
                    : user?.name || "Petualang"}
                </p>
                {!isMobile && (
                  <p className="text-xs text-slate-500">
                    {user?.email || "Penjelajah"}
                  </p>
                )}
              </div>

              {/* Avatar */}
              <div className="relative">
                <div className="w-9 h-9 xl:w-11 xl:h-11 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {getInitials(user?.name)}
                </div>
                {!isMobile && (
                  <motion.div
                    className="absolute -bottom-1 -right-1 w-3 h-3 xl:w-4 xl:h-4 bg-green-400 rounded-full border-2 border-white shadow"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </div>

              {!isMobile && (
                <motion.div
                  animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown size={18} className="text-slate-400" />
                </motion.div>
              )}
            </motion.button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  className="absolute right-0 mt-2 xl:mt-3 w-64 xl:w-72 rounded-2xl shadow-xl bg-white/95 backdrop-blur-md border border-slate-200/60 z-40 overflow-hidden"
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  {/* Header dengan gradient */}
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-400 p-4 text-white">
                    <p className="font-semibold text-sm">
                      {user?.name || "Petualang"}
                    </p>
                    <p className="text-xs text-blue-100 opacity-90">
                      {user?.email || "Penjelajah"}
                    </p>
                    <p className="text-xs text-blue-200 mt-1">
                      ✈️ Pecinta Perjalanan
                    </p>
                  </div>

                  <div className="p-2">
                    <Link
                      to="/profile"
                      className="flex items-center w-full px-3 py-3 text-sm text-slate-700 rounded-lg hover:bg-slate-100/80 transition-colors group"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <User
                        size={18}
                        className="mr-3 text-slate-500 group-hover:text-blue-500"
                      />
                      Profil Saya
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center w-full px-3 py-3 text-sm text-slate-700 rounded-lg hover:bg-slate-100/80 transition-colors group"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <Settings
                        size={18}
                        className="mr-3 text-slate-500 group-hover:text-blue-500"
                      />
                      Pengaturan
                    </Link>

                    <div className="border-t border-slate-200/60 mt-2 pt-2">
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-3 py-3 text-sm text-red-600 rounded-lg hover:bg-red-50/80 transition-colors group"
                      >
                        <LogOut
                          size={18}
                          className="mr-3 group-hover:scale-110 transition-transform"
                        />
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
    </header>
  );
};

export default Header;
