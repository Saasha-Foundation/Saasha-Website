import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { DarkModeProvider } from './context/DarkModeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
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

const MainApp = () => {
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

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <DarkModeProvider>
          <MainApp />
        </DarkModeProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
