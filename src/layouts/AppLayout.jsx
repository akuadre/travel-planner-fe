import { Outlet } from "react-router-dom";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import Footer from "../components/layout/Footer";
import { memo, useState, useEffect } from "react";

// Gunakan React.memo untuk prevent unnecessary re-renders
const StableSidebar = memo(Sidebar);
const StableHeader = memo(Header);
const StableFooter = memo(Footer);

const AppLayout = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Check screen size untuk responsive
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1280); // xl breakpoint
      if (window.innerWidth >= 1280) {
        setSidebarOpen(false); // Auto close sidebar on desktop
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Sidebar - Responsive */}
      <StableSidebar 
        isMobile={isMobile}
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      
      {/* Mobile sidebar overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Main content area - Responsive margin */}
      <div className={`
        flex flex-col min-h-screen transition-all duration-300
        ${isMobile ? 'ml-0' : 'ml-0 xl:ml-72'}
      `}>
        {/* Header - Responsive */}
        <StableHeader 
          isMobile={isMobile}
          toggleSidebar={toggleSidebar}
        />
        
        {/* Main content - Responsive padding */}
        <main className={`
          grow p-4 transition-all duration-300
          ${isMobile ? 'pt-20' : 'pt-24'}
        `}>
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
        
        {/* Footer */}
        <StableFooter />
      </div>
    </div>
  );
};

export default memo(AppLayout);