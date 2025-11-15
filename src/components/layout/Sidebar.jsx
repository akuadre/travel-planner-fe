import React, { useState, useEffect } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  MapPin,
  Calendar,
  Plane,
  ChevronRight,
  LogOut,
  Plus,
  Compass,
} from "lucide-react";
import { useAuth } from "../../utils/auth";

const Sidebar = () => {
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState({});
  const { logout, user } = useAuth();

  useEffect(() => {
    const path = location.pathname;
    const newOpenMenus = {};

    // Auto-expand menu berdasarkan halaman aktif
    if (path.startsWith("/destinations")) {
      newOpenMenus.destinations = true;
    }

    setOpenMenus(newOpenMenus);
  }, [location.pathname]);

  const handleMenuToggle = (menu) => {
    setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  // Navigation structure dengan exact matching
  const navigation = [
    {
      key: "dashboard",
      icon: Home,
      label: "Dashboard",
      href: "/home",
      type: "single",
    },
    {
      key: "destinations",
      icon: MapPin,
      label: "Destinations",
      sub: [
        { 
          path: "/destinations", 
          label: "All Destinations", 
          icon: Compass,
          exact: true // Exact match untuk /destinations
        },
        { 
          path: "/destinations/new", 
          label: "Add New", 
          icon: Plus,
          exact: true // Exact match untuk /destinations/new
        },
      ],
      type: "dropdown",
    },
    {
      key: "itineraries",
      icon: Calendar,
      label: "Itineraries", 
      href: "/itineraries",
      type: "single",
    },
  ];

  // Styling functions
  const getLinkClass = ({ isActive }) =>
    `relative flex items-center justify-between w-full p-3 px-4 rounded-xl transition-all duration-300 ease-out group border ${
      isActive
        ? "bg-blue-500/15 text-blue-100 border-blue-400/30 shadow-lg shadow-blue-500/20"
        : "text-gray-300 border-transparent hover:bg-white/5 hover:text-white hover:border-blue-400/20"
    }`;

  const getSubLinkClass = ({ isActive }) =>
    `relative flex items-center w-full text-sm p-2.5 px-4 rounded-lg transition-all duration-200 mx-2 ${
      isActive
        ? "text-blue-300 font-semibold bg-blue-500/20 shadow-md shadow-blue-500/10"
        : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
    }`;

  const dropdownVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.2 },
    },
  };

  return (
    <aside className="fixed top-0 left-0 w-72 h-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex flex-col z-40 border-r border-slate-700/50 shadow-2xl">
      {/* App Header */}
      <motion.div
        className="flex items-center gap-4 px-6 py-6 border-b border-slate-700/50 bg-slate-800/30"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="p-3 bg-sky-200 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
          whileHover={{
            scale: 1.1,
            rotate: 5,
            transition: { type: "spring", stiffness: 300 },
          }}
        >
          <img
            src="/images/icon.png"
            className="w-7 h-7 transition-colors duration-300 hover:brightness-125"
          />
        </motion.div>

        <div>
          <Link
            to="/home"
            className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent tracking-tight hover:from-blue-300 hover:to-cyan-200 transition-all"
          >
            Travel Planner
          </Link>
          <p className="text-xs text-slate-400 mt-1">Plan Your Adventures</p>
        </div>
      </motion.div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-5 space-y-3 overflow-y-auto">
        <p className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Navigation
        </p>

        <div className="space-y-2">
          {navigation.map((item, index) => {
            const Icon = item.icon;

            if (item.type === "single") {
              return (
                <motion.div
                  key={item.key}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.1 }}
                >
                  <NavLink
                    to={item.href}
                    className={getLinkClass}
                  >
                    {({ isActive }) => (
                      <>
                        <div className="flex items-center gap-4">
                          <motion.div
                            animate={{
                              scale: isActive ? 1.2 : 1,
                              rotate: isActive ? 5 : 0,
                            }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <Icon
                              size={20}
                              className={
                                isActive ? "text-blue-300" : "text-slate-400"
                              }
                            />
                          </motion.div>
                          <span className="font-medium">{item.label}</span>
                        </div>
                        {isActive && (
                          <motion.div
                            className="w-2 h-2 bg-blue-400 rounded-full"
                            layoutId="activeDot"
                            transition={{
                              type: "spring",
                              stiffness: 500,
                              damping: 30,
                            }}
                          />
                        )}
                      </>
                    )}
                  </NavLink>
                </motion.div>
              );
            }

            if (item.type === "dropdown") {
              // Check jika ada sub-item yang active
              const hasActiveSubItem = item.sub.some(subItem => 
                location.pathname === subItem.path
              );

              return (
                <motion.div
                  key={item.key}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.1 }}
                  className="space-y-2"
                >
                  <button
                    onClick={() => handleMenuToggle(item.key)}
                    className={`relative flex items-center justify-between w-full p-3 px-4 rounded-xl transition-all duration-300 ease-out group border ${
                      hasActiveSubItem
                        ? "bg-blue-500/10 text-blue-100 border-blue-400/20"
                        : "text-gray-300 border-transparent hover:bg-white/5 hover:text-white hover:border-blue-400/20"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <Icon 
                        size={20} 
                        className={hasActiveSubItem ? "text-blue-300" : "text-slate-400"} 
                      />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    <motion.div
                      animate={{ rotate: openMenus[item.key] ? 90 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronRight 
                        size={16} 
                        className={hasActiveSubItem ? "text-blue-300" : "text-slate-400"} 
                      />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {openMenus[item.key] && (
                      <motion.div
                        variants={dropdownVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="overflow-hidden"
                      >
                        <div className="space-y-1.5 mt-1">
                          {item.sub.map((subItem, subIndex) => {
                            const SubIcon = subItem.icon;
                            return (
                              <motion.div
                                key={subItem.path}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: subIndex * 0.1 }}
                              >
                                <NavLink
                                  to={subItem.path}
                                  end={subItem.exact} // 🔑 INI YANG PENTING - exact matching
                                  className={getSubLinkClass}
                                >
                                  <SubIcon size={16} className="mr-3" />
                                  <span>{subItem.label}</span>
                                </NavLink>
                              </motion.div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            }

            return null;
          })}
        </div>
      </nav>

      {/* User Info & Logout */}
      <motion.div
        className="p-5 border-t border-slate-700/50 bg-slate-800/30 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              {user?.name?.charAt(0).toUpperCase() || "T"}
            </motion.div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {user?.name || "Traveler"}
              </p>
              <p className="text-xs text-slate-400 truncate">
                {user?.email || "explorer@travel.com"}
              </p>
            </div>
          </div>
          <motion.button
            onClick={logout}
            className="p-2.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-200 border border-transparent hover:border-red-500/20"
            title="Logout"
            whileHover={{
              scale: 1.1,
              backgroundColor: "rgba(239, 68, 68, 0.1)",
            }}
            whileTap={{ scale: 0.9 }}
          >
            <LogOut size={18} />
          </motion.button>
        </div>
      </motion.div>
    </aside>
  );
};

export default Sidebar;