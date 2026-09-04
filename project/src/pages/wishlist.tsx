// // src/pages/wishlist.tsx
// import { Link, useNavigate } from 'react-router-dom';
// import { Heart, ArrowRight, Trash2, Loader2, FileText } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Card } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { EmptyState } from '@/components/shared';
// import { useApp } from '@/hooks/use-app';
// import { toast } from 'sonner';
// import { useState, useEffect, useMemo, useCallback } from 'react';
// import { PageBreadcrumb as Breadcrumb } from '@/layouts/customer-layout-wrapper';
// import { cn } from '@/lib/utils';
// import axios from 'axios';
// import { baseurl } from '@/Baseurl/baseurl';

// // Define the API product type
// interface ApiProduct {
//   id: number;
//   product_name: string;
//   product_code: string;
//   product_brand: string;
//   price: string;
//   discount: string;
//   product_description: string;
//   warranty: string;
//   product_series: string | null;
//   product_type: string | null;
//   created_at: string;
//   updated_at: string;
//   product_category_id: number;
//   product_details_pdf?: string;
//   category_name?: string;
//   variants?: Array<{
//     id: number;
//     product_id: number;
//     color_name: string;
//     color_hex: string;
//     price: string;
//     stock: number;
//     image_url: string;
//   }>;
// }

// interface DisplayProduct {
//   id: string;
//   name: string;
//   slug: string;
//   brandName: string;
//   categoryName: string;
//   shortDescription: string;
//   description: string;
//   price: number;
//   discount: number;
//   rating: number;
//   reviewCount: number;
//   gallery: string[];
//   image: string;
//   isPopular: boolean;
//   isNew: boolean;
//   createdAt: string;
//   variants: ApiProduct['variants'];
// }

// function isApiProduct(item: any): item is ApiProduct {
//   return item && typeof item === 'object' && 'product_name' in item && 'product_code' in item;
// }

// export function WishlistPage() {
//   const navigate = useNavigate();
//   const { wishlistProducts, removeFromWishlist, clearWishlist, fetchWishlist } = useApp();
//   const [userId, setUserId] = useState<number | null>(null);
//   const [initialLoad, setInitialLoad] = useState(true);
//   const [removingId, setRemovingId] = useState<string | null>(null);
//   const [isClearing, setIsClearing] = useState(false);
//   const [isGeneratingQuotation, setIsGeneratingQuotation] = useState(false);

//   useEffect(() => {
//     const session = localStorage.getItem('userSession');
//     if (session) {
//       try {
//         const user = JSON.parse(session);
//         setUserId(user.userId);
//         if (user.userId) {
//           fetchWishlist(user.userId).finally(() => {
//             setInitialLoad(false);
//           });
//         } else {
//           setInitialLoad(false);
//         }
//       } catch (e) {
//         console.error('Error loading user session:', e);
//         setInitialLoad(false);
//       }
//     } else {
//       setInitialLoad(false);
//     }
//   }, []);

//   const displayProducts = useMemo((): DisplayProduct[] => {
//     if (!wishlistProducts || wishlistProducts.length === 0) {
//       return [];
//     }

//     const products = wishlistProducts as any[];
    
//     return products
//       .filter(isApiProduct)
//       .map((p: ApiProduct) => {
//         let image = 'https://via.placeholder.com/400x400';
//         if (p.variants && p.variants.length > 0 && p.variants[0].image_url) {
//           image = `${baseurl}${p.variants[0].image_url}`;
//         }
        
//         const galleryImages = p.variants?.map(v => 
//           v.image_url ? `${baseurl}${v.image_url}` : null
//         ).filter((url): url is string => Boolean(url)) || [];
        
//         return {
//           id: String(p.id),
//           name: p.product_name,
//           slug: p.product_name.toLowerCase().replace(/\s+/g, '-'),
//           brandName: p.product_brand || 'Unknown',
//           categoryName: p.category_name || 'Uncategorized',
//           shortDescription: p.product_description?.substring(0, 100) || '',
//           description: p.product_description || '',
//           price: parseFloat(p.price) || 0,
//           discount: parseFloat(p.discount) || 0,
//           rating: 4.5,
//           reviewCount: 0,
//           gallery: galleryImages.length > 0 ? galleryImages : [image],
//           image: image,
//           isPopular: false,
//           isNew: false,
//           createdAt: p.created_at,
//           variants: p.variants || [],
//         };
//       });
//   }, [wishlistProducts]);

