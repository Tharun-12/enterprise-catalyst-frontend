// product-details.tsx - Fixed with quantity and wishlist
import { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Heart, Download, FileText, Star, ChevronRight,
  ZoomIn, Share2, ShieldCheck, Package, ArrowLeft,
  BadgeCheck, Truck, Wrench, FileSpreadsheet, Minus, Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ProductCard } from '@/components/product-card';
import { EmptyState } from '@/components/shared';
import { useApp } from '@/hooks/use-app';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { PageBreadcrumb as Breadcrumb } from '@/layouts/customer-layout-wrapper';
import { baseurl } from '@/Baseurl/baseurl';
import type { Product } from '@/types';

// Extend the Product type locally to include productType, minPrice, maxPrice
interface ExtendedProduct extends Product {
  productType?: string;
  minPrice?: number;
  maxPrice?: number;
}

// ---- Raw API response shapes ----
interface ApiCategory {
  id: number;
  category_name: string;
  created_at: string;
  updated_at: string;
}

interface ApiBrand {
  id: number;
  brand_name: string;
  description: string;
  product_series: string;
  conductor_type: string;
  cable_od: string;
  jacket_material: string;
  bandwidth: string;
  operating_temperature: string;
  poe_support: string;
  category_id: number;
  category_name: string;
  created_at: string;
  updated_at: string;
}

interface ApiVariant {
  id: number;
  product_id: number;
  variant_name?: string;
  part_code?: string;
  category?: string;
  brand?: string;
  description?: string;
  spec_type?: string;
  color?: string;
  size?: string;
  price: string;
  availability?: string;
  datasheet_url?: string;
  image_url: string;
  stock: number;
  color_name?: string;
  color_hex?: string;
  created_at: string;
  updated_at: string;
}

interface ApiProduct {
  id: number;
  product_name: string;
  product_code: string;
  product_category_id: number;
  product_brand: string;
  product_details_pdf: string;
  price: string;
  min_price?: string;
  max_price?: string;
  dimensions?: string;
  specifications?: string;
  weight?: string;
  discount: string;
  product_description: string;
  warranty: string;
  product_series?: string;
  product_type?: string;
  conductor_type?: string;
  cable_od?: string;
  jacket_material?: string;
  bandwidth?: string;
  operating_temperature?: string;
  poe_support?: string;
  created_at: string;
  updated_at: string;
  category_name?: string;
  variants?: ApiVariant[];
}

interface SpecComparison {
  [specType: string]: {
    id: number;
    product_id: number;
    spec_type: string;
    bandwidth: string;
    max_data_rate: string;
    internal_design: string;
    typical_applications: string;
    created_at: string;
    updated_at: string;
  };
}

