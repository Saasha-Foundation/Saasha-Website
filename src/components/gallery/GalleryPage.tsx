import { useState, useEffect, useCallback } from 'react';
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
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const location = useLocation();

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!selectedImage?.group_id) return;
    
    const groupImages = images.filter(img => img.group_id === selectedImage.group_id);
    const currentIndex = groupImages.findIndex(img => img.id === selectedImage.id);
    
    if (e.key === 'ArrowLeft' && currentIndex > 0) {
      setSelectedImage(groupImages[currentIndex - 1]);
    } else if (e.key === 'ArrowRight' && currentIndex < groupImages.length - 1) {
      setSelectedImage(groupImages[currentIndex + 1]);
    } else if (e.key === 'Escape') {
      setSelectedImage(null);
    }
  }, [selectedImage, images]);

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

  useEffect(() => {
    if (selectedImage) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [selectedImage, handleKeyDown]);

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

  // Get only cover images or standalone images
  const filteredImages = (selectedCategory === 'all' 
    ? images 
    : images.filter(img => img.category === selectedCategory))
    .filter(img => !img.group_id || img.is_cover);

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
                <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 [column-fill:_balance] w-full">
                  {filteredImages.map((image) => {
                    const isGroup = image.group_id && image.is_cover;
                    const groupImages = isGroup ? images.filter(img => img.group_id === image.group_id) : [];
                    
                    return (
                      <div 
                        key={image.id}
                        className="break-inside-avoid mb-6"
                      >
                        <div 
                          onClick={() => setSelectedImage(image)}
                          className={`group relative overflow-hidden rounded-2xl shadow-lg cursor-pointer transform transition-all duration-500 hover:shadow-xl ${isGroup ? 'hover:scale-[1.02]' : 'hover:scale-[1.03]'}`}
                        >
                          <div className={`relative ${isGroup ? 'aspect-[4/5]' : 'aspect-[3/4]'}`}>
                            <img 
                              src={image.image_url} 
                              alt={image.title} 
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              loading="lazy"
                            />
                            {/* Gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                            
                            {/* Content overlay */}
                            <div className="absolute inset-0 p-6 flex flex-col justify-end translate-y-6 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                              <h3 className="text-white text-xl font-semibold tracking-wide">{image.title}</h3>
                              <p className="text-white/90 text-sm mt-2 font-medium">{image.category}</p>
                              
                              {isGroup && (
                                <div className="mt-4 flex items-center gap-4">
                                  <div className="flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span className="text-white font-medium">
                                      {groupImages.length} photos
                                    </span>
                                  </div>
                                  <button 
                                    className="ml-auto bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-medium hover:bg-white/30 transition-colors duration-300"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedImage(image);
                                    }}
                                  >
                                    View All
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* Group image preview */}
                          {isGroup && groupImages.length > 1 && (
                            <div className="absolute -bottom-1 left-0 right-0 h-20 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                              <div className="absolute bottom-4 left-4 right-4 flex gap-2 overflow-x-auto hide-scrollbar">
                                {groupImages.slice(1, 5).map((groupImage, index) => (
                                  <div 
                                    key={groupImage.id} 
                                    className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 border-white/30"
                                  >
                                    <img 
                                      src={groupImage.image_url} 
                                      alt={`Preview ${index + 2}`}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                ))}
                                {groupImages.length > 5 && (
                                  <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 border-white/30 bg-black/50 flex items-center justify-center text-white text-sm font-medium">
                                    +{groupImages.length - 4}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={() => setSelectedImage(null)}
        >
          {/* Main content */}
          <div 
            className="relative w-full h-full flex items-center justify-center p-4 md:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image container */}
            <div className="relative max-w-7xl w-full h-full flex flex-col md:flex-row gap-8">
              {/* Left section - Image */}
              <div className="flex-1 relative flex items-center justify-center min-h-0">
                <img 
                  src={selectedImage.image_url} 
                  alt={selectedImage.title} 
                  className="max-w-full max-h-full object-contain rounded-lg"
                />
                
                {/* Navigation arrows for group images */}
                {selectedImage.group_id && (
                  <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
                    {images
                      .filter(img => img.group_id === selectedImage.group_id)
                      .map((img, index, arr) => {
                        if (img.id === selectedImage.id) {
                          return (
                            <div key={img.id} className="flex gap-4 w-full justify-between">
                              {index > 0 && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedImage(arr[index - 1]);
                                  }}
                                  className="pointer-events-auto p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors duration-300 group"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white transform group-hover:-translate-x-0.5 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                  </svg>
                                </button>
                              )}
                              {index < arr.length - 1 && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedImage(arr[index + 1]);
                                  }}
                                  className="pointer-events-auto p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors duration-300 group"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white transform group-hover:translate-x-0.5 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                  </svg>
                                </button>
                              )}
                            </div>
                          );
                        }
                        return null;
                      })
                    }
                  </div>
                )}
              </div>
              
              {/* Right section - Info */}
              <div className="w-full md:w-96 bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 flex flex-col">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white">{selectedImage.title}</h3>
                    <p className="text-white/80 mt-1">{selectedImage.category}</p>
                  </div>
                  <button 
                    onClick={() => setSelectedImage(null)}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-300 group"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white transform group-hover:rotate-90 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                {selectedImage.description && (
                  <p className="text-white/90 text-sm leading-relaxed">{selectedImage.description}</p>
                )}
                
                {/* Thumbnail navigation for group images */}
                {selectedImage.group_id && (
                  <div className="mt-auto pt-6">
                    <div className="flex flex-wrap gap-2">
                      {images
                        .filter(img => img.group_id === selectedImage.group_id)
                        .map((img, index) => (
                          <button
                            key={img.id}
                            onClick={() => setSelectedImage(img)}
                            className={`relative w-16 h-16 rounded-lg overflow-hidden transition-transform duration-300 ${img.id === selectedImage.id ? 'ring-2 ring-white scale-105' : 'opacity-60 hover:opacity-100'}`}
                          >
                            <img 
                              src={img.image_url} 
                              alt={`Thumbnail ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))
                      }
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
};

export default GalleryPage;