//   const handleRemove = useCallback(async (productId: string): Promise<void> => {
//     if (removingId) return;
    
//     setRemovingId(productId);
//     try {
//       await removeFromWishlist(productId, userId || undefined);
//       if (userId) {
//         await fetchWishlist(userId);
//       }
//       toast.success('Removed from wishlist');
//     } catch (error) {
//       toast.error('Failed to remove from wishlist');
//     } finally {
//       setRemovingId(null);
//     }
//   }, [removeFromWishlist, userId, fetchWishlist, removingId]);

//   const handleClearAll = useCallback(async (): Promise<void> => {
//     if (isClearing) return;
    
//     if (!confirm('Are you sure you want to clear all items from your wishlist?')) {
//       return;
//     }
    
//     setIsClearing(true);
//     try {
//       if (userId) {
//         await clearWishlist(userId);
//         await fetchWishlist(userId);
//       } else {
//         displayProducts.forEach(async (p) => {
//           await removeFromWishlist(p.id, undefined);
//         });
//       }
//       toast.success('Wishlist cleared successfully');
//     } catch (error) {
//       toast.error('Failed to clear wishlist');
//     } finally {
//       setIsClearing(false);
//     }
//   }, [clearWishlist, userId, fetchWishlist, displayProducts, removeFromWishlist, isClearing]);

//   const handleGenerateQuotation = useCallback(async (): Promise<void> => {
//     if (displayProducts.length === 0) {
//       toast.error('Your wishlist is empty. Add products to generate a quotation.');
//       return;
//     }
    
//     const session = localStorage.getItem('userSession');
//     if (!session) {
//       toast.error('Please login to generate a quotation');
//       navigate('/login');
//       return;
//     }

//     // Remove the window.prompt - generate quotation directly
//     setIsGeneratingQuotation(true);

//     try {
//       const response = await axios.post(`${baseurl}/api/quotations/generate`, {
//         user_id: userId,
//         remarks: '' // Empty remarks or you can use a default
//       });

//       if (response.data.success) {
//         toast.success('Quotation generated successfully!');
//         if (userId) {
//           await fetchWishlist(userId);
//         }
//         navigate('/wishlist/quotation');
//       }
//     } catch (error: unknown) {
//       console.error('Error generating quotation:', error);
//       const axiosError = error as { response?: { data?: { message?: string } } };
//       const errorMessage = axiosError.response?.data?.message || 'Failed to generate quotation';
//       toast.error(errorMessage);
//     } finally {
//       setIsGeneratingQuotation(false);
//     }
//   }, [displayProducts.length, userId, fetchWishlist, navigate]);

  
//   if (initialLoad) {
//     return (
//       <div className="container mx-auto px-4 py-8">
//         <Breadcrumb items={[{ label: 'Home', path: '/' }, { label: 'Wishlist' }]} />
//         <div className="flex items-center justify-center h-64">
//           <Loader2 className="w-8 h-8 animate-spin text-primary" />
//         </div>
//       </div>
//     );
//   }

//   if (displayProducts.length === 0) {
//     return (
//       <div className="container mx-auto px-4 py-8">
//         <Breadcrumb items={[{ label: 'Home', path: '/' }, { label: 'Wishlist' }]} />
//         <EmptyState
//           icon={<Heart className="w-8 h-8" />}
//           title="Your wishlist is empty"
//           description="Save products to your wishlist and get personalized quotes from our sales team."
//           action={<Button asChild><Link to="/products">Browse Products <ArrowRight className="w-4 h-4 ml-2" /></Link></Button>}
//         />
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <Breadcrumb items={[{ label: 'Home', path: '/' }, { label: 'Wishlist' }]} />

