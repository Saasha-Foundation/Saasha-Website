import React, { useEffect, useState } from 'react';
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
import ComingSoon from './components/ComingSoon';
import MaintenancePage from './components/MaintenancePage';
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import BlogList from './components/blog/BlogList';
import BlogPost from './components/blog/BlogPost';
import EventsPage from './components/events/EventsPage';
import EventPage from './components/events/EventPage';
import VolunteerPage from './components/volunteer/VolunteerPage';
import FAQPage from './components/faq/FAQPage';
import GalleryPage from './components/gallery/GalleryPage';
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

// Check if current path is admin related
const isAdminRoute = (pathname: string) => {
  return pathname.startsWith('/admin');
};

const MainApp = () => {
  const location = useLocation();
  const { isMaintenanceMode } = useMaintenance();
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    // Check if user already has access
    const storedAccess = localStorage.getItem('hasDevAccess');
    
    // If ?developer is in URL, grant access
    if (location.search.includes('?dev')) {
      localStorage.setItem('hasDevAccess', 'true');
      setHasAccess(true);
    } 
    // If access was previously granted, maintain it
    else if (storedAccess === 'true') {
      setHasAccess(true);
    }
  }, [location.search]);

  // Show coming soon page if user doesn't have access
  if (!hasAccess) {
    return <ComingSoon />;
  }

  // Show maintenance page if maintenance mode is active and not on admin routes
  if (isMaintenanceMode && !isAdminRoute(location.pathname)) {
    return <MaintenancePage />;
  }

  return (
    <div className="min-h-screen bg-saasha-cream dark:bg-dark-primary dark:text-dark-text transition-colors duration-200">
      <Toaster position="top-right" />
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
    </div>
  );
};

function App() {
  return (
    <DarkModeProvider>
      <AuthProvider>
        <MaintenanceProvider>
          <Router>
            <MainApp />
          </Router>
        </MaintenanceProvider>
      </AuthProvider>
    </DarkModeProvider>
  );
}

export default App;
