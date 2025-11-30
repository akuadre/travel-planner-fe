import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Award,
  Target,
  Zap,
  Globe,
  Clock,
  DollarSign,
  Calendar,
  Compass,
  Navigation,
  ChevronRight,
  Play,
  Pause,
  Plane,
  MapPin,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  destinationService,
  STORAGE_BASE_URL,
} from "../services/destinationService";

// 🔥 Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 10, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
  hover: {
    y: -5,
    scale: 1.02,
    transition: {
      duration: 0.2,
      ease: "easeInOut",
    },
  },
};

// Skeleton Components
const StoryCarouselSkeleton = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="relative h-80 rounded-3xl overflow-hidden mb-8 bg-gray-200 animate-pulse"
  >
    <div className="absolute bottom-0 left-0 right-0 p-8">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-16 h-6 bg-gray-300 rounded-full"></div>
        <div className="w-24 h-4 bg-gray-300 rounded-full"></div>
      </div>
      <div className="w-1/3 h-8 bg-gray-300 rounded-lg mb-2"></div>
      <div className="w-2/5 h-4 bg-gray-300 rounded-lg mb-4"></div>
      <div className="w-32 h-10 bg-gray-300 rounded-xl"></div>
    </div>
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-4">
      <div className="flex gap-2">
        {[1, 2, 3, 4].map((index) => (
          <div key={index} className="w-2 h-2 bg-gray-300 rounded-full"></div>
        ))}
      </div>
      <div className="flex gap-2">
        <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
        <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
      </div>
    </div>
  </motion.div>
);

const QuickStatsSkeleton = () => (
  <motion.div
    variants={containerVariants}
    initial="hidden"
    animate="visible"
    className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
  >
    {[1, 2, 3, 4].map((index) => (
      <motion.div
        key={index}
        variants={itemVariants}
        className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm"
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="w-16 h-8 bg-gray-200 rounded-lg mb-2 animate-pulse"></div>
            <div className="w-20 h-4 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
          <div className="w-12 h-12 bg-gray-200 rounded-xl animate-pulse"></div>
        </div>
      </motion.div>
    ))}
  </motion.div>
);

const TripSectionSkeleton = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm"
  >
    <div className="w-40 h-6 bg-gray-200 rounded-lg mb-6 animate-pulse"></div>
    <div className="space-y-4">
      {[1, 2, 3].map((index) => (
        <div
          key={index}
          className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 animate-pulse"
        >
          <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
          <div className="flex-1 space-y-2">
            <div className="w-32 h-4 bg-gray-200 rounded-lg"></div>
            <div className="w-40 h-3 bg-gray-200 rounded-lg"></div>
          </div>
          <div className="w-20 h-4 bg-gray-200 rounded-lg"></div>
        </div>
      ))}
    </div>
  </motion.div>
);

const QuickActionsSkeleton = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-gray-200 rounded-2xl p-6 animate-pulse"
  >
    <div className="w-32 h-6 bg-gray-300 rounded-lg mb-4"></div>
    <div className="space-y-3">
      {[1, 2, 3].map((index) => (
        <div
          key={index}
          className="flex items-center gap-3 p-3 bg-gray-300 rounded-xl"
        >
          <div className="w-5 h-5 bg-gray-400 rounded"></div>
          <div className="w-24 h-4 bg-gray-400 rounded-lg"></div>
        </div>
      ))}
    </div>
  </motion.div>
);

const HeaderSkeleton = () => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white/80 backdrop-blur-sm border-b border-gray-200/60 shadow-sm"
  >
    <div className="max-w-7xl mx-auto px-6 py-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div>
            <div className="w-64 h-8 bg-gray-200 rounded-lg mb-2 animate-pulse"></div>
            <div className="w-48 h-4 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
        </div>
        <div className="w-40 h-12 bg-gray-200 rounded-xl animate-pulse"></div>
      </div>
    </div>
  </motion.div>
);

// Main Loading Component
const HomeSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-cyan-50/30">
    <HeaderSkeleton />
    <div className="max-w-7xl mx-auto px-6 py-8">
      <StoryCarouselSkeleton />
      <QuickStatsSkeleton />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2">
          <TripSectionSkeleton />
        </div>

        <div>
          <QuickActionsSkeleton />
        </div>
      </div>
    </div>
  </div>
);

