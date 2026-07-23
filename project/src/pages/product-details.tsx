import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Heart, GitCompare, Download, FileText, Check, Star, ChevronRight,
  ZoomIn, Share2, MessageSquare, ShieldCheck, Package, ArrowLeft,
  BadgeCheck, Truck, Wrench
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ProductCard } from '@/components/product-card';
import { EmptyState } from '@/components/shared';
import { WishlistLeadModal } from '@/components/wishlist-modal';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useApp } from '@/hooks/use-app';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { PageBreadcrumb as Breadcrumb } from '@/layouts/customer-layout-wrapper';

// API response types
interface Category {
  id: number;
  category_name: string;
}

interface Brand {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

interface Variant {
  id: number;
  product_id: number;
  color_name: string;
  color_hex: string;
  price: string;
  stock: number;
  image_url: string;
}

interface Product {
  id: number;
  product_name: string;
  product_code: string;
  product_category_id: number;
  product_brand: string;
  product_details_pdf: string;
  price: string;
  dimensions: string;
  specifications: string;
  weight: string;
  discount: string;
  product_description: string;
  warranty: string;
  created_at: string;
  updated_at: string;
  category_name?: string;
  variants?: Variant[];
}

// Transform API product to match expected format
const transformProduct = (product: Product, categories: Category[], brands: Brand[]) => {
  const category = categories.find(c => c.id === product.product_category_id);
  const brand = brands.find(b => b.name === product.product_brand);
  const primaryVariant = product.variants?.[0];
  
  // Get all images from variants
  const galleryImages = product.variants?.map(v => 
    v.image_url ? `http://localhost:5000${v.image_url}` : null
  ).filter(Boolean) as string[] || [];
  
  const defaultImage = 'https://via.placeholder.com/400x400';
  const gallery = galleryImages.length > 0 ? galleryImages : [defaultImage];
  
  return {
    id: String(product.id),
    name: product.product_name,
    slug: product.product_name.toLowerCase().replace(/\s+/g, '-'),
    price: parseFloat(product.price),
    originalPrice: parseFloat(product.price) * (1 + parseFloat(product.discount || '0') / 100),
    discount: parseFloat(product.discount || '0'),
    rating: 4.5,
    reviewCount: 0,
    isPopular: false,
    isNew: false,
    brandId: String(brand?.id || product.product_brand || 'Unknown'),
    brandName: brand?.name || product.product_brand || 'Unknown',
    brandDescription: brand?.description || '',
    categoryId: product.product_category_id,
    categoryName: category?.category_name || product.category_name || 'Uncategorized',
    shortDescription: product.product_description?.substring(0, 150) || '',
    description: product.product_description || '',
    gallery: gallery,
    sku: product.product_code,
    warranty: product.warranty || 'Standard warranty',
    specGroups: [
      {
        groupName: 'Specifications',
        fields: [
          { key: 'dimensions', label: 'Dimensions', value: product.dimensions || 'N/A' },
          { key: 'weight', label: 'Weight', value: product.weight ? `${product.weight} kg` : 'N/A' },
          { key: 'specifications', label: 'Specifications', value: product.specifications || 'N/A' },
          { key: 'warranty', label: 'Warranty', value: product.warranty || 'Standard' },
        ]
      }
    ],
    features: product.specifications?.split(',').map(s => s.trim()).filter(Boolean) || ['Premium quality', 'Enterprise grade'],
    downloads: product.product_details_pdf ? [
      { name: 'Product Details', size: 'PDF', url: product.product_details_pdf }
    ] : [],
    status: 'active' as const,
    createdAt: product.created_at,
    variants: product.variants || [],
    productCode: product.product_code,
    brand: brand?.name || product.product_brand || 'Unknown',
    category: category?.category_name || product.category_name || 'Uncategorized',
    image: gallery[0] || defaultImage,
    images: gallery,
    stock: product.variants?.reduce((sum, v) => sum + v.stock, 0) || 0,
    hasVariants: (product.variants?.length || 0) > 0,
    discountPercentage: parseFloat(product.discount || '0'),
    regularPrice: parseFloat(product.price),
    salePrice: parseFloat(product.price) * (1 - parseFloat(product.discount || '0') / 100),
  };
};

export function ProductDetailsPage() {
  const { slug } = useParams();
  const [productData, setProductData] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const { addToWishlist, removeFromWishlist, isInWishlist, addToCompare, removeFromCompare, isInCompare, addInquiry } = useApp();

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch categories
        const categoriesRes = await fetch('http://localhost:5000/api/categories/');
        const categoriesData = await categoriesRes.json();
        
        if (!categoriesData.success) {
          throw new Error('Failed to fetch categories');
        }
        setCategories(categoriesData.data);

        // Fetch brands
        const brandsRes = await fetch('http://localhost:5000/api/brands/');
        const brandsData = await brandsRes.json();
        
        if (!brandsData.success) {
          throw new Error('Failed to fetch brands');
        }
        setBrands(brandsData.data);

        // Fetch all products with variants
        const productsRes = await fetch('http://localhost:5000/api/products/products-with-variants');
        const productsData = await productsRes.json();
        
        if (Array.isArray(productsData)) {
          setAllProducts(productsData);
          
          // Find the current product by slug
          const foundProduct = productsData.find((p: Product) => 
            p.product_name.toLowerCase().replace(/\s+/g, '-') === slug
          );
          
          if (foundProduct) {
            setProductData(foundProduct);
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
        p.product_category_id === product.categoryId && 
        p.id !== parseInt(product.id)
      )
      .slice(0, 4)
      .map(p => transformProduct(p, categories, brands));
  }, [product, allProducts, categories, brands]);

