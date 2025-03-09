import React from 'react';
import { Mail, Send, MessageSquare, Instagram } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import PageLayout from './layout/PageLayout';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

const Contact = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          access_key: 'f5af0961-3131-4613-b30e-ba1e8cf7da1e',
          ...data
        })
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Message sent successfully!');
        reset();
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
      console.error('Error sending message:', error);
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
      <section className="py-4 bg-saasha-cream dark:bg-dark-primary" id="contact">
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
                      href="https://www.instagram.com/saasha_foundation" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-saasha-brown/80 dark:text-dark-text/80 hover:text-saasha-rose dark:hover:text-dark-accent transition-colors duration-300"
                    >
                      @saasha_foundation
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
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-saasha-brown dark:text-dark-text mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    {...register('name')}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.name ? 'border-red-500' : 'border-saasha-cream dark:border-dark-border'
                    } focus:outline-none focus:ring-2 focus:ring-saasha-rose/20 dark:bg-dark-secondary dark:text-dark-text`}
                    placeholder="John Doe"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-saasha-brown dark:text-dark-text mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    {...register('email')}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.email ? 'border-red-500' : 'border-saasha-cream dark:border-dark-border'
                    } focus:outline-none focus:ring-2 focus:ring-saasha-rose/20 dark:bg-dark-secondary dark:text-dark-text`}
                    placeholder="john@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-saasha-brown dark:text-dark-text mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    {...register('subject')}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.subject ? 'border-red-500' : 'border-saasha-cream dark:border-dark-border'
                    } focus:outline-none focus:ring-2 focus:ring-saasha-rose/20 dark:bg-dark-secondary dark:text-dark-text`}
                    placeholder="How can we help?"
                  />
                  {errors.subject && (
                    <p className="mt-1 text-sm text-red-500">{errors.subject.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-saasha-brown dark:text-dark-text mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    {...register('message')}
                    rows={4}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.message ? 'border-red-500' : 'border-saasha-cream dark:border-dark-border'
                    } focus:outline-none focus:ring-2 focus:ring-saasha-rose/20 dark:bg-dark-secondary dark:text-dark-text`}
                    placeholder="Your message here..."
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>
                  )}
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