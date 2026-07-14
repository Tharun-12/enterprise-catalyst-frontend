export type ProductStatus = 'active' | 'draft' | 'archived';
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'closed';
export type InquiryStatus = 'new' | 'in-review' | 'responded' | 'closed';

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logoText: string;
  country: string;
  description: string;
  website: string;
  productCount: number;
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

export interface SpecificationGroup {
  groupName: string;
  fields: { key: string; label: string; value: string }[];
}

export interface DownloadResource {
  name: string;
  type: 'pdf' | 'datasheet' | 'manual' | 'brochure';
  size: string;
  url: string;
}

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
  features: string[];
  specifications: Record<string, string>;
  specGroups: SpecificationGroup[];
  gallery: string[];
  price: number;
  currency: string;
  status: ProductStatus;
  isPopular: boolean;
  isNew: boolean;
  rating: number;
  reviewCount: number;
  downloads: DownloadResource[];
  relatedProductIds: string[];
  createdAt: string;
  warranty: string;
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
