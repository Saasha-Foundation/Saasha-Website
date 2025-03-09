import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import PageLayout from '../components/layout/PageLayout';

const Team = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [direction, setDirection] = useState(0);

  const teamMembers = [
    { id: 1, name: 'Sanya', role: 'Co-Founder', imageUrl: 'https://i.imgur.com/cUokxUE.jpeg' },
    { id: 2, name: 'Tanisha', role: 'Co-Founder', imageUrl: 'https://i.imgur.com/VfUhwwo.jpeg' },
    { id: 3, name: 'Aarya', role: 'Social Media Manager', imageUrl: 'https://i.imgur.com/RtKs0d5.jpeg' },
    { id: 4, name: 'Arnav', role: 'Lead Designer', imageUrl: 'https://i.imgur.com/Cae5gD4.jpeg' },
    { id: 5, name: 'Akshat', role: 'Designer', imageUrl: 'https://i.imgur.com/HA6Fs1M.jpeg' },
    { id: 6, name: 'Samisha', role: 'Creative Strategist', imageUrl: 'https://i.imgur.com/zUPEhLp.jpeg' },
    { id: 7, name: 'Krishnna', role: 'Creative Strategist', imageUrl: 'https://i.imgur.com/jnB7vm9.jpeg' },
    { id: 8, name: 'Yessa', role: 'Content Writer', imageUrl: 'https://i.imgur.com/L2OubBk.jpeg' },
    { id: 9, name: 'Prishita', role: 'Content Writer', imageUrl: 'https://i.imgur.com/lEnSCur.jpeg' },
    { id: 10, name: 'Nihar', role: 'Event Manager', imageUrl: 'https://i.imgur.com/HOysoez.jpeg' },
    { id: 11, name: 'Meira', role: 'Photographer', imageUrl: 'https://i.imgur.com/mxffnJo.jpeg' },
    { id: 12, name: 'Anushka', role: 'Head of Content Creation', imageUrl: 'https://i.imgur.com/YHYITC3.jpeg' }
  ];

  const itemsPerPage = {
    desktop: 4,
    tablet: 3,
    mobile: 2
  };

  useEffect(() => {
    let interval: number;
    if (isAutoPlaying) {
      interval = window.setInterval(() => {
        setDirection(1);
        setCurrentIndex((prevIndex) => 
          prevIndex === teamMembers.length - itemsPerPage.desktop ? 0 : prevIndex + 1
        );
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, teamMembers.length]);

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) => 
      prevIndex === teamMembers.length - itemsPerPage.desktop ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? teamMembers.length - itemsPerPage.desktop : prevIndex - 1
    );
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

          <div className="relative group">
            {/* Navigation Buttons */}
            <button 
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-8 bg-saasha-brown/90 dark:bg-dark-accent/90 text-saasha-cream p-2 rounded-full hover:bg-saasha-rose dark:hover:bg-dark-accent transition-all duration-300 z-10 opacity-0 group-hover:opacity-100 focus:opacity-100"
              onMouseEnter={() => setIsAutoPlaying(false)}
              onMouseLeave={() => setIsAutoPlaying(true)}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button 
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-8 bg-saasha-brown/90 dark:bg-dark-accent/90 text-saasha-cream p-2 rounded-full hover:bg-saasha-rose dark:hover:bg-dark-accent transition-all duration-300 z-10 opacity-0 group-hover:opacity-100 focus:opacity-100"
              onMouseEnter={() => setIsAutoPlaying(false)}
              onMouseLeave={() => setIsAutoPlaying(true)}
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Team Members Carousel */}
            <div className="overflow-hidden">
              <motion.div 
                className="flex"
                initial={false}
                animate={{ 
                  x: `-${currentIndex * 25}%` 
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
                    className="flex-none w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-4"
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="bg-saasha-cream/30 dark:bg-dark-secondary rounded-xl p-6 text-center h-full transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                      <div className="mb-4 overflow-hidden rounded-full mx-auto w-32 h-32">
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
              {Array.from({ length: Math.ceil(teamMembers.length / itemsPerPage.desktop) }).map((_, index) => (
                <button
                  key={index}
                  className={`h-2 transition-all duration-300 rounded-full ${
                    Math.floor(currentIndex / itemsPerPage.desktop) === index 
                      ? 'w-8 bg-saasha-brown dark:bg-dark-accent' 
                      : 'w-2 bg-saasha-rose dark:bg-dark-accent/70 hover:bg-saasha-brown/70 dark:hover:bg-dark-accent'
                  }`}
                  onClick={() => {
                    setDirection(index > Math.floor(currentIndex / itemsPerPage.desktop) ? 1 : -1);
                    setCurrentIndex(index * itemsPerPage.desktop);
                  }}
                  onMouseEnter={() => setIsAutoPlaying(false)}
                  onMouseLeave={() => setIsAutoPlaying(true)}
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