// 🔥 StoryCarousel Component - HANYA menampilkan perjalanan akan datang
const StoryCarousel = ({ upcomingDestinations }) => {
  const [activeStory, setActiveStory] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [imageLoading, setImageLoading] = useState({});
  const timerRef = useRef(null);
  const lastChangeTimeRef = useRef(Date.now());

  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (!isPlaying || upcomingDestinations.length === 0) return;

    timerRef.current = setInterval(() => {
      setActiveStory((prev) => (prev + 1) % upcomingDestinations.length);
      lastChangeTimeRef.current = Date.now();
    }, 5000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isPlaying, upcomingDestinations.length]);

  useEffect(() => {
    setImageLoading((prev) => ({
      ...prev,
      [activeStory]: true,
    }));
  }, [activeStory]);

  const handleStoryChange = useCallback(
    (index) => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      setActiveStory(index);
      lastChangeTimeRef.current = Date.now();

      if (isPlaying) {
        timerRef.current = setInterval(() => {
          setActiveStory((prev) => (prev + 1) % upcomingDestinations.length);
          lastChangeTimeRef.current = Date.now();
        }, 5000);
      }
    },
    [isPlaying, upcomingDestinations.length]
  );

  const handleNext = useCallback(() => {
    handleStoryChange((activeStory + 1) % upcomingDestinations.length);
  }, [activeStory, upcomingDestinations.length, handleStoryChange]);

  const handlePrev = useCallback(() => {
    handleStoryChange(
      (activeStory - 1 + upcomingDestinations.length) %
        upcomingDestinations.length
    );
  }, [activeStory, upcomingDestinations.length, handleStoryChange]);

  const handleImageLoad = useCallback((index) => {
    setImageLoading((prev) => ({
      ...prev,
      [index]: false,
    }));
  }, []);

  const handleImageError = useCallback((index) => {
    setImageLoading((prev) => ({
      ...prev,
      [index]: false,
    }));
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getDaysUntil = (dateString) => {
    const today = new Date();
    const departure = new Date(dateString);
    const diffTime = departure - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getImageUrl = (photoPath) => {
    if (!photoPath) return null;
    if (photoPath.startsWith("http")) return photoPath;
    return `${STORAGE_BASE_URL}/destinations/${photoPath}`;
  };

  if (upcomingDestinations.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative h-80 rounded-3xl overflow-hidden mb-8 bg-gradient-to-br from-blue-400 to-cyan-300"
      >
        <div className="absolute inset-0 flex items-center justify-center text-white">
          <div className="text-center">
            <Plane className="h-20 w-20 mx-auto mb-4 opacity-80" />
            <h3 className="text-2xl font-bold mb-2">
              Belum Ada Perjalanan Mendatang
            </h3>
            <p className="text-white/80 mb-4">
              Mulai rencanakan petualangan Anda berikutnya
            </p>
            <Link
              to="/destinations/new"
              className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl hover:bg-white/30 transition-all text-white font-semibold"
            >
              <Plus className="h-5 w-5 mr-2" />
              Rencanakan Perjalanan
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative h-80 rounded-3xl overflow-hidden mb-8"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStory}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <div className="relative w-full h-full">
            <div className="relative w-full h-full">
              {upcomingDestinations[activeStory]?.photo ? (
                <>
                  {(imageLoading[activeStory] === undefined ||
                    imageLoading[activeStory]) && (
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse z-10">
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-16 h-16 bg-gray-400 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                  )}

                  <img
                    src={getImageUrl(upcomingDestinations[activeStory].photo)}
                    alt={upcomingDestinations[activeStory].title}
                    className={`w-full h-full object-cover transition-opacity duration-300 ${
                      imageLoading[activeStory] ? "opacity-0" : "opacity-100"
                    }`}
                    onLoad={() => handleImageLoad(activeStory)}
                    onError={() => handleImageError(activeStory)}
                  />
                </>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-cyan-300 flex items-center justify-center">
                  <Plane className="h-20 w-20 text-white opacity-80" />
                </div>
              )}
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-500/90"
                  >
                    Akan Datang
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-center text-sm opacity-90"
                  >
                    <Calendar className="h-3 w-3 mr-1" />
                    {formatDate(
                      upcomingDestinations[activeStory]?.departure_date
                    )}
                  </motion.div>
                </div>

                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-2xl font-bold mb-2"
                >
                  {upcomingDestinations[activeStory]?.title}
                </motion.h3>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-white/80 mb-4 line-clamp-2"
                >
                  Berangkat dalam{" "}
                  {getDaysUntil(
                    upcomingDestinations[activeStory]?.departure_date
                  )}{" "}
                  hari - Siap petualangan!
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <Link
                    to={`/destinations/${upcomingDestinations[activeStory]?.id}`}
                    className="inline-flex items-center px-6 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl hover:bg-white/30 transition-all text-white font-semibold"
                  >
                    Lihat Perjalanan
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-4"
      >
        <div className="flex gap-2">
          {upcomingDestinations.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => handleStoryChange(index)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className={`w-2 h-2 rounded-full transition-all ${
                index === activeStory ? "bg-white w-6" : "bg-white/50"
              }`}
            />
          ))}
        </div>

        <div className="flex gap-2">
          <motion.button
            onClick={handlePrev}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
          >
            <ChevronRight className="h-4 w-4 text-white rotate-180" />
          </motion.button>

          <motion.button
            onClick={handleNext}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
          >
            <ChevronRight className="h-4 w-4 text-white" />
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// 🔥 QuickStats Component
const QuickStats = ({ stats }) => (
  <motion.div
    variants={containerVariants}
    initial="hidden"
    animate="visible"
    className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
  >
    {[
      {
        icon: Globe,
        value: stats.total,
        label: "Total Perjalanan",
        color: "blue",
      },
      {
        icon: Award,
        value: stats.achieved,
        label: "Tercapai",
        color: "green",
      },
      {
        icon: Target,
        value: stats.upcoming,
        label: "Akan Datang",
        color: "orange",
      },
      {
        icon: Zap,
        value: stats.totalDays,
        label: "Total Hari",
        color: "purple",
      },
    ].map((stat, index) => (
      <motion.div
        key={stat.label}
        variants={itemVariants}
        whileHover="hover"
        className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all group"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {stat.value}
            </p>
            <p className="text-sm font-semibold text-gray-600">{stat.label}</p>
          </div>
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className={`p-3 rounded-xl bg-${stat.color}-100 transition-transform`}
          >
            <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
          </motion.div>
        </div>
      </motion.div>
    ))}
  </motion.div>
);

// 🔥 TripSection Component untuk Perjalanan yang Sudah Ada
const CompletedTripsSection = ({ trips }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          Perjalanan yang Sudah Selesai
        </h2>
        <motion.div whileHover={{ x: 5 }}>
          <Link
            to="/destinations?filter=completed"
            className="text-blue-500 hover:text-blue-600 font-semibold text-sm flex items-center gap-1"
          >
            Lihat Semua
            <ChevronRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>

      <div className="space-y-4">
        {trips.length > 0 ? (
          trips.map((trip, index) => (
            <motion.div
              key={trip.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, x: 5 }}
              className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-green-300 transition-all group cursor-pointer"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-400 rounded-xl flex items-center justify-center text-white"
              >
                <Award className="h-6 w-6" />
              </motion.div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                  {trip.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {formatDate(trip.departure_date)} • {trip.duration_days} hari
                </p>
              </div>

              <div className="text-right">
                <p className="font-semibold text-gray-900">
                  {formatCurrency(trip.budget)}
                </p>
                <p className="text-xs text-green-600 font-medium">Selesai</p>
              </div>
            </motion.div>
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center py-8"
          >
            <Award className="h-16 w-16 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 mb-4">
              Belum ada perjalanan yang selesai
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/destinations/new"
                className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors text-sm font-semibold"
              >
                <Plus className="h-4 w-4 mr-2" />
                Rencanakan Perjalanan
              </Link>
            </motion.div>
            <p className="text-xs text-gray-400 mt-3">
              Perjalanan yang sudah Anda selesaikan akan muncul di sini
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

// 🔥 QuickActions Component
const QuickActions = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.5 }}
    className="bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl p-6 text-white"
  >
    <h3 className="font-bold text-lg mb-4">Aksi Cepat</h3>
    <div className="space-y-3">
      {[
        {
          icon: Plus,
          label: "Perjalanan Baru",
          link: "/destinations/new",
          description: "Rencanakan petualangan baru",
        },
        {
          icon: Compass,
          label: "Destinasi",
          link: "/destinations",
          description: "Kelola semua destinasi",
        },
        {
          icon: Navigation,
          label: "Rencana Perjalanan",
          link: "/itineraries",
          description: "Buat itinerary detail",
        },
        {
          icon: MapPin,
          label: "Peta Perjalanan",
          link: "/map",
          description: "Lihat peta perjalanan",
        },
      ].map((action, index) => (
        <motion.div
          key={action.label}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 + index * 0.1 }}
        >
          <Link
            to={action.link}
            className="flex items-center gap-3 p-3 bg-white/20 rounded-xl hover:bg-white/30 transition-all group"
          >
            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              className="transition-transform flex-shrink-0"
            >
              <action.icon className="h-5 w-5" />
            </motion.div>
            <div className="flex-1">
              <span className="group-hover:translate-x-1 transition-transform block">
                {action.label}
              </span>
              <span className="text-white/70 text-xs block">
                {action.description}
              </span>
            </div>
            <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

const Home = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDestinations = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await destinationService.getAll();
      setDestinations(data);
    } catch (error) {
      console.error("Failed to load destinations:", error);
      setError("Gagal memuat data destinasi. Silakan coba lagi.");
      setDestinations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDestinations();
  }, [loadDestinations]);

  // 🔥 Data untuk berbagai section
  const upcomingDestinations = useMemo(() => {
    return destinations
      .filter(
        (dest) =>
          new Date(dest.departure_date) > new Date() && !dest.is_achieved
      )
      .sort((a, b) => new Date(a.departure_date) - new Date(b.departure_date))
      .slice(0, 5); // Ambil 5 untuk carousel
  }, [destinations]);

  const completedTrips = useMemo(() => {
    return destinations
      .filter((d) => d.is_achieved)
      .sort((a, b) => new Date(b.departure_date) - new Date(a.departure_date))
      .slice(0, 3);
  }, [destinations]);

  const stats = useMemo(() => {
    return {
      total: destinations.length,
      achieved: destinations.filter((d) => d.is_achieved).length,
      planning: destinations.filter((d) => !d.is_achieved).length,
      totalBudget: destinations.reduce(
        (sum, d) => sum + parseFloat(d.budget || 0),
        0
      ),
      totalDays: destinations.reduce(
        (sum, d) => sum + parseInt(d.duration_days || 0),
        0
      ),
      upcoming: destinations.filter(
        (dest) =>
          new Date(dest.departure_date) > new Date() && !dest.is_achieved
      ).length,
    };
  }, [destinations]);

  // Show skeleton loading
  if (loading) {
    return <HomeSkeleton />;
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50/30 to-cyan-50/30"
      >
        <div className="text-center max-w-md">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4"
          >
            <Compass className="h-10 w-10 text-red-600" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-red-600 text-lg font-medium mb-4"
          >
            {error}
          </motion.div>
          <motion.button
            onClick={loadDestinations}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-xl hover:from-blue-600 hover:to-cyan-500 transition-all shadow-lg font-semibold"
          >
            Coba Lagi
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-cyan-50/30">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/80 backdrop-blur-sm border-b border-gray-200/60 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div>
                <motion.h1
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent"
                >
                  Dashboard Perjalanan
                  <span className="ml-1 text-white">🚞</span>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-gray-600 mt-1"
                >
                  Ringkasan perjalanan dan rencana Anda
                </motion.p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/destinations/new"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-xl hover:from-blue-600 hover:to-cyan-500 transition-all shadow-lg hover:shadow-xl font-semibold"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Tambah Destinasi
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Story Carousel - HANYA perjalanan akan datang */}
        <StoryCarousel upcomingDestinations={upcomingDestinations} />

        {/* Quick Stats */}
        <QuickStats stats={stats} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column - 2/3 width */}
          <div className="xl:col-span-2">
            {/* Perjalanan yang Sudah Selesai */}
            <CompletedTripsSection trips={completedTrips} />
          </div>

          {/* Right Column - 1/3 width */}
          <div>
            {/* Aksi Cepat */}
            <QuickActions />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
