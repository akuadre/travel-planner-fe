import { Outlet } from "react-router-dom";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import Footer from "../components/layout/Footer";
import { memo, useState, useEffect, useCallback } from "react";

const StableSidebar = memo(Sidebar);
const StableHeader = memo(Header);
const StableFooter = memo(Footer);

const AppLayout = () => {
  const [isMobile, setIsMobile] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // 🔥 PERBAIKAN: Initial check untuk device
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 1280;
      setIsMobile(mobile);
      
      // 🔥 CRITICAL: Set sidebar state berdasarkan device
      if (mobile) {
        // Mobile: sidebar closed
        setSidebarOpen(false);
      } else {
        // Desktop: sidebar open
        setSidebarOpen(true);
      }
    };

    // Panggil untuk initial check
    checkScreenSize();
    
    const handleResize = () => {
      checkScreenSize();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 🔥 PERBAIKAN: Toggle function yang sederhana
  const toggleSidebar = useCallback(() => {
    console.log("🔄 Toggling sidebar, current state:", sidebarOpen);
    setSidebarOpen(prev => !prev);
  }, [sidebarOpen]);

  const closeSidebar = useCallback(() => {
    console.log("❌ Closing sidebar");
    setSidebarOpen(false);
  }, []);

  if (isMobile === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  console.log("📱 Device:", isMobile ? "Mobile" : "Desktop", "Sidebar:", sidebarOpen ? "Open" : "Closed");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Sidebar */}
      <StableSidebar 
        isMobile={isMobile}
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        closeSidebar={closeSidebar}
      />
      
      {/* Mobile sidebar overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}
      
      {/* Main content */}
      <div className={`
        flex flex-col min-h-screen transition-all duration-300
        ${!isMobile && sidebarOpen ? 'xl:ml-72' : 'ml-0'}
      `}>
        {/* Header */}
        <StableHeader 
          isMobile={isMobile}
          toggleSidebar={toggleSidebar}
          sidebarOpen={sidebarOpen}
        />
        
        {/* Main content */}
        <main className={`
          grow p-4 transition-all duration-300
          ${isMobile ? 'pt-16' : 'pt-20'}
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