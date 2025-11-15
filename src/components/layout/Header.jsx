import { Menu } from "lucide-react";
import { useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();
  
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/home':
        return 'Dashboard';
      case '/destinations':
        return 'Destinations';
      case '/itineraries':
        return 'Itineraries';
      default:
        return 'Dashboard';
    }
  };

  const getPageDescription = () => {
    switch (location.pathname) {
      case '/home':
        return 'Manage your travel plans';
      case '/destinations':
        return 'Create and edit destinations';
      case '/itineraries':
        return 'Plan your trip details';
      default:
        return 'Welcome to your travel planner';
    }
  };

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-64 bg-white shadow-sm z-40 border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Dynamic Page Title */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{getPageTitle()}</h1>
          <p className="text-sm text-gray-500">{getPageDescription()}</p>
        </div>

        {/* Mobile menu button */}
        <button className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100">
          <Menu className="h-6 w-6" />
        </button>
      </div>
    </header>
  );
};

export default Header;