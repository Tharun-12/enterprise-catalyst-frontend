// src/types/index.ts
export type ProductStatus = 'active' | 'draft' | 'archived';
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'closed';
export type InquiryStatus = 'new' | 'in-review' | 'responded' | 'closed';

export interface Brand {
  [x: string]: string;
  id: string;
  name: string;
  slug: string;
  logoText: string;
  country: string;
  description: string;
  website: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  color: string;
  productCount: number;
  featured: boolean;
}

export interface SpecField {
  key: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'boolean';
  unit?: string;
  options?: string[];
}

export interface SpecGroup {
  groupName: string;
  fields: { key: string; label: string; value: string }[];
}

// src/types/index.ts
export interface Variant {
  id: number;
  color_name: string;
  color: string; // Add this for color name
  color_hex: string;
  price?: string; // Make optional
  min_price?: string; // Add this
  max_price?: string; // Add this
  stock: number;
  image_url: string;
  // Additional fields
  variant_name?: string;
  part_code?: string;
  category?: string;
  sub_category?: string;
  brand?: string;
  description?: string;
  spec_type?: string;
  size?: string;
  availability?: string;
  datasheet_url?: string;
}


export interface DownloadResource {
  name: string;
  type: 'pdf' | 'datasheet' | 'manual' | 'brochure';
  size: string;
  url: string;
}

export interface ProductVariant {
  id: number;
  color_name: string;
  color_hex: string;
  price: string;
  stock: number;
  image_url: string;
}

// src/types/index.ts - Update Product interface
export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  brandId: string;
  brandName: string;
  categoryId: string;
  categoryName: string;
  shortDescription: string;
  description: string;
  gallery: string[];
  features: string[];
  specifications: Record<string, any>;
  currency: string;
  relatedProductIds: string[];
  specGroups: SpecGroup[];
  price: number;
  minPrice?: number;
  maxPrice?: number;
  originalPrice: number;
  discountPercentage: number;
  status: 'active' | 'inactive' | 'draft';
  isPopular: boolean;
  isNew: boolean;
  rating: number;
  reviewCount: number;
  downloads: { name: string; type: 'pdf' | 'zip' | 'file'; size: string; url: string }[];
  createdAt: string;
  warranty: string;
  variants?: Variant[];
  hasVariants: boolean;
  stock: number;
}

export interface WishlistLead {
  id: string;
  name: string;
  phone: string;
  email: string;
  company: string;
  city: string;
  remarks: string;
  productId: string;
  productName: string;
  status: LeadStatus;
  assignedTo: string;
  notes: string;
  createdAt: string;
}

export interface Inquiry {
  id: string;
  name: string;
  phone: string;
  email: string;
  company: string;
  productId: string;
  productName: string;
  message: string;
  status: InquiryStatus;
  createdAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  message: string;
  rating: number;
  avatar: string;
}

export interface Activity {
  id: string;
  type: 'product' | 'lead' | 'inquiry' | 'category' | 'brand';
  message: string;
  timestamp: string;
}

export interface ProductVariantExtended extends ProductVariant {
  variant_name?: string;
  part_code?: string;
  spec_type?: string;
  size?: string;
  availability?: string;
  datasheet_url?: string;
  description?: string;
}