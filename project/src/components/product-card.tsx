import { Link } from 'react-router-dom';
import { Heart, GitCompare, Eye, Star, BadgeCheck } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useApp } from '@/hooks/use-app';
import type { Product } from '@/types';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { compareList, addToWishlist, removeFromWishlist, addToCompare, removeFromCompare, isInWishlist, isInCompare } = useApp();

  const inWishlist = isInWishlist(product.id);
  const inCompare = isInCompare(product.id);
  const compareFull = compareList.length >= 4;

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inWishlist) {
      removeFromWishlist(product.id);
      toast.success('Removed from wishlist');
    } else {
      addToWishlist(product.id);
      toast.success('Added to wishlist! Fill in your details to get a quote.');
    }
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inCompare) {
      removeFromCompare(product.id);
      toast.success('Removed from comparison');
    } else {
      if (compareFull) {
        toast.error('You can compare up to 4 products at a time');
        return;
      }
      addToCompare(product.id);
      toast.success('Added to comparison');
    }
  };

  return (
    <Card className="group relative overflow-hidden border-border hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col">
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
        {product.isPopular && (
          <Badge className="bg-accent text-accent-foreground text-[10px] font-semibold shadow-sm">POPULAR</Badge>
        )}
        {product.isNew && (
          <Badge className="bg-secondary text-secondary-foreground text-[10px] font-semibold shadow-sm">NEW</Badge>
        )}
      </div>

      {/* Image */}
      <Link to={`/products/${product.slug}`} className="block relative aspect-square overflow-hidden bg-muted/30">
        <img
          src={product.gallery[0]}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Quick actions overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex gap-2">
            <Button size="icon" variant="secondary" className="w-10 h-10 rounded-full shadow-lg" asChild>
              <Link to={`/products/${product.slug}`}>
                <Eye className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center gap-1.5 mb-2">
          <BadgeCheck className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-medium text-muted-foreground">{product.brandName}</span>
          <span className="text-xs text-muted-foreground/50">·</span>
          <span className="text-xs text-muted-foreground">{product.categoryName}</span>
        </div>

        <Link to={`/products/${product.slug}`}>
          <h3 className="font-semibold text-sm leading-snug mb-1.5 line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        <p className="text-xs text-muted-foreground line-clamp-2 mb-3 flex-1">{product.shortDescription}</p>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={cn(
                  'w-3.5 h-3.5',
                  star <= Math.floor(product.rating) ? 'text-accent fill-accent' : 'text-muted-foreground/30'
                )}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-auto">
          <Button asChild size="sm" className="flex-1 h-9 text-xs">
            <Link to={`/products/${product.slug}`}>View Details</Link>
          </Button>
          <Button
            size="icon"
            variant="outline"
            className={cn('h-9 w-9 shrink-0', inWishlist && 'border-accent text-accent bg-accent/10')}
            onClick={handleWishlist}
            title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart className={cn('w-4 h-4', inWishlist && 'fill-accent')} />
          </Button>
          <Button
            size="icon"
            variant="outline"
            className={cn('h-9 w-9 shrink-0', inCompare && 'border-secondary text-secondary bg-secondary/10')}
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
