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

// Main Loading Component
const HomeSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-cyan-50/30">
    <HeaderSkeleton />
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 md:py-6 lg:py-8">
      <StoryCarouselSkeleton />
      <QuickStatsSkeleton />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
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

// Skeleton Components - UPDATED untuk match dengan object asli
const StoryCarouselSkeleton = () => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    className="relative h-48 md:h-64 lg:h-80 rounded-xl md:rounded-2xl lg:rounded-3xl overflow-hidden mb-4 md:mb-6 lg:mb-8 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse"
  >
    <div className="absolute inset-0 bg-gradient-to-t from-gray-300/50 via-transparent to-gray-400/30"></div>
    <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 lg:p-8">
      <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-2 md:mb-3 lg:mb-4">
        <div className="w-16 md:w-20 h-4 md:h-5 bg-gray-300 rounded-full"></div>
        <div className="flex items-center">
          <div className="w-3 md:w-4 h-3 md:h-4 bg-gray-300 rounded mr-1 md:mr-2"></div>
          <div className="w-20 md:w-24 h-3 md:h-4 bg-gray-300 rounded"></div>
        </div>
      </div>
      <div className="w-3/4 h-5 md:h-6 lg:h-8 bg-gray-300 rounded-lg mb-2 md:mb-3"></div>
      <div className="w-1/2 h-4 md:h-5 bg-gray-300 rounded-lg mb-3 md:mb-4 lg:mb-6"></div>
      <div className="w-24 md:w-28 lg:w-32 h-8 md:h-9 lg:h-10 bg-gray-300 rounded-xl"></div>
    </div>
  </motion.div>
);

const QuickStatsSkeleton = () => (
  <motion.div
    variants={containerVariants}
    initial="hidden"
    animate="visible"
    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-5 mb-4 md:mb-6 lg:mb-8"
  >
    {[1, 2, 3, 4].map((index) => (
      <motion.div
        key={index}
        variants={itemVariants}
        className="bg-white rounded-lg md:rounded-xl lg:rounded-2xl p-3 md:p-4 lg:p-6 border border-gray-200 shadow-sm"
      >
        <div className="flex items-center justify-between">
          <div className="space-y-2 md:space-y-3">
            <div className="w-12 md:w-14 lg:w-16 h-5 md:h-6 lg:h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse"></div>
            <div className="w-16 md:w-18 lg:w-20 h-3 md:h-4 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
          <div
            className={`p-2 md:p-2.5 lg:p-3 rounded-lg md:rounded-xl bg-gradient-to-br ${
              index === 1
                ? "from-green-100 to-green-50"
                : index === 2
                ? "from-orange-100 to-orange-50"
                : index === 3
                ? "from-purple-100 to-purple-50"
                : "from-blue-100 to-blue-50"
            } animate-pulse`}
          >
            <div
              className={`w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 ${
                index === 1
                  ? "bg-green-200"
                  : index === 2
                  ? "bg-orange-200"
                  : index === 3
                  ? "bg-purple-200"
                  : "bg-blue-200"
              } rounded-lg`}
            ></div>
          </div>
        </div>
      </motion.div>
    ))}
  </motion.div>
);

