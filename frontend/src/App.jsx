import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';

// Static Components (Keep these static as they are part of the initial shell)
import Header from './components/Header';
import Footer from './components/Footer';
import AdminLayout from './components/AdminLayout';

// Lazy Loaded Pages
const Home = lazy(() => import('./pages/Home'));
const Projects = lazy(() => import('./pages/Projects'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const Contact = lazy(() => import('./pages/Contact'));
const Testimonials = lazy(() => import('./pages/Testimonials'));
const Expertise = lazy(() => import('./pages/Expertise'));
const Login = lazy(() => import('./pages/Login'));

// Lazy Loaded Admin Pages
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const ManageProjects = lazy(() => import('./pages/admin/ManageProjects'));
const ManageSkills = lazy(() => import('./pages/admin/ManageSkills'));
const ManageBlog = lazy(() => import('./pages/admin/ManageBlog'));
const ManageTestimonials = lazy(() => import('./pages/admin/ManageTestimonials'));
const ManageInquiries = lazy(() => import('./pages/admin/ManageInquiries'));
const ManageFooter = lazy(() => import('./pages/admin/ManageFooter'));
const ManageSettings = lazy(() => import('./pages/admin/ManageSettings'));

// Store
import { useAuthStore } from './store/store';

// Loading Fallback Component
const PageLoading = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
  </div>
);

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
          <Suspense fallback={<PageLoading />}>
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
          </Suspense>
        </div>
        <Toaster position="bottom-right" />
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;

