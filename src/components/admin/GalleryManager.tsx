import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { Database } from '../../types/supabase';
import toast from 'react-hot-toast';

type GalleryImage = Database['public']['Tables']['gallery_images']['Row'];
type GalleryImageInsert = Database['public']['Tables']['gallery_images']['Insert'];

const CLOUDINARY_PRESET = 'saasha_blog';
const CLOUD_NAME = 'daoicwuqc';

interface UploadedImage {
  url: string;
  isCover: boolean;
}

const GalleryManager: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<GalleryImageInsert>({
    title: '',
    description: '',
    image_url: '',
    category: '',
    published: true,
    order: 0,
    group_id: null,
    is_cover: false
  });
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [groupedImages, setGroupedImages] = useState<{ [key: string]: GalleryImage[] }>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => {
    // Group images by group_id
    const grouped = images.reduce((acc, img) => {
      if (img.group_id) {
        if (!acc[img.group_id]) {
          acc[img.group_id] = [];
        }
        acc[img.group_id].push(img);
      }
      return acc;
    }, {} as { [key: string]: GalleryImage[] });

    setGroupedImages(grouped);
  }, [images]);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .order('order', { ascending: true });

      if (error) throw error;
      setImages(data || []);

      // Extract unique categories
      const uniqueCategories = [...new Set((data || []).map(img => img.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching gallery images:', error);
      toast.error('Failed to load gallery images');
    } finally {
      setLoading(false);
    }
  };



  const handleSetCover = (index: number) => {
    setUploadedImages(prev => prev.map((img, i) => ({
      ...img,
      isCover: i === index
    })));
    setFormData(prev => ({
      ...prev,
      image_url: uploadedImages[index].url,
      is_cover: true
    }));
  };

  const handleRemoveImage = (index: number) => {
    setUploadedImages(prev => {
      const newImages = prev.filter((_, i) => i !== index);
      // If we removed the cover image, set the first remaining image as cover
      if (prev[index].isCover && newImages.length > 0) {
        newImages[0].isCover = true;
        setFormData(prev => ({
          ...prev,
          image_url: newImages[0].url,
          is_cover: true
        }));
      }
      return newImages;
    });
  };

  const handleImageUpload = () => {
    if (!window.cloudinary) {
      toast.error('Image upload is initializing. Please try again in a moment.');
      return;
    }

    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: CLOUD_NAME,
        uploadPreset: CLOUDINARY_PRESET,
        sources: ['local', 'url', 'camera'],
        multiple: true,
        maxFiles: 10,
        maxFileSize: 10000000, // 10MB
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
          const newImage = {
            url: result.info.secure_url,
            isCover: uploadedImages.length === 0
          };
          setUploadedImages(prev => [...prev, newImage]);
          if (uploadedImages.length === 0) {
            setFormData(prev => ({
              ...prev,
              image_url: result.info.secure_url,
              is_cover: true
            }));
          }
          toast.success('Image uploaded successfully');
        }
      }
    );

    widget.open();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (uploadedImages.length === 0 && !editingId) {
        throw new Error('Please upload at least one image');
      }

      // Ensure at least one image is marked as cover when creating new images
      if (!editingId && !uploadedImages.some(img => img.isCover)) {
        throw new Error('Please select a cover image');
      }

      if (editingId) {
        // Check if we're editing a group image
        const imageToEdit = images.find(img => img.id === editingId);
        if (imageToEdit?.group_id) {
          // Update all images in the group with the same metadata
          const groupId = imageToEdit.group_id;
          const { error } = await supabase
            .from('gallery_images')
            .update({
              title: formData.title,
              description: formData.description,
              category: formData.category,
              published: formData.published,
              updated_at: new Date().toISOString()
            })
            .eq('group_id', groupId);

          if (error) throw error;
          toast.success('Gallery group updated successfully');
        } else {
          // Update single image
          const { error } = await supabase
            .from('gallery_images')
            .update({
              title: formData.title,
              description: formData.description,
              image_url: formData.image_url,
              category: formData.category,
              published: formData.published,
              order: formData.order || 0,
              updated_at: new Date().toISOString()
            })
            .eq('id', editingId);

          if (error) throw error;
          toast.success('Gallery image updated successfully');
        }
      } else {
        // Create new group of images
        const groupId = crypto.randomUUID();
        const imagesToInsert = uploadedImages.map((image, index) => ({
          ...formData,
          image_url: image.url,
          group_id: uploadedImages.length > 1 ? groupId : null,
          is_cover: image.isCover,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          order: (formData.order || 0) + index
        }));

        const { error } = await supabase
          .from('gallery_images')
          .insert(imagesToInsert);

        if (error) throw error;
        toast.success('Gallery images added successfully');
      }

      // Reset form and refresh images
      resetForm();
      fetchImages();
    } catch (error: any) {
      console.error('Error saving gallery image:', error);
      toast.error(error.message || 'Failed to save gallery image');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (image: GalleryImage) => {
    // If this is a group cover image, we're editing the group properties
    const isGroupCover = image.group_id && image.is_cover;
    
    setFormData({
      title: image.title,
      description: image.description,
      image_url: image.image_url,
      category: image.category,
      published: image.published,
      order: image.order,
      group_id: image.group_id,
      is_cover: image.is_cover
    });
    
    // For group edits, we'll update all images in the group with the same metadata
    setEditingId(image.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;

    try {
      // Check if this is a group ID
      const isGroupId = Object.keys(groupedImages).includes(id);
      
      if (isGroupId) {
        // Delete all images in the group
        const { error } = await supabase
          .from('gallery_images')
          .delete()
          .eq('group_id', id);

        if (error) throw error;
        toast.success('Gallery group deleted successfully');
      } else {
        // Delete single image
        const { error } = await supabase
          .from('gallery_images')
          .delete()
          .eq('id', id);

        if (error) throw error;
        toast.success('Gallery image deleted successfully');
      }
      
      fetchImages();
    } catch (error) {
      console.error('Error deleting gallery image:', error);
      toast.error('Failed to delete gallery image');
    }
  };



  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image_url: '',
      category: '',
      published: true,
      order: images.length,
      group_id: null,
      is_cover: false
    });
    setUploadedImages([]);
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-saasha-brown dark:text-dark-text">
          Gallery Images
        </h2>
        {!showForm ? (
          <button
            onClick={() => {
              setFormData({
                title: '',
                description: '',
                image_url: '',
                category: '',
                published: true,
                order: images.length
              });
              setEditingId(null);
              setShowForm(true);
            }}
            className="bg-saasha-rose text-white px-4 py-2 rounded-md hover:bg-saasha-rose/90"
          >
            Add New Image
          </button>
        ) : (
          <button
            onClick={resetForm}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
          >
            Cancel
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 dark:bg-dark-secondary/50 p-6 rounded-lg mb-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                Category
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-saasha-rose focus:border-saasha-rose dark:bg-dark-secondary dark:border-gray-600 dark:text-dark-text"
                  disabled={isSubmitting}
                  list="categories"
                  placeholder="Enter or select a category"
                />
                <datalist id="categories">
                  {categories.map((category, index) => (
                    <option key={index} value={category} />
                  ))}
                </datalist>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-saasha-brown dark:text-dark-text mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-saasha-rose focus:border-saasha-rose dark:bg-dark-secondary dark:border-gray-600 dark:text-dark-text"
              disabled={isSubmitting}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-saasha-brown dark:text-dark-text">
                  Images
                </label>
                <button
                  type="button"
                  onClick={handleImageUpload}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-dark-secondary dark:hover:bg-dark-secondary/80 text-saasha-brown dark:text-dark-text rounded-md focus:outline-none focus:ring-2 focus:ring-saasha-rose flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  {uploadedImages.length === 0 ? 'Add Images' : 'Add More Images'}
                </button>
              </div>

              {uploadedImages.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {uploadedImages.map((image, index) => (
                    <div key={image.url} className="relative group">
                      <div className="aspect-w-4 aspect-h-3 rounded-lg overflow-hidden">
                        <img 
                          src={image.url} 
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleSetCover(index)}
                            className={`p-2 rounded-full ${image.isCover ? 'bg-saasha-rose text-white' : 'bg-white/80 text-gray-800 hover:bg-white'}`}
                            title={image.isCover ? 'Cover Image' : 'Set as Cover'}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                            </svg>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="p-2 rounded-full bg-white/80 text-red-600 hover:bg-white"
                            title="Remove Image"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      {image.isCover && (
                        <div className="absolute top-2 left-2 bg-saasha-rose text-white text-xs px-2 py-1 rounded-full">
                          Cover
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-saasha-brown dark:text-dark-text mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-saasha-rose focus:border-saasha-rose dark:bg-dark-secondary dark:border-gray-600 dark:text-dark-text"
                  disabled={isSubmitting}
                  min={0}
                />
              </div>
              <div className="flex items-end">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="h-4 w-4 text-saasha-rose focus:ring-saasha-rose border-gray-300 rounded"
                    disabled={isSubmitting}
                  />
                  <span className="text-sm font-medium text-saasha-brown dark:text-dark-text">Published</span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={resetForm}
              disabled={isSubmitting}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-secondary hover:bg-gray-50 dark:hover:bg-dark-secondary/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-saasha-rose disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-saasha-rose hover:bg-saasha-rose/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-saasha-rose disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              ) : editingId ? 'Update Image' : 'Add Image'}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <svg className="animate-spin h-10 w-10 text-saasha-rose" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      ) : (
        <>
          {images.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 dark:bg-dark-secondary/30 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">No gallery images found. Add your first image!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Filter to show only standalone images or cover images for groups */}
              {images.filter(img => !img.group_id || (img.group_id && img.is_cover)).map((image) => {
                const isGroupCover = image.group_id && image.is_cover;
                const groupImages = isGroupCover ? images.filter(img => img.group_id === image.group_id) : [];
                
                return (
                  <div key={image.id} className="bg-white dark:bg-dark-secondary rounded-lg shadow-md overflow-hidden">
                    <div className="relative h-48">
                      <img 
                        src={image.image_url} 
                        alt={image.title} 
                        className="w-full h-full object-cover"
                      />
                      {!image.published && (
                        <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                          Draft
                        </div>
                      )}
                      {isGroupCover && (
                        <div className="absolute top-2 left-2 bg-saasha-rose text-white text-xs px-2 py-1 rounded-full">
                          Group ({groupImages.length} photos)
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-medium text-saasha-brown dark:text-dark-text">{image.title}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{image.category}</p>
                        </div>
                        <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-gray-200 dark:bg-dark-primary text-xs font-medium text-gray-800 dark:text-gray-200">
                          {image.order}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{image.description}</p>
                      <div className="mt-4 flex justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(image)}
                          className="text-xs px-2 py-1 bg-gray-100 dark:bg-dark-primary text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-dark-primary/80"
                        >
                          {isGroupCover ? 'Edit Group' : 'Edit'}
                        </button>
                        <button
                          onClick={() => handleDelete(isGroupCover ? image.group_id! : image.id)}
                          className="text-xs px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-900/50"
                        >
                          {isGroupCover ? 'Delete Group' : 'Delete'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default GalleryManager;
