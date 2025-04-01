import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

const ScrollToTopLink = ({ to, children, className }: { to: string; children: React.ReactNode; className?: string }) => {
  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <RouterLink to={to} className={className} onClick={handleClick}>
      {children}
    </RouterLink>
  );
};

const Footer = () => {
  return (
    <footer className="bg-saasha-brown dark:bg-dark-secondary text-saasha-cream py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">We'd Love to Hear from You</h2>
          <p className="text-lg text-saasha-cream/80 max-w-2xl mx-auto">
            We're here to assist you with any questions, support, or partnership inquiries - reach out to us today.
          </p>
          <ScrollToTopLink 
            to="/contact"
            className="mt-8 inline-block bg-saasha-rose hover:bg-saasha-rose/90 dark:bg-dark-accent dark:hover:bg-dark-accent/90 text-saasha-cream px-8 py-3 rounded-full transition-colors duration-300"
          >
            Contact Us
          </ScrollToTopLink>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-4">
            <h3 className="font-semibold text-xl mb-4">About</h3>
            <ul className="space-y-2">
              <li><ScrollToTopLink to="/about" className="hover:text-saasha-rose dark:hover:text-dark-accent transition-colors duration-300">About Us</ScrollToTopLink></li>
              <li><ScrollToTopLink to="/team" className="hover:text-saasha-rose dark:hover:text-dark-accent transition-colors duration-300">Team</ScrollToTopLink></li>
              <li><ScrollToTopLink to="/volunteer" className="hover:text-saasha-rose dark:hover:text-dark-accent transition-colors duration-300">Volunteer</ScrollToTopLink></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold text-xl mb-4">Events</h3>
            <ul className="space-y-2">
            <li><ScrollToTopLink to="/events" className="hover:text-saasha-rose dark:hover:text-dark-accent transition-colors duration-300">Events</ScrollToTopLink></li>
              <li><ScrollToTopLink to="/events?upcoming" className="hover:text-saasha-rose dark:hover:text-dark-accent transition-colors duration-300">Upcoming</ScrollToTopLink></li>
              <li><ScrollToTopLink to="/events?past" className="hover:text-saasha-rose dark:hover:text-dark-accent transition-colors duration-300">Past</ScrollToTopLink></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold text-xl mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <ScrollToTopLink to="/blogs" className="hover:text-saasha-rose dark:hover:text-dark-accent transition-colors duration-300">
                  Blogs
                </ScrollToTopLink>
              </li>
              <li>
                <ScrollToTopLink to="/gallery" className="hover:text-saasha-rose dark:hover:text-dark-accent transition-colors duration-300">
                  Gallery
                </ScrollToTopLink>
              </li>
              <li>
                <ScrollToTopLink to="/faqs" className="hover:text-saasha-rose dark:hover:text-dark-accent transition-colors duration-300">
                  FAQs
                </ScrollToTopLink>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-saasha-cream/20 text-center text-sm text-saasha-cream/60">
          <p> {new Date().getFullYear()} Saasha. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;