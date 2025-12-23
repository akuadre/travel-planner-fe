import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../utils/auth";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Plane,
  Mountain,
  Sun,
  MapPin,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { motion } from "framer-motion";

// Shared animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.8,
      staggerChildren: 0.15,
    },
  },
  exit: {
    opacity: 0,
    x: 100,
    transition: {
      duration: 0.6,
      ease: "easeInOut",
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

const floatingAnimation = {
  animate: {
    y: [0, -15, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const Register = () => {
  const [isMobile, setIsMobile] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [bgLoaded, setBgLoaded] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Background image - tetap sama
  const baseUrl =
    import.meta.env.BASE_URL && import.meta.env.BASE_URL !== "/"
      ? import.meta.env.BASE_URL
      : "/";
  const backgroundImage = `${baseUrl}images/bg5.png`;

  // Preload background image
  useEffect(() => {
    const img = new Image();
    img.src = backgroundImage;
    img.onload = () => setBgLoaded(true);
  }, [backgroundImage]);

  // 🔥 VALIDATION RULES
  const validationRules = {
    name: (value) => {
      if (!value.trim()) return "Full name is required";
      if (value.trim().length < 6)
        return "Full name must be at least 6 characters";
      return "";
    },
    email: (value) => {
      if (!value.trim()) return "Email is required";
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) return "Please enter a valid email address";
      return "";
    },
    password: (value) => {
      if (!value.trim()) return "Password is required";
      if (value.length < 8) return "Password must be at least 8 characters";
      return "";
    },
    confirmPassword: (value) => {
      if (!value.trim()) return "Please confirm your password";
      if (value !== formData.password) return "Passwords do not match";
      return "";
    },
  };

  // 🔥 REAL-TIME VALIDATION
  useEffect(() => {
    const newErrors = {};
    Object.keys(formData).forEach((field) => {
      if (touched[field] || formData[field]) {
        const error = validationRules[field](formData[field]);
        newErrors[field] = error;
      }
    });
    setErrors(newErrors);
    // }, [formData, touched]);
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  };

  const handleFocus = (e) => {
    const { name } = e.target;
    if (!touched[name]) {
      setTouched((prev) => ({
        ...prev,
        [name]: true,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    Object.keys(formData).forEach((field) => {
      const error = validationRules[field](formData[field]);
      newErrors[field] = error;
      if (error) isValid = false;
    });

    setErrors(newErrors);
    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setError("Please fix the errors in the form");
      return;
    }

    setLoading(true);
    setError("");

    const result = await register(
      formData.name,
      formData.email,
      formData.password
    );

    if (result.success) {
      navigate("/home");
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  // Helper functions
  const getFieldStatus = (fieldName) => {
    const value = formData[fieldName];
    const isTouched = touched[fieldName];
    const error = errors[fieldName];

    if (!isTouched && !value) return "neutral";
    if (error) return "error";
    if (value && !error) return "success";
    return "neutral";
  };

  const getInputClasses = (fieldName) => {
    const status = getFieldStatus(fieldName);
    const baseClasses =
      "block w-full pl-12 pr-16 sm:pr-20 py-3 sm:py-4 bg-white/20 border rounded-xl placeholder-white/60 text-white focus:outline-none focus:ring-2 transition-all duration-300";

    switch (status) {
      case "error":
        return `${baseClasses} border-red-400/50 focus:ring-red-500/50 focus:border-red-400`;
      case "success":
        return `${baseClasses} border-green-400/50 focus:ring-green-500/50 focus:border-green-400`;
      default:
        return `${baseClasses} border-white/30 focus:ring-white/50 focus:border-white/40`;
    }
  };

  const getIconColor = (fieldName) => {
    const status = getFieldStatus(fieldName);
    switch (status) {
      case "error":
        return "text-red-400";
      case "success":
        return "text-green-400";
      default:
        return "text-white/60";
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      className="min-h-screen flex relative overflow-hidden"
    >
      {/* Background - OPTIMIZED FOR MOBILE */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          {/* 🔥 STATIC BACKGROUND DI MOBILE, PARALLAX HANYA DI DESKTOP */}
          {!isMobile ? (
            <motion.div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: bgLoaded ? `url(${backgroundImage})` : "none",
                backgroundSize: "cover",
                minWidth: "100%",
                minHeight: "100%",
              }}
              animate={
                bgLoaded
                  ? {
                      x: ["0%", "1%", "0%", "-1%", "0%"],
                      y: ["0%", "0.5%", "0%", "-0.5%", "0%"],
                      scale: [1, 1.01, 1, 1.005, 1],
                    }
                  : {}
              }
              transition={
                bgLoaded
                  ? {
                      duration: 30,
                      repeat: Infinity,
                      ease: "linear",
                    }
                  : {}
              }
            />
          ) : (
            // ✅ MOBILE: STATIC BACKGROUND SAJA
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: bgLoaded ? `url(${backgroundImage})` : "none",
                backgroundSize: "cover",
                minWidth: "100%",
                minHeight: "100%",
              }}
            />
          )}

          {/* Fallback gradient saat gambar belum load */}
          {!bgLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-green-600/80 via-green-700/80 to-green-800/80" />
          )}
        </div>

        {/* Green Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-600/80 via-green-700/80 to-green-800/80"></div>

        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-white rounded-full blur-xl"></div>
          <div className="absolute top-3/4 left-1/4 w-24 h-24 bg-white rounded-full blur-lg"></div>
          <div className="absolute top-1/2 right-1/2 w-40 h-40 bg-white rounded-full blur-2xl"></div>
        </div>

        {/* 🔥 FLOATING ICONS HANYA DI DESKTOP */}
        {!isMobile && (
          <>
            <motion.div
              variants={floatingAnimation}
              animate="animate"
              className="absolute top-20 right-20 text-white/20"
            >
              <Mountain size={60} />
            </motion.div>
            <motion.div
              variants={floatingAnimation}
              animate="animate"
              transition={{ delay: 1 }}
              className="absolute top-40 left-32 text-white/15"
            >
              <Sun size={80} />
            </motion.div>
            <motion.div
              variants={floatingAnimation}
              animate="animate"
              transition={{ delay: 2 }}
              className="absolute bottom-32 right-32 text-white/25"
            >
              <MapPin size={50} />
            </motion.div>
          </>
        )}
      </div>

      {/* Left Side - Hero Content (HIDDEN DI MOBILE) */}
      {!isMobile && (
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="hidden lg:flex flex-1 relative z-10 items-center justify-center"
        >
          <div className="text-center text-white max-w-2xl px-12">
            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="text-6xl font-bold mb-8 leading-tight"
            >
              Start Your
              <motion.br
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
              />
              <motion.span
                className="bg-linear-to-r from-white to-green-200 bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ["0%", "100%"],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              >
                Adventure
              </motion.span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="text-xl text-green-100 mb-12 leading-relaxed"
            >
              Join our community of travelers and start planning your dream
              vacations with ease and style.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4, duration: 0.8 }}
              className="grid grid-cols-3 gap-8"
            >
              {[
                { icon: User, text: "Create Profile" },
                { icon: MapPin, text: "Save Destinations" },
                { icon: Sun, text: "Share Memories" },
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.text}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.6 + index * 0.2, duration: 0.6 }}
                    className="text-center"
                    whileHover={{
                      y: -10,
                      transition: { type: "spring", stiffness: 300 },
                    }}
                  >
                    <motion.div
                      className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl border border-white/30 inline-block mb-3"
                      whileHover={{
                        rotate: 360,
                        transition: { duration: 0.8 },
                      }}
                    >
                      <Icon className="h-8 w-8 text-white" />
                    </motion.div>
                    <p className="text-white/90 font-medium">{item.text}</p>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* Right Side - Form */}
      <motion.div
        variants={containerVariants}
        className="flex-1 flex items-center justify-center px-6 py-8 sm:px-8 md:px-12 lg:px-20 xl:px-24 relative z-10"
      >
        <motion.div
          variants={containerVariants}
          className="max-w-md w-full space-y-8"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center">
            <motion.div
              className="flex justify-center"
              whileHover={
                !isMobile ? { scale: 1.1, rotate: [0, -5, 5, 0] } : {}
              }
              whileTap={!isMobile ? { scale: 0.95 } : {}}
            >
              <motion.div
                className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl border border-white/30"
                whileHover={
                  !isMobile
                    ? { boxShadow: "0 20px 40px rgba(34, 197, 94, 0.3)" }
                    : {}
                }
              >
                <Plane className="h-12 w-12 text-white" />
              </motion.div>
            </motion.div>
            <motion.h2
              variants={itemVariants}
              className="mt-6 text-3xl sm:text-4xl font-bold text-white"
            >
              Join Us
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="mt-3 text-base sm:text-lg text-green-100"
            >
              Create your account and start exploring
            </motion.p>
          </motion.div>

          {/* Form */}
          <motion.form
            variants={itemVariants}
            className="mt-8 sm:mt-10 space-y-5 sm:space-y-6"
            onSubmit={handleSubmit}
          >
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-red-500/20 backdrop-blur-sm border border-red-400/30 text-red-100 px-4 py-3 rounded-xl text-sm flex items-center gap-2"
              >
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </motion.div>
            )}

            <div className="space-y-6">
              {/* Name Input */}
              <div>
                <motion.div
                  className="relative"
                  whileFocus={!isMobile ? { scale: 1.02 } : {}}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className={`h-5 w-5 ${getIconColor("name")}`} />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="off"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onFocus={handleFocus}
                    className={getInputClasses("name")}
                    placeholder="Enter your full name"
                  />

                  {/* Status Icon */}
                  <div className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center pointer-events-none">
                    {getFieldStatus("name") === "success" && (
                      <CheckCircle className="h-5 w-5 text-green-400" />
                    )}
                    {getFieldStatus("name") === "error" && (
                      <XCircle className="h-5 w-5 text-red-400" />
                    )}
                  </div>
                </motion.div>

                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {!formData.name && touched.name && (
                      <>
                        <span className="text-xs text-red-300">•</span>
                        <span className="text-xs text-red-300">Required</span>
                      </>
                    )}
                  </div>
                  {errors.name && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs sm:text-sm text-red-300 text-right"
                    >
                      {errors.name}
                    </motion.p>
                  )}
                </div>

                {/* Character counter */}
                {formData.name && (
                  <div className="mt-1 text-xs sm:text-sm text-white/60 text-right">
                    {formData.name.length}/6 characters minimum
                  </div>
                )}
              </div>

              {/* Email Input */}
              <div>
                <motion.div
                  className="relative"
                  whileFocus={!isMobile ? { scale: 1.02 } : {}}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className={`h-5 w-5 ${getIconColor("email")}`} />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="off"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onFocus={handleFocus}
                    className={getInputClasses("email")}
                    placeholder="Enter your email"
                  />

                  {/* Status Icon */}
                  <div className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center pointer-events-none">
                    {getFieldStatus("email") === "success" && (
                      <CheckCircle className="h-5 w-5 text-green-400" />
                    )}
                    {getFieldStatus("email") === "error" && (
                      <XCircle className="h-5 w-5 text-red-400" />
                    )}
                  </div>
                </motion.div>

                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {!formData.email && touched.email && (
                      <>
                        <span className="text-xs text-red-300">•</span>
                        <span className="text-xs text-red-300">Required</span>
                      </>
                    )}
                  </div>
                  {errors.email && (
                    <motion.p className="text-xs sm:text-sm text-red-300 text-right">
                      {errors.email}
                    </motion.p>
                  )}
                </div>

                {/* Email format hint */}
                {formData.email && !errors.email && (
                  <div className="mt-1 text-xs text-green-300 text-right">
                    ✓ Valid email format
                  </div>
                )}
              </div>

              {/* Password Input */}
              <div>
                <motion.div
                  className="relative"
                  whileFocus={!isMobile ? { scale: 1.02 } : {}}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className={`h-5 w-5 ${getIconColor("password")}`} />
                  </div>

                  <input
                    id="password"
                    name="password"
                    autoComplete="off"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onFocus={handleFocus}
                    className="block w-full pl-12 pr-20 py-4 bg-white/20 border rounded-xl placeholder-white/60 text-white focus:outline-none focus:ring-2 transition-all duration-300"
                    placeholder="Create a password (min. 8 characters)"
                    style={{
                      borderColor:
                        getFieldStatus("password") === "error"
                          ? "rgba(248, 113, 113, 0.5)"
                          : getFieldStatus("password") === "success"
                          ? "rgba(74, 222, 128, 0.5)"
                          : "rgba(255, 255, 255, 0.3)",
                      boxShadow:
                        getFieldStatus("password") === "error"
                          ? "0 0 0 2px rgba(248, 113, 113, 0.3)"
                          : getFieldStatus("password") === "success"
                          ? "0 0 0 2px rgba(74, 222, 128, 0.3)"
                          : "none",
                    }}
                  />

                  {/* Status Icon */}
                  <div className="absolute inset-y-0 right-10 sm:right-12 pr-2 sm:pr-3 flex items-center pointer-events-none">
                    {getFieldStatus("password") === "success" && (
                      <CheckCircle className="h-5 w-5 text-green-400" />
                    )}
                    {getFieldStatus("password") === "error" && (
                      <XCircle className="h-5 w-5 text-red-400" />
                    )}
                  </div>

                  {/* Show/Hide Button */}
                  <motion.button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                    whileHover={!isMobile ? { scale: 1.1 } : {}}
                    whileTap={!isMobile ? { scale: 0.9 } : {}}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-white/60 hover:text-white/80" />
                    ) : (
                      <Eye className="h-5 w-5 text-white/60 hover:text-white/80" />
                    )}
                  </motion.button>
                </motion.div>

                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {!formData.password && touched.password && (
                      <>
                        <span className="text-xs text-red-300">•</span>
                        <span className="text-xs text-red-300">Required</span>
                      </>
                    )}
                  </div>
                  {errors.password && (
                    <motion.p className="text-xs sm:text-sm text-red-300 text-right">
                      {errors.password}
                    </motion.p>
                  )}
                </div>

                {/* Password strength indicator */}
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs sm:text-sm text-white/60">
                        Password strength:
                      </span>
                      <span
                        className={`text-xs font-medium ${
                          formData.password.length >= 8
                            ? "text-green-400"
                            : "text-yellow-400"
                        }`}
                      >
                        {formData.password.length >= 8 ? "Strong" : "Weak"}
                      </span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          formData.password.length >= 8
                            ? "bg-green-400 w-full"
                            : formData.password.length >= 4
                            ? "bg-yellow-400 w-2/3"
                            : "bg-red-400 w-1/3"
                        }`}
                      />
                    </div>
                    <div className="mt-1 text-xs sm:text-sm text-white/60 text-right">
                      {formData.password.length}/8 characters
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password Input */}
              <div>
                <motion.div
                  className="relative"
                  whileFocus={!isMobile ? { scale: 1.02 } : {}}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock
                      className={`h-5 w-5 ${getIconColor("confirmPassword")}`}
                    />
                  </div>

                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    autoComplete="off"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onFocus={handleFocus}
                    className="block w-full pl-12 pr-20 py-4 bg-white/20 border rounded-xl placeholder-white/60 text-white focus:outline-none focus:ring-2 transition-all duration-300"
                    placeholder="Confirm your password"
                    style={{
                      borderColor:
                        getFieldStatus("confirmPassword") === "error"
                          ? "rgba(248, 113, 113, 0.5)"
                          : getFieldStatus("confirmPassword") === "success"
                          ? "rgba(74, 222, 128, 0.5)"
                          : "rgba(255, 255, 255, 0.3)",
                      boxShadow:
                        getFieldStatus("confirmPassword") === "error"
                          ? "0 0 0 2px rgba(248, 113, 113, 0.3)"
                          : getFieldStatus("confirmPassword") === "success"
                          ? "0 0 0 2px rgba(74, 222, 128, 0.3)"
                          : "none",
                    }}
                  />

                  {/* Status Icon */}
                  <div className="absolute inset-y-0 right-10 sm:right-12 pr-2 sm:pr-3 flex items-center pointer-events-none">
                    {getFieldStatus("confirmPassword") === "success" && (
                      <CheckCircle className="h-5 w-5 text-green-400" />
                    )}
                    {getFieldStatus("confirmPassword") === "error" && (
                      <XCircle className="h-5 w-5 text-red-400" />
                    )}
                  </div>

                  {/* Show/Hide Button */}
                  <motion.button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    whileHover={!isMobile ? { scale: 1.1 } : {}}
                    whileTap={!isMobile ? { scale: 0.9 } : {}}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-white/60 hover:text-white/80" />
                    ) : (
                      <Eye className="h-5 w-5 text-white/60 hover:text-white/80" />
                    )}
                  </motion.button>
                </motion.div>

                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {!formData.confirmPassword && touched.confirmPassword && (
                      <>
                        <span className="text-xs text-red-300">•</span>
                        <span className="text-xs text-red-300">Required</span>
                      </>
                    )}
                  </div>
                  {errors.confirmPassword && (
                    <motion.p className="text-xs sm:text-sm text-red-300 text-right">
                      {errors.confirmPassword}
                    </motion.p>
                  )}
                </div>

                {/* Password match indicator */}
                {/* {formData.password && formData.confirmPassword && (
                  <div className="mt-1">
                    {formData.password === formData.confirmPassword ? (
                      <div className="text-xs text-green-300 text-right flex items-center justify-end gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Passwords match
                      </div>
                    ) : (
                      <div className="text-xs sm:text-sm text-red-300 text-right flex items-center justify-end gap-1">
                        <XCircle className="h-3 w-3" />
                        Passwords don't match
                      </div>
                    )}
                  </div>
                )} */}
              </div>
            </div>

            {/* Submit Button */}
            <motion.div variants={itemVariants}>
              <motion.button
                type="submit"
                disabled={
                  loading || Object.values(errors).some((error) => error)
                }
                className="group relative w-full flex justify-center py-3 sm:py-4 px-6 border border-transparent text-base sm:text-lg font-semibold rounded-xl text-green-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                whileHover={
                  !isMobile && !loading
                    ? {
                        scale: 1.02,
                        boxShadow: "0 20px 40px rgba(255, 255, 255, 0.3)",
                      }
                    : {}
                }
                whileTap={!isMobile ? { scale: 0.98 } : {}}
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="rounded-full h-6 w-6 border-b-2 border-green-600"
                  />
                ) : (
                  <span>Create Account</span>
                )}
              </motion.button>
            </motion.div>

            {/* Login Link */}
            <motion.div variants={itemVariants} className="text-center pt-6">
              <div className="text-white/80">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-white hover:text-gray-200 transition-colors underline"
                >
                  Sign In Here
                </Link>
              </div>
            </motion.div>
          </motion.form>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Register;