const TripSectionSkeleton = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg md:rounded-xl lg:rounded-2xl p-3 md:p-4 lg:p-6 border border-gray-200 shadow-sm h-full flex flex-col"
    >
      {/* Header Skeleton - Responsive */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 md:mb-4 lg:mb-6 flex-shrink-0">
        <div className="flex items-center gap-2 md:gap-3 mb-2 sm:mb-0">
          <div className="p-1.5 md:p-2 lg:p-2.5 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg md:rounded-xl animate-pulse">
            <div className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 bg-gray-300 rounded"></div>
          </div>
          <div className="space-y-1.5 md:space-y-2">
            <div className="w-28 md:w-32 lg:w-40 h-4 md:h-5 lg:h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse"></div>
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-14 md:w-16 lg:w-20 h-3 md:h-4 lg:h-5 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="w-20 md:w-24 lg:w-32 h-3 md:h-4 lg:h-5 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
        <div className="w-16 md:w-20 lg:w-28 h-5 md:h-6 lg:h-8 bg-gray-200 rounded-lg animate-pulse"></div>
      </div>

      {/* Content Skeleton - Responsive */}
      <div className="flex-grow">
        <div className="h-full flex flex-col">
          {/* Month Header */}
          <div className="flex items-center justify-between mb-2 md:mb-3 lg:mb-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 md:w-4 md:h-4 bg-gray-200 rounded"></div>
              <div className="w-20 md:w-24 lg:w-28 h-3 md:h-4 bg-gray-200 rounded"></div>
            </div>
            <div className="w-12 md:w-14 lg:w-16 h-3 md:h-4 bg-gray-200 rounded-full"></div>
          </div>

          {/* Trip Cards (2 items) - Responsive */}
          <div className="space-y-2 md:space-y-3 flex-grow">
            {[1, 2].map((index) => (
              <div
                key={index}
                className="relative rounded-lg md:rounded-xl border border-gray-300 animate-pulse overflow-hidden"
              >
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-gray-300 to-gray-400"></div>
                <div className="flex items-center gap-2 md:gap-3 lg:gap-4 p-2 md:p-3 lg:p-4 pl-3 md:pl-4 lg:pl-5">
                  {/* Avatar - Responsive */}
                  <div className="flex-shrink-0 relative">
                    <div className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg md:rounded-xl"></div>
                  </div>

                  {/* Content - Responsive */}
                  <div className="flex-1 space-y-1.5 md:space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="w-24 md:w-28 lg:w-36 h-3 md:h-4 bg-gray-200 rounded"></div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 md:w-3 md:h-3 bg-gray-300 rounded"></div>
                        <div className="w-6 md:w-8 h-2 md:h-3 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-1 md:gap-2 lg:gap-3">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 md:w-3 md:h-3 bg-gray-300 rounded"></div>
                        <div className="w-16 md:w-20 lg:w-24 h-2 md:h-3 bg-gray-200 rounded"></div>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 md:w-3 md:h-3 bg-gray-300 rounded"></div>
                        <div className="w-12 md:w-16 lg:w-20 h-2 md:h-3 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  </div>

                  {/* Chevron */}
                  <div className="w-3 h-3 md:w-4 md:h-4 bg-gray-300 rounded-full"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Stats Footer Skeleton - Responsive */}
          <div className="mt-2 md:mt-3 lg:mt-4 pt-2 md:pt-3 lg:pt-4 border-t border-gray-200 flex-shrink-0">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg md:rounded-xl p-2 md:p-3 lg:p-4 border border-gray-200">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="p-1.5 md:p-2 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg animate-pulse">
                  <div className="w-3 h-3 md:w-4 md:h-4 bg-gray-400 rounded"></div>
                </div>
                <div className="space-y-1.5 md:space-y-2">
                  <div className="w-28 md:w-32 lg:w-40 h-3 md:h-4 bg-gray-200 rounded"></div>
                  <div className="w-32 md:w-40 lg:w-48 h-2 md:h-3 bg-gray-200 rounded"></div>
                </div>
              </div>
              <div className="mt-2 md:mt-3">
                <div className="w-20 md:w-24 lg:w-28 h-6 md:h-7 lg:h-8 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const QuickActionsSkeleton = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-lg md:rounded-xl lg:rounded-2xl p-3 md:p-4 lg:p-6 border border-gray-200 shadow-sm h-full flex flex-col"
  >
    {/* Header */}
    <div className="mb-3 md:mb-4 lg:mb-6 flex-shrink-0">
      <div className="w-20 md:w-24 lg:w-32 h-4 md:h-5 lg:h-6 bg-gray-200 rounded-lg mb-1.5 md:mb-2 animate-pulse"></div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 md:w-4 md:h-4 bg-gray-200 rounded"></div>
        <div className="w-24 md:w-28 lg:w-40 h-2 md:h-3 bg-gray-200 rounded"></div>
      </div>
    </div>

    {/* Action items - Responsive */}
    <div className="space-y-1.5 md:space-y-2 flex-grow">
      {[1, 2, 3, 4].map((index) => (
        <div
          key={index}
          className="flex items-center justify-between p-2 md:p-2.5 lg:p-3 rounded-lg bg-gray-50 animate-pulse h-10 md:h-12 lg:h-14"
        >
          <div className="flex items-center gap-2 md:gap-3">
            {/* Icon - Responsive */}
            <div
              className={`w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 ${
                index === 1
                  ? "bg-blue-100"
                  : index === 2
                  ? "bg-green-100"
                  : index === 3
                  ? "bg-purple-100"
                  : "bg-orange-100"
              } rounded-lg`}
            ></div>

            {/* Text - Responsive */}
            <div className="space-y-1.5">
              <div className="w-20 md:w-24 lg:w-32 h-3 md:h-4 bg-gray-200 rounded-lg"></div>
              <div className="w-14 md:w-16 lg:w-24 h-2 md:h-3 bg-gray-200 rounded"></div>
            </div>
          </div>

          {/* Right side - Responsive */}
          <div className="flex items-center gap-1.5 md:gap-2">
            <div
              className={`w-4 h-3 md:w-6 md:h-4 lg:w-8 lg:h-6 ${
                index === 1
                  ? "bg-blue-200"
                  : index === 2
                  ? "bg-green-200"
                  : index === 3
                  ? "bg-purple-200"
                  : "bg-orange-200"
              } rounded-full`}
            ></div>
            <div className="w-3 h-3 md:w-4 md:h-4 bg-gray-200 rounded-full"></div>
          </div>
        </div>
      ))}
    </div>

    {/* Stats bar - Responsive */}
    <div className="mt-3 md:mt-4 lg:mt-6 pt-3 md:pt-4 lg:pt-6 border-t border-gray-100 flex-shrink-0">
      <div className="grid grid-cols-3 gap-2 md:gap-3 lg:gap-4">
        {[1, 2, 3].map((index) => (
          <div key={index} className="text-center">
            <div className="w-6 h-4 md:w-7 md:h-5 lg:w-8 lg:h-6 bg-gray-200 rounded mx-auto mb-0.5 md:mb-1 animate-pulse"></div>
            <div className="w-12 md:w-14 lg:w-16 h-2 md:h-3 bg-gray-200 rounded mx-auto"></div>
          </div>
        ))}
      </div>
    </div>
  </motion.div>
);

const HeaderSkeleton = () => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white/80 backdrop-blur-sm border-b border-gray-200/60 shadow-sm"
  >
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4 lg:py-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 md:gap-4">
        {/* Left side - title & description */}
        <div className="flex items-center gap-3 md:gap-4 lg:gap-6">
          <div className="space-y-1.5 md:space-y-2 lg:space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-28 md:w-36 lg:w-48 h-5 md:h-6 lg:h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse"></div>
              <div className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 bg-gray-300 rounded"></div>
            </div>
            <div className="w-40 md:w-52 lg:w-64 h-3 md:h-4 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
        </div>

        {/* Right side - button (hidden di mobile) */}
        <div className="hidden sm:flex items-center gap-3 md:gap-4">
          <div className="w-24 md:w-32 lg:w-40 h-8 md:h-10 lg:h-12 bg-gradient-to-r from-gray-300 to-gray-400 rounded-lg md:rounded-xl animate-pulse flex items-center justify-center">
            <div className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 bg-gray-400/80 rounded mr-1 md:mr-2"></div>
            <div className="w-16 md:w-20 lg:w-24 h-3 md:h-4 bg-gray-400/80 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

// 🔥 StoryCarousel Component
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
        className="relative h-48 md:h-64 lg:h-80 rounded-2xl lg:rounded-3xl overflow-hidden mb-6 md:mb-8 bg-gradient-to-br from-blue-400 to-cyan-300"
      >
        <div className="absolute inset-0 flex items-center justify-center text-white p-4">
          <div className="text-center">
            {/* ICON PESAWAT - Hanya muncul di tablet ke atas */}
            <div className="hidden sm:block mb-3 md:mb-4">
              <Plane className="h-14 w-14 md:h-16 md:w-16 lg:h-20 lg:w-20 mx-auto opacity-80" />
            </div>

            <h3 className="text-lg md:text-xl lg:text-2xl font-bold mb-2">
              Belum Ada Perjalanan Mendatang
            </h3>
            <p className="text-white/80 mb-3 md:mb-4 text-sm md:text-base">
              Mulai rencanakan petualangan Anda berikutnya
            </p>
            <Link
              to="/destinations/new"
              className="inline-flex items-center px-4 py-2 md:px-6 md:py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl hover:bg-white/30 transition-all text-white font-semibold text-sm md:text-base"
            >
              <Plus className="h-4 w-4 md:h-5 md:w-5 mr-2" />
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
const QuickStats = ({ stats }) => {
  const getColorClasses = (color) => {
    switch (color) {
      case "blue":
        return { bg: "bg-blue-100", text: "text-blue-600" };
      case "green":
        return { bg: "bg-green-100", text: "text-green-600" };
      case "orange":
        return { bg: "bg-orange-100", text: "text-orange-600" };
      case "purple":
        return { bg: "bg-purple-100", text: "text-purple-600" };
      default:
        return { bg: "bg-blue-100", text: "text-blue-600" };
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 md:mb-8" // 👈 Mobile: 1 kolom, tablet: 2 kolom, desktop: 4 kolom
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
      ].map((stat, index) => {
        const colorClasses = getColorClasses(stat.color);

        return (
          <motion.div
            key={stat.label}
            variants={itemVariants}
            whileHover={{ y: -3, scale: 1.02 }}
            className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </p>
                <p className="text-sm font-semibold text-gray-600">
                  {stat.label}
                </p>
              </div>
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className={`p-3 rounded-xl ${colorClasses.bg} transition-transform`}
              >
                <stat.icon className={`h-6 w-6 ${colorClasses.text}`} />
              </motion.div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

// 🔥 TripSection Component untuk Perjalanan yang Sudah Ada - COMPACT VERSION
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

  const getShortMonthYear = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      month: "short",
      year: "numeric",
    });
  };

  // Ambil maksimal 2 item terbaru
  const displayedTrips = trips.slice(0, 2);
  const hasMoreTrips = trips.length > 2;
  const isEmpty = trips.length === 0;
  const isSingleTrip = trips.length === 1;

  // Group trips by month-year untuk header
  const groupedTrips = displayedTrips.reduce((groups, trip) => {
    const monthYear = getShortMonthYear(trip.departure_date);
    if (!groups[monthYear]) {
      groups[monthYear] = [];
    }
    groups[monthYear].push(trip);
    return groups;
  }, {});

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm h-full flex flex-col"
    >
      {/* Header dengan gradient */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 md:mb-6 flex-shrink-0">
        <div className="flex items-center gap-3 mb-3 sm:mb-0">
          <div className="p-2 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
            <Award className="h-4 w-4 md:h-5 md:w-5 text-green-600" />
          </div>
          <div>
            <h2 className="text-base md:text-lg lg:text-xl font-bold text-gray-900">
              Perjalanan Selesai
            </h2>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <p className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                {trips.length} tercapai
              </p>
            </div>
          </div>
        </div>

        {/* Hanya muncul di tablet ke atas */}
        {hasMoreTrips && (
          <motion.div
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.95 }}
            className="hidden sm:block" // 👈 HILANG DI MOBILE
          >
            <Link
              to="/destinations?status=completed"
              className="text-blue-500 hover:text-blue-600 font-semibold text-xs md:text-sm flex items-center gap-1 bg-blue-50 px-2 py-1 md:px-3 md:py-1.5 rounded-lg"
            >
              Lihat {trips.length - 2} lainnya
              <ChevronRight className="h-3 w-3 md:h-4 md:w-4" />
            </Link>
          </motion.div>
        )}
      </div>
      {/* Content */}
      <div className="flex-grow overflow-hidden">
        {isEmpty ? (
          /* Empty State - Elegant */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="h-full flex flex-col items-center justify-center text-center p-4"
          >
            <div className="relative mb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl flex items-center justify-center border border-green-200">
                <Award className="h-10 w-10 text-green-400" />
              </div>
              <div className="absolute -top-1 -right-1 w-8 h-8 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-full flex items-center justify-center border-2 border-white">
                <Plus className="h-4 w-4 text-blue-500" />
              </div>
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Mulai Perjalanan Pertama
            </h3>
            <p className="text-sm text-gray-600 mb-6 max-w-xs">
              Rencanakan perjalanan Anda dan tandai sebagai selesai untuk
              melihat pencapaian di sini
            </p>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/destinations/new"
                className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-400 text-white rounded-xl hover:from-green-600 hover:to-emerald-500 transition-all font-semibold shadow-lg hover:shadow-xl"
              >
                <Plus className="h-4 w-4 mr-2" />
                Rencanakan Perjalanan
              </Link>
            </motion.div>
          </motion.div>
        ) : (
          /* Trip Items - Max 2 Cards */
          <div className="h-full flex flex-col">
            {/* Scrollable content */}
            <div className="space-y-4 flex-grow overflow-y-auto pr-2">
              {Object.entries(groupedTrips).map(([monthYear, monthTrips]) => (
                <div key={monthYear} className="space-y-3">
                  {/* Month Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="font-medium text-gray-700 text-sm">
                        {monthYear}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                      {monthTrips.length} perjalanan
                    </span>
                  </div>

                  {/* Trip Cards (Max 2) */}
                  <div className="space-y-3">
                    {monthTrips.map((trip, index) => (
                      <motion.div
                        key={trip.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ y: -2 }}
                        className="relative bg-white rounded-xl border border-gray-200 hover:border-green-300 transition-all group cursor-pointer overflow-hidden"
                      >
                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-green-500 to-emerald-400"></div>
                        <Link
                          to={`/destinations/${trip.id}`}
                          className="flex items-center gap-3 p-3 md:p-4 pl-4 md:pl-5"
                        >
                          {/* Icon Award */}
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-green-500 to-emerald-400 rounded-xl flex items-center justify-center text-white">
                              <Award className="h-4 w-4 md:h-6 md:w-6" />
                            </div>
                          </div>

                          {/* Content - Hanya title dan tanggal */}
                          <div className="flex-1 min-w-0">
                            {/* Title - tidak ada truncate, biar wrap natural */}
                            <h3 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors text-sm md:text-base leading-tight mb-1">
                              {trip.title}
                            </h3>

                            {/* Hanya tanggal saja */}
                            <div className="flex items-center gap-1 text-xs md:text-sm text-gray-600">
                              <Calendar className="h-3 w-3 flex-shrink-0" />
                              <span>{formatDate(trip.departure_date)}</span>
                              {/* Duration - hanya muncul di tablet+ */}
                              <span className="hidden sm:inline-flex items-center gap-1 ml-2">
                                <Clock className="h-3 w-3" />
                                <span>{trip.duration_days} hari</span>
                              </span>
                            </div>
                          </div>

                          {/* Arrow Right */}
                          <ChevronRight className="h-3 w-3 md:h-4 md:w-4 text-gray-400 group-hover:text-green-500 group-hover:translate-x-1 transition-all flex-shrink-0" />
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Stats Footer */}
            <div className="mt-4 pt-4 border-t border-gray-100 flex-shrink-0">
              {isSingleTrip ? (
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg">
                      <Target className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">
                        Perjalanan pertama sukses! 🎉
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        Tambahkan perjalanan berikutnya untuk mengumpulkan lebih
                        banyak pencapaian
                      </p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <Link
                      to="/destinations/new"
                      className="inline-flex items-center px-3 py-1.5 bg-white text-blue-600 rounded-lg border border-blue-300 hover:bg-blue-50 text-sm font-medium"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Tambah Perjalanan
                    </Link>
                  </div>
                </div>
              ) : hasMoreTrips ? (
                <div className="flex items-center justify-between bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg">
                      <Award className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">
                        {trips.length - 2} perjalanan lainnya
                      </p>
                      <p className="text-xs text-gray-600">
                        Lihat semua perjalanan yang sudah selesai
                      </p>
                    </div>
                  </div>
                  <Link
                    to="/destinations?status=completed"
                    className="text-blue-500 hover:text-blue-600 font-medium text-sm"
                  >
                    Lihat semua →
                  </Link>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-700">
                      {trips.length} perjalanan selesai
                    </span>
                  </div>
                  <Link
                    to="/destinations/new"
                    className="text-blue-500 hover:text-blue-600 text-sm font-medium"
                  >
                    + Tambah lagi
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// 🔥 QuickActions Component - UPDATED untuk height yang responsive
const QuickActions = ({ destinations = [] }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.5 }}
    className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm h-full flex flex-col"
  >
    {/* Clean Header */}
    <div className="mb-6 flex-shrink-0">
      <h3 className="text-lg font-bold text-gray-900 mb-2">Aksi Cepat</h3>
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Zap className="h-4 w-4 text-blue-500" />
        <span>Akses cepat ke fitur utama</span>
      </div>
    </div>

    {/* Action List - Flex grow untuk mengisi space */}
    <div className="space-y-2 flex-grow">
      {[
        {
          icon: Plus,
          label: "Tambah Destinasi Baru",
          link: "/destinations/new",
          count: "New",
          color: "blue",
        },
        {
          icon: Compass,
          label: "Kelola Destinasi",
          link: "/destinations",
          count: destinations.length,
          color: "green",
        },
        {
          icon: Calendar,
          label: "Buat Itinerary",
          link: "/itineraries",
          count: "+",
          color: "purple",
        },
        {
          icon: MapPin,
          label: "Lihat Peta Perjalanan",
          link: "/map",
          count: "📍",
          color: "orange",
        },
      ].map((action, index) => (
        <motion.div
          key={action.label}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 + index * 0.1 }}
          whileHover={{ x: 4 }}
          className="h-16" // Fixed height untuk consistency
        >
          <Link
            to={action.link}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-all group h-full"
          >
            <div className="flex items-center gap-3">
              {/* Icon dengan indicator color */}
              <div
                className={`p-2 rounded-lg ${
                  action.color === "blue"
                    ? "bg-blue-50 group-hover:bg-blue-100"
                    : action.color === "green"
                    ? "bg-green-50 group-hover:bg-green-100"
                    : action.color === "purple"
                    ? "bg-purple-50 group-hover:bg-purple-100"
                    : "bg-orange-50 group-hover:bg-orange-100"
                } transition-colors`}
              >
                <action.icon
                  className={`h-5 w-5 ${
                    action.color === "blue"
                      ? "text-blue-600"
                      : action.color === "green"
                      ? "text-green-600"
                      : action.color === "purple"
                      ? "text-purple-600"
                      : "text-orange-600"
                  }`}
                />
              </div>

              <div>
                <p className="font-medium text-gray-900 text-sm group-hover:text-blue-600 transition-colors">
                  {action.label}
                </p>
                <p className="text-xs text-gray-500">Klik untuk membuka</p>
              </div>
            </div>

            {/* Right side - Count/Badge */}
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  action.color === "blue"
                    ? "bg-blue-100 text-blue-700"
                    : action.color === "green"
                    ? "bg-green-100 text-green-700"
                    : action.color === "purple"
                    ? "bg-purple-100 text-purple-700"
                    : "bg-orange-100 text-orange-700"
                }`}
              >
                {action.count}
              </span>
              <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
            </div>
          </Link>
        </motion.div>
      ))}
    </div>

    {/* Quick Stats Bar */}
    <div className="mt-6 pt-6 border-t border-gray-100 flex-shrink-0">
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900">
            {destinations.length}
          </div>
          <div className="text-xs text-gray-500">Destinasi</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900">
            {destinations.filter((d) => !d.is_achieved).length}
          </div>
          <div className="text-xs text-gray-500">Direncanakan</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900">
            {destinations.filter((d) => d.is_achieved).length}
          </div>
          <div className="text-xs text-gray-500">Selesai</div>
        </div>
      </div>
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
      .sort((a, b) => new Date(b.departure_date) - new Date(a.departure_date));
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
                  className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent"
                  // className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent"
                >
                  Travel Dashboard
                  <span className="ml-1 text-white">🚞</span>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-gray-600 mt-1 text-sm lg:text-base"
                  // className="text-gray-600 mt-1"
                >
                  Ringkasan perjalanan dan rencana Anda
                </motion.p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Button hanya muncul di tablet ke atas */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="hidden sm:block"
              >
                <Link
                  to="/destinations/new"
                  className="inline-flex items-center px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-xl hover:from-blue-600 hover:to-cyan-500 transition-all shadow-lg hover:shadow-xl font-semibold text-sm md:text-base"
                >
                  <Plus className="h-4 w-4 md:h-5 md:w-5 mr-2" />
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
            <QuickActions destinations={destinations} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
