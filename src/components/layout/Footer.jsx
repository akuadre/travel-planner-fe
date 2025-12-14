// components/layout/Footer.jsx
import React from 'react';
import { Heart, Coffee, Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white/80 backdrop-blur-sm border-t border-slate-200/60 py-3 md:py-6">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Left section - Made with love */}
          <div className="flex items-center gap-2 md:gap-4 text-slate-600 mb-3 md:mb-0">
            <span className="text-xs md:text-sm">
              Dibuat dengan 
            </span>
            <div className="flex items-center gap-1 md:gap-2">
              <Heart size={12} md:size={16} className="text-red-500 fill-current" />
              <Coffee size={12} md:size={16} className="text-amber-600" />
            </div>
            <span className="text-xs md:text-sm">
              untuk Petualang
            </span>
          </div>
          
          {/* Links - Tersembunyi di mobile, muncul di tablet */}
          <div className="hidden sm:flex items-center gap-4 md:gap-6">
            <a 
              href="#" 
              className="text-xs md:text-sm text-slate-500 hover:text-slate-700 transition-colors"
            >
              Privasi
            </a>
            <a 
              href="#" 
              className="text-xs md:text-sm text-slate-500 hover:text-slate-700 transition-colors"
            >
              Syarat
            </a>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 md:gap-2 text-xs md:text-sm text-slate-500 hover:text-slate-700 transition-colors"
            >
              <Github size={12} md:size={16} />
              <span className="hidden md:inline">GitHub</span>
            </a>
          </div>
        </div>
        
        {/* Copyright - lebih kecil di mobile */}
        <div className="text-center mt-2 md:mt-4">
          <p className="text-[10px] md:text-xs text-slate-400">
            © {new Date().getFullYear()} Travel Planner. Semua petualangan dilindungi.
          </p>
          {/* Versi mobile: minimal */}
          <p className="text-[10px] text-slate-400 mt-1 sm:hidden">
            v1.0 • ✈️
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;