//       <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
//         <div>
//           <h1 className="text-2xl lg:text-3xl font-bold">My Wishlist</h1>
//           <p className="text-sm text-muted-foreground mt-1">{displayProducts.length} products saved</p>
//         </div>
//         <div className="flex flex-wrap gap-2 w-full sm:w-auto">
//           <Button 
//             onClick={handleGenerateQuotation}
//             disabled={displayProducts.length === 0 || isGeneratingQuotation}
//             className="flex items-center gap-2 flex-1 sm:flex-none bg-primary hover:bg-primary/90"
//           >
//             {isGeneratingQuotation ? (
//               <Loader2 className="w-4 h-4 animate-spin" />
//             ) : (
//               <FileText className="w-4 h-4" />
//             )}
//             Request For Quotation
//           </Button>
//           <Button 
//             variant="destructive" 
//             size="sm"
//             onClick={handleClearAll}
//             disabled={isClearing || displayProducts.length === 0}
//             className="flex items-center gap-2 flex-1 sm:flex-none"
//           >
//             {isClearing ? (
//               <Loader2 className="w-4 h-4 animate-spin" />
//             ) : (
//               <Trash2 className="w-4 h-4" />
//             )}
//             Clear All
//           </Button>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
//         {displayProducts.map((product: DisplayProduct) => (
//           <Card 
//             key={product.id} 
//             className="group relative overflow-hidden border-border hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
//           >
//             <Link to={`/products/${product.slug}`} className="block relative aspect-square overflow-hidden bg-muted/30">
//               <img
//                 src={product.image}
//                 alt={product.name}
//                 loading="lazy"
//                 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
//                 onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
//                   (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x400';
//                 }}
//               />
              
//               <Button
//                 size="icon"
//                 variant="ghost"
//                 className={cn(
//                   'absolute top-2 right-2 w-8 h-8 rounded-full transition-all duration-200',
//                   'bg-white/80 hover:bg-white shadow-md backdrop-blur-sm',
//                   'border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600',
//                   removingId === product.id && 'opacity-50 cursor-not-allowed'
//                 )}
//                 onClick={(e: React.MouseEvent) => {
//                   e.preventDefault();
//                   e.stopPropagation();
//                   handleRemove(product.id);
//                 }}
//                 disabled={removingId === product.id}
//                 title="Remove from wishlist"
//               >
//                 {removingId === product.id ? (
//                   <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
//                 ) : (
//                   <Heart className="w-4 h-4 fill-red-500" />
//                 )}
//               </Button>
//             </Link>

//             <div className="p-4 flex flex-col flex-1">
//               <div className="flex items-center gap-1.5 mb-2">
//                 <Badge className="text-[10px] font-semibold bg-primary/10 text-primary border-0">
//                   {product.brandName}
//                 </Badge>
//                 <span className="text-xs text-muted-foreground/50">·</span>
//                 <span className="text-xs text-muted-foreground">{product.categoryName}</span>
//               </div>

//               <Link to={`/products/${product.slug}`}>
//                 <h3 className="font-semibold text-sm leading-snug mb-1.5 line-clamp-2 group-hover:text-primary transition-colors">
//                   {product.name}
//                 </h3>
//               </Link>

//               <p className="text-xs text-muted-foreground line-clamp-2 mb-3 flex-1">
//                 {product.shortDescription}
//               </p>

//               <div className="flex items-center gap-1.5">
//                 <div className="flex items-center">
//                   {[1, 2, 3, 4, 5].map((star) => (
//                     <span
//                       key={star}
//                       className={cn(
//                         'text-sm',
//                         star <= Math.floor(product.rating) ? 'text-red-500' : 'text-muted-foreground/30'
//                       )}
//                     >
//                       ★
//                     </span>
//                   ))}
//                 </div>
//                 <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
//               </div>
//             </div>
//           </Card>
//         ))}
//       </div>
//     </div>
//   );
// }


// src/pages/wishlist.tsx

// src/pages/wishlist.tsx

// src/pages/wishlist.tsx - Updated with min/max price display

// src/pages/wishlist.tsx - Fixed with proper min/max price calculation from variants

// src/pages/wishlist.tsx - Fixed with proper image handling
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ArrowRight, Trash2, Loader2, FileText, Eye, BadgeCheck, Minus, Plus } from 'lucide-react';
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
interface ApiVariant {
  id: number;
  product_id: number;
  variant_name: string;
  part_code: string;
  category: string | null;
  sub_category: string | null;
  brand: string;
  description: string;
  spec_type: string;
  color: string;
  size: string;
  min_price: string;
  max_price: string;
  availability: string;
  datasheet_url: string;
  stock: number;
  image_url: string;
  created_at: string;
  updated_at: string;
}

