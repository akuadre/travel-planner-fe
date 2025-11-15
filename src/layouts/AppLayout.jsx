import { Outlet } from "react-router-dom";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import Footer from "../components/layout/Footer";

const AppLayout = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Sidebar fixed di kiri */}
      <Sidebar />
      
      {/* Main content area */}
      <div className="lg:ml-64 flex flex-col min-h-screen">
        {/* Header */}
        <Header />
        
        {/* Main content */}
        <main className="flex-grow p-6 pt-24">
          <Outlet />
        </main>
        
        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default AppLayout;