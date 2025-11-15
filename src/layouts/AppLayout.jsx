import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import Footer from "../components/layout/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { memo } from "react";

// Gunakan React.memo untuk prevent unnecessary re-renders
const StableSidebar = memo(Sidebar);
const StableHeader = memo(Header);
const StableFooter = memo(Footer);

const AppLayout = () => {
  const location = useLocation();

  console.log('🔁 AppLayout rendered - path:', location.pathname);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Sidebar - PASTI TIDAK RE-RENDER */}
      <StableSidebar />
      
      {/* Main content area */}
      <div className="ml-72 flex flex-col min-h-screen">
        {/* Header - PASTI TIDAK RE-RENDER */}
        <StableHeader />
        
        {/* Main content - HANYA Outlet yang berubah */}
        <main className="flex-grow p-8 pt-28">
          <div className="max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
        
        {/* Footer */}
        <StableFooter />
      </div>
    </div>
  );
};

// Export dengan memo juga
export default memo(AppLayout);