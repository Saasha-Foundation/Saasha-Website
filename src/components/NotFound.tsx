import { Link } from 'react-router-dom';
import PageLayout from './layout/PageLayout';

const NotFound = () => {
  return (
    <PageLayout>
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative mb-12">
            <h1 className="text-9xl font-extrabold text-saasha-rose dark:text-dark-accent">404</h1>
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-saasha-brown dark:bg-dark-text rounded-full"></div>
          </div>
          
          <h2 className="text-3xl font-bold text-saasha-brown dark:text-dark-text mb-6">
            Page Not Found
          </h2>
          
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
            We're sorry, but the page you're looking for doesn't exist or has been moved.
            Let's get you back on track.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/"
              className="px-8 py-3 bg-saasha-rose hover:bg-saasha-rose/90 dark:bg-dark-accent dark:hover:bg-dark-accent/90 text-white rounded-md transition-colors duration-300 font-medium"
            >
              Return Home
            </Link>
            <Link 
              to="/contact"
              className="px-8 py-3 border border-saasha-brown dark:border-dark-text text-saasha-brown dark:text-dark-text hover:bg-saasha-brown/10 dark:hover:bg-dark-text/10 rounded-md transition-colors duration-300 font-medium"
            >
              Contact Us
            </Link>
          </div>
          
          <div className="mt-16">
            <h3 className="text-xl font-semibold text-saasha-brown dark:text-dark-text mb-6">
              You might be looking for:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <Link 
                to="/about" 
                className="p-4 bg-white dark:bg-dark-secondary rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 text-saasha-brown dark:text-dark-text hover:text-saasha-rose dark:hover:text-dark-accent"
              >
                About Us
              </Link>
              <Link 
                to="/events" 
                className="p-4 bg-white dark:bg-dark-secondary rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 text-saasha-brown dark:text-dark-text hover:text-saasha-rose dark:hover:text-dark-accent"
              >
                Events
              </Link>
              <Link 
                to="/blogs" 
                className="p-4 bg-white dark:bg-dark-secondary rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 text-saasha-brown dark:text-dark-text hover:text-saasha-rose dark:hover:text-dark-accent"
              >
                Blog
              </Link>
              <Link 
                to="/team" 
                className="p-4 bg-white dark:bg-dark-secondary rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 text-saasha-brown dark:text-dark-text hover:text-saasha-rose dark:hover:text-dark-accent"
              >
                Our Team
              </Link>
              <Link 
                to="/donate" 
                className="p-4 bg-white dark:bg-dark-secondary rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 text-saasha-brown dark:text-dark-text hover:text-saasha-rose dark:hover:text-dark-accent"
              >
                Donate
              </Link>
              <Link 
                to="/volunteer" 
                className="p-4 bg-white dark:bg-dark-secondary rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 text-saasha-brown dark:text-dark-text hover:text-saasha-rose dark:hover:text-dark-accent"
              >
                Volunteer
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default NotFound;
