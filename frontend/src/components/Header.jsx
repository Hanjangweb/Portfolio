import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, Code2 } from 'lucide-react';
import { useAuthStore } from '../store/store';
import { settingsAPI } from '../utils/api';

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [siteName, setSiteName] = useState('Portfolio');
  const { isAuthenticated, isAdmin, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    const loadSettings = async () => {
      try {
        const data = await settingsAPI.get();
        if (data?.data?.siteName) {
          setSiteName(data.data.siteName);
        }
      } catch (error) {
        console.error('Error loading site name:', error);
      }
    };
    loadSettings();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Projects', path: '/projects' },
    { name: 'Expertise', path: '/expertise' },
    { name: 'Blog', path: '/blog' },
    { name: 'Reviews', path: '/testimonials' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl shadow-lg shadow-blue-900/5 border-b border-white/20 dark:border-white/10 py-3' 
          : 'bg-transparent py-6'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 text-2xl font-black text-gray-900 dark:text-white group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl flex items-center justify-center transform group-hover:rotate-12 group-hover:scale-110 transition-all shadow-lg shadow-blue-500/30">
              <Code2 size={24} />
            </div>
            <span className="tracking-tight">{siteName.slice(0, 4)}<span className="text-primary">{siteName.slice(4)}.</span></span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-2 glass px-4 py-2 rounded-full border border-white/20 dark:border-white/10 shadow-sm">
              {navLinks.map((link) => (
                <Link 
                  key={link.name}
                  to={link.path} 
                  className={`text-sm font-semibold px-4 py-2 rounded-full transition-all duration-300 ${
                    location.pathname === link.path 
                      ? 'bg-primary text-white shadow-md shadow-primary/30' 
                      : 'text-gray-600 dark:text-gray-300 hover:text-primary hover:bg-white/50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-4">
              {isAuthenticated && isAdmin && (
                <Link to="/admin/dashboard" className="text-sm font-semibold hover:text-primary transition">
                  Dashboard
                </Link>
              )}

              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-5 py-2.5 bg-red-500/10 text-red-600 dark:text-red-400 rounded-full hover:bg-red-500 hover:text-white transition-all duration-300 text-sm font-bold"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full hover:scale-105 transition-transform text-sm font-bold shadow-lg shadow-blue-500/30"
                >
                  Login
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-600 dark:text-gray-300"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-slate-900 shadow-xl border-t border-gray-100 dark:border-gray-800 p-4 space-y-2 pb-6">
            {navLinks.map((link) => (
              <Link 
                key={link.name}
                to={link.path} 
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 rounded-xl font-semibold transition-colors ${
                  location.pathname === link.path 
                    ? 'bg-primary/10 text-primary' 
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200'
                }`}
              >
                {link.name}
              </Link>
            ))}

            <div className="h-px bg-gray-200 dark:bg-gray-800 my-4"></div>

            {isAuthenticated && isAdmin && (
              <Link 
                to="/admin/dashboard" 
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200"
              >
                Dashboard
              </Link>
            )}

            {isAuthenticated ? (
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 mt-2 bg-red-500/10 text-red-600 rounded-xl hover:bg-red-500 hover:text-white transition-colors font-bold"
              >
                <LogOut size={18} />
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="block text-center px-4 py-3 mt-2 bg-primary text-white rounded-xl hover:bg-blue-700 transition-colors font-bold shadow-md"
              >
                Login
              </Link>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
