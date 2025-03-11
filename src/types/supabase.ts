export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      blog_posts: {
        Row: {
          id: string;
          title: string;
          content: string;
          header_image: string;
          tags: string[];
          created_at: string;
          updated_at: string;
          slug: string;
          published: boolean;
        };
        Insert: {
          id?: string;
          title: string;
          content: string;
          header_image: string;
          tags: string[];
          created_at?: string;
          updated_at?: string;
          slug: string;
          published?: boolean;
        };
        Update: {
          id?: string;
          title?: string;
          content?: string;
          header_image?: string;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
          slug?: string;
          published?: boolean;
        };
      };
      events: {
        Row: {
          id: string;
          title: string;
          description: string;
          image: string;
          date: string;
          location: string;
          status: 'upcoming' | 'ongoing' | 'completed';
          created_at: string;
          updated_at: string;
          slug: string;
          published: boolean;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          image: string;
          date: string;
          location: string;
          status?: 'upcoming' | 'ongoing' | 'completed';
          created_at?: string;
          updated_at?: string;
          slug: string;
          published?: boolean;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          image?: string;
          date?: string;
          location?: string;
          status?: 'upcoming' | 'ongoing' | 'completed';
          created_at?: string;
          updated_at?: string;
          slug?: string;
          published?: boolean;
        };
      };
      faqs: {
        Row: {
          id: number;
          question: string;
          answer: string;
          order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          question: string;
          answer: string;
          order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          question?: string;
          answer?: string;
          order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      gallery_images: {
        Row: {
          id: string;
          title: string;
          description: string;
          image_url: string;
          category: string;
          created_at: string;
          updated_at: string;
          published: boolean;
          order: number;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          image_url: string;
          category: string;
          created_at?: string;
          updated_at?: string;
          published?: boolean;
          order?: number;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          image_url?: string;
          category?: string;
          created_at?: string;
          updated_at?: string;
          published?: boolean;
          order?: number;
        };
        Relationships: [];
      };
      volunteer_registrations: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          phone: string;
          interests: string[];
          availability: string[];
          skills: string[];
          experience: string;
          created_at: string;
          status: 'pending' | 'approved' | 'rejected';
        };
        Insert: {
          id?: string;
          full_name: string;
          email: string;
          phone: string;
          interests: string[];
          availability: string[];
          skills: string[];
          experience: string;
          created_at?: string;
          status?: 'pending' | 'approved' | 'rejected';
        };
        Update: {
          id?: string;
          full_name?: string;
          email?: string;
          phone?: string;
          interests?: string[];
          availability?: string[];
          skills?: string[];
          experience?: string;
          created_at?: string;
          status?: 'pending' | 'approved' | 'rejected';
        };
      };
    };
  };
}
