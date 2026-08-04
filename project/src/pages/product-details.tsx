// product-details.tsx - Fixed to remove N/A fields
import { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Heart, GitCompare, Download, FileText, Check, Star, ChevronRight,
  ZoomIn, Share2, ShieldCheck, Package, ArrowLeft,
  BadgeCheck, Truck, Wrench, FileSpreadsheet
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ProductCard } from '@/components/product-card';
import { EmptyState } from '@/components/shared';
import { WishlistLeadModal } from '@/components/wishlist-modal';
import { useApp } from '@/hooks/use-app';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { PageBreadcrumb as Breadcrumb } from '@/layouts/customer-layout-wrapper';
import { baseurl } from '@/Baseurl/baseurl';
import type { Product } from '@/types';

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
  dimensions?: string;
  specifications?: string;
  weight?: string;
  discount: string;
  product_description: string;
  warranty: string;
  product_series?: string;
  product_type?: string;
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
): Product => {
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

  // Get unique spec types from variants
  const specTypes = product.variants?.map(v => v.spec_type).filter(Boolean) as string[] || [];
  const uniqueSpecTypes = [...new Set(specTypes)];

  // Build specifications - only include fields that have actual values
  const specFields: { key: string; label: string; value: string }[] = [];

  // Only add fields if they have meaningful values (not N/A or empty)
  if (product.dimensions && product.dimensions !== 'N/A' && product.dimensions.trim() !== '') {
    specFields.push({ key: 'dimensions', label: 'Dimensions', value: product.dimensions });
  }
  
  if (product.weight && product.weight !== 'N/A' && product.weight.trim() !== '') {
    specFields.push({ key: 'weight', label: 'Weight', value: `${product.weight} kg` });
  }
  
  if (product.specifications && product.specifications !== 'N/A' && product.specifications.trim() !== '') {
    specFields.push({ key: 'specifications', label: 'Specifications', value: product.specifications });
  }
  
  if (product.warranty && product.warranty !== 'N/A' && product.warranty.trim() !== '') {
    specFields.push({ key: 'warranty', label: 'Warranty', value: product.warranty });
  }
  
  if (product.product_series && product.product_series !== 'N/A' && product.product_series.trim() !== '') {
    specFields.push({ key: 'series', label: 'Series', value: product.product_series });
  }
  
  if (product.product_type && product.product_type !== 'N/A' && product.product_type.trim() !== '') {
    specFields.push({ key: 'type', label: 'Type', value: product.product_type });
  }

  // Add variant spec types to spec fields
  uniqueSpecTypes.forEach(type => {
    if (type && type.trim() !== '') {
      specFields.push({
        key: `spec_${type}`,
        label: `Spec Type`,
        value: type
      });
    }
  });

  // Add variant details if available
  if (product.variants && product.variants.length > 0) {
    const variant = product.variants[0];
    if (variant.size && variant.size.trim() !== '') {
      specFields.push({ key: 'size', label: 'Size', value: variant.size });
    }
    if (variant.color && variant.color.trim() !== '') {
      specFields.push({ key: 'color', label: 'Color', value: variant.color });
    }
    if (variant.availability && variant.availability.trim() !== '') {
      specFields.push({ key: 'availability', label: 'Availability', value: variant.availability });
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
    brandDescription: brand?.description || '',
    categoryId: String(product.product_category_id),
    categoryName: category?.category_name || product.category_name || 'Uncategorized',
    shortDescription: product.product_description?.substring(0, 150) || '',
    description: product.product_description || '',
    gallery,
    features: product.specifications?.split(',').map(s => s.trim()).filter(Boolean) || ['Premium quality', 'Enterprise grade'],
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
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { addToWishlist, removeFromWishlist, isInWishlist, addToCompare, removeFromCompare, isInCompare } = useApp();

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

          // Find the product by slug - decode the slug first
          const decodedSlug = decodeURIComponent(slug || '');
          
          // Try multiple matching strategies
          let foundProduct = productsData.find((p: ApiProduct) => {
            const productSlug = p.product_name.toLowerCase().replace(/\s+/g, '-');
            return productSlug === decodedSlug;
          });

          // If not found by slug, try by ID
          if (!foundProduct) {
            const idMatch = decodedSlug.match(/^(\d+)/);
            if (idMatch) {
              foundProduct = productsData.find((p: ApiProduct) => String(p.id) === idMatch[1]);
            }
          }

          // If still not found, try partial match
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

  const relatedProducts = useMemo(() => {
    if (!product || allProducts.length === 0) return [];

    return allProducts
      .filter(p =>
        String(p.product_category_id) === product.categoryId &&
        String(p.id) !== product.id
      )
      .slice(0, 4)
      .map(p => transformProduct(p, categories, brands));
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
    const userId = getUserId();

    if (isInWishlist(product.id)) {
      await removeFromWishlist(product.id, userId || undefined);
    } else {
      await addToWishlist(product.id, userId || undefined);
      if (!userId) {
        setWishlistOpen(true);
      }
    }
  };

  const handleCompare = () => {
    if (!product) return;
    if (isInCompare(product.id)) {
      removeFromCompare(product.id);
    } else {
      addToCompare(product.id);
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

    const userId = getUserId();
    if (!userId) {
      toast.error('Please login to request a quotation');
      return;
    }

    setSubmitting(true);

    try {
      const user = getUserDetails();
      
      const payload = {
        user_id: userId,
        product_id: parseInt(product.id),
        product_name: product.name,
        product_code: product.sku,
        product_brand: product.brandName,
        price: product.price,
        discount: product.discountPercentage || 0,
        quantity: 1,
        remarks: `Quotation requested for ${product.name}`,
        customer_name: user?.name || '',
        customer_mobile: user?.mobile || '',
        customer_email: user?.email || ''
      };

      const response = await fetch(`${baseurl}/api/quotations/single`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`Quotation #${data.quotation_no} generated successfully!`);
        navigate('/wishlist/quotation');
      } else {
        toast.error(data.message || 'Failed to submit quotation request');
      }
    } catch (error) {
      console.error('Error submitting quotation:', error);
      toast.error('Failed to submit quotation request. Please try again.');
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
  const inCompare = isInCompare(product.id);

  // Get variant spec types for display - Use type assertion to access spec_type
  const variantSpecTypes = product.variants?.map(v => (v as any).spec_type).filter(Boolean) as string[] || [];
  const uniqueSpecTypes = [...new Set(variantSpecTypes)];

  // Get the first variant for price display
  const firstVariant = product.variants && product.variants.length > 0 ? product.variants[0] : null;
  const displayPrice = firstVariant ? parseFloat(firstVariant.price) : product.price;
  const displayOriginalPrice = displayPrice * (1 + (product.discountPercentage || 0) / 100);

  // Get only the first 4 non-empty spec fields for preview
  const previewSpecs = product.specGroups[0]?.fields.slice(0, 6) || [];

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
              {(product.discountPercentage ?? 0) > 0 && (
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

          {/* Price */}
          <div className="mb-6">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-primary">₹{displayPrice.toLocaleString()}</span>
              {(product.discountPercentage ?? 0) > 0 && (
                <>
                  <span className="text-lg text-muted-foreground line-through">₹{displayOriginalPrice.toLocaleString()}</span>
                  <Badge variant="destructive" className="text-sm">{product.discountPercentage}% OFF</Badge>
                </>
              )}
            </div>
          </div>

          {/* Key specs preview - only show if there are specs */}
          {previewSpecs.length > 0 && (
            <div className="grid grid-cols-2 gap-3 mb-6">
              {previewSpecs.map((field) => (
                <div key={field.key} className="bg-muted/40 rounded-lg p-3">
                  <div className="text-xs text-muted-foreground mb-0.5">{field.label}</div>
                  <div className="text-sm font-semibold">{field.value}</div>
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
              disabled={submitting}
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
            <Button
              size="lg"
              variant={inCompare ? 'default' : 'outline'}
              onClick={handleCompare}
            >
              <GitCompare className="w-4 h-4 mr-2" />
              {inCompare ? 'Comparing' : 'Compare'}
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
          <TabsTrigger value="features">Features</TabsTrigger>
          {uniqueSpecTypes.length > 0 && (
            <TabsTrigger value="spec-comparison">Spec Comparison</TabsTrigger>
          )}
          <TabsTrigger value="downloads">Downloads</TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="mt-6">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Product Description</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">{product.description}</p>
            {product.brandDescription && (
              <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                <h3 className="font-semibold text-sm mb-1">About {product.brandName}</h3>
                <p className="text-sm text-muted-foreground">{product.brandDescription}</p>
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="specifications" className="mt-6">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-6">Technical Specifications</h2>
            {product.specGroups[0]?.fields.length > 0 ? (
              <div className="space-y-8">
                {product.specGroups.map((group) => (
                  <div key={group.groupName}>
                    <h3 className="font-semibold text-primary mb-3 pb-2 border-b">{group.groupName}</h3>
                    <div className="grid sm:grid-cols-2 gap-x-8 gap-y-0">
                      {group.fields.map((field, idx) => (
                        <div key={field.key} className={cn('flex justify-between py-2.5 border-b border-dashed', idx % 2 === 1 && 'sm:border-l sm:pl-8 sm:border-b-0 sm:border-dashed')}>
                          <span className="text-sm text-muted-foreground">{field.label}</span>
                          <span className="text-sm font-medium text-right">{field.value}</span>
                        </div>
                      ))}
                    </div>
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

        <TabsContent value="features" className="mt-6">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-6">Key Features</h2>
            {product.features.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {product.features.map((feature, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 text-green-600" />
                    </div>
                    <span className="text-sm font-medium">{feature}</span>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No features listed for this product.
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
            <h2 className="text-xl font-bold">Related Products</h2>
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

      <WishlistLeadModal product={product} open={wishlistOpen} onOpenChange={setWishlistOpen} />
    </div>
  );
}