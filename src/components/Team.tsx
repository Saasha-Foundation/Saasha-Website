import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import PageLayout from './layout/PageLayout';

const Team = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  const teamMembers = [
    { id: 1, name: 'Sanya', role: 'Co-Founder', imageUrl: 'https://i.imgur.com/cUokxUE.jpeg' },
    { id: 2, name: 'Tanisha', role: 'Co-Founder', imageUrl: 'https://i.imgur.com/VfUhwwo.jpeg' },
    { id: 3, name: 'Aarya', role: 'Social Media Manager', imageUrl: 'https://i.imgur.com/RtKs0d5.jpeg' },
    { id: 4, name: 'Arnav', role: 'Lead Designer', imageUrl: 'https://i.imgur.com/Cae5gD4.jpeg' },
    { id: 5, name: 'Akshat', role: 'Designer', imageUrl: 'https://i.imgur.com/tRKueeb.jpeg' },
    { id: 6, name: 'Samisha', role: 'Creative Strategist', imageUrl: 'https://i.imgur.com/zUPEhLp.jpeg' },
    { id: 7, name: 'Krishnna', role: 'Creative Strategist', imageUrl: 'https://i.imgur.com/jnB7vm9.jpeg' },
    { id: 8, name: 'Yessa', role: 'Content Writer', imageUrl: 'https://i.imgur.com/L2OubBk.jpeg' },
    { id: 9, name: 'Prishita', role: 'Content Writer', imageUrl: 'https://i.imgur.com/lEnSCur.jpeg' },
    { id: 10, name: 'Nihar', role: 'Event Manager', imageUrl: 'https://i.imgur.com/YEV2iU2.jpeg' },
    { id: 11, name: 'Meira', role: 'Photographer', imageUrl: 'https://i.imgur.com/mxffnJo.jpeg' },
    { id: 12, name: 'Anushka', role: 'Head of Content Creation', imageUrl: 'https://i.imgur.com/YHYITC3.jpeg' }
  ];

  const itemsPerPage = {
    desktop: 5,
    tablet: 3,
    mobile: 1
  };

  // Cards to scroll per click
  const scrollIncrement = {
    desktop: 2,
    tablet: 1,
    mobile: 1
  };

  // Card width classes based on screen size
  const cardWidthClasses = {
    mobile: "w-full", // Full width on mobile
    tablet: "w-1/3", // 3 cards per row on tablet
    desktop: "w-1/5" // 5 cards per row on desktop
  };

  // Get current items per page based on window width
  const getCurrentItemsPerPage = () => {
    if (windowWidth >= 1024) return itemsPerPage.desktop;
    if (windowWidth >= 768) return itemsPerPage.tablet;
    return itemsPerPage.mobile;
  };

  // Get current scroll increment based on window width
  const getCurrentScrollIncrement = () => {
    if (windowWidth >= 1024) return scrollIncrement.desktop;
    if (windowWidth >= 768) return scrollIncrement.tablet;
    return scrollIncrement.mobile;
  };

  const currentItemsPerPage = getCurrentItemsPerPage();
  const currentScrollIncrement = getCurrentScrollIncrement();

  const toggleAutoplay = () => {
    setIsAutoPlaying(prev => !prev);
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    let interval: number;
    if (isAutoPlaying) {
      interval = window.setInterval(() => {
        setCurrentIndex((prevIndex) => {
          const maxIndex = teamMembers.length - currentItemsPerPage;
          return prevIndex >= maxIndex ? 0 : prevIndex + currentScrollIncrement;
        });
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, teamMembers.length, currentItemsPerPage, currentScrollIncrement]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => {
      const maxIndex = teamMembers.length - currentItemsPerPage;
      return prevIndex >= maxIndex ? 0 : prevIndex + currentScrollIncrement;
    });
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => {
      const maxIndex = teamMembers.length - currentItemsPerPage;
      if (prevIndex === 0) return maxIndex;
      
      // Ensure we don't go below 0
      const newIndex = prevIndex - currentScrollIncrement;
      return newIndex < 0 ? 0 : newIndex;
    });
  };

  return (
    <PageLayout>
      <section className="py-4 bg-white dark:bg-dark-primary" id="team">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-saasha-brown dark:text-dark-text">Meet The Team</h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              The passionate individuals behind Saasha Foundation
            </p>
          </div>

          <div className="relative">
            {/* Navigation Buttons */}
            <button 
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-8 bg-saasha-brown/90 dark:bg-dark-accent/90 text-saasha-cream p-2 rounded-full hover:bg-saasha-rose dark:hover:bg-dark-accent transition-all duration-300 z-10 focus:opacity-100"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button 
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-8 bg-saasha-brown/90 dark:bg-dark-accent/90 text-saasha-cream p-2 rounded-full hover:bg-saasha-rose dark:hover:bg-dark-accent transition-all duration-300 z-10 focus:opacity-100"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Pause/Play Button */}
            <button 
              onClick={toggleAutoplay}
              className="absolute right-1/2 top-0 translate-x-1/2 -translate-y-8 bg-saasha-brown/90 dark:bg-dark-accent/90 text-saasha-cream p-2 rounded-full hover:bg-saasha-rose dark:hover:bg-dark-accent transition-all duration-300 z-10 focus:opacity-100"
            >
              {isAutoPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </button>

            {/* Team Members Carousel */}
            <div className="overflow-hidden">
              <motion.div 
                className="flex"
                initial={false}
                animate={{ 
                  x: `-${currentIndex * (100 / currentItemsPerPage)}%` 
                }}
                transition={{ 
                  type: "spring",
                  stiffness: 100,
                  damping: 20,
                  mass: 0.5
                }}
              >
                {teamMembers.map((member) => (
                  <motion.div 
                    key={member.id}
                    className={`flex-none ${windowWidth >= 1024 ? cardWidthClasses.desktop : windowWidth >= 768 ? cardWidthClasses.tablet : cardWidthClasses.mobile} px-4`}
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="bg-saasha-cream/30 dark:bg-dark-secondary rounded-xl p-6 text-center h-full transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                      <div className="mb-4 overflow-hidden rounded-full mx-auto w-40 h-40 sm:w-44 sm:h-44 md:w-48 md:h-48">
                        <img
                          src={member.imageUrl}
                          alt={member.name}
                          className="w-full h-full object-cover transform transition-transform duration-700 hover:scale-110"
                        />
                      </div>
                      <h3 className="text-xl font-semibold text-saasha-brown dark:text-dark-text mb-2">{member.name}</h3>
                      <p className="text-saasha-rose dark:text-dark-accent">{member.role}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center mt-8 space-x-2">
              {Array.from({ length: Math.ceil(teamMembers.length / currentItemsPerPage) }).map((_, index) => (
                <button
                  key={index}
                  className={`h-2 transition-all duration-300 rounded-full ${
                    Math.floor(currentIndex / currentItemsPerPage) === index 
                      ? 'w-8 bg-saasha-brown dark:bg-dark-accent' 
                      : 'w-2 bg-saasha-rose dark:bg-dark-accent/70 hover:bg-saasha-brown/70 dark:hover:bg-dark-accent'
                  }`}
                  onClick={() => {
                    setCurrentIndex(index * currentItemsPerPage);
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Team;