// ---- Transform API product into the app-wide `Product` type ----
const transformProduct = (
  product: ApiProduct,
  categories: ApiCategory[],
  brands: ApiBrand[]
): ExtendedProduct => {
  const category = categories.find(c => c.id === product.product_category_id);
  const brand = brands.find(b => b.brand_name === product.product_brand);

  // Get images from variants or use default
  const galleryImages = product.variants?.map(v =>
    v.image_url ? `${baseurl}${v.image_url}` : null
  ).filter(Boolean) as string[] || [];

  const defaultImage = 'https://via.placeholder.com/400x400';
  const gallery = galleryImages.length > 0 ? galleryImages : [defaultImage];

  // Use the product price directly from API
  const priceNum = parseFloat(product.price);
  const discountNum = parseFloat(product.discount || '0');

  // Parse min and max prices from API
  const minPrice = product.min_price ? parseFloat(product.min_price) : undefined;
  const maxPrice = product.max_price ? parseFloat(product.max_price) : undefined;

  // Build specifications - include ALL product fields
  const specFields: { key: string; label: string; value: string }[] = [];

  // Product fields
  if (product.product_series && product.product_series.trim() !== '') {
    specFields.push({ key: 'series', label: 'Series', value: product.product_series });
  }

  if (product.product_type && product.product_type.trim() !== '') {
    specFields.push({ key: 'type', label: 'Type', value: product.product_type });
  }

  if (product.conductor_type && product.conductor_type.trim() !== '') {
    specFields.push({ key: 'conductor_type', label: 'Conductor Type', value: product.conductor_type });
  }

  if (product.cable_od && product.cable_od.trim() !== '') {
    specFields.push({ key: 'cable_od', label: 'Cable OD', value: product.cable_od });
  }

  if (product.jacket_material && product.jacket_material.trim() !== '') {
    specFields.push({ key: 'jacket_material', label: 'Jacket Material', value: product.jacket_material });
  }

  if (product.bandwidth && product.bandwidth.trim() !== '') {
    specFields.push({ key: 'bandwidth', label: 'Bandwidth', value: product.bandwidth });
  }

  if (product.operating_temperature && product.operating_temperature.trim() !== '') {
    specFields.push({ key: 'operating_temperature', label: 'Operating Temperature', value: product.operating_temperature });
  }

  if (product.poe_support && product.poe_support.trim() !== '') {
    specFields.push({ key: 'poe_support', label: 'PoE Support', value: product.poe_support });
  }

  if (product.warranty && product.warranty.trim() !== '') {
    specFields.push({ key: 'warranty', label: 'Warranty', value: product.warranty });
  }

  // Add variant details
  if (product.variants && product.variants.length > 0) {
    const variant = product.variants[0];
    if (variant.spec_type && variant.spec_type.trim() !== '') {
      specFields.push({ key: 'spec_type', label: 'Spec Type', value: variant.spec_type });
    }
    if (variant.size && variant.size.trim() !== '') {
      specFields.push({ key: 'size', label: 'Size', value: variant.size });
    }
    if (variant.color && variant.color.trim() !== '') {
      specFields.push({ key: 'color', label: 'Color', value: variant.color });
    }
    if (variant.availability && variant.availability.trim() !== '') {
      specFields.push({ key: 'availability', label: 'Availability', value: variant.availability });
    }
    if (variant.part_code && variant.part_code.trim() !== '') {
      specFields.push({ key: 'part_code', label: 'Part Code', value: variant.part_code });
    }
  }

  // Transform variants with all properties
  const transformedVariants = product.variants?.map(v => ({
    id: v.id,
    color_name: v.color_name || v.color || 'Default',
    color_hex: v.color_hex || '#000000',
    price: v.price,
    stock: v.stock,
    image_url: v.image_url,
    variant_name: v.variant_name,
    part_code: v.part_code,
    spec_type: v.spec_type,
    size: v.size,
    availability: v.availability,
    datasheet_url: v.datasheet_url,
    description: v.description,
  })) || [];

  return {
    id: String(product.id),
    name: product.product_name,
    slug: product.product_name.toLowerCase().replace(/\s+/g, '-'),
    sku: product.product_code,
    brandId: String(brand?.id ?? 'unknown'),
    brandName: brand?.brand_name || product.product_brand || 'Unknown',
    categoryId: String(product.product_category_id),
    categoryName: category?.category_name || product.category_name || 'Uncategorized',
    shortDescription: product.product_description?.substring(0, 150) || '',
    description: product.product_description || '',
    gallery,
    features: product.specifications?.split(',').map(s => s.trim()).filter(Boolean) || [],
    specifications: {},
    currency: 'INR',
    relatedProductIds: [],
    specGroups: [
      {
        groupName: 'Specifications',
        fields: specFields
      }
    ],
    price: priceNum,
    minPrice: minPrice,
    maxPrice: maxPrice,
    originalPrice: priceNum * (1 + discountNum / 100),
    discountPercentage: discountNum,
    status: 'active',
    isPopular: false,
    isNew: false,
    rating: 4.5,
    reviewCount: 0,
    downloads: product.product_details_pdf
      ? [{ name: 'Product Details', type: 'pdf' as const, size: 'PDF', url: product.product_details_pdf }]
      : [],
    createdAt: product.created_at,
    warranty: product.warranty || 'Standard warranty',
    variants: transformedVariants as any[],
    hasVariants: (product.variants?.length || 0) > 0,
    stock: product.variants?.reduce((sum, v) => sum + v.stock, 0) || 0,
    productType: product.product_type || '',
  };
};

