import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../utils/auth";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Plane,
  Mountain,
  Sun,
  MapPin,
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
    x: -100,
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

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await login(formData.email, formData.password);

    if (result.success) {
      navigate("/home");
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  // Background image URL - ganti dengan gambar lu nanti
  //   const backgroundImage = "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80";
  const backgroundImage = "/images/bg3.png";

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      className="min-h-screen flex relative overflow-hidden"
    >
      {/* Background Image dengan Blue Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      >
        {/* Blue Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-br from-blue-600/80 via-blue-700/80 to-blue-800/80"></div>

        {/* Additional Pattern Overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white rounded-full blur-xl"></div>
          <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-white rounded-full blur-lg"></div>
          <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-white rounded-full blur-2xl"></div>
        </div>

        {/* Floating Icons */}
        <motion.div
          variants={floatingAnimation}
          animate="animate"
          className="absolute top-20 left-20 text-white/20"
        >
          <Mountain size={60} />
        </motion.div>
        <motion.div
          variants={floatingAnimation}
          animate="animate"
          transition={{ delay: 1 }}
          className="absolute top-40 right-32 text-white/15"
        >
          <Sun size={80} />
        </motion.div>
        <motion.div
          variants={floatingAnimation}
          animate="animate"
          transition={{ delay: 2 }}
          className="absolute bottom-32 left-32 text-white/25"
        >
          <MapPin size={50} />
        </motion.div>
      </div>

      {/* Left Side - Form */}
      <motion.div
        variants={containerVariants}
        className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-20 xl:px-24 relative z-10"
      >
        <motion.div
          variants={containerVariants}
          className="max-w-md w-full space-y-8"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center">
            <motion.div
              className="flex justify-center"
              whileHover={{
                scale: 1.1,
                rotate: [0, -5, 5, 0],
                transition: { duration: 0.5 },
              }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl border border-white/30"
                whileHover={{
                  boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)",
                  background: [
                    "rgba(255,255,255,0.2)",
                    "rgba(255,255,255,0.3)",
                    "rgba(255,255,255,0.2)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Plane className="h-12 w-12 text-white" />
              </motion.div>
            </motion.div>
            <motion.h2
              variants={itemVariants}
              className="mt-8 text-4xl font-bold text-white"
            >
              Welcome Back
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="mt-4 text-lg text-blue-100"
            >
              Ready to continue your adventure?
            </motion.p>
          </motion.div>

          {/* Form */}
          <motion.form
            variants={itemVariants}
            className="mt-12 space-y-6"
            onSubmit={handleSubmit}
          >
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-red-500/20 backdrop-blur-sm border border-red-400/30 text-red-100 px-4 py-3 rounded-xl text-sm"
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-6">
              {/* Email Input */}
              <motion.div variants={itemVariants}>
                <motion.div
                  className="relative"
                  whileFocus={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-white/60" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="off"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full pl-12 pr-4 py-4 bg-white/20 border border-white/30 rounded-xl placeholder-white/60 text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/40 transition-all duration-300"
                    placeholder="Enter your email"
                  />
                </motion.div>
              </motion.div>

              {/* Password Input */}
              <motion.div variants={itemVariants}>
                <motion.div
                  className="relative"
                  whileFocus={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-white/60" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    autoComplete="off"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full pl-12 pr-12 py-4 bg-white/20 border border-white/30 rounded-xl placeholder-white/60 text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/40 transition-all duration-300"
                    placeholder="Enter your password"
                  />
                  <motion.button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-white/60 hover:text-white/80 transition-colors" />
                    ) : (
                      <Eye className="h-5 w-5 text-white/60 hover:text-white/80 transition-colors" />
                    )}
                  </motion.button>
                </motion.div>
              </motion.div>
            </div>

            {/* Submit Button */}
            <motion.div variants={itemVariants}>
              <motion.button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-4 px-6 border border-transparent text-lg font-semibold rounded-xl text-blue-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                whileHover={{
                  scale: loading ? 1 : 1.02,
                  boxShadow: "0 20px 40px rgba(255, 255, 255, 0.3)",
                }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="rounded-full h-6 w-6 border-b-2 border-blue-600"
                  ></motion.div>
                ) : (
                  <motion.span
                    animate={{
                      backgroundPosition: ["0%", "100%"],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                    className="bg-linear-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent"
                  >
                    Sign In
                  </motion.span>
                )}
              </motion.button>
            </motion.div>

            {/* Register Link */}
            <motion.div variants={itemVariants} className="text-center pt-6">
              <div className="text-white/80">
                Don't have an account?{" "}
                <motion.span className="inline-block">
                  <Link
                    to="/register"
                    className="font-semibold text-white hover:text-gray-200 transition-colors relative"
                  >
                    <motion.span
                      whileHover={{
                        scale: 1.05,
                        textShadow: "0 0 20px rgba(255,255,255,0.8)",
                      }}
                      className="relative"
                    >
                      Join the Adventure
                      <motion.div
                        className="absolute bottom-0 left-0 w-0 h-0.5 bg-white"
                        whileHover={{ width: "100%" }}
                        transition={{ duration: 0.3 }}
                      />
                    </motion.span>
                  </Link>
                </motion.span>
              </div>
            </motion.div>
          </motion.form>

          {/* Demo Credentials */}
          <motion.div
            variants={itemVariants}
            className="mt-8 p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20"
            whileHover={{
              scale: 1.02,
              boxShadow: "0 20px 40px rgba(255, 255, 255, 0.1)",
            }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <p className="text-white/80 text-center text-sm">
              <strong className="text-white">Demo credentials:</strong>
              <br />
              <motion.span
                animate={{
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                john@example.com / password123
              </motion.span>
            </p>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Right Side - Hero Content */}
      <motion.div
        initial={{ opacity: 0, x: 100 }}
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
            Your Journey
            <motion.br
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            />
            <motion.span
              className="bg-linear-to-r from-white to-blue-200 bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ["0%", "100%"],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              Begins Here
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="text-xl text-blue-100 mb-12 leading-relaxed"
          >
            Plan unforgettable adventures, create lasting memories, and explore
            the world one destination at a time.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.8 }}
            className="grid grid-cols-3 gap-8"
          >
            {[
              { icon: MapPin, text: "Discover Places" },
              { icon: Mountain, text: "Plan Trips" },
              { icon: Sun, text: "Create Memories" },
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
    </motion.div>
  );
};

export default Login;
