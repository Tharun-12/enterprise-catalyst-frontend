// src/pages/wishlist.tsx
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ArrowRight, Trash2, Loader2, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/shared';
import { useApp } from '@/hooks/use-app';
import { toast } from 'sonner';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { PageBreadcrumb as Breadcrumb } from '@/layouts/customer-layout-wrapper';
import { cn } from '@/lib/utils';
import axios from 'axios';
import { baseurl } from '@/Baseurl/baseurl';

// Define the API product type
interface ApiProduct {
  id: number;
  product_name: string;
  product_code: string;
  product_brand: string;
  price: string;
  discount: string;
  product_description: string;
  warranty: string;
  product_series: string | null;
  product_type: string | null;
  created_at: string;
  updated_at: string;
  product_category_id: number;
  product_details_pdf?: string;
  category_name?: string;
  variants?: Array<{
    id: number;
    product_id: number;
    color_name: string;
    color_hex: string;
    price: string;
    stock: number;
    image_url: string;
  }>;
}

interface DisplayProduct {
  id: string;
  name: string;
  slug: string;
  brandName: string;
  categoryName: string;
  shortDescription: string;
  description: string;
  price: number;
  discount: number;
  rating: number;
  reviewCount: number;
  gallery: string[];
  image: string;
  isPopular: boolean;
  isNew: boolean;
  createdAt: string;
  variants: ApiProduct['variants'];
}

function isApiProduct(item: any): item is ApiProduct {
  return item && typeof item === 'object' && 'product_name' in item && 'product_code' in item;
}

