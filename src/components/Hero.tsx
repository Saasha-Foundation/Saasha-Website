import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="relative bg-saasha-cream dark:bg-dark-primary min-h-screen flex items-center">
      <div className="absolute inset-0">
        <img
          src="https://i.imgur.com/495jfJc.jpeg"
          alt="Good old saasha"
          className="w-full h-full object-cover opacity-20 dark:opacity-10"
        />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-saasha-brown dark:text-dark-text sm:text-5xl md:text-6xl">
            <span className="block">Making a Difference</span>
            <span className="block text-saasha-rose dark:text-dark-accent">One Life at a Time</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-saasha-brown/80 dark:text-dark-text/80 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Together, we can create lasting change in our communities. Join us in our mission to build a better future for everyone.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <Link to="/volunteer" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-saasha-cream bg-saasha-brown hover:bg-saasha-rose dark:bg-dark-accent dark:hover:bg-saasha-rose transition-colors duration-300 md:py-4 md:text-lg md:px-10">
                Volunteer
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;