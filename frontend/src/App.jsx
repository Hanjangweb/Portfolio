import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';

// Components
import Header from './components/Header';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Projects from './pages/Projects';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Contact from './pages/Contact';
import Testimonials from './pages/Testimonials';
import Expertise from './pages/Expertise';
import Login from './pages/Login';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import ManageProjects from './pages/admin/ManageProjects';
import ManageSkills from './pages/admin/ManageSkills';
import ManageBlog from './pages/admin/ManageBlog';
import ManageTestimonials from './pages/admin/ManageTestimonials';
import ManageInquiries from './pages/admin/ManageInquiries';
import ManageFooter from './pages/admin/ManageFooter';
import ManageSettings from './pages/admin/ManageSettings';
import AdminLayout from './components/AdminLayout';

// Store
import { useAuthStore } from './store/store';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isAdmin } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (!isAdmin) {
    return <Navigate to="/" />;
  }
  
  return children;
};

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen bg-[var(--background)]">
          <Routes>
            {/* Public Routes with Header & Footer */}
            <Route path="/*" element={
              <>
                <Header />
                <main className="flex-grow pt-20">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/blog/:id" element={<BlogPost />} />
                    <Route path="/testimonials" element={<Testimonials />} />
                    <Route path="/expertise" element={<Expertise />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/login" element={<Login />} />
                    {/* 404 Fallback */}
                    <Route path="*" element={<Navigate to="/" />} />
                  </Routes>
                </main>
                <Footer />
              </>
            } />

            {/* Protected Admin Routes with AdminLayout */}
            <Route path="/admin/*" element={
              <ProtectedRoute>
                <AdminLayout>
                  <Routes>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="projects" element={<ManageProjects />} />
                    <Route path="skills" element={<ManageSkills />} />
                    <Route path="blog" element={<ManageBlog />} />
                    <Route path="testimonials" element={<ManageTestimonials />} />
                    <Route path="inquiries" element={<ManageInquiries />} />
                    <Route path="footer" element={<ManageFooter />} />
                    <Route path="settings" element={<ManageSettings />} />
                    <Route path="*" element={<Navigate to="/admin/dashboard" />} />
                  </Routes>
                </AdminLayout>
              </ProtectedRoute>
            } />
          </Routes>
        </div>
        <Toaster position="bottom-right" />
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
