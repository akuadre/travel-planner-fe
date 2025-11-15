const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-4 px-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          © {new Date().getFullYear()} Travel Planner. All rights reserved.
        </p>
        <p className="text-sm text-gray-600">
          Made with ❤️ using React & Laravel • {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
};

export default Footer;