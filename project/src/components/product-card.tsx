// product-card.tsx
import { Link } from 'react-router-dom';
import { Heart, GitCompare, Eye, Star, BadgeCheck } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useApp } from '@/hooks/use-app';
import type { Product } from '@/types';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { 
    compareList, 
    addToWishlist, 
    removeFromWishlist, 
    addToCompare, 
    removeFromCompare, 
    isInWishlist, 
    isInCompare,
    loadingWishlist 
  } = useApp();
  
  const [isLoading, setIsLoading] = useState(false);
  const [localWishlistState, setLocalWishlistState] = useState<boolean | null>(null);

  // Use local state if available, otherwise use the context state
  const inWishlist = localWishlistState !== null ? localWishlistState : isInWishlist(product.id);
  const inCompare = isInCompare(product.id);
  const compareFull = compareList.length >= 4;

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isLoading || loadingWishlist) return;
    
    setIsLoading(true);
    
    try {
      if (inWishlist) {
        await removeFromWishlist(product.id);
        setLocalWishlistState(false);
        toast.success('Removed from wishlist', {
          duration: 2000,
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
      } else {
        await addToWishlist(product.id);
        setLocalWishlistState(true);
        toast.success('Added to wishlist', {
          duration: 2000,
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
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      setLocalWishlistState(null);
      toast.error('Failed to update wishlist', {
        duration: 2000,
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
      setIsLoading(false);
    }
  };

  const handleCompare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      if (inCompare) {
        await removeFromCompare(product.id);
        toast.success('Removed from compare', {
          duration: 2000,
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
      } else {
        if (compareFull) {
          toast.error('You can compare up to 4 products at a time', {
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
          return;
        }
        await addToCompare(product.id);
        toast.success('Added to compare', {
          duration: 2000,
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
      }
    } catch (error) {
      console.error('Error toggling compare:', error);
      toast.error('Failed to update compare list', {
        duration: 2000,
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
  };

  // Format price in Indian Rupees
  const formatPrice = (price: number) => {
    if (isNaN(price) || !isFinite(price)) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Get display price - show min/max range
  const getDisplayPrice = () => {
    // Check if product has minPrice and maxPrice from API
    if (product.minPrice !== undefined && product.minPrice !== null && 
        product.maxPrice !== undefined && product.maxPrice !== null) {
      const min = Number(product.minPrice);
      const max = Number(product.maxPrice);
      
      if (!isNaN(min) && !isNaN(max)) {
        if (min === max) {
          return formatPrice(min);
        }
        return `${formatPrice(min)} - ${formatPrice(max)}`;
      }
    }
    
    // Fallback to variants
    if (product.variants && product.variants.length > 0) {
      const variantPrices = product.variants
        .map(v => parseFloat(v.price))
        .filter(p => !isNaN(p) && isFinite(p));
      
      if (variantPrices.length > 0) {
        const minPrice = Math.min(...variantPrices);
        const maxPrice = Math.max(...variantPrices);
        
        if (minPrice === maxPrice) {
          return formatPrice(minPrice);
        }
        return `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`;
      }
    }
    
    // Fallback to product price
    if (product.price && !isNaN(product.price) && isFinite(product.price)) {
      return formatPrice(product.price);
    }
    
    return 'Price on request';
  };

  // Check if product has discount
  const hasDiscount = (product.discountPercentage ?? 0) > 0;
  const discountedPrice = hasDiscount && product.price ? product.price * (1 - (product.discountPercentage ?? 0) / 100) : product.price;

  // Get stock with fallback
  const stock = product.stock ?? 0;

  return (
    <Card className="group relative overflow-hidden border border-gray-200 dark:border-gray-800 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col bg-white dark:bg-gray-900 rounded-2xl">
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
        {product.isPopular && (
          <Badge className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-[10px] font-semibold shadow-lg rounded-full px-3 py-1">
            POPULAR
          </Badge>
        )}
        {product.isNew && (
          <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-[10px] font-semibold shadow-lg rounded-full px-3 py-1">
            NEW
          </Badge>
        )}
        {hasDiscount && (
          <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white text-[10px] font-semibold shadow-lg rounded-full px-3 py-1">
            {product.discountPercentage}% OFF
          </Badge>
        )}
      </div>

      {/* Image */}
      <Link to={`/products/${product.slug}`} className="block relative aspect-square overflow-hidden bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-t-2xl">
        <img
          src={product.gallery[0]}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
        />
        {/* Quick actions overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex gap-2">
            <Button 
              size="icon" 
              variant="secondary" 
              className="w-10 h-10 rounded-full shadow-lg hover:scale-110 transition-transform"
              asChild
            >
              <Link to={`/products/${product.slug}`}>
                <Eye className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        {/* Brand & Category */}
        <div className="flex items-center gap-1.5 mb-2">
          <BadgeCheck className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{product.brandName}</span>
          <span className="text-xs text-gray-300 dark:text-gray-600">·</span>
          <span className="text-xs text-gray-500 dark:text-gray-500">{product.categoryName}</span>
        </div>

        {/* Product Name */}
        <Link to={`/products/${product.slug}`}>
          <h3 className="font-semibold text-sm leading-snug mb-1.5 line-clamp-2 group-hover:text-primary transition-colors text-gray-900 dark:text-white">
            {product.name}
          </h3>
        </Link>

        {/* Price Section - Fixed to show min/max properly */}
        <div className="mb-2 mt-1">
          {hasDiscount && discountedPrice ? (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-lg font-bold text-primary">
                {formatPrice(discountedPrice)}
              </span>
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(product.price)}
              </span>
            </div>
          ) : (
            <span className="text-lg font-bold text-primary">
              {getDisplayPrice()}
            </span>
          )}
          {/* Show min/max label if different */}
          {product.minPrice !== undefined && product.maxPrice !== undefined && 
           product.minPrice !== product.maxPrice && 
           !isNaN(product.minPrice) && !isNaN(product.maxPrice) && (
            <p className="text-xs text-gray-400 mt-0.5">Price range based on variants</p>
          )}
          {product.variants && product.variants.length > 1 && 
           !(product.minPrice !== undefined && product.maxPrice !== undefined) && (
            <p className="text-xs text-gray-400 mt-0.5">*Price varies by variant</p>
          )}
        </div>

        {/* Short Description */}
        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3 flex-1">
          {product.shortDescription}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={cn(
                  'w-3.5 h-3.5',
                  star <= Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'
                )}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">({product.reviewCount})</span>
          {stock > 0 && (
            <span className="text-xs text-green-600 dark:text-green-400 ml-auto">
              {stock > 10 ? 'In Stock' : `Only ${stock} left`}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-auto">
          <Button 
            asChild 
            size="sm" 
            className="flex-1 h-9 text-xs rounded-full bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl transition-all"
          >
            <Link to={`/products/${product.slug}`}>
              View Details
            </Link>
          </Button>
          <Button
            size="icon"
            variant="outline"
            className={cn(
              'h-9 w-9 shrink-0 rounded-full transition-all duration-200 border-gray-200 dark:border-gray-700 hover:border-primary hover:text-primary',
              inWishlist && 'border-red-500 text-red-500 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30',
              (isLoading || loadingWishlist) && 'opacity-50 cursor-not-allowed'
            )}
            onClick={handleWishlist}
            disabled={isLoading || loadingWishlist}
            title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            {isLoading || loadingWishlist ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <Heart className={cn('w-4 h-4 transition-all', inWishlist && 'fill-red-500')} />
            )}
          </Button>
          <Button
            size="icon"
            variant="outline"
            className={cn(
              'h-9 w-9 shrink-0 rounded-full transition-all duration-200 border-gray-200 dark:border-gray-700 hover:border-primary hover:text-primary',
              inCompare && 'border-blue-500 text-blue-500 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30'
            )}
            onClick={handleCompare}
            title={inCompare ? 'Remove from comparison' : 'Add to comparison'}
          >
            <GitCompare className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}