  // Get current user ID
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

  const handleWishlist = async () => {
    if (!product) return;
    const userId = getUserId();
    
    if (isInWishlist(product.id)) {
      await removeFromWishlist(product.id, userId || undefined);
    } else {
      await addToWishlist(product.id, userId || undefined);
      if (!userId) {
        // Show login prompt if not logged in
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

  const handleInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    addInquiry({
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
      company: formData.get('company') as string,
      productId: product!.id,
      productName: product!.name,
      message: formData.get('message') as string,
    });
    toast.success('Inquiry submitted! Our team will contact you soon.');
    setInquiryOpen(false);
    form.reset();
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

  return (
    <div className="container mx-auto px-4 py-8">
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
            <Link to={`/products?category=${product.categoryName.toLowerCase()}`} className="text-sm font-medium text-primary hover:underline">
              {product.brandName}
            </Link>
            <span className="text-muted-foreground/50">·</span>
            <span className="text-sm text-muted-foreground">{product.categoryName}</span>
          </div>

          <h1 className="text-2xl lg:text-3xl font-bold mb-3">{product.name}</h1>

          <div className="flex items-center gap-4 mb-5">
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className={cn('w-4 h-4', s <= Math.floor(product.rating) ? 'text-accent fill-accent' : 'text-muted-foreground/30')} />
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
              <span className="text-3xl font-bold">₹{product.price.toLocaleString()}</span>
              {product.discount > 0 && (
                <>
                  <span className="text-lg text-muted-foreground line-through">₹{product.originalPrice.toLocaleString()}</span>
                  <Badge variant="destructive" className="text-sm">{product.discount}% OFF</Badge>
                </>
              )}
            </div>
          </div>

          {/* Key specs preview */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {product.specGroups[0]?.fields.slice(0, 4).map((field) => (
              <div key={field.key} className="bg-muted/40 rounded-lg p-3">
                <div className="text-xs text-muted-foreground mb-0.5">{field.label}</div>
                <div className="text-sm font-semibold">{field.value}</div>
              </div>
            ))}
          </div>

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
            <Button size="lg" className="flex-1 min-w-[160px]" onClick={() => setInquiryOpen(true)}>
              <MessageSquare className="w-4 h-4 mr-2" /> Send Inquiry
            </Button>
            <Button
              size="lg"
              variant={inWishlist ? 'default' : 'outline'}
              className={cn(inWishlist && 'bg-accent hover:bg-accent/90 text-accent-foreground')}
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
            <Button variant="ghost" size="sm" onClick={() => { navigator.clipboard?.writeText(window.location.href); toast.success('Link copied to clipboard'); }}>
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
          </Card>
        </TabsContent>

        <TabsContent value="features" className="mt-6">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-6">Key Features</h2>
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
          </Card>
        </TabsContent>

        <TabsContent value="downloads" className="mt-6">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-6">Downloads & Resources</h2>
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
                  <Button size="icon" variant="outline" onClick={() => toast.info('Download started (demo)')}>
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
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

      {/* Inquiry Modal */}
      <Dialog open={inquiryOpen} onOpenChange={setInquiryOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Send Inquiry</DialogTitle>
            <DialogDescription>Send us your inquiry about <span className="font-semibold text-foreground">{product.name}</span></DialogDescription>
          </DialogHeader>
          <form onSubmit={handleInquiry} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="iq-name" className="text-xs">Name *</Label>
                <Input id="iq-name" name="name" required placeholder="Your name" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="iq-phone" className="text-xs">Phone *</Label>
                <Input id="iq-phone" name="phone" required placeholder="+91 98765 43210" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="iq-email" className="text-xs">Email *</Label>
              <Input id="iq-email" name="email" type="email" required placeholder="you@company.com" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="iq-company" className="text-xs">Company</Label>
              <Input id="iq-company" name="company" placeholder="Company name" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="iq-message" className="text-xs">Message *</Label>
              <Textarea id="iq-message" name="message" required placeholder="Tell us about your requirements..." className="resize-none" rows={4} />
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setInquiryOpen(false)}>Cancel</Button>
              <Button type="submit" className="flex-1">Submit Inquiry</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}