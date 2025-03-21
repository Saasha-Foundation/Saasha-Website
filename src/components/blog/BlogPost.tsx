import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import PageLayout from '../layout/PageLayout';
import { Database } from '../../types/supabase';

type BlogPost = Database['public']['Tables']['blog_posts']['Row'];

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPost();
  }, [slug]);

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) throw error;
      setPost(data);
    } catch (error) {
      console.error('Error fetching post:', error);
      navigate('/blogs');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-saasha-brown"></div>
        </div>
      </PageLayout>
    );
  }

  if (!post) {
    return (
      <PageLayout>
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold text-saasha-brown">Post not found</h1>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header Image */}
        {post.header_image && (
          <div className="w-full h-auto mb-6 rounded-lg overflow-hidden">
            <img
              src={post.header_image}
              alt={post.title}
              className="w-full h-full"
            />
          </div>
        )}

        {/* Meta Information Box */}
        <div className="bg-saasha-cream/20 dark:bg-dark-secondary rounded-lg p-6 mb-2">
          <h1 className="text-4xl font-bold text-saasha-brown dark:text-dark-text mb-4">
            {post.title}
          </h1>
          
          <div className="space-y-3">
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-saasha-rose/20 dark:bg-dark-accent px-3 py-1 rounded-full text-sm text-saasha-brown dark:text-dark-text"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            
            <div className="bg-saasha-brown/10 dark:bg-dark-accent/50 px-4 py-2 rounded-full inline-block text-sm text-saasha-brown dark:text-dark-text/80">
              {new Date(post.created_at!).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>
        </div>

        {/* Content Box */}
        <div className="bg-white dark:bg-dark-secondary rounded-lg shadow-lg p-8">
          <div 
            className="prose prose-lg dark:prose-invert max-w-none
              prose-headings:text-saasha-brown dark:prose-headings:text-dark-text
              prose-h1:text-4xl prose-h1:font-bold
              prose-h2:text-3xl prose-h2:font-semibold
              prose-h3:text-2xl prose-h3:font-medium
              prose-h4:text-xl
              prose-p:text-base prose-p:text-gray-700 dark:prose-p:text-gray-300
              prose-a:text-saasha-rose hover:prose-a:text-saasha-rose/80
              prose-strong:text-saasha-brown dark:prose-strong:text-dark-text
              prose-ul:ml-6 prose-ul:list-disc prose-ul:list-outside
              prose-ol:ml-6 prose-ol:list-decimal prose-ol:list-outside
              prose-li:my-2 prose-li:text-gray-700 dark:prose-li:text-gray-300
              marker:text-gray-700 dark:marker:text-gray-300"
            dangerouslySetInnerHTML={{ __html: post.content || '' }}
          />
        </div>
      </article>
    </PageLayout>
  );
};

export default BlogPost;