interface ApiProduct {
  id: number;
  product_name: string;
  product_code: string;
  product_brand: string;
  min_price: string | null;
  max_price: string | null;
  discount: string;
  product_description: string;
  warranty: string;
  product_series: string | null;
  product_type: string | null;
  created_at: string;
  updated_at: string;
  product_category_id: number;
  product_details_pdf?: string;
  category_name?: string | null;
  variants?: ApiVariant[];
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
  minPrice: number;
  maxPrice: number;
  discount: number;
  rating: number;
  reviewCount: number;
  gallery: string[];
  image: string;
  isPopular: boolean;
  isNew: boolean;
  createdAt: string;
  variants: ApiVariant[];
  sku: string;
  discountPercentage?: number;
  stock: number;
}

/**
 * Helper function to extract image URL from variant image_url field
 * Handles both JSON array format and direct string format
 */
const extractImageUrl = (imageUrl: string | undefined | null): string | null => {
  if (!imageUrl) return null;
  
  try {
    // Try to parse as JSON array (format: "[\"/uploads/products/image.jpg\"]")
    const parsed = JSON.parse(imageUrl);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed[0];
    }
    return imageUrl;
  } catch {
    // If not JSON, treat as direct URL string
    return imageUrl;
  }
};

/**
 * Helper function to get full image URL with base URL
 */
