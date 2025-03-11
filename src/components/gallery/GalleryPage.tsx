import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Database } from '../../types/supabase';
import PageLayout from '../layout/PageLayout';
import { useLocation } from 'react-router-dom';

type GalleryImage = Database['public']['Tables']['gallery_images']['Row'];

const GalleryPage = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const location = useLocation();

  useEffect(() => {
    fetchImages();
  }, []);

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [location.pathname, location.search]);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .eq('published', true)
        .order('order', { ascending: true });

      if (error) throw error;
      
      setImages(data || []);
      
      // Extract unique categories
      const uniqueCategories = [...new Set((data || []).map(img => img.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching gallery images:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredImages = selectedCategory === 'all' 
    ? images 
    : images.filter(img => img.category === selectedCategory);

  return (
    <PageLayout>
      <div className="py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-saasha-brown dark:text-dark-text mb-4">
              Our Gallery
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Explore our collection of images showcasing our events, activities, and the impact we're making in the community.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
                selectedCategory === 'all'
                  ? 'bg-saasha-rose text-white'
                  : 'bg-gray-100 dark:bg-dark-secondary text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-dark-secondary/80'
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
                  selectedCategory === category
                    ? 'bg-saasha-rose text-white'
                    : 'bg-gray-100 dark:bg-dark-secondary text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-dark-secondary/80'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-saasha-rose"></div>
            </div>
          ) : (
            <>
              {filteredImages.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-gray-500 dark:text-gray-400">No images found in this category.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredImages.map((image) => (
                    <div 
                      key={image.id}
                      onClick={() => setSelectedImage(image)}
                      className="group relative overflow-hidden rounded-lg shadow-md cursor-pointer transform transition duration-300 hover:scale-105"
                    >
                      <div className="aspect-w-4 aspect-h-3">
                        <img 
                          src={image.image_url} 
                          alt={image.title} 
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                        <h3 className="text-white text-lg font-semibold">{image.title}</h3>
                        <p className="text-white/80 text-sm mt-1">{image.category}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div 
            className="max-w-5xl w-full bg-white dark:bg-dark-secondary rounded-lg overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <img 
                src={selectedImage.image_url} 
                alt={selectedImage.title} 
                className="w-full h-auto max-h-[80vh] object-contain"
              />
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold text-saasha-brown dark:text-dark-text">{selectedImage.title}</h3>
              <p className="text-sm text-saasha-rose dark:text-dark-accent mt-1">{selectedImage.category}</p>
              <p className="mt-4 text-gray-700 dark:text-gray-300">{selectedImage.description}</p>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
};

export default GalleryPage;