export function WishlistPage() {
  const navigate = useNavigate();
  const { wishlistProducts, removeFromWishlist, clearWishlist, fetchWishlist } = useApp();
  const [userId, setUserId] = useState<number | null>(null);
  const [initialLoad, setInitialLoad] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [isClearing, setIsClearing] = useState(false);
  const [isGeneratingQuotation, setIsGeneratingQuotation] = useState(false);

  useEffect(() => {
    const session = localStorage.getItem('userSession');
    if (session) {
      try {
        const user = JSON.parse(session);
        setUserId(user.userId);
        if (user.userId) {
          fetchWishlist(user.userId).finally(() => {
            setInitialLoad(false);
          });
        } else {
          setInitialLoad(false);
        }
      } catch (e) {
        console.error('Error loading user session:', e);
        setInitialLoad(false);
      }
    } else {
      setInitialLoad(false);
    }
  }, []);

  const displayProducts = useMemo((): DisplayProduct[] => {
    if (!wishlistProducts || wishlistProducts.length === 0) {
      return [];
    }

    const products = wishlistProducts as any[];
    
    return products
      .filter(isApiProduct)
      .map((p: ApiProduct) => {
        let image = 'https://via.placeholder.com/400x400';
        if (p.variants && p.variants.length > 0 && p.variants[0].image_url) {
          image = `${baseurl}${p.variants[0].image_url}`;
        }
        
        const galleryImages = p.variants?.map(v => 
          v.image_url ? `${baseurl}${v.image_url}` : null
        ).filter((url): url is string => Boolean(url)) || [];
        
        return {
          id: String(p.id),
          name: p.product_name,
          slug: p.product_name.toLowerCase().replace(/\s+/g, '-'),
          brandName: p.product_brand || 'Unknown',
          categoryName: p.category_name || 'Uncategorized',
          shortDescription: p.product_description?.substring(0, 100) || '',
          description: p.product_description || '',
          price: parseFloat(p.price) || 0,
          discount: parseFloat(p.discount) || 0,
          rating: 4.5,
          reviewCount: 0,
          gallery: galleryImages.length > 0 ? galleryImages : [image],
          image: image,
          isPopular: false,
          isNew: false,
          createdAt: p.created_at,
          variants: p.variants || [],
        };
      });
  }, [wishlistProducts]);

  const handleRemove = useCallback(async (productId: string): Promise<void> => {
    if (removingId) return;
    
    setRemovingId(productId);
    try {
      await removeFromWishlist(productId, userId || undefined);
      if (userId) {
        await fetchWishlist(userId);
      }
      toast.success('Removed from wishlist');
    } catch (error) {
      toast.error('Failed to remove from wishlist');
    } finally {
      setRemovingId(null);
    }
  }, [removeFromWishlist, userId, fetchWishlist, removingId]);

  const handleClearAll = useCallback(async (): Promise<void> => {
    if (isClearing) return;
    
    if (!confirm('Are you sure you want to clear all items from your wishlist?')) {
      return;
    }
    
    setIsClearing(true);
    try {
      if (userId) {
        await clearWishlist(userId);
        await fetchWishlist(userId);
      } else {
        displayProducts.forEach(async (p) => {
          await removeFromWishlist(p.id, undefined);
        });
      }
      toast.success('Wishlist cleared successfully');
    } catch (error) {
      toast.error('Failed to clear wishlist');
    } finally {
      setIsClearing(false);
    }
  }, [clearWishlist, userId, fetchWishlist, displayProducts, removeFromWishlist, isClearing]);

  const handleGenerateQuotation = useCallback(async (): Promise<void> => {
    if (displayProducts.length === 0) {
      toast.error('Your wishlist is empty. Add products to generate a quotation.');
      return;
    }
    
    const session = localStorage.getItem('userSession');
    if (!session) {
      toast.error('Please login to generate a quotation');
      navigate('/login');
      return;
    }

    // Remove the window.prompt - generate quotation directly
    setIsGeneratingQuotation(true);

    try {
      const response = await axios.post(`${baseurl}/api/quotations/generate`, {
        user_id: userId,
        remarks: '' // Empty remarks or you can use a default
      });

      if (response.data.success) {
        toast.success('Quotation generated successfully!');
        if (userId) {
          await fetchWishlist(userId);
        }
        navigate('/wishlist/quotation');
      }
    } catch (error: unknown) {
      console.error('Error generating quotation:', error);
      const axiosError = error as { response?: { data?: { message?: string } } };
      const errorMessage = axiosError.response?.data?.message || 'Failed to generate quotation';
      toast.error(errorMessage);
    } finally {
      setIsGeneratingQuotation(false);
    }
  }, [displayProducts.length, userId, fetchWishlist, navigate]);

  
  if (initialLoad) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb items={[{ label: 'Home', path: '/' }, { label: 'Wishlist' }]} />
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (displayProducts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb items={[{ label: 'Home', path: '/' }, { label: 'Wishlist' }]} />
        <EmptyState
          icon={<Heart className="w-8 h-8" />}
          title="Your wishlist is empty"
          description="Save products to your wishlist and get personalized quotes from our sales team."
          action={<Button asChild><Link to="/products">Browse Products <ArrowRight className="w-4 h-4 ml-2" /></Link></Button>}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: 'Home', path: '/' }, { label: 'Wishlist' }]} />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">My Wishlist</h1>
          <p className="text-sm text-muted-foreground mt-1">{displayProducts.length} products saved</p>
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <Button 
            onClick={handleGenerateQuotation}
            disabled={displayProducts.length === 0 || isGeneratingQuotation}
            className="flex items-center gap-2 flex-1 sm:flex-none bg-primary hover:bg-primary/90"
          >
            {isGeneratingQuotation ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <FileText className="w-4 h-4" />
            )}
            Request For Quotation
          </Button>
          <Button 
            variant="destructive" 
            size="sm"
            onClick={handleClearAll}
            disabled={isClearing || displayProducts.length === 0}
            className="flex items-center gap-2 flex-1 sm:flex-none"
          >
            {isClearing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
            Clear All
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {displayProducts.map((product: DisplayProduct) => (
          <Card 
            key={product.id} 
            className="group relative overflow-hidden border-border hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
          >
            <Link to={`/products/${product.slug}`} className="block relative aspect-square overflow-hidden bg-muted/30">
              <img
                src={product.image}
                alt={product.name}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x400';
                }}
              />
              
              <Button
                size="icon"
                variant="ghost"
                className={cn(
                  'absolute top-2 right-2 w-8 h-8 rounded-full transition-all duration-200',
                  'bg-white/80 hover:bg-white shadow-md backdrop-blur-sm',
                  'border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600',
                  removingId === product.id && 'opacity-50 cursor-not-allowed'
                )}
                onClick={(e: React.MouseEvent) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleRemove(product.id);
                }}
                disabled={removingId === product.id}
                title="Remove from wishlist"
              >
                {removingId === product.id ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Heart className="w-4 h-4 fill-red-500" />
                )}
              </Button>
            </Link>

            <div className="p-4 flex flex-col flex-1">
              <div className="flex items-center gap-1.5 mb-2">
                <Badge className="text-[10px] font-semibold bg-primary/10 text-primary border-0">
                  {product.brandName}
                </Badge>
                <span className="text-xs text-muted-foreground/50">·</span>
                <span className="text-xs text-muted-foreground">{product.categoryName}</span>
              </div>

              <Link to={`/products/${product.slug}`}>
                <h3 className="font-semibold text-sm leading-snug mb-1.5 line-clamp-2 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
              </Link>

              <p className="text-xs text-muted-foreground line-clamp-2 mb-3 flex-1">
                {product.shortDescription}
              </p>

              <div className="flex items-center gap-1.5">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={cn(
                        'text-sm',
                        star <= Math.floor(product.rating) ? 'text-red-500' : 'text-muted-foreground/30'
                      )}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}