import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useMaintenance } from '../../context/MaintenanceContext';
import { supabase } from '../../lib/supabase';
import RichTextEditor from './RichTextEditor';
import BlogPostManager from './BlogPostManager';
import EventManager from './EventManager';
import VolunteerManager from './VolunteerManager';
import FAQManager from './FAQManager';
import GalleryManager from './GalleryManager';
import PageLayout from '../layout/PageLayout';
import { Database } from '../../types/supabase';

type BlogPost = Database['public']['Tables']['blog_posts']['Insert'];

declare global {
  interface Window {
    cloudinary: any;
  }
}

const CLOUDINARY_PRESET = 'saasha_blog'; // Create this in your Cloudinary dashboard

const AdminDashboard = () => {
  const { logout } = useAuth();
  const { isMaintenanceMode, toggleMaintenanceMode, isLoading: maintenanceLoading } = useMaintenance();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'blogs' | 'events' | 'volunteers' | 'faqs' | 'gallery' | 'settings'>('blogs');
  const [formData, setFormData] = useState<BlogPost>({
    title: '',
    content: '',
    header_image: '',
    tags: [],
    slug: '',
  });
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showManager, setShowManager] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const handleEditPost = (event: CustomEvent<BlogPost>) => {
      const post = event.detail;
      setFormData(post);
      setEditingId(post.id || null);
      setShowManager(false);
    };

    window.addEventListener('editBlogPost', handleEditPost as EventListener);
    return () => {
      window.removeEventListener('editBlogPost', handleEditPost as EventListener);
    };
  }, []);

  useEffect(() => {
    // Load Cloudinary widget script
    const script = document.createElement('script');
    script.src = 'https://upload-widget.cloudinary.com/global/all.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleImageUpload = () => {
    if (!window.cloudinary) {
      alert('Image upload is initializing. Please try again in a moment.');
      return;
    }

    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: 'daoicwuqc',
        uploadPreset: CLOUDINARY_PRESET,
        sources: ['local', 'url', 'camera'],
        multiple: false,
        maxFiles: 1,
        maxFileSize: 5000000, // 5MB
        styles: {
          palette: {
            window: '#FFFFFF',
            windowBorder: '#90A0B3',
            tabIcon: '#8C7662',
            menuIcons: '#8C7662',
            textDark: '#8C7662',
            textLight: '#FFFFFF',
            link: '#8C7662',
            action: '#E4A988',
            inactiveTabIcon: '#B3B3B3',
            error: '#F44235',
            inProgress: '#8C7662',
            complete: '#20B832',
            sourceBg: '#FFFFFF'
          }
        }
      },
      (error: any, result: any) => {
        if (!error && result && result.event === 'success') {
          setFormData(prev => ({
            ...prev,
            header_image: result.info.secure_url
          }));
        }
      }
    );

    widget.open();
  };

  const generateUniqueSlug = async (title: string, currentId?: string): Promise<string> => {
    const baseSlug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
    
    let finalSlug = baseSlug;
    let counter = 0;
    
    while (true) {
      // Check if slug exists, excluding the current post if editing
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id')
        .eq('slug', finalSlug)
        .not('id', 'eq', currentId)
        .maybeSingle();

      if (error) throw error;
      
      // If no post found with this slug, or it's the current post being edited, we can use this slug
      if (!data) {
        return finalSlug;
      }
      
      // If slug exists, append counter and try again
      counter++;
      finalSlug = `${baseSlug}-${counter}`;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const slug = await generateUniqueSlug(formData.title, editingId || undefined);
      let error;

      if (editingId) {
        // Update existing post - only send fields that should be updated
        const updateData = {
          title: formData.title,
          content: formData.content,
          header_image: formData.header_image,
          tags: formData.tags,
          slug: slug,
          updated_at: new Date().toISOString()
        };

        ({ error } = await supabase
          .from('blog_posts')
          .update(updateData)
          .eq('id', editingId));
      } else {
        // Create new post - exclude id field to let Supabase auto-generate it
        const insertData = {
          title: formData.title,
          content: formData.content,
          header_image: formData.header_image,
          tags: formData.tags,
          slug: slug,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        ({ error } = await supabase
          .from('blog_posts')
          .insert([insertData]));
      }

      if (error) throw error;

      // Reset form
      setFormData({
        title: '',
        content: '',
        header_image: '',
        tags: [],
        slug: '',
      });
      setEditingId(null);
      setShowManager(true);
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error: any) {
      console.error('Error saving post:', error);
      const errorMessage = error.message || 'Failed to save blog post. Please try again.';
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTagAdd = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  return (
    <PageLayout>
      <div className="bg-gray-100 dark:bg-dark-primary min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-saasha-brown dark:text-dark-text">Admin Dashboard</h1>
            <button
              onClick={() => {
                logout();
                navigate('/admin');
              }}
              className="bg-saasha-brown text-white px-4 py-2 rounded-md hover:bg-saasha-brown/90"
            >
              Logout
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700 mb-8">
            <button
              onClick={() => setActiveTab('blogs')}
              className={`px-4 py-2 -mb-px text-sm font-medium ${
                activeTab === 'blogs'
                  ? 'border-b-2 border-saasha-rose text-saasha-rose'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Blog Posts
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`px-4 py-2 -mb-px text-sm font-medium ${
                activeTab === 'events'
                  ? 'border-b-2 border-saasha-rose text-saasha-rose'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Events
            </button>
            <button
              onClick={() => setActiveTab('volunteers')}
              className={`px-4 py-2 -mb-px text-sm font-medium ${
                activeTab === 'volunteers'
                  ? 'border-b-2 border-saasha-rose text-saasha-rose'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Volunteers
            </button>
            <button
              onClick={() => setActiveTab('faqs')}
              className={`px-4 py-2 -mb-px text-sm font-medium ${
                activeTab === 'faqs'
                  ? 'border-b-2 border-saasha-rose text-saasha-rose'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              FAQs
            </button>
            <button
              onClick={() => setActiveTab('gallery')}
              className={`px-4 py-2 -mb-px text-sm font-medium ${
                activeTab === 'gallery'
                  ? 'border-b-2 border-saasha-rose text-saasha-rose'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Gallery
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-2 -mb-px text-sm font-medium ${
                activeTab === 'settings'
                  ? 'border-b-2 border-saasha-rose text-saasha-rose'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Settings
            </button>
          </div>

          {/* Content Area */}
          <div className="bg-white dark:bg-dark-secondary rounded-lg shadow-lg p-8">
            {activeTab === 'blogs' && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-saasha-brown dark:text-dark-text">
                    Blog Posts
                  </h2>
                  {showManager && (
                    <button
                      onClick={() => {
                        setFormData({
                          title: '',
                          content: '',
                          header_image: '',
                          tags: [],
                          slug: '',
                        });
                        setEditingId(null);
                        setShowManager(false);
                      }}
                      className="bg-saasha-rose text-white px-4 py-2 rounded-md hover:bg-saasha-rose/90"
                    >
                      Create New Post
                    </button>
                  )}
                </div>
                {showManager ? (
                  <BlogPostManager />
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-saasha-brown dark:text-dark-text mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-saasha-rose focus:border-saasha-rose dark:bg-dark-secondary dark:border-gray-600 dark:text-dark-text"
                        disabled={isSubmitting}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-saasha-brown dark:text-dark-text mb-1">
                        Header Image
                      </label>
                      <button
                        type="button"
                        onClick={handleImageUpload}
                        disabled={isSubmitting}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-saasha-rose focus:border-saasha-rose dark:bg-dark-secondary dark:border-gray-600 dark:text-dark-text text-left disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {formData.header_image ? 'Change Image' : 'Upload Image'}
                      </button>
                      {formData.header_image && (
                        <div className="mt-2">
                          <img
                            src={formData.header_image}
                            alt="Header preview"
                            className="h-32 object-cover rounded"
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-saasha-brown dark:text-dark-text mb-1">
                        Tags (Press Enter to add)
                      </label>
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleTagAdd}
                        disabled={isSubmitting}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-saasha-rose focus:border-saasha-rose dark:bg-dark-secondary dark:border-gray-600 dark:text-dark-text disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="Enter tags..."
                      />
                      <div className="mt-2 flex flex-wrap gap-2">
                        {formData.tags?.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-saasha-rose text-white"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => handleTagRemove(tag)}
                              disabled={isSubmitting}
                              className="ml-1 hover:text-saasha-cream disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-saasha-brown dark:text-dark-text mb-1">
                        Content
                      </label>
                      <RichTextEditor
                        value={formData.content}
                        onChange={(value) => setFormData({ ...formData, content: value })}
                      />
                    </div>

                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({
                            title: '',
                            content: '',
                            header_image: '',
                            tags: [],
                            slug: '',
                          });
                          setEditingId(null);
                          setShowManager(true);
                        }}
                        disabled={isSubmitting}
                        className="w-1/2 bg-gray-400 text-white py-2 px-4 rounded-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-1/2 bg-saasha-rose text-white py-2 px-4 rounded-md hover:bg-saasha-rose/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-saasha-rose disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Publishing...
                          </span>
                        ) : editingId ? 'Save Changes' : 'Publish Blog Post'}
                      </button>
                    </div>
                  </form>
                )}
              </>
            )}

            {activeTab === 'events' && <EventManager />}
            {activeTab === 'volunteers' && <VolunteerManager />}
            {activeTab === 'faqs' && <FAQManager />}
            {activeTab === 'gallery' && <GalleryManager />}
            {activeTab === 'settings' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-saasha-brown dark:text-dark-text mb-6">
                    Site Settings
                  </h2>
                  
                  <div className="bg-gray-50 dark:bg-dark-secondary/50 p-6 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-saasha-brown dark:text-dark-text">
                          Maintenance Mode
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          When enabled, visitors will see a maintenance page instead of the website. Admin dashboard will remain accessible.
                        </p>
                      </div>
                      <div className="flex items-center">
                        <button
                          onClick={toggleMaintenanceMode}
                          disabled={maintenanceLoading}
                          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-saasha-rose focus:ring-offset-2 ${
                            isMaintenanceMode ? 'bg-saasha-rose' : 'bg-gray-300 dark:bg-gray-600'
                          } ${maintenanceLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                          role="switch"
                          aria-checked={isMaintenanceMode}
                        >
                          <span
                            aria-hidden="true"
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              isMaintenanceMode ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                        <span className="ml-3 text-sm font-medium text-saasha-brown dark:text-dark-text">
                          {maintenanceLoading ? 'Updating...' : isMaintenanceMode ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default AdminDashboard;
