import React from 'react';
import { Heart, BookOpen } from 'lucide-react';
import PageLayout from './layout/PageLayout';
import { useLocation } from 'react-router-dom';

const About = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <PageLayout>
      <section className={`bg-white dark:bg-dark-primary ${isHomePage ? '-mt-16' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-saasha-brown dark:text-dark-text mb-4">
                  About saasha
                </h1>
              </div>
              <p className="text-lg text-saasha-brown/80 dark:text-dark-text/80 mb-8">
                saasha was born from the shared vision of two aspiring medical students committed to making healthcare knowledge accessible and actionable. The name "Saasha" not only combines the founders' names but also rhymes with "Aasha," the Hindi word for hope, symbolizing our mission to inspire hope and empowerment through health education and advocacy.
              </p>
              
              <div className="space-y-8">
                <div className="bg-saasha-cream/30 dark:bg-dark-secondary/30 rounded-xl p-6">
                  <div className="flex items-center mb-4">
                    <Heart className="w-6 h-6 text-saasha-rose dark:text-dark-accent mr-3" />
                    <h3 className="text-xl font-semibold text-saasha-brown dark:text-dark-text">Our Mission</h3>
                  </div>
                  <p className="text-saasha-brown/80 dark:text-dark-text/80">
                    To empower communities through accessible healthcare education and advocacy, creating lasting positive change in people's lives.
                  </p>
                </div>

                <div className="bg-saasha-cream/30 dark:bg-dark-secondary/30 rounded-xl p-6">
                  <div className="flex items-center mb-4">
                    <BookOpen className="w-6 h-6 text-saasha-rose dark:text-dark-accent mr-3" />
                    <h3 className="text-xl font-semibold text-saasha-brown dark:text-dark-text">Why saasha?</h3>
                  </div>
                  <p className="text-saasha-brown/80 dark:text-dark-text/80">
                    We believe in the power of knowledge and community support to transform healthcare outcomes. Our unique approach combines medical expertise with grassroots engagement, ensuring that vital health information reaches those who need it most.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-w-4 aspect-h-5 rounded-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80"
                  alt="Medical professionals collaborating"
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-saasha-cream dark:bg-dark-secondary p-6 rounded-xl shadow-lg">
                <p className="text-saasha-brown dark:text-dark-text font-semibold text-lg">Founded in 2024</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default About;