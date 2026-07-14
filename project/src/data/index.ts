import generatedData from './generated-data.json';
import type { Brand, Category, Product, SpecField, Testimonial, Activity, WishlistLead, Inquiry } from '@/types';

export const brands = generatedData.brands as Brand[];
export const categories = generatedData.categories as (Category & { specFields: SpecField[] })[];
export const products = generatedData.products as unknown as Product[];

export const testimonials: Testimonial[] = [
  {
    id: 't1',
    name: 'Rajesh Kumar',
    role: 'IT Manager',
    company: 'TechCorp Solutions',
    message: 'MVB helped us deploy a complete surveillance system across 12 locations. The product quality and support have been outstanding.',
    rating: 5,
    avatar: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: 't2',
    name: 'Priya Sharma',
    role: 'Operations Director',
    company: 'GreenLine Logistics',
    message: 'The solar power solutions we purchased from MVB reduced our energy costs by 40%. Excellent product selection and professional service.',
    rating: 5,
    avatar: 'https://i.pravatar.cc/150?img=5',
  },
  {
    id: 't3',
    name: 'Amit Patel',
    role: 'Facility Head',
    company: 'Metro Hospital',
    message: 'From fire safety to access control, MVB provided end-to-end solutions for our hospital. Their team understood our requirements perfectly.',
    rating: 5,
    avatar: 'https://i.pravatar.cc/150?img=3',
  },
  {
    id: 't4',
    name: 'Sneha Reddy',
    role: 'Procurement Lead',
    company: 'Apex Industries',
    message: 'The comparison feature helped us evaluate multiple UPS systems side by side. Made our procurement decision much easier and faster.',
    rating: 4,
    avatar: 'https://i.pravatar.cc/150?img=9',
  },
];

export const recentActivities: Activity[] = [
  { id: 'a1', type: 'lead', message: 'New wishlist lead from Rajesh Kumar for Hikvision Pro Dome Camera Pro', timestamp: '2026-07-14T08:30:00Z' },
  { id: 'a2', type: 'inquiry', message: 'New inquiry received for Schneider Electric Online UPS Pro', timestamp: '2026-07-14T07:15:00Z' },
  { id: 'a3', type: 'product', message: 'Product "Dahua Bullet IP Camera Plus" marked as active', timestamp: '2026-07-13T16:45:00Z' },
  { id: 'a4', type: 'lead', message: 'Lead from Priya Sharma moved to Contacted status', timestamp: '2026-07-13T14:20:00Z' },
  { id: 'a5', type: 'category', message: 'New specification field added to CCTV category', timestamp: '2026-07-13T11:10:00Z' },
  { id: 'a6', type: 'inquiry', message: 'Inquiry from Metro Hospital responded', timestamp: '2026-07-12T15:30:00Z' },
  { id: 'a7', type: 'brand', message: 'New brand "Panasonic" added to catalog', timestamp: '2026-07-12T10:00:00Z' },
];

