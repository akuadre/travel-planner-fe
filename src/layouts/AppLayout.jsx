import { Outlet } from "react-router-dom";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import Footer from "../components/layout/Footer";
import { memo, useState, useEffect, useCallback } from "react";

const StableSidebar = memo(Sidebar);
const StableHeader = memo(Header);
const StableFooter = memo(Footer);

const AppLayout = () => {
  // 🔥 SIMPLE: Tanpa state isMobile, langsung CSS media query
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // 🔥 HAPUS semua resize logic kompleks
  // Biarkan CSS yang handle mobile/desktop

  const toggleSidebar = useCallback(() => {
    console.log("Toggle sidebar clicked");
    setSidebarOpen(prev => !prev);
  }, []);

  const closeSidebar = useCallback(() => {
    console.log("Closing sidebar");
    setSidebarOpen(false);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Sidebar - Desktop: always visible via CSS, Mobile: controlled by state */}
      <StableSidebar 
        sidebarOpen={sidebarOpen}
        closeSidebar={closeSidebar}
      />
      
      {/* Mobile overlay - hanya muncul di mobile dan ketika sidebarOpen */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        } lg:hidden`}
        onClick={closeSidebar}
      />
      
      {/* Main content */}
      <div className="flex flex-col min-h-screen lg:ml-72">
        <StableHeader 
          toggleSidebar={toggleSidebar}
        />
        
        <main className="flex-1 p-4 pt-16 lg:pt-20">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
        
        <StableFooter />
      </div>
    </div>
  );
};

export default memo(AppLayout);