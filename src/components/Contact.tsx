import React, { useState, FormEvent } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import PageLayout from './layout/PageLayout';

interface FormData {
  name: string;
  email: string;
  message: string;
}

const Contact = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          access_key: 'f5af0961-3131-4613-b30e-ba1e8cf7da1e', // Get this from Web3Forms
          name: formData.name,
          email: formData.email,
          message: formData.message
        })
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Message sent successfully!');
        setFormData({ name: '', email: '', message: '' });
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

  return (
    <PageLayout>
      <div className="bg-saasha-cream dark:bg-dark-primary py-4" id="contact">
        <Toaster position="top-center" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-saasha-brown dark:text-dark-text sm:text-4xl">Get in Touch</h2>
            <p className="mt-4 text-xl text-saasha-brown/70 dark:text-dark-text/70">We'd love to hear from you</p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
            <ContactCard
              icon={<Mail className="h-6 w-6" />}
              title="Email"
              content="help.foundation.saasha@gmail.com"
            />
            <ContactCard
              icon={<Mail className="h-6 w-6" />}
              title="Email"
              content="foundation.saasha@gmail.com"
            />
          </div>

          <form onSubmit={handleSubmit} className="mt-16 max-w-xl mx-auto">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-saasha-brown dark:text-dark-text">Name</label>
                <input 
                  type="text" 
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-saasha-rose/20 shadow-sm focus:border-saasha-rose focus:ring focus:ring-saasha-rose/20 bg-white dark:bg-dark-secondary dark:border-dark-accent/20 dark:text-dark-text dark:focus:border-dark-accent dark:focus:ring-dark-accent/20"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-saasha-brown dark:text-dark-text">Email</label>
                <input 
                  type="email" 
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-saasha-rose/20 shadow-sm focus:border-saasha-rose focus:ring focus:ring-saasha-rose/20 bg-white dark:bg-dark-secondary dark:border-dark-accent/20 dark:text-dark-text dark:focus:border-dark-accent dark:focus:ring-dark-accent/20"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-saasha-brown dark:text-dark-text">Message</label>
                <textarea 
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4} 
                  className="mt-1 block w-full rounded-md border-saasha-rose/20 shadow-sm focus:border-saasha-rose focus:ring focus:ring-saasha-rose/20 bg-white dark:bg-dark-secondary dark:border-dark-accent/20 dark:text-dark-text dark:focus:border-dark-accent dark:focus:ring-dark-accent/20"
                ></textarea>
              </div>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-saasha-brown text-saasha-cream py-2 px-4 rounded-md hover:bg-saasha-rose dark:bg-dark-accent dark:hover:bg-saasha-rose transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </PageLayout>
  );
};

const ContactCard = ({ icon, title, content }: { icon: React.ReactNode; title: string; content: string }) => (
  <div className="text-center">
    <div className="flex justify-center text-saasha-rose dark:text-dark-accent">{icon}</div>
    <h3 className="mt-4 text-lg font-medium text-saasha-brown dark:text-dark-text">{title}</h3>
    <p className="mt-2 text-saasha-brown/70 dark:text-dark-text/70">{content}</p>
  </div>
);

export default Contact;
