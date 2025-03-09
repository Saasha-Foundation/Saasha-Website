import React from 'react';
import { Mail, Send, Loader2, MessageSquare, Instagram } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import PageLayout from './layout/PageLayout';

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
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log('Form data:', data);
      toast.success('Message sent successfully!');
      reset();
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
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
      <section className="py-24 bg-white" id="contact">
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
                <h2 className="text-4xl font-bold text-saasha-brown mb-6">Get in Touch</h2>
                <p className="text-lg text-saasha-brown/80 mb-12">
                  Have questions about our initiatives or want to get involved? We'd love to hear from you. Reach out to us using any of the following methods or fill out the contact form.
                </p>
              </motion.div>

              <div className="space-y-8">
                <motion.div
                  variants={itemVariants}
                  className="flex items-start space-x-4"
                >
                  <div className="bg-saasha-cream/30 p-3 rounded-full">
                    <Mail className="w-6 h-6 text-saasha-rose" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-saasha-brown mb-1">Email Us</h3>
                    <a 
                      href="mailto:help.foundation.saasha@gmail.com"
                      className="text-saasha-brown/80 hover:text-saasha-rose transition-colors duration-300"
                    >
                      help.foundation.saasha@gmail.com
                    </a>
                    <p className="text-sm text-saasha-brown/60 mt-1">We'll respond within 24 hours</p>
                  </div>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="flex items-start space-x-4"
                >
                  <div className="bg-saasha-cream/30 p-3 rounded-full">
                    <MessageSquare className="w-6 h-6 text-saasha-rose" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-saasha-brown mb-1">WhatsApp Community</h3>
                    <a 
                      href="https://chat.whatsapp.com/HbsBIjkN1De9fAkm0M7LKO" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-saasha-brown/80 hover:text-saasha-rose transition-colors duration-300"
                    >
                      Join our community
                    </a>
                    <p className="text-sm text-saasha-brown/60 mt-1">Get updates and connect with others</p>
                  </div>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="flex items-start space-x-4"
                >
                  <div className="bg-saasha-cream/30 p-3 rounded-full">
                    <Instagram className="w-6 h-6 text-saasha-rose" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-saasha-brown mb-1">Follow Us</h3>
                    <a 
                      href="https://www.instagram.com/saasha_foundation?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-saasha-brown/80 hover:text-saasha-rose transition-colors duration-300"
                    >
                      @saasha
                    </a>
                    <p className="text-sm text-saasha-brown/60 mt-1">Stay updated with our latest events</p>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Contact Form */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-2xl shadow-xl p-8 border border-saasha-cream"
            >
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-saasha-brown mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    {...register('name')}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.name ? 'border-red-500' : 'border-saasha-cream'
                    } focus:outline-none focus:ring-2 focus:ring-saasha-rose/20`}
                    placeholder="John Doe"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-saasha-brown mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    {...register('email')}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.email ? 'border-red-500' : 'border-saasha-cream'
                    } focus:outline-none focus:ring-2 focus:ring-saasha-rose/20`}
                    placeholder="john@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-saasha-brown mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    {...register('subject')}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.subject ? 'border-red-500' : 'border-saasha-cream'
                    } focus:outline-none focus:ring-2 focus:ring-saasha-rose/20`}
                    placeholder="How can we help?"
                  />
                  {errors.subject && (
                    <p className="mt-1 text-sm text-red-500">{errors.subject.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-saasha-brown mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    {...register('message')}
                    rows={4}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.message ? 'border-red-500' : 'border-saasha-cream'
                    } focus:outline-none focus:ring-2 focus:ring-saasha-rose/20`}
                    placeholder="Your message here..."
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-saasha-brown hover:bg-saasha-rose text-saasha-cream py-3 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center space-x-2 disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
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