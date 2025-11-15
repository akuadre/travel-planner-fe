// components/layout/Footer.jsx
import React from 'react';
import { Heart, Coffee, Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white/80 backdrop-blur-sm border-t border-slate-200/60 py-6">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-4 text-slate-600">
            <span className="text-sm">
              Made with 
            </span>
            <div className="flex items-center gap-2">
              <Heart size={16} className="text-red-500 fill-current" />
              <Coffee size={16} className="text-amber-600" />
            </div>
            <span className="text-sm">
              for Travelers
            </span>
          </div>
          
          <div className="flex items-center gap-6 mt-4 md:mt-0">
            <a 
              href="#" 
              className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
            >
              Privacy
            </a>
            <a 
              href="#" 
              className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
            >
              Terms
            </a>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
            >
              <Github size={16} />
              GitHub
            </a>
          </div>
        </div>
        
        <div className="text-center mt-4">
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} Travel Planner. All adventures reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;