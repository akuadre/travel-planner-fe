import { Outlet } from "react-router-dom";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import Footer from "../components/layout/Footer";
import { memo } from "react";

// Gunakan React.memo untuk prevent unnecessary re-renders
const StableSidebar = memo(Sidebar);
const StableHeader = memo(Header);
const StableFooter = memo(Footer);

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50/30">
      {/* Sidebar - PASTI TIDAK RE-RENDER */}
      <StableSidebar />
      
      {/* Main content area */}
      <div className="ml-72 flex flex-col min-h-screen">
        {/* Header - PASTI TIDAK RE-RENDER */}
        <StableHeader />
        
        {/* Main content - OUTLET TANPA ANIMATION */}
        <main className="grow p-4 pt-24">
          {/* <div className="max-w-7xl mx-auto"> */}
          <div className="mx-auto">
            <Outlet /> {/* TANPA ANIMATION WRAPPER */}
          </div>
        </main>
        
        {/* Footer */}
        <StableFooter />
      </div>
    </div>
  );
};

export default memo(AppLayout);