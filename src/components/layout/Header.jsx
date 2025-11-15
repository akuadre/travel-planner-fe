import { Menu } from "lucide-react";

const Header = () => {
  return (
    <header className="fixed top-0 right-0 left-0 lg:left-64 bg-white shadow-sm z-40 border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Page Title - bisa diganti dynamic nanti */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500">Welcome to your travel planner</p>
        </div>

        {/* Mobile menu button (hidden di desktop) */}
        <button className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100">
          <Menu className="h-6 w-6" />
        </button>
      </div>
    </header>
  );
};

export default Header;