export const wishlistLeads: WishlistLead[] = [
  { id: 'wl1', name: 'Rajesh Kumar', phone: '+91 98765 43210', email: 'rajesh@techcorp.in', company: 'TechCorp Solutions', city: 'Mumbai', remarks: 'Need 20 units for office deployment', productId: 'p1', productName: 'Hikvision Pro Dome Camera Pro', status: 'new', assignedTo: 'Sales Team A', notes: 'High priority - large order', createdAt: '2026-07-14T08:30:00Z' },
  { id: 'wl2', name: 'Priya Sharma', phone: '+91 99876 54321', email: 'priya@greenline.co', company: 'GreenLine Logistics', city: 'Pune', remarks: 'Looking for solar solution for warehouse', productId: 'p9', productName: 'Luminous Mono Solar Panel Pro', status: 'contacted', assignedTo: 'Sales Team B', notes: 'Sent quotation', createdAt: '2026-07-12T11:20:00Z' },
  { id: 'wl3', name: 'Amit Patel', phone: '+91 98123 45678', email: 'amit@metrohospital.in', company: 'Metro Hospital', city: 'Ahmedabad', remarks: 'Fire safety audit requirement', productId: 'p41', productName: 'Apollo Smoke Detector Pro', status: 'qualified', assignedTo: 'Sales Team A', notes: 'Site visit scheduled', createdAt: '2026-07-10T09:00:00Z' },
  { id: 'wl4', name: 'Sneha Reddy', phone: '+91 90123 45678', email: 'sneha@apexind.com', company: 'Apex Industries', city: 'Hyderabad', remarks: 'UPS comparison needed', productId: 'p17', productName: 'Schneider Electric Online UPS Pro', status: 'closed', assignedTo: 'Sales Team C', notes: 'Order completed', createdAt: '2026-07-08T14:15:00Z' },
  { id: 'wl5', name: 'Vikram Singh', phone: '+91 88123 98765', email: 'vikram@buildtech.in', company: 'BuildTech Constructions', city: 'Delhi', remarks: 'Access control for new building', productId: 'p57', productName: 'Hikvision Fingerprint Reader Pro', status: 'new', assignedTo: 'Unassigned', notes: '', createdAt: '2026-07-13T16:45:00Z' },
];

export const inquiries: Inquiry[] = [
  { id: 'iq1', name: 'Rajesh Kumar', phone: '+91 98765 43210', email: 'rajesh@techcorp.in', company: 'TechCorp Solutions', productId: 'p1', productName: 'Hikvision Pro Dome Camera Pro', message: 'Need pricing for 20 units with installation support', status: 'new', createdAt: '2026-07-14T08:30:00Z' },
  { id: 'iq2', name: 'Priya Sharma', phone: '+91 99876 54321', email: 'priya@greenline.co', company: 'GreenLine Logistics', productId: 'p9', productName: 'Luminous Mono Solar Panel Pro', message: 'Interested in 10kW solar system for warehouse', status: 'in-review', createdAt: '2026-07-12T11:20:00Z' },
  { id: 'iq3', name: 'Amit Patel', phone: '+91 98123 45678', email: 'amit@metrohospital.in', company: 'Metro Hospital', productId: 'p41', productName: 'Apollo Smoke Detector Pro', message: 'Need fire safety audit and product supply', status: 'responded', createdAt: '2026-07-10T09:00:00Z' },
  { id: 'iq4', name: 'Sneha Reddy', phone: '+91 90123 45678', email: 'sneha@apexind.com', company: 'Apex Industries', productId: 'p17', productName: 'Schneider Electric Online UPS Pro', message: 'Comparison between 3 UPS models needed', status: 'closed', createdAt: '2026-07-08T14:15:00Z' },
  { id: 'iq5', name: 'Vikram Singh', phone: '+91 88123 98765', email: 'vikram@buildtech.in', company: 'BuildTech Constructions', productId: 'p57', productName: 'Hikvision Fingerprint Reader Pro', message: 'Access control system for 50-door facility', status: 'new', createdAt: '2026-07-13T16:45:00Z' },
  { id: 'iq6', name: 'Meera Joshi', phone: '+91 77123 45678', email: 'meera@infotech.co', company: 'InfoTech Solutions', productId: 'p33', productName: 'Cisco Managed Switch Pro', message: 'Need 24-port managed switch for network upgrade', status: 'in-review', createdAt: '2026-07-11T10:30:00Z' },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductsByCategory(categoryId: string): Product[] {
  return products.filter((p) => p.categoryId === categoryId && p.status === 'active');
}

export function getRelatedProducts(product: Product): Product[] {
  return product.relatedProductIds
    .map((id) => getProductById(id))
    .filter((p): p is Product => p !== undefined);
}

export function getCategoryBySlug(slug: string): (Category & { specFields: SpecField[] }) | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getBrandById(id: string): Brand | undefined {
  return brands.find((b) => b.id === id);
}

export function getCategoryById(id: string): (Category & { specFields: SpecField[] }) | undefined {
  return categories.find((c) => c.id === id);
}
