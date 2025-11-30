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
  Navigation,
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

  // Navigation structure dengan exact matching - BAHASA INDONESIA
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
      label: "Destinasi",
      sub: [
        { 
          path: "/destinations", 
          label: "Semua Destinasi", 
          icon: Compass,
          exact: true
        },
        { 
          path: "/destinations/new", 
          label: "Tambah Baru", 
          icon: Plus,
          exact: true
        },
      ],
      type: "dropdown",
    },
    {
      key: "itineraries",
      icon: Calendar,
      label: "Rencana Perjalanan", 
      href: "/itineraries",
      type: "single",
    },
  ];

  // Styling functions dengan warna biru yang lebih natural
  const getLinkClass = ({ isActive }) =>
    `relative flex items-center justify-between w-full p-3 px-4 rounded-xl transition-all duration-300 ease-out group border ${
      isActive
        ? "bg-blue-600/20 text-white border-blue-500/30 shadow-lg shadow-blue-600/20"
        : "text-blue-100 border-transparent hover:bg-blue-700/20 hover:text-white hover:border-blue-500/20"
    }`;

  const getSubLinkClass = ({ isActive }) =>
    `relative flex items-center w-full text-sm p-2.5 px-4 rounded-lg transition-all duration-200 mx-2 ${
      isActive
        ? "text-white font-semibold bg-blue-600/30 shadow-md shadow-blue-600/20"
        : "text-blue-200 hover:bg-blue-700/20 hover:text-blue-50"
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
    <aside className="fixed top-0 left-0 w-72 h-full bg-gradient-to-b from-slate-800 via-blue-900/80 to-slate-800 flex flex-col z-40 border-r border-slate-700/50 shadow-2xl">
      {/* App Header yang lebih natural */}
      <motion.div
        className="relative px-6 py-6 bg-gradient-to-r from-blue-800 to-blue-700 border-b border-blue-600/30"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Subtle Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-20 h-20 bg-blue-400 rounded-full -translate-y-10 translate-x-10"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-blue-300 rounded-full translate-y-8 -translate-x-8"></div>
        </div>

        <div className="relative z-10 flex items-center gap-4">
          <motion.div
            className="p-3 bg-white/10 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/10"
            whileHover={{
              scale: 1.05,
              transition: { type: "spring", stiffness: 300 },
            }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="relative">
              <img
                src="/images/icon.png"
                className="w-7 h-7 transition-transform duration-300"
                alt="Travel Planner Logo"
              />
            </div>
          </motion.div>

          <div className="flex-1">
            <Link
              to="/home"
              className="block group"
            >
              <motion.h1 
                className="text-xl font-bold text-white tracking-tight mb-1"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                Travel Planner
              </motion.h1>
              <motion.p 
                className="text-blue-200 text-xs"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Rencanakan Petualanganmu
              </motion.p>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-5 space-y-3 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <p className="px-3 py-2 text-xs font-semibold text-blue-300 uppercase tracking-wider flex items-center gap-2">
            <Navigation className="h-3 w-3" />
            Navigasi
          </p>
        </motion.div>

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
                  transition={{ delay: index * 0.1 + 0.5 }}
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
                              scale: isActive ? 1.1 : 1,
                            }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <Icon
                              size={20}
                              className={
                                isActive ? "text-white" : "text-blue-300"
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
              {/* const hasActiveSubItem = item.sub.some(subItem => 
                location.pathname === subItem.path
              ); */}
              const hasActiveSubItem = location.pathname.startsWith(`/${item.key}`);

              return (
                <motion.div
                  key={item.key}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.1 + 0.5 }}
                  className="space-y-2"
                >
                  <button
                    onClick={() => handleMenuToggle(item.key)}
                    className={`relative flex items-center justify-between w-full p-3 px-4 rounded-xl transition-all duration-300 ease-out group border ${
                      hasActiveSubItem
                        ? "bg-blue-600/20 text-white border-blue-500/30 shadow-lg shadow-blue-600/20"
                        : "text-blue-100 border-transparent hover:bg-blue-700/20 hover:text-white hover:border-blue-500/20"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <Icon 
                        size={20} 
                        className={hasActiveSubItem ? "text-white" : "text-blue-300"} 
                      />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    <motion.div
                      animate={{ rotate: openMenus[item.key] ? 90 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronRight 
                        size={16} 
                        className={hasActiveSubItem ? "text-white" : "text-blue-300"} 
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
                                  end={subItem.exact}
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
        className="p-5 border-t border-slate-700/50 bg-slate-800/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              className="relative"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                {user?.name?.charAt(0).toUpperCase() || "P"}
              </div>
            </motion.div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {user?.name || "Petualang"}
              </p>
              <p className="text-xs text-blue-300 truncate">
                {user?.email || "petualang@travel.com"}
              </p>
            </div>
          </div>
          <motion.button
            onClick={logout}
            className="p-2 text-blue-300 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200"
            title="Keluar"
            whileHover={{
              scale: 1.1,
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