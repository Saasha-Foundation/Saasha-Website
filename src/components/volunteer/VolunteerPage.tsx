import React from 'react';
import PageLayout from '../layout/PageLayout';
import VolunteerForm from './VolunteerForm';

const VolunteerPage = () => {
  return (
    <PageLayout>
      <section className="py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-saasha-brown dark:text-dark-text mb-4">
              Volunteer With Us
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Join our community of dedicated volunteers making a difference in the lives of others. 
              Whether you have a few hours or a regular commitment, your time and skills can help create positive change.
            </p>
          </div>

          {/*
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white dark:bg-dark-secondary rounded-lg p-6 text-center shadow-lg">
              <div className="text-3xl font-bold text-saasha-brown dark:text-dark-text mb-2">100+</div>
              <div className="text-gray-600 dark:text-gray-300">Active Volunteers</div>
            </div>
            <div className="bg-white dark:bg-dark-secondary rounded-lg p-6 text-center shadow-lg">
              <div className="text-3xl font-bold text-saasha-brown dark:text-dark-text mb-2">50+</div>
              <div className="text-gray-600 dark:text-gray-300">Projects Completed</div>
            </div>
            <div className="bg-white dark:bg-dark-secondary rounded-lg p-6 text-center shadow-lg">
              <div className="text-3xl font-bold text-saasha-brown dark:text-dark-text mb-2">1000+</div>
              <div className="text-gray-600 dark:text-gray-300">Lives Impacted</div>
            </div>
          </div>*/}

          {/* Why Volunteer Section */}
          <div className="bg-saasha-cream/20 dark:bg-dark-secondary rounded-lg p-8 mb-16">
            <h2 className="text-2xl font-bold text-saasha-brown dark:text-dark-text mb-6">
              Why Volunteer With Us?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-saasha-rose" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-saasha-brown dark:text-dark-text mb-2">Make an Impact</h3>
                  <p className="text-gray-600 dark:text-gray-300">Directly contribute to meaningful projects that improve lives in our community.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-saasha-rose" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-saasha-brown dark:text-dark-text mb-2">Join a Community</h3>
                  <p className="text-gray-600 dark:text-gray-300">Connect with like-minded individuals passionate about making a difference.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-saasha-rose" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-saasha-brown dark:text-dark-text mb-2">Gain Experience</h3>
                  <p className="text-gray-600 dark:text-gray-300">Develop new skills and get hands-on experience in various areas.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Registration Form */}
          <div className="bg-white dark:bg-dark-secondary rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-saasha-brown dark:text-dark-text mb-6">
              Volunteer Registration
            </h2>
            <VolunteerForm />
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default VolunteerPage;
