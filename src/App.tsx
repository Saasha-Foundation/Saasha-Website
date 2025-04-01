import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { DarkModeProvider } from './context/DarkModeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { MaintenanceProvider, useMaintenance } from './context/MaintenanceContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Contact from './components/Contact';
import WhySupport from './components/WhySupport';
import Team from './components/Team';
import Footer from './components/Footer';
import Donate from './components/Donate';
import DarkModeToggle from './components/DarkModeToggle';
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import BlogList from './components/blog/BlogList';
import BlogPost from './components/blog/BlogPost';
import EventsPage from './components/events/EventsPage';
import EventPage from './components/events/EventPage';
import VolunteerPage from './components/volunteer/VolunteerPage';
import FAQPage from './components/faq/FAQPage';
import GalleryPage from './components/gallery/GalleryPage';
import MaintenancePage from './components/MaintenancePage';
import NotFound from './components/NotFound';
import { Toaster } from 'react-hot-toast';

// Protected Route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/admin" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// Maintenance Mode component
const MaintenanceWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isMaintenanceMode, isInitialized } = useMaintenance();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Show loading state until maintenance status is initialized
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-saasha-cream dark:bg-dark-primary">
        <div className="animate-pulse text-saasha-brown dark:text-dark-text text-xl">
          Loading...
        </div>
      </div>
    );
  }

  // Always show admin routes, show maintenance page for all other routes when in maintenance mode
  if (isMaintenanceMode && !isAdminRoute) {
    return <MaintenancePage />;
  }

  return <>{children}</>;
};

const MainApp = () => {
  const { isInitialized } = useMaintenance();

  return (
    <div className="min-h-screen bg-saasha-cream dark:bg-dark-primary dark:text-dark-text transition-colors duration-200">
      <Toaster position="top-right" />
      <MaintenanceWrapper>
        {isInitialized && (
          <>
            <Navbar />
            <Routes>
              <Route path="/" element={
                <>
                  <Hero />
                  <About />
                  <WhySupport />
                </>
              } />
              <Route path="/about" element={<About />} />
              <Route path="/team" element={<Team />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/volunteer" element={<VolunteerPage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/event/:id" element={<EventPage />} />
              <Route path="/donate" element={<Donate />} />
              <Route path="/whysupport" element={<WhySupport />} />
              <Route path="/blogs" element={<BlogList />} />
              <Route path="/blog" element={<Navigate to="/blogs" replace />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/faqs" element={<FAQPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/admin" element={<AdminLogin />} />
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
            <DarkModeToggle />
          </>
        )}
      </MaintenanceWrapper>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <DarkModeProvider>
          <MaintenanceProvider>
            <MainApp />
          </MaintenanceProvider>
        </DarkModeProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
