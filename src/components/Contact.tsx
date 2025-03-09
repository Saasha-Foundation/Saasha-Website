import React, { useState } from 'react';
import { Mail, Send, MessageSquare, Instagram } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import PageLayout from './layout/PageLayout';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const Contact = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          access_key: 'f5af0961-3131-4613-b30e-ba1e8cf7da1e',
          ...formData
        })
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Message sent successfully!');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
      console.error('Error sending message:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <PageLayout>
      <section className="py-16 bg-saasha-cream dark:bg-dark-primary" id="contact">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid grid-cols-1 lg:grid-cols-2 gap-16"
          >
            {/* Contact Information */}
            <div>
              <motion.div variants={itemVariants}>
                <h2 className="text-4xl font-bold text-saasha-brown dark:text-dark-text mb-6">Get in Touch</h2>
                <p className="text-lg text-saasha-brown/80 dark:text-dark-text/80 mb-12">
                  Have questions about our initiatives or want to get involved? We'd love to hear from you. Reach out to us using any of the following methods or fill out the contact form.
                </p>
              </motion.div>

              <div className="space-y-8">
                <motion.div
                  variants={itemVariants}
                  className="flex items-start space-x-4"
                >
                  <div className="bg-saasha-cream/30 dark:bg-dark-secondary/30 p-3 rounded-full">
                    <Mail className="w-6 h-6 text-saasha-rose dark:text-dark-accent" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-saasha-brown dark:text-dark-text mb-1">Email Us</h3>
                    <a 
                      href="mailto:help.foundation.saasha@gmail.com"
                      className="text-saasha-brown/80 dark:text-dark-text/80 hover:text-saasha-rose dark:hover:text-dark-accent transition-colors duration-300"
                    >
                      help.foundation.saasha@gmail.com
                    </a>
                    <p className="text-sm text-saasha-brown/60 dark:text-dark-text/60 mt-1">We'll respond within 24 hours</p>
                  </div>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="flex items-start space-x-4"
                >
                  <div className="bg-saasha-cream/30 dark:bg-dark-secondary/30 p-3 rounded-full">
                    <MessageSquare className="w-6 h-6 text-saasha-rose dark:text-dark-accent" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-saasha-brown dark:text-dark-text mb-1">WhatsApp Community</h3>
                    <a 
                      href="https://chat.whatsapp.com/HbsBIjkN1De9fAkm0M7LKO" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-saasha-brown/80 dark:text-dark-text/80 hover:text-saasha-rose dark:hover:text-dark-accent transition-colors duration-300"
                    >
                      Join our community
                    </a>
                    <p className="text-sm text-saasha-brown/60 dark:text-dark-text/60 mt-1">Get updates and connect with others</p>
                  </div>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="flex items-start space-x-4"
                >
                  <div className="bg-saasha-cream/30 dark:bg-dark-secondary/30 p-3 rounded-full">
                    <Instagram className="w-6 h-6 text-saasha-rose dark:text-dark-accent" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-saasha-brown dark:text-dark-text mb-1">Follow Us</h3>
                    <a 
                      href="https://www.instagram.com/saasha_foundation?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-saasha-brown/80 dark:text-dark-text/80 hover:text-saasha-rose dark:hover:text-dark-accent transition-colors duration-300"
                    >
                      @saasha
                    </a>
                    <p className="text-sm text-saasha-brown/60 dark:text-dark-text/60 mt-1">Stay updated with our latest events</p>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Contact Form */}
            <motion.div
              variants={itemVariants}
              className="bg-white dark:bg-dark-secondary rounded-2xl shadow-xl p-8 border border-saasha-cream dark:border-dark-border"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-saasha-brown dark:text-dark-text mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-saasha-cream dark:border-dark-border focus:outline-none focus:ring-2 focus:ring-saasha-rose/20 dark:bg-dark-secondary dark:text-dark-text"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-saasha-brown dark:text-dark-text mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-saasha-cream dark:border-dark-border focus:outline-none focus:ring-2 focus:ring-saasha-rose/20 dark:bg-dark-secondary dark:text-dark-text"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-saasha-brown dark:text-dark-text mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-saasha-cream dark:border-dark-border focus:outline-none focus:ring-2 focus:ring-saasha-rose/20 dark:bg-dark-secondary dark:text-dark-text"
                    placeholder="How can we help?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-saasha-brown dark:text-dark-text mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-saasha-cream dark:border-dark-border focus:outline-none focus:ring-2 focus:ring-saasha-rose/20 dark:bg-dark-secondary dark:text-dark-text"
                    placeholder="Your message here..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-saasha-brown hover:bg-saasha-rose dark:bg-dark-accent dark:hover:bg-dark-accent/80 text-saasha-cream py-3 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center space-x-2 disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <Send className="w-5 h-5 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Contact;