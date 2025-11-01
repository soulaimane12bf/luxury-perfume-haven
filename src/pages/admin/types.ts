export type Product = {
  id: string;
  name: string;
  brand?: string;
  price?: number | string;
  old_price?: number | string | null;
  category?: string;
  type?: string;
  size?: string;
  description?: string;
  stock?: number | string;
  image_urls?: string[];
  best_selling?: boolean;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
};

export type Review = {
  id: string;
  name: string;
  customer_name?: string;
  rating: number;
  comment?: string;
  approved?: boolean;
  is_approved?: boolean;
  product_id?: string;
  images?: string[];
  likes?: number;
  dislikes?: number;
  created_at?: string;
  createdAt?: string;
};

export type OrderItem = {
  id: string;
  name?: string;
  quantity?: number;
  price?: number;
  image_url?: string;
  image?: string;
  image_urls?: string[];
  variant?: string;
};

export type Order = {
  id: string;
  customer_name?: string;
  customer_phone?: string;
  customer_email?: string;
  customer_address?: string;
  shipping_address?: string;
  city?: string;
  items?: OrderItem[];
  total_amount?: number;
  status?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
};

export type Slider = {
  id: string;
  image_url?: string;
  title?: string;
  subtitle?: string;
  button_text?: string;
  button_link?: string;
  order?: number;
  active?: boolean;
};

export type PaginatedResponse = {
  products: Product[];
  total: number;
  totalPages: number;
};

export const ADMIN_TABS = ['orders', 'products', 'categories', 'reviews', 'bestsellers', 'sliders', 'profile'] as const;

export type AdminTab = typeof ADMIN_TABS[number];

export type DeleteTarget = {
  type: 'product' | 'category' | 'review' | 'order' | 'slider';
  id: string;
  name?: string;
  meta?: string;
};

export type CategoryForm = {
  name: string;
  slug: string;
  description: string;
};