export function ProductDetailsPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [productData, setProductData] = useState<ApiProduct | null>(null);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [brands, setBrands] = useState<ApiBrand[]>([]);
  const [allProducts, setAllProducts] = useState<ApiProduct[]>([]);
  const [specComparison, setSpecComparison] = useState<SpecComparison | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingSpecs, setLoadingSpecs] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [submitting, setSubmitting] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { addToWishlist, removeFromWishlist, isInWishlist, isLoggedIn } = useApp();

  // Get max stock from variants
  const maxStock = useMemo(() => {
    if (!productData?.variants) return 10;
    return productData.variants.reduce((sum, v) => sum + v.stock, 0);
  }, [productData]);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= maxStock) {
      setQuantity(newQuantity);
    } else if (newQuantity > maxStock) {
      toast.warning(`Only ${maxStock} items available in stock`, {
        duration: 3000,
        position: 'top-right',
        style: {
          background: '#F59E0B',
          color: 'white',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '500',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          marginTop: '70px',
        },
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch categories
        const categoriesRes = await fetch(`${baseurl}/api/categories/`);
        const categoriesData = await categoriesRes.json();
        if (categoriesData.success) {
          setCategories(categoriesData.data);
        }

        // Fetch brands
        const brandsRes = await fetch(`${baseurl}/api/brands/`);
        const brandsData = await brandsRes.json();
        if (brandsData.success) {
          setBrands(brandsData.data);
        }

        // Fetch all products
        const productsRes = await fetch(`${baseurl}/api/products/products-with-variants`);
        const productsData = await productsRes.json();

        if (Array.isArray(productsData) && productsData.length > 0) {
          setAllProducts(productsData);

          // Find the product by slug
          const decodedSlug = decodeURIComponent(slug || '');

          let foundProduct = productsData.find((p: ApiProduct) => {
            const productSlug = p.product_name.toLowerCase().replace(/\s+/g, '-');
            return productSlug === decodedSlug;
          });

          if (!foundProduct) {
            const idMatch = decodedSlug.match(/^(\d+)/);
            if (idMatch) {
              foundProduct = productsData.find((p: ApiProduct) => String(p.id) === idMatch[1]);
            }
          }

          if (!foundProduct) {
            foundProduct = productsData.find((p: ApiProduct) => {
              const productSlug = p.product_name.toLowerCase().replace(/\s+/g, '-');
              return productSlug.includes(decodedSlug) || decodedSlug.includes(productSlug);
            });
          }

          if (foundProduct) {
            setProductData(foundProduct);

            // Fetch spec comparison if product has variants
            if (foundProduct.variants && foundProduct.variants.length > 0) {
              setLoadingSpecs(true);
              try {
                const specRes = await fetch(`${baseurl}/api/products/spec-comparison/${foundProduct.id}`);
                if (specRes.ok) {
                  const specData = await specRes.json();
                  setSpecComparison(specData);
                }
              } catch (specErr) {
                console.error('Error fetching spec comparison:', specErr);
              } finally {
                setLoadingSpecs(false);
              }
            }
          } else {
            setError('Product not found');
          }
        } else {
          throw new Error('Invalid products data format');
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load product details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchData();
    }
  }, [slug]);

  const product = useMemo(() => {
    if (!productData) return null;
    return transformProduct(productData, categories, brands);
  }, [productData, categories, brands]);

  // Related products - ONLY show products with same product_type
  const relatedProducts = useMemo(() => {
    if (!product || allProducts.length === 0) return [];

    const extendedProduct = product as ExtendedProduct;
    const productType = extendedProduct.productType;

    const hasValidProductType = productType &&
      productType !== 'N/A' &&
      productType.trim() !== '';

    if (!hasValidProductType) {
      return [];
    }

    const sameTypeProducts = allProducts.filter(p =>
      String(p.product_category_id) === product.categoryId &&
      String(p.id) !== product.id &&
      p.product_type === productType
    );

    if (sameTypeProducts.length === 0) {
      return [];
    }

    sameTypeProducts.sort((a, b) => {
      const aHasVariant = (a.variants?.length || 0) > 0;
      const bHasVariant = (b.variants?.length || 0) > 0;
      if (aHasVariant && !bHasVariant) return -1;
      if (!aHasVariant && bHasVariant) return 1;
      return parseFloat(a.price) - parseFloat(b.price);
    });

    const topRelated = sameTypeProducts.slice(0, 4);

    return topRelated.map(p => transformProduct(p, categories, brands));
  }, [product, allProducts, categories, brands]);

  const getUserId = () => {
    const session = localStorage.getItem('userSession');
    if (session) {
      try {
        const user = JSON.parse(session);
        return user.userId;
      } catch (e) {
        return null;
      }
    }
    return null;
  };

  const getUserDetails = () => {
    const session = localStorage.getItem('userSession');
    if (session) {
      try {
        const user = JSON.parse(session);
        return {
          id: user.userId,
          name: user.name || '',
          email: user.email || '',
          mobile: user.mobile || ''
        };
      } catch (e) {
        return null;
      }
    }
    return null;
  };

  const handleWishlist = async () => {
    if (!product) return;
    
    if (!isLoggedIn) {
      toast.error('Please login to sync wishlist', {
        duration: 3000,
        position: 'top-right',
        style: {
          background: '#EF4444',
          color: 'white',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '500',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          marginTop: '70px',
        },
        action: {
          label: 'Login',
          onClick: () => window.location.href = '/login'
        }
      });
      setTimeout(() => window.location.href = '/login', 1500);
      return;
    }

    const userId = getUserId();
    if (isInWishlist(product.id)) {
      await removeFromWishlist(product.id, userId || undefined);
    } else {
      await addToWishlist(product.id, userId || undefined);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  const handleSingleQuotation = async () => {
    if (!product) return;

    if (!isLoggedIn) {
      toast.error('Please login to request a quotation', {
        duration: 3000,
        position: 'top-right',
        style: {
          background: '#EF4444',
          color: 'white',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '500',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          marginTop: '70px',
        },
        action: {
          label: 'Login',
          onClick: () => window.location.href = '/login'
        }
      });
      setTimeout(() => window.location.href = '/login', 1500);
      return;
    }

    const userId = getUserId();
    if (!userId) {
      toast.error('Please login to request a quotation', {
        duration: 3000,
        position: 'top-right',
        style: {
          background: '#EF4444',
          color: 'white',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '500',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          marginTop: '70px',
        },
      });
      return;
    }

    setSubmitting(true);

    try {
      const user = getUserDetails();

      // Use maxPrice if available, otherwise minPrice
      let actualPrice = product.price;
      let minPrice = extendedProduct.minPrice;
      let maxPrice = extendedProduct.maxPrice;
      
      if (extendedProduct.maxPrice !== undefined && extendedProduct.maxPrice > 0) {
        actualPrice = extendedProduct.maxPrice;
      } else if (extendedProduct.minPrice !== undefined && extendedProduct.minPrice > 0) {
        actualPrice = extendedProduct.minPrice;
      }

      // Get variant image from the first variant
      let variantImage = null;
      let variantDetails = null;
      
      if (product.variants && product.variants.length > 0) {
        const firstVariant = product.variants[0] as any;
        if (firstVariant.image_url) {
          variantImage = firstVariant.image_url;
        }
        // Store all variant details
        variantDetails = JSON.stringify(product.variants.map((v: any) => ({
          id: v.id,
          variant_name: v.variant_name,
          part_code: v.part_code,
          spec_type: v.spec_type,
          color: v.color,
          size: v.size,
          price: v.price,
          image_url: v.image_url,
          stock: v.stock
        })));
      }

      const actualDiscount = product.discountPercentage || 0;

      const payload = {
        user_id: userId,
        product_id: parseInt(product.id),
        product_name: product.name,
        product_code: product.sku,
        product_brand: product.brandName,
        price: actualPrice,
        min_price: minPrice,
        max_price: maxPrice,
        discount: actualDiscount,
        quantity: quantity,
        remarks: `Quotation requested for ${product.name} (Qty: ${quantity})`,
        customer_name: user?.name || '',
        customer_mobile: user?.mobile || '',
        customer_email: user?.email || '',
        variant_image: variantImage,
        variant_details: variantDetails
      };

      console.log('Sending quotation payload:', payload);

      const response = await fetch(`${baseurl}/api/quotations/single`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`Quotation requested for ${quantity} item(s)!`, {
          duration: 3000,
          position: 'top-right',
          style: {
            background: '#10B981',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            marginTop: '70px',
          },
        });
        navigate('/my-quotations');
      } else {
        toast.error(data.message || 'Failed to submit quotation request', {
          duration: 3000,
          position: 'top-right',
          style: {
            background: '#EF4444',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            marginTop: '70px',
          },
        });
      }
    } catch (error) {
      console.error('Error submitting quotation:', error);
      toast.error('Failed to submit quotation request. Please try again.', {
        duration: 3000,
        position: 'top-right',
        style: {
          background: '#EF4444',
          color: 'white',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '500',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          marginTop: '70px',
        },
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded mb-8"></div>
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
            <div className="space-y-4">
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <EmptyState
          icon={<Package className="w-8 h-8" />}
          title="Product not found"
          description={error || "The product you're looking for doesn't exist or has been removed."}
          action={<Button asChild><Link to="/products">Browse Products</Link></Button>}
        />
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);

  // Get variant spec types
  const variantSpecTypes = product.variants?.map(v => (v as any).spec_type).filter(Boolean) as string[] || [];
  const uniqueSpecTypes = [...new Set(variantSpecTypes)];

  // Cast product to ExtendedProduct
  const extendedProduct = product as ExtendedProduct;

  // Get display price with min/max
  const getDisplayPrice = () => {
    if (extendedProduct.minPrice !== undefined && extendedProduct.maxPrice !== undefined) {
      const min = extendedProduct.minPrice;
      const max = extendedProduct.maxPrice;
      if (min === max) {
        return `₹${min.toLocaleString()}`;
      }
      return `₹${min.toLocaleString()} - ₹${max.toLocaleString()}`;
    }
    return `₹${product.price.toLocaleString()}`;
  };

  // Check if product has discount
  const hasDiscount = (product.discountPercentage ?? 0) > 0;

  // Get all spec fields for display
  const allSpecFields = product.specGroups[0]?.fields || [];

  // Preview specs (first 4)
  const previewSpecs = allSpecFields.slice(0, 4);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <Breadcrumb items={[
        { label: 'Home', path: '/' },
        { label: 'Products', path: '/products' },
        { label: product.categoryName, path: `/products?category=${product.categoryName.toLowerCase().replace(/\s+/g, '-').replace(/&/g, '')}` },
        { label: product.name }
      ]} />

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
        {/* Gallery */}
        <div>
          <div
            className="relative aspect-square rounded-2xl overflow-hidden bg-muted/30 border cursor-zoom-in group"
            onMouseEnter={() => setZoomed(true)}
            onMouseLeave={() => setZoomed(false)}
            onMouseMove={handleMouseMove}
          >
            <img
              src={product.gallery[activeImage] || 'https://via.placeholder.com/400x400'}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-300"
              style={zoomed ? { transform: `scale(2)`, transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` } : undefined}
            />
            {!zoomed && (
              <div className="absolute top-4 right-4 bg-black/60 text-white rounded-lg px-3 py-1.5 text-xs flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn className="w-3.5 h-3.5" /> Hover to zoom
              </div>
            )}
            <div className="absolute top-4 left-4 flex flex-col gap-1.5">
              {product.isPopular && <Badge className="bg-accent text-accent-foreground shadow-sm">POPULAR</Badge>}
              {product.isNew && <Badge className="bg-secondary text-secondary-foreground shadow-sm">NEW</Badge>}
              {hasDiscount && (
                <Badge variant="destructive">{product.discountPercentage}% OFF</Badge>
              )}
            </div>
          </div>

          {/* Thumbnails */}
          <div className="grid grid-cols-4 gap-3 mt-4">
            {product.gallery.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(idx)}
                className={cn(
                  'aspect-square rounded-xl overflow-hidden border-2 transition-all',
                  activeImage === idx ? 'border-primary ring-2 ring-primary/20' : 'border-border hover:border-primary/50'
                )}
              >
                <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <BadgeCheck className="w-4 h-4 text-primary" />
            <Link to={`/products?brand=${product.brandName}`} className="text-sm font-medium text-primary hover:underline">
              {product.brandName}
            </Link>
            <span className="text-muted-foreground/50">·</span>
            <span className="text-sm text-muted-foreground">{product.categoryName}</span>
            {extendedProduct.productType && extendedProduct.productType !== 'N/A' && extendedProduct.productType.trim() !== '' && (
              <>
                <span className="text-muted-foreground/50">·</span>
                <span className="text-sm text-muted-foreground">{extendedProduct.productType}</span>
              </>
            )}
          </div>

          <h1 className="text-2xl lg:text-3xl font-bold mb-3">{product.name}</h1>

          <div className="flex items-center gap-4 mb-5">
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className={cn('w-4 h-4', s <= Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/30')} />
              ))}
              <span className="text-sm font-medium ml-1">{product.rating.toFixed(1)}</span>
            </div>
            <span className="text-sm text-muted-foreground">{product.reviewCount} reviews</span>
            <Separator orientation="vertical" className="h-4" />
            <span className="text-sm text-muted-foreground">SKU: {product.sku}</span>
          </div>

          <p className="text-muted-foreground leading-relaxed mb-6">{product.shortDescription}</p>

          {/* Price - Show Min and Max */}
          <div className="mb-6">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-3xl font-bold text-primary">{getDisplayPrice()}</span>
              {hasDiscount && (
                <>
                  <Badge variant="destructive" className="text-sm">{product.discountPercentage}% OFF</Badge>
                </>
              )}
            </div>
            {/* Show price range note if min and max are different */}
            {extendedProduct.minPrice !== undefined && extendedProduct.maxPrice !== undefined &&
              extendedProduct.minPrice !== extendedProduct.maxPrice && (
                <p className="text-xs text-muted-foreground mt-1">Price range based on variants</p>
              )}
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Quantity:</span>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                size="icon"
                variant="outline"
                className="h-9 w-9 rounded-full border-gray-300 dark:border-gray-600 hover:bg-primary hover:text-white hover:border-primary transition-colors"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="w-12 text-center text-base font-medium text-gray-900 dark:text-white">
                {quantity}
              </span>
              <Button
                type="button"
                size="icon"
                variant="outline"
                className="h-9 w-9 rounded-full border-gray-300 dark:border-gray-600 hover:bg-primary hover:text-white hover:border-primary transition-colors"
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= maxStock}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {maxStock > 0 && (
              <span className="text-xs text-gray-400">
                Max: {maxStock} {maxStock > 1 ? 'items' : 'item'} available
              </span>
            )}
            {maxStock === 0 && (
              <span className="text-xs text-red-500 font-medium">Out of Stock</span>
            )}
          </div>

          {/* Key specs preview - show relevant specs */}
          {previewSpecs.length > 0 && (
            <div className="grid grid-cols-2 gap-3 mb-6">
              {previewSpecs.map((field) => (
                <div key={field.key} className="bg-muted/40 rounded-lg p-3">
                  <div className="text-xs text-muted-foreground mb-0.5">{field.label}</div>
                  <div className="text-sm font-semibold truncate">{field.value}</div>
                </div>
              ))}
            </div>
          )}

          {/* Trust badges */}
          <div className="flex flex-wrap gap-4 mb-6 text-sm">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <ShieldCheck className="w-4 h-4 text-green-600" /> {product.warranty || 'Standard warranty'}
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Truck className="w-4 h-4 text-primary" /> Pan-India delivery
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Wrench className="w-4 h-4 text-secondary" /> Professional installation
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 mb-4">
            <Button
              size="lg"
              className="flex-1 min-w-[160px]"
              onClick={handleSingleQuotation}
              disabled={submitting || maxStock === 0}
            >
              {submitting ? (
                <>
                  <span className="animate-spin mr-2">⟳</span> Generating...
                </>
              ) : (
                <>
                  <FileSpreadsheet className="w-4 h-4 mr-2" /> Request for Quotation
                </>
              )}
            </Button>
            <Button
              size="lg"
              variant={inWishlist ? 'default' : 'outline'}
              className={cn(inWishlist && 'bg-red-500 hover:bg-red-600 text-white')}
              onClick={handleWishlist}
            >
              <Heart className={cn('w-4 h-4 mr-2', inWishlist && 'fill-current')} />
              {inWishlist ? 'Wishlisted' : 'Wishlist'}
            </Button>
          </div>

          <div className="flex gap-3">
            <Button variant="ghost" size="sm" onClick={() => {
              navigator.clipboard?.writeText(window.location.href);
              toast.success('Link copied to clipboard');
            }}>
              <Share2 className="w-4 h-4 mr-1.5" /> Share
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link to="/products">
                <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Products
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="description" className="mb-12">
        <TabsList className="w-full justify-start flex-wrap h-auto p-1 gap-1">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="specifications">Specifications</TabsTrigger>
          {uniqueSpecTypes.length > 0 && (
            <TabsTrigger value="spec-comparison">Spec Comparison</TabsTrigger>
          )}
          <TabsTrigger value="downloads">Downloads</TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="mt-6">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Product Description</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">{product.description}</p>
          </Card>
        </TabsContent>

        <TabsContent value="specifications" className="mt-6">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-6">Technical Specifications</h2>
            {allSpecFields.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-x-8 gap-y-0">
                {allSpecFields.map((field, idx) => (
                  <div key={field.key} className={cn('flex justify-between py-2.5 border-b border-dashed', idx % 2 === 1 && 'sm:border-l sm:pl-8 sm:border-b-0 sm:border-dashed')}>
                    <span className="text-sm text-muted-foreground">{field.label}</span>
                    <span className="text-sm font-medium text-right">{field.value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No specifications available for this product.
              </p>
            )}
          </Card>
        </TabsContent>

        {uniqueSpecTypes.length > 0 && (
          <TabsContent value="spec-comparison" className="mt-6">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-6">Specification Comparison</h2>
              {loadingSpecs ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : specComparison && Object.keys(specComparison).length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="p-3 text-left text-sm font-semibold border">Feature</th>
                        {Object.keys(specComparison).map((specType) => (
                          <th key={specType} className="p-3 text-left text-sm font-semibold border">
                            {specType}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys(specComparison[Object.keys(specComparison)[0]] || {}).map((key) => {
                        if (['id', 'product_id', 'spec_type', 'created_at', 'updated_at'].includes(key)) return null;
                        const label = key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                        return (
                          <tr key={key} className="hover:bg-muted/30 transition-colors">
                            <td className="p-3 text-sm font-medium border">{label}</td>
                            {Object.keys(specComparison).map((specType) => (
                              <td key={`${specType}-${key}`} className="p-3 text-sm border">
                                {specComparison[specType]?.[key as keyof typeof specComparison[typeof specType]] || 'N/A'}
                              </td>
                            ))}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No specification comparison available for this product.
                </p>
              )}
            </Card>
          </TabsContent>
        )}

        <TabsContent value="downloads" className="mt-6">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-6">Downloads & Resources</h2>
            {product.downloads.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {product.downloads.map((dl, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 rounded-xl border hover:shadow-md transition-all hover:border-primary/30 group">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <FileText className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm">{dl.name}</div>
                      <div className="text-xs text-muted-foreground">{dl.size}</div>
                    </div>
                    <Button size="icon" variant="outline" onClick={() => {
                      const link = document.createElement('a');
                      link.href = `${baseurl}${dl.url}`;
                      link.download = dl.name;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      toast.success('Download started');
                    }}>
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No downloads available for this product.
              </p>
            )}
          </Card>
        </TabsContent>
      </Tabs>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold">
              Related {extendedProduct.productType || 'Products'}
            </h2>
            <Button asChild variant="ghost" size="sm">
              <Link to={`/products?category=${product.categoryName.toLowerCase().replace(/\s+/g, '-').replace(/&/g, '')}`}>
                View More <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {relatedProducts.map((rp) => (
              <ProductCard key={rp.id} product={rp} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}