const getFullImageUrl = (imagePath: string | null): string => {
  if (!imagePath) {
    return 'https://via.placeholder.com/400x400?text=No+Image';
  }
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // Ensure path starts with '/'
  const normalizedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${baseurl}${normalizedPath}`;
};

function isApiProduct(item: any): item is ApiProduct {
  return item && typeof item === 'object' && 'product_name' in item && 'product_code' in item;
}

export function WishlistPage() {
  const navigate = useNavigate();
  const { wishlistProducts, removeFromWishlist, clearWishlist, fetchWishlist, addToCompare, removeFromCompare, isInCompare, compareList } = useApp();
  const [userId, setUserId] = useState<number | null>(null);
  const [initialLoad, setInitialLoad] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [isClearing, setIsClearing] = useState(false);
  const [isGeneratingQuotation, setIsGeneratingQuotation] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [isCompareLoading, setIsCompareLoading] = useState<Record<string, boolean>>({});
  const [_isQuotationLoading, _setIsQuotationLoading] = useState<Record<string, boolean>>({});

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

  // Update the displayProducts useMemo to use the selected variant with proper image handling
  const displayProducts = useMemo((): DisplayProduct[] => {
    if (!wishlistProducts || wishlistProducts.length === 0) {
      return [];
    }

    const products = wishlistProducts as any[];
    
    return products
      .filter(isApiProduct)
      .map((p: ApiProduct) => {
        // Find the selected variant (marked by backend) or use first variant
        const selectedVariant = p.variants?.find((v: any) => v.is_selected) || p.variants?.[0];
        
        // Extract image URL from variant - handles both JSON array and string formats
        let image = 'https://via.placeholder.com/400x400?text=No+Image';
        if (selectedVariant?.image_url) {
          const extracted = extractImageUrl(selectedVariant.image_url);
          if (extracted) {
            image = getFullImageUrl(extracted);
          }
        }
        
        // Build gallery images from all variants with proper image extraction
        const galleryImages = p.variants?.map(v => {
          const extracted = extractImageUrl(v.image_url);
          return extracted ? getFullImageUrl(extracted) : null;
        }).filter((url): url is string => Boolean(url)) || [];
        
        // If no gallery images, use the main image
        const finalGallery = galleryImages.length > 0 ? galleryImages : [image];
        
        const totalStock = p.variants?.reduce((sum, v) => sum + v.stock, 0) || 0;
        
        // Use the selected variant's prices
        let minPrice = 0;
        let maxPrice = 0;
        
        if (selectedVariant) {
          minPrice = parseFloat(selectedVariant.min_price) || 0;
          maxPrice = parseFloat(selectedVariant.max_price) || 0;
        }
        
        // If no selected variant prices, try product-level prices
        if (minPrice === 0 && p.min_price) {
          minPrice = parseFloat(p.min_price) || 0;
        }
        if (maxPrice === 0 && p.max_price) {
          maxPrice = parseFloat(p.max_price) || 0;
        }
        
        // Use selected variant's min as fallback price
        let fallbackPrice = minPrice > 0 ? minPrice : 0;
        
        return {
          id: String(p.id),
          name: p.product_name,
          slug: p.product_name.toLowerCase().replace(/\s+/g, '-'),
          brandName: p.product_brand || 'Unknown',
          categoryName: p.category_name || 'Uncategorized',
          shortDescription: p.product_description?.substring(0, 100) || '',
          description: p.product_description || '',
          price: fallbackPrice > 0 ? fallbackPrice : 0,
          minPrice: minPrice,
          maxPrice: maxPrice,
          discount: parseFloat(p.discount) || 0,
          rating: 4.5,
          reviewCount: 0,
          gallery: finalGallery,
          image: image,
          isPopular: false,
          isNew: false,
          createdAt: p.created_at,
          variants: p.variants || [],
          sku: p.product_code,
          discountPercentage: parseFloat(p.discount) || 0,
          stock: totalStock,
        };
      });
  }, [wishlistProducts]);

  // Initialize quantities for products
  useEffect(() => {
    const initialQuantities: Record<string, number> = {};
    displayProducts.forEach(p => {
      initialQuantities[p.id] = 1;
    });
    setQuantities(initialQuantities);
  }, [displayProducts]);

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    const product = displayProducts.find(p => p.id === productId);
    if (!product) return;
    
    const maxStock = product.stock || 10;
    if (newQuantity >= 1 && newQuantity <= maxStock) {
      setQuantities(prev => ({ ...prev, [productId]: newQuantity }));
    } else if (newQuantity > maxStock) {
      toast.warning(`Only ${maxStock} items available in stock`, {
        duration: 2000,
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

  const toggleProductSelection = (productId: string) => {
    setSelectedProducts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedProducts.size === displayProducts.length) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(displayProducts.map(p => p.id)));
    }
  };

  const handleRemove = useCallback(async (productId: string): Promise<void> => {
    if (removingId) return;
    
    setRemovingId(productId);
    try {
      await removeFromWishlist(productId, userId || undefined);
      
      if (userId) {
        await fetchWishlist(userId);
      }
      setSelectedProducts(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Failed to remove from wishlist', {
        duration: 3000,
        position: 'top-right',
        style: {
          background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
          color: '#ffffff',
          border: 'none',
          padding: '14px 24px',
          borderRadius: '12px',
          fontSize: '15px',
          fontWeight: '600',
          boxShadow: '0 8px 25px rgba(239, 68, 68, 0.4)',
          marginTop: '70px',
          letterSpacing: '0.3px',
        },
      });
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
      setSelectedProducts(new Set());
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      toast.error('Failed to clear wishlist', {
        duration: 3000,
        position: 'top-right',
        style: {
          background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
          color: '#ffffff',
          border: 'none',
          padding: '14px 24px',
          borderRadius: '12px',
          fontSize: '15px',
          fontWeight: '600',
          boxShadow: '0 8px 25px rgba(239, 68, 68, 0.4)',
          marginTop: '70px',
          letterSpacing: '0.3px',
        },
      });
    } finally {
      setIsClearing(false);
    }
  }, [clearWishlist, userId, fetchWishlist, displayProducts, removeFromWishlist, isClearing]);

  const handleGenerateQuotation = useCallback(async (): Promise<void> => {
    if (selectedProducts.size === 0) {
      toast.error('Please select at least one product to generate a quotation.', {
        duration: 3000,
        position: 'top-right',
        style: {
          background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
          color: '#ffffff',
          border: 'none',
          padding: '14px 24px',
          borderRadius: '12px',
          fontSize: '15px',
          fontWeight: '600',
          boxShadow: '0 8px 25px rgba(239, 68, 68, 0.4)',
          marginTop: '70px',
          letterSpacing: '0.3px',
        },
      });
      return;
    }
    
    const session = localStorage.getItem('userSession');
    if (!session) {
      toast.error('Please login to generate a quotation', {
        duration: 3000,
        position: 'top-right',
        style: {
          background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
          color: '#ffffff',
          border: 'none',
          padding: '14px 24px',
          borderRadius: '12px',
          fontSize: '15px',
          fontWeight: '600',
          boxShadow: '0 8px 25px rgba(239, 68, 68, 0.4)',
          marginTop: '70px',
          letterSpacing: '0.3px',
        },
      });
      navigate('/login');
      return;
    }

    setIsGeneratingQuotation(true);

    try {
      const selectedProductsData = displayProducts
        .filter(p => selectedProducts.has(p.id))
        .map(p => ({
          product_id: parseInt(p.id),
          quantity: quantities[p.id] || 1,
          product_name: p.name,
          product_code: p.sku,
          product_brand: p.brandName,
          price: p.price,
          min_price: p.minPrice || null,
          max_price: p.maxPrice || null,
          discount: p.discountPercentage || 0,
        }));

      const response = await axios.post(`${baseurl}/api/quotations/generate-from-wishlist`, {
        user_id: userId,
        products: selectedProductsData,
        remarks: `Quotation for ${selectedProductsData.length} selected wishlist items`
      });

      if (response.data.success) {
        toast.success(`Quotation generated for ${selectedProductsData.length} product(s)!`, {
          duration: 800,
          position: 'top-right',
          style: {
            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            color: '#ffffff',
            border: 'none',
            padding: '14px 24px',
            borderRadius: '12px',
            fontSize: '15px',
            fontWeight: '600',
            boxShadow: '0 8px 25px rgba(16, 185, 129, 0.4)',
            marginTop: '70px',
            letterSpacing: '0.3px',
          },
        });
        setSelectedProducts(new Set());
        if (userId) {
          await fetchWishlist(userId);
        }
        navigate('/my-quotations');
      }
    } catch (error: unknown) {
      console.error('Error generating quotation:', error);
      const axiosError = error as { response?: { data?: { message?: string } } };
      const errorMessage = axiosError.response?.data?.message || 'Failed to generate quotation';
      toast.error(errorMessage, {
        duration: 3000,
        position: 'top-right',
        style: {
          background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
          color: '#ffffff',
          border: 'none',
          padding: '14px 24px',
          borderRadius: '12px',
          fontSize: '15px',
          fontWeight: '600',
          boxShadow: '0 8px 25px rgba(239, 68, 68, 0.4)',
          marginTop: '70px',
          letterSpacing: '0.3px',
        },
      });
    } finally {
      setIsGeneratingQuotation(false);
    }
  }, [selectedProducts, displayProducts, quantities, userId, fetchWishlist, navigate]);

  const handleCompareToggle = async (productId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsCompareLoading(prev => ({ ...prev, [productId]: true }));
    
    try {
      const inCompare = isInCompare(productId);
      if (inCompare) {
        await removeFromCompare(productId, userId || undefined);
        toast.success('Removed from compare');
      } else {
        if (compareList.length >= 4) {
          toast.warning('You can compare up to 4 products');
          setIsCompareLoading(prev => ({ ...prev, [productId]: false }));
          return;
        }
        await addToCompare(productId, userId || undefined);
        toast.success('Added to compare');
        navigate('/compare');
      }
    } catch (error) {
      console.error('Error toggling compare:', error);
      toast.error('Failed to update compare list');
    } finally {
      setIsCompareLoading(prev => ({ ...prev, [productId]: false }));
    }
  };

  // Format price
  const formatPrice = (price: number) => {
    if (isNaN(price) || !isFinite(price)) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Get display price - show min/max range from variants
  const getDisplayPrice = (product: DisplayProduct) => {
    const minPrice = product.minPrice || 0;
    const maxPrice = product.maxPrice || 0;
    
    // If both min and max are 0, try to use the regular price
    if (minPrice === 0 && maxPrice === 0) {
      return formatPrice(product.price);
    }
    
    // If min and max are the same, show single price
    if (minPrice === maxPrice) {
      return formatPrice(minPrice);
    }
    
    // Show range
    return `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`;
  };

  // Check if product has discount
  const hasDiscount = (product: DisplayProduct) => {
    return (product.discountPercentage || 0) > 0;
  };

  // Check if price is a range
  const isPriceRange = (product: DisplayProduct) => {
    const minPrice = product.minPrice || 0;
    const maxPrice = product.maxPrice || 0;
    return minPrice > 0 && maxPrice > 0 && minPrice !== maxPrice;
  };

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
          <p className="text-sm text-muted-foreground mt-1">
            {displayProducts.length} products saved · {selectedProducts.size} selected
          </p>
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <Button 
            onClick={toggleSelectAll}
            variant="outline"
            size="sm"
            className="flex-1 sm:flex-none"
          >
            {selectedProducts.size === displayProducts.length ? 'Deselect All' : 'Select All'}
          </Button>
          <Button 
            onClick={handleGenerateQuotation}
            disabled={selectedProducts.size === 0 || isGeneratingQuotation}
            className="flex items-center gap-2 flex-1 sm:flex-none bg-primary hover:bg-primary/90"
          >
            {isGeneratingQuotation ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <FileText className="w-4 h-4" />
            )}
            Request Quote ({selectedProducts.size})
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
        {displayProducts.map((product: DisplayProduct) => {
          const isSelected = selectedProducts.has(product.id);
          const inCompare = isInCompare(product.id);
          const maxStock = product.stock || 10;
          const quantity = quantities[product.id] || 1;
          const discount = hasDiscount(product);
          const displayPrice = getDisplayPrice(product);
          const priceRange = isPriceRange(product);

          return (
            <Card 
              key={product.id} 
              className={cn(
                'group relative overflow-hidden border hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col',
                isSelected ? 'border-primary ring-2 ring-primary/20' : 'border-border'
              )}
            >
              {/* Selection checkbox */}
              <div className="absolute top-3 left-3 z-20">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleProductSelection(product.id)}
                  className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary focus:ring-offset-0 accent-primary cursor-pointer"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>

              {/* Badges */}
              <div className="absolute top-3 left-12 z-10 flex flex-col gap-1.5">
                {discount && (
                  <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white text-[10px] font-semibold shadow-lg rounded-full px-3 py-1">
                    {product.discountPercentage}% OFF
                  </Badge>
                )}
              </div>

              {/* Remove button */}
              <Button
                size="icon"
                variant="ghost"
                className={cn(
                  'absolute top-2 right-2 z-20 w-8 h-8 rounded-full transition-all duration-200',
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

              {/* Image */}
              <Link to={`/products/${product.slug}`} className="block relative aspect-square overflow-hidden bg-muted/30">
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x400?text=No+Image';
                  }}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
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
              </Link>

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

                {/* Price - Updated to show min/max range from variants */}
                <div className="mb-2 mt-1">
                  <span className="text-lg font-bold text-primary">
                    {displayPrice}
                  </span>
                  {priceRange && (
                    <p className="text-xs text-gray-400 mt-0.5">Price range based on variants</p>
                  )}
                </div>

                {/* Short Description */}
                <p className="text-xs text-muted-foreground line-clamp-2 mb-3 flex-1">
                  {product.shortDescription}
                </p>

                {/* Quantity Selector */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Qty:</span>
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      className="h-7 w-7 rounded-full border-gray-300 dark:border-gray-600 hover:bg-primary hover:text-white hover:border-primary transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQuantityChange(product.id, quantity - 1);
                      }}
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="w-8 text-center text-sm font-medium text-gray-900 dark:text-white">
                      {quantity}
                    </span>
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      className="h-7 w-7 rounded-full border-gray-300 dark:border-gray-600 hover:bg-primary hover:text-white hover:border-primary transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQuantityChange(product.id, quantity + 1);
                      }}
                      disabled={quantity >= maxStock}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                  {maxStock > 0 && (
                    <span className="text-[10px] text-gray-400 ml-1">
                      Max: {maxStock}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  {/* Add to Compare */}
                  <button
                    className={cn(
                      'flex items-center gap-2 mt-1 select-none text-xs font-medium',
                      isCompareLoading[product.id] ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
                      inCompare ? 'text-primary' : 'text-gray-600 dark:text-gray-400'
                    )}
                    onClick={(e) => handleCompareToggle(product.id, e)}
                    disabled={isCompareLoading[product.id]}
                  >
                    <input
                      type="checkbox"
                      checked={inCompare}
                      disabled={isCompareLoading[product.id]}
                      onChange={() => {}}
                      onClick={(e) => e.stopPropagation()}
                      className={cn(
                        'h-4 w-4 rounded border-gray-300 dark:border-gray-600',
                        'text-primary focus:ring-primary focus:ring-offset-0',
                        'accent-primary cursor-pointer disabled:cursor-not-allowed'
                      )}
                    />
                    <span>{inCompare ? 'Added to compare' : 'Add to compare'}</span>
                    {isCompareLoading[product.id] && (
                      <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin text-primary" />
                    )}
                  </button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}