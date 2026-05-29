export interface AffiliateLink {
  id: number;
  name: string;
  slug: string;
  category?: string;
  description?: string;
  tracking_url: string;
  comparison_data?: unknown;
  position?: number;
}

export interface Article {
  id: number;
  title: string;
  slug: string;
  locale: string;
  content_type: string;
  excerpt?: string;
  ai_summary?: string;
  key_points?: string[];
  body?: string;
  featured_image?: string;
  featured_image_optimized?: string;
  discover_thumbnail?: string;
  is_breaking?: boolean;
  is_featured?: boolean;
  human_reviewed?: boolean;
  fact_checked?: boolean;
  sources?: { title: string; url: string }[];
  source_references?: { title: string; url: string }[];
  content_quality?: {
    plagiarism_score?: number;
    hallucination_risk?: number;
    spam_score?: number;
    readability_score?: number;
    seo_score?: number;
    fact_checks?: unknown[];
    recommendations?: unknown[];
  };
  india_impact_score?: number;
  india_impact_summary?: string;
  ai_opportunity_score?: number;
  ai_opportunity_summary?: string;
  audience_roles?: string[];
  timeline?: { time: string; event: string }[];
  faqs?: { question: string; answer: string }[];
  reading_time_minutes?: number;
  views_count?: number;
  published_at?: string;
  updated_at?: string;
  is_fresh?: boolean;
  discover_ready?: boolean;
  category?: { name: string; slug: string };
  author?: {
    name: string;
    avatar?: string;
    bio?: string;
    is_verified?: boolean;
    designation?: string;
    slug?: string;
    expertise_topics?: string[];
    social_links?: { twitter?: string; linkedin?: string };
  };
  tags?: string[];
  seo?: {
    meta_title?: string;
    meta_description?: string;
    og_image?: string;
    discover_thumbnail?: string;
    schema_markup?: unknown;
  };
  affiliate_links?: AffiliateLink[];
}

export interface WebStory {
  id: number;
  title: string;
  slug: string;
  cover_image: string;
  locale: string;
  published_at?: string;
}

export interface Author {
  id: number;
  display_name: string;
  slug: string;
  bio?: string;
  avatar?: string;
  designation?: string;
  is_verified?: boolean;
  expertise_topics?: string[];
  social_links?: { twitter?: string; linkedin?: string };
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  locale: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta?: { current_page: number; last_page: number; total: number };
}
