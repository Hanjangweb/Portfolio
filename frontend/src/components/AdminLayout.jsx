import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, FileText, Wrench, MessageSquare, LogOut, ArrowLeft, Star, Link as LinkIcon, Settings, Menu, X } from 'lucide-react';
import { useAuthStore } from '../store/store';

export const AdminLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Projects', path: '/admin/projects', icon: FolderKanban },
    { name: 'Blog', path: '/admin/blog', icon: FileText },
    { name: 'Skills', path: '/admin/skills', icon: Wrench },
    { name: 'Testimonials', path: '/admin/testimonials', icon: Star },
    { name: 'Inquiries', path: '/admin/inquiries', icon: MessageSquare },
    { name: 'Footer', path: '/admin/footer', icon: LinkIcon },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-[#020817] overflow-hidden">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-[#0f172a] border-r border-gray-200 dark:border-gray-800 flex flex-col transform transition-transform duration-300 md:relative md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200 dark:border-gray-800">
          <span className="text-xl font-bold text-gray-900 dark:text-white">Admin Panel</span>
          <button 
            className="md:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                  isActive
                    ? 'bg-primary text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <item.icon size={20} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 mb-2 font-medium"
          >
            <ArrowLeft size={20} />
            Back to Site
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors rounded-xl font-medium"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white dark:bg-[#0f172a] border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white hidden sm:block">
              {navItems.find(item => item.path === location.pathname)?.name || 'Admin'}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <span className="text-sm font-medium hidden sm:block dark:text-white">{user?.name || 'Administrator'}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-4 md:p-8 bg-gray-50 dark:bg-[#020817]">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
