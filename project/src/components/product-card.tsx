// // product-card.tsx
// import { Link, useNavigate } from 'react-router-dom';
// import { Heart, GitCompare, Eye, Star, BadgeCheck, FileSpreadsheet } from 'lucide-react';
// import { Card } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { useApp } from '@/hooks/use-app';
// import type { Product } from '@/types';
// import { cn } from '@/lib/utils';
// import { toast } from 'sonner';
// import { useState } from 'react';
// import { baseurl } from '@/Baseurl/baseurl';

// interface ProductCardProps {
//   product: Product;
// }

// export function ProductCard({ product }: ProductCardProps) {
//   const { 
//     compareList, 
//     addToWishlist, 
//     removeFromWishlist, 
//     addToCompare, 
//     removeFromCompare, 
//     isInWishlist, 
//     isInCompare,
//     loadingWishlist,
//     isLoggedIn
//   } = useApp();
  
//   const navigate = useNavigate();
//   const [isLoading, setIsLoading] = useState(false);
//   const [localWishlistState, setLocalWishlistState] = useState<boolean | null>(null);
//   const [isCompareLoading, setIsCompareLoading] = useState(false);
//   const [isQuotationLoading, setIsQuotationLoading] = useState(false);

//   // Use local state if available, otherwise use the context state
//   const inWishlist = localWishlistState !== null ? localWishlistState : isInWishlist(product.id);
//   const inCompare = isInCompare(product.id);
//   const compareFull = compareList.length >= 4;

//   const getUserId = (): number | undefined => {
//     const session = localStorage.getItem('userSession');
//     if (session) {
//       try {
//         return JSON.parse(session).userId;
//       } catch {
//         return undefined;
//       }
//     }
//     return undefined;
//   };

//   const getUserDetails = () => {
//     const session = localStorage.getItem('userSession');
//     if (session) {
//       try {
//         const user = JSON.parse(session);
//         return {
//           id: user.userId,
//           name: user.name || '',
//           email: user.email || '',
//           mobile: user.mobile || ''
//         };
//       } catch (e) {
//         return null;
//       }
//     }
//     return null;
//   };

//   const handleWishlist = async (e: React.MouseEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
    
//     if (isLoading || loadingWishlist) return;
    
//     // Check if user is logged in
//     if (!isLoggedIn) {
//       toast.error('Please login to sync wishlist', {
//         duration: 3000,
//         position: 'top-right',
//         style: {
//           background: '#EF4444',
//           color: 'white',
//           border: 'none',
//           padding: '12px 24px',
//           borderRadius: '8px',
//           fontSize: '14px',
//           fontWeight: '500',
//           boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
//           marginTop: '70px',
//         },
//         action: {
//           label: 'Login',
//           onClick: () => window.location.href = '/login'
//         }
//       });
//       // Redirect to login after a short delay
//       setTimeout(() => {
//         window.location.href = '/login';
//       }, 1500);
//       return;
//     }
    
//     setIsLoading(true);
    
//     try {
//       if (inWishlist) {
//         await removeFromWishlist(product.id);
//         setLocalWishlistState(false);
//         toast.success('Removed from wishlist', {
//           duration: 2000,
//           position: 'top-right',
//           style: {
//             background: '#EF4444',
//             color: 'white',
//             border: 'none',
//             padding: '12px 24px',
//             borderRadius: '8px',
//             fontSize: '14px',
//             fontWeight: '500',
//             boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
//             marginTop: '70px',
//           },
//         });
//       } else {
//         await addToWishlist(product.id);
//         setLocalWishlistState(true);
//         toast.success('Added to wishlist', {
//           duration: 2000,
//           position: 'top-right',
//           style: {
//             background: '#10B981',
//             color: 'white',
//             border: 'none',
//             padding: '12px 24px',
//             borderRadius: '8px',
//             fontSize: '14px',
//             fontWeight: '500',
//             boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
//             marginTop: '70px',
//           },
//         });
//       }
//     } catch (error) {
//       console.error('Error toggling wishlist:', error);
//       setLocalWishlistState(null);
//       toast.error('Failed to update wishlist', {
//         duration: 2000,
//         position: 'top-right',
//         style: {
//           background: '#EF4444',
//           color: 'white',
//           border: 'none',
//           padding: '12px 24px',
//           borderRadius: '8px',
//           fontSize: '14px',
//           fontWeight: '500',
//           boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
//           marginTop: '70px',
//         },
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Shared toggle logic used by BOTH the compare icon and the checkbox
//   const toggleCompare = async (): Promise<boolean> => {
//     if (isCompareLoading) return false;

//     if (!inCompare && compareFull) {
//       toast.warning('You can compare up to 4 products', {
//         duration: 3000,
//         position: 'top-right',
//         style: {
//           background: '#F59E0B',
//           color: 'white',
//           border: 'none',
//           padding: '12px 24px',
//           borderRadius: '8px',
//           fontSize: '14px',
//           fontWeight: '500',
//           boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
//           marginTop: '70px',
//         },
//       });
//       return false;
//     }

//     setIsCompareLoading(true);
//     const uid = getUserId();

//     try {
//       if (inCompare) {
//         await removeFromCompare(product.id, uid);
//       } else {
//         await addToCompare(product.id, uid);
//       }
//       return true;
//     } catch (error) {
//       console.error('Error toggling compare:', error);
//       toast.error('Failed to update compare list');
//       return false;
//     } finally {
//       setIsCompareLoading(false);
//     }
//   };

//   // Compare icon: toggle, then take user to the compare page
//   const handleCompareClick = async (e: React.MouseEvent) => {
//     e.preventDefault();
//     e.stopPropagation();

//     if (inCompare) {
//       // Already added — just view the comparison
//       navigate('/compare');
//       return;
//     }

//     const added = await toggleCompare();
//     if (added) {
//       navigate('/compare');
//     }
//   };

//   // Checkbox: toggle and navigate to compare page
//   const handleCompareCheckbox = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     e.stopPropagation();
    
//     // If already in compare, just navigate to compare page
//     if (inCompare) {
//       navigate('/compare');
//       return;
//     }
    
//     const added = await toggleCompare();
//     if (added) {
//       navigate('/compare');
//     }
//   };

//   // Handle Quotation Request
//   const handleQuotationRequest = async (e: React.MouseEvent) => {
//     e.preventDefault();
//     e.stopPropagation();

//     const userId = getUserId();
//     if (!userId) {
//       toast.error('Please login to request a quotation', {
//         duration: 3000,
//         position: 'top-right',
//         style: {
//           background: '#EF4444',
//           color: 'white',
//           border: 'none',
//           padding: '12px 24px',
//           borderRadius: '8px',
//           fontSize: '14px',
//           fontWeight: '500',
//           boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
//           marginTop: '70px',
//         },
//         action: {
//           label: 'Login',
//           onClick: () => window.location.href = '/login'
//         }
//       });
//       setTimeout(() => {
//         window.location.href = '/login';
//       }, 1500);
//       return;
//     }

//     setIsQuotationLoading(true);

//     try {
//       const user = getUserDetails();
      
//       // Get the actual price - use minPrice/maxPrice if available
//       let actualPrice = product.price;
//       if (product.maxPrice !== undefined && product.maxPrice !== null && product.maxPrice > 0) {
//         actualPrice = product.maxPrice;
//       } else if (product.minPrice !== undefined && product.minPrice !== null && product.minPrice > 0) {
//         actualPrice = product.minPrice;
//       }

//       // Get the actual discount percentage
//       const actualDiscount = product.discountPercentage || 0;
      
//       const payload = {
//         user_id: userId,
//         product_id: parseInt(product.id),
//         product_name: product.name,
//         product_code: product.sku,
//         product_brand: product.brandName,
//         price: actualPrice,
//         discount: actualDiscount,
//         quantity: 1,
//         remarks: `Quotation requested for ${product.name}`,
//         customer_name: user?.name || '',
//         customer_mobile: user?.mobile || '',
//         customer_email: user?.email || ''
//       };

//       console.log('Sending quotation payload:', payload);

//       const response = await fetch(`${baseurl}/api/quotations/single`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(payload),
//       });

//       const data = await response.json();

//       if (data.success) {
//         toast.success(`Quotation #${data.quotation_no} generated successfully!`, {
//           duration: 3000,
//           position: 'top-right',
//           style: {
//             background: '#10B981',
//             color: 'white',
//             border: 'none',
//             padding: '12px 24px',
//             borderRadius: '8px',
//             fontSize: '14px',
//             fontWeight: '500',
//             boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
//             marginTop: '70px',
//           },
//         });
//         navigate('/wishlist/quotation');
//       } else {
//         toast.error(data.message || 'Failed to submit quotation request', {
//           duration: 3000,
//           position: 'top-right',
//           style: {
//             background: '#EF4444',
//             color: 'white',
//             border: 'none',
//             padding: '12px 24px',
//             borderRadius: '8px',
//             fontSize: '14px',
//             fontWeight: '500',
//             boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
//             marginTop: '70px',
//           },
//         });
//       }
//     } catch (error) {
//       console.error('Error submitting quotation:', error);
//       toast.error('Failed to submit quotation request. Please try again.', {
//         duration: 3000,
//         position: 'top-right',
//         style: {
//           background: '#EF4444',
//           color: 'white',
//           border: 'none',
//           padding: '12px 24px',
//           borderRadius: '8px',
//           fontSize: '14px',
//           fontWeight: '500',
//           boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
//           marginTop: '70px',
//         },
//       });
//     } finally {
//       setIsQuotationLoading(false);
//     }
//   };

//   // Format price in Indian Rupees
//   const formatPrice = (price: number) => {
//     if (isNaN(price) || !isFinite(price)) return '₹0';
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0,
//     }).format(price);
//   };

//   // Get display price - show min/max range
//   const getDisplayPrice = () => {
//     // Check if product has minPrice and maxPrice from API
//     if (product.minPrice !== undefined && product.minPrice !== null && 
//         product.maxPrice !== undefined && product.maxPrice !== null) {
//       const min = Number(product.minPrice);
//       const max = Number(product.maxPrice);
      
//       if (!isNaN(min) && !isNaN(max)) {
//         if (min === max) {
//           return formatPrice(min);
//         }
//         return `${formatPrice(min)} - ${formatPrice(max)}`;
//       }
//     }
    
//     // Fallback to variants
//     if (product.variants && product.variants.length > 0) {
//       const variantPrices = product.variants
//         .map(v => parseFloat(v.price))
//         .filter(p => !isNaN(p) && isFinite(p));
      
//       if (variantPrices.length > 0) {
//         const minPrice = Math.min(...variantPrices);
//         const maxPrice = Math.max(...variantPrices);
        
//         if (minPrice === maxPrice) {
//           return formatPrice(minPrice);
//         }
//         return `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`;
//       }
//     }
    
//     // Fallback to product price
//     if (product.price && !isNaN(product.price) && isFinite(product.price)) {
//       return formatPrice(product.price);
//     }
    
//     return 'Price on request';
//   };

//   // Check if product has discount
//   const hasDiscount = (product.discountPercentage ?? 0) > 0;
//   const discountedPrice = hasDiscount && product.price ? product.price * (1 - (product.discountPercentage ?? 0) / 100) : product.price;

//   // Get stock with fallback
//   const stock = product.stock ?? 0;

//   return (
//     <Card className="group relative overflow-hidden border border-gray-200 dark:border-gray-800 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col bg-white dark:bg-gray-900 rounded-2xl">
//       {/* Badges */}
//       <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
//         {product.isPopular && (
//           <Badge className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-[10px] font-semibold shadow-lg rounded-full px-3 py-1">
//             POPULAR
//           </Badge>
//         )}
//         {product.isNew && (
//           <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-[10px] font-semibold shadow-lg rounded-full px-3 py-1">
//             NEW
//           </Badge>
//         )}
//         {hasDiscount && (
//           <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white text-[10px] font-semibold shadow-lg rounded-full px-3 py-1">
//             {product.discountPercentage}% OFF
//           </Badge>
//         )}
//       </div>

//       {/* Heart Icon at Top Right with Circle Background */}
//       <button
//         className={cn(
//           'absolute top-2 right-2 z-20 h-9 w-9 rounded-full',
//           'flex items-center justify-center',
//           'bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm',
//           'shadow-md hover:shadow-lg transition-all duration-200',
//           'border border-gray-200/50 dark:border-gray-700/50',
//           inWishlist && 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800',
//           (isLoading || loadingWishlist) && 'opacity-50 cursor-not-allowed'
//         )}
//         onClick={handleWishlist}
//         disabled={isLoading || loadingWishlist}
//         title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
//       >
//         {isLoading || loadingWishlist ? (
//           <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin text-gray-400" />
//         ) : (
//           <Heart className={cn(
//             'w-4.5 h-4.5 transition-all duration-200',
//             inWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600 dark:text-gray-300 hover:text-red-500'
//           )} />
//         )}
//       </button>

//       {/* Image */}
//       <Link to={`/products/${product.slug}`} className="block relative aspect-square overflow-hidden bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-t-2xl">
//         <img
//           src={product.gallery[0]}
//           alt={product.name}
//           loading="lazy"
//           className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
//         />
//         {/* Quick actions overlay */}
//         <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
//           <div className="flex gap-2">
//             <Button 
//               size="icon" 
//               variant="secondary" 
//               className="w-10 h-10 rounded-full shadow-lg hover:scale-110 transition-transform"
//               asChild
//             >
//               <Link to={`/products/${product.slug}`}>
//                 <Eye className="w-4 h-4" />
//               </Link>
//             </Button>
//           </div>
//         </div>
//       </Link>

//       {/* Content */}
//       <div className="p-4 flex flex-col flex-1">
//         {/* Brand & Category */}
//         <div className="flex items-center gap-1.5 mb-2">
//           <BadgeCheck className="w-3.5 h-3.5 text-primary" />
//           <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{product.brandName}</span>
//           <span className="text-xs text-gray-300 dark:text-gray-600">·</span>
//           <span className="text-xs text-gray-500 dark:text-gray-500">{product.categoryName}</span>
//         </div>

//         {/* Product Name */}
//         <Link to={`/products/${product.slug}`}>
//           <h3 className="font-semibold text-sm leading-snug mb-1.5 line-clamp-2 group-hover:text-primary transition-colors text-gray-900 dark:text-white">
//             {product.name}
//           </h3>
//         </Link>

//         {/* Price Section - Fixed to show min/max properly */}
//         <div className="mb-2 mt-1">
//           {hasDiscount && discountedPrice ? (
//             <div className="flex flex-wrap items-center gap-2">
//               <span className="text-lg font-bold text-primary">
//                 {formatPrice(discountedPrice)}
//               </span>
//               <span className="text-sm text-gray-400 line-through">
//                 {formatPrice(product.price)}
//               </span>
//             </div>
//           ) : (
//             <span className="text-lg font-bold text-primary">
//               {getDisplayPrice()}
//             </span>
//           )}
//           {/* Show min/max label if different */}
//           {product.minPrice !== undefined && product.maxPrice !== undefined && 
//            product.minPrice !== product.maxPrice && 
//            !isNaN(product.minPrice) && !isNaN(product.maxPrice) && (
//             <p className="text-xs text-gray-400 mt-0.5">Price range based on variants</p>
//           )}
//           {product.variants && product.variants.length > 1 && 
//            !(product.minPrice !== undefined && product.maxPrice !== undefined) && (
//             <p className="text-xs text-gray-400 mt-0.5">*Price varies by variant</p>
//           )}
//         </div>

//         {/* Short Description */}
//         <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3 flex-1">
//           {product.shortDescription}
//         </p>

//         {/* Rating */}
//         <div className="flex items-center gap-1.5 mb-3">
//           <div className="flex items-center">
//             {[1, 2, 3, 4, 5].map((star) => (
//               <Star
//                 key={star}
//                 className={cn(
//                   'w-3.5 h-3.5',
//                   star <= Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'
//                 )}
//               />
//             ))}
//           </div>
//           <span className="text-xs text-gray-500 dark:text-gray-400">({product.reviewCount})</span>
//           {stock > 0 && (
//             <span className="text-xs text-green-600 dark:text-green-400 ml-auto">
//               {stock > 10 ? 'In Stock' : `Only ${stock} left`}
//             </span>
//           )}
//         </div>

//         {/* Actions - Modified to include Quotation Button and remove Compare icon */}
//         <div className="flex flex-col gap-2">
//           {/* First row: View Details + Quotation */}
//           <div className="flex items-center gap-2">
//             <Button 
//               asChild 
//               size="sm" 
//               className="flex-1 h-9 text-xs rounded-full bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl transition-all"
//             >
//               <Link to={`/products/${product.slug}`}>
//                 View Details
//               </Link>
//             </Button>

//             {/* Request for Quotation Button */}
//             <Button
//               size="sm"
//               variant="outline"
//               className={cn(
//                 'h-9 px-3 shrink-0 rounded-full border-primary/30 text-primary hover:bg-primary hover:text-white transition-all duration-200',
//                 isQuotationLoading && 'opacity-50 cursor-not-allowed'
//               )}
//               onClick={handleQuotationRequest}
//               disabled={isQuotationLoading}
//               title="Request for Quotation"
//             >
//               {isQuotationLoading ? (
//                 <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
//               ) : (
//                 <>
//                   <FileSpreadsheet className="w-4 h-4 mr-1" />
//                   <span className="text-xs font-medium hidden sm:inline">Quote</span>
//                 </>
//               )}
//             </Button>
//           </div>

//           {/* Second row: Add to Compare checkbox */}
//           <label
//             className={cn(
//               'flex items-center gap-2 mt-1 select-none',
//               isCompareLoading ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
//             )}
//             onClick={(e) => e.stopPropagation()}
//           >
//             <input
//               type="checkbox"
//               checked={inCompare}
//               disabled={isCompareLoading}
//               onChange={handleCompareCheckbox}
//               onClick={(e) => e.stopPropagation()}
//               className={cn(
//                 'h-4 w-4 rounded border-gray-300 dark:border-gray-600',
//                 'text-primary focus:ring-primary focus:ring-offset-0',
//                 'accent-primary cursor-pointer disabled:cursor-not-allowed'
//               )}
//             />
//             <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
//               Add to compare
//             </span>
//             {isCompareLoading && (
//               <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin text-primary" />
//             )}
//           </label>
//         </div>
//       </div>
//     </Card>
//   );
// }

// product-card.tsx

// product-card.tsx

// product-card.tsx
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Eye, Star, BadgeCheck, FileSpreadsheet } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useApp } from '@/hooks/use-app';
import type { Product } from '@/types';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useState, useMemo } from 'react';
import { baseurl } from '@/Baseurl/baseurl';

interface ProductCardProps {
  product: Product;
}

// Define the variant type locally to avoid any
interface VariantWithDetails {
  id: number;
  color_name?: string;
  color?: string;
  color_hex?: string;
  price?: string | number;
  min_price?: string | number;
  max_price?: string | number;
  stock: number;
  image_url?: string;
  variant_name?: string;
  part_code?: string;
  spec_type?: string;
  size?: string;
  availability?: string;
  datasheet_url?: string;
  description?: string;
  [key: string]: any;
}

interface VariantColor {
  color: string;
  variantId: number;
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
    loadingWishlist,
    isLoggedIn
  } = useApp();
  
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [localWishlistState, setLocalWishlistState] = useState<boolean | null>(null);
  const [isCompareLoading, setIsCompareLoading] = useState(false);
  const [isQuotationLoading, setIsQuotationLoading] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null);

  // Quantity is always 1 - no state needed
  const quantity = 1;

  const inWishlist = localWishlistState !== null ? localWishlistState : isInWishlist(product.id);
  const inCompare = isInCompare(product.id);
  const compareFull = compareList.length >= 4;

  const getUserId = (): number | undefined => {
    const session = localStorage.getItem('userSession');
    if (session) {
      try {
        return JSON.parse(session).userId;
      } catch {
        return undefined;
      }
    }
    return undefined;
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

  // Get variants with full data
  const variants = (product.variants || []) as VariantWithDetails[];
  const selectedVariant = variants.find(v => v.id === selectedVariantId) || variants[0] || null;

 // product-card.tsx - Updated handleWishlist to pass variant ID

// Find the handleWishlist function and update it:

const handleWishlist = async (e: React.MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();
  if (isLoading || loadingWishlist) return;
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
  setIsLoading(true);
  try {
    // Get the selected variant ID
    const variantId = selectedVariant?.id;
    if (inWishlist) {
      await removeFromWishlist(product.id);
      setLocalWishlistState(false);
    } else {
      // Pass the selected variant ID when adding
      await addToWishlist(product.id, undefined, variantId);
      setLocalWishlistState(true);
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


  const toggleCompare = async (): Promise<boolean> => {
    if (isCompareLoading) return false;
    if (!inCompare && compareFull) {
      toast.warning('You can compare up to 4 products', {
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
      return false;
    }
    setIsCompareLoading(true);
    const uid = getUserId();
    try {
      if (inCompare) {
        await removeFromCompare(product.id, uid);
      } else {
        await addToCompare(product.id, uid);
      }
      return true;
    } catch (error) {
      console.error('Error toggling compare:', error);
      toast.error('Failed to update compare list');
      return false;
    } finally {
      setIsCompareLoading(false);
    }
  };

  const handleCompareCheckbox = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (inCompare) {
      navigate('/compare');
      return;
    }
    const added = await toggleCompare();
    if (added) navigate('/compare');
  };

  const handleQuotationRequest = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

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

    setIsQuotationLoading(true);

    try {
      const user = getUserDetails();
      
      let actualPrice = product.price;
      let minPrice = product.minPrice;
      let maxPrice = product.maxPrice;
      
      if (selectedVariant) {
        const selectedMin = Number(selectedVariant.min_price);
        const selectedMax = Number(selectedVariant.max_price);
        const selectedPrice = Number(selectedVariant.price);
        
        if (Number.isFinite(selectedMax) && selectedMax > 0) {
          actualPrice = selectedMax;
        } else if (Number.isFinite(selectedMin) && selectedMin > 0) {
          actualPrice = selectedMin;
        } else if (Number.isFinite(selectedPrice) && selectedPrice > 0) {
          actualPrice = selectedPrice;
        }
        
        minPrice = Number.isFinite(selectedMin) ? selectedMin : minPrice;
        maxPrice = Number.isFinite(selectedMax) ? selectedMax : maxPrice;
      }

      let variantImage = null;
      let variantDetails = null;
      
      if (selectedVariant) {
        if (selectedVariant.image_url) variantImage = selectedVariant.image_url;
        variantDetails = JSON.stringify(variants.map((v: VariantWithDetails) => ({
          id: v.id,
          variant_name: v.variant_name || v.color_name || 'Default',
          part_code: v.part_code || '',
          spec_type: v.spec_type || '',
          color: v.color || v.color_name || '',
          size: v.size || '',
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
        quantity: quantity, // Always 1
        remarks: `Quotation requested for ${product.name} (Qty: ${quantity})`,
        customer_name: user?.name || '',
        customer_mobile: user?.mobile || '',
        customer_email: user?.email || '',
        variant_image: variantImage,
        variant_details: variantDetails
      };

      const response = await fetch(`${baseurl}/api/quotations/single`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
      setIsQuotationLoading(false);
    }
  };

  const formatPrice = (price: number): string => {
    if (isNaN(price) || !isFinite(price)) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Get color for dot
  const getColorHex = (colorName: string): string => {
    const colorMap: Record<string, string> = {
      'black': '#000000',
      'white': '#FFFFFF',
      'blue': '#2563EB',
      'red': '#DC2626',
      'green': '#16A34A',
      'yellow': '#EAB308',
      'purple': '#9333EA',
      'pink': '#EC4899',
      'orange': '#EA580C',
      'gray': '#6B7280',
      'brown': '#92400E',
      'gold': '#D4AF37',
      'silver': '#C0C0C0'
    };
    return colorMap[colorName.toLowerCase()] || '#CCCCCC';
  };

  // Get unique colors from variants - Only colors, no prices
  const variantColors = useMemo((): VariantColor[] => {
    if (!variants || variants.length === 0) return [];

    const colorMap = new Map<string, VariantColor>();
    
    variants.forEach((variant: VariantWithDetails) => {
      const color = variant.color || variant.color_name || 'Default';
      
      if (!colorMap.has(color)) {
        colorMap.set(color, {
          color: color,
          variantId: variant.id
        });
      }
    });

    return Array.from(colorMap.values());
  }, [variants]);

  // Get display price from selected variant or product
  const getDisplayPrice = (): string => {
    if (selectedVariant) {
      const minPrice = Number(selectedVariant.min_price);
      const maxPrice = Number(selectedVariant.max_price);
      const price = Number(selectedVariant.price);
      
      if (Number.isFinite(minPrice) && Number.isFinite(maxPrice) && minPrice > 0 && maxPrice > 0) {
        if (minPrice === maxPrice) {
          return formatPrice(minPrice);
        }
        return `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`;
      }
      
      if (Number.isFinite(price) && price > 0) {
        return formatPrice(price);
      }
    }
    
    if (product.minPrice !== undefined && product.maxPrice !== undefined) {
      const min = Number(product.minPrice);
      const max = Number(product.maxPrice);
      if (Number.isFinite(min) && Number.isFinite(max) && min > 0 && max > 0) {
        if (min === max) {
          return formatPrice(min);
        }
        return `${formatPrice(min)} - ${formatPrice(max)}`;
      }
    }
    
    if (product.price && Number.isFinite(product.price) && product.price > 0) {
      return formatPrice(product.price);
    }
    
    return 'Price on request';
  };

  // Get min/max for discount
  const getMinMaxForDiscount = (): { min: number; max: number } => {
    if (selectedVariant) {
      const min = Number(selectedVariant.min_price);
      const max = Number(selectedVariant.max_price);
      const price = Number(selectedVariant.price);
      
      if (Number.isFinite(min) && min > 0) {
        return { min, max: Number.isFinite(max) && max > 0 ? max : min };
      }
      if (Number.isFinite(price) && price > 0) {
        return { min: price, max: price };
      }
    }
    
    if (product.minPrice && product.maxPrice) {
      return { min: Number(product.minPrice), max: Number(product.maxPrice) };
    }
    
    return { min: product.price, max: product.price };
  };

  const hasDiscount = (product.discountPercentage ?? 0) > 0;
  const stock = product.stock ?? 0;
  const hasMultipleVariants = variantColors.length > 1;

  // Handle variant selection
  const handleVariantSelect = (variantId: number) => {
    setSelectedVariantId(variantId);
  };

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

      <button
        className={cn(
          'absolute top-2 right-2 z-20 h-9 w-9 rounded-full',
          'flex items-center justify-center',
          'bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm',
          'shadow-md hover:shadow-lg transition-all duration-200',
          'border border-gray-200/50 dark:border-gray-700/50',
          inWishlist && 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800',
          (isLoading || loadingWishlist) && 'opacity-50 cursor-not-allowed'
        )}
        onClick={handleWishlist}
        disabled={isLoading || loadingWishlist}
        title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        {isLoading || loadingWishlist ? (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin text-gray-400" />
        ) : (
          <Heart className={cn(
            'w-4.5 h-4.5 transition-all duration-200',
            inWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600 dark:text-gray-300 hover:text-red-500'
          )} />
        )}
      </button>

      <Link to={`/products/${product.slug}`} className="block relative aspect-square overflow-hidden bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-t-2xl">
        <img
          src={selectedVariant?.image_url ? `${baseurl}${selectedVariant.image_url}` : product.gallery[0]}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex gap-2">
            <Button size="icon" variant="secondary" className="w-10 h-10 rounded-full shadow-lg hover:scale-110 transition-transform" asChild>
              <Link to={`/products/${product.slug}`}>
                <Eye className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center gap-1.5 mb-2">
          <BadgeCheck className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{product.brandName}</span>
          <span className="text-xs text-gray-300 dark:text-gray-600">·</span>
          <span className="text-xs text-gray-500 dark:text-gray-500">{product.categoryName}</span>
        </div>

        <Link to={`/products/${product.slug}`}>
          <h3 className="font-semibold text-sm leading-snug mb-1.5 line-clamp-2 group-hover:text-primary transition-colors text-gray-900 dark:text-white">
            {product.name}
          </h3>
        </Link>

        {/* Color Dots - Only dots, no prices */}
        {variantColors.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 mb-2">
            {variantColors.map((vc: VariantColor) => (
              <button
                key={vc.variantId}
                onClick={(e) => {
                  e.stopPropagation();
                  handleVariantSelect(vc.variantId);
                }}
                className={cn(
                  'w-5 h-5 rounded-full border-2 transition-all duration-200',
                  selectedVariant?.id === vc.variantId 
                    ? 'ring-2 ring-primary ring-offset-1 border-primary' 
                    : 'hover:scale-110 hover:shadow-md'
                )}
                style={{ 
                  backgroundColor: getColorHex(vc.color),
                  borderColor: vc.color.toLowerCase() === 'white' ? '#E5E7EB' : 'rgba(0,0,0,0.1)'
                }}
                title={vc.color}
              />
            ))}
          </div>
        )}

        {/* Price Section */}
        <div className="mb-2 mt-1">
          {hasDiscount ? (
            <div className="flex flex-wrap items-center gap-2">
              {/* <span className="text-lg font-bold text-primary">
                {formatPrice(getMinMaxForDiscount().min * (1 - (product.discountPercentage ?? 0) / 100))}
              </span> */}
              <span className="text-sm text-gray-400">
                {getDisplayPrice()}
              </span>
            </div>
          ) : (
            <span className="text-lg font-bold text-primary">
              {getDisplayPrice()}
            </span>
          )}
          {hasMultipleVariants && (
            <p className="text-xs text-gray-400 mt-0.5">Click color dot to see variant price</p>
          )}
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3 flex-1">
          {product.shortDescription}
        </p>

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

        {/* Quantity - Fixed to 1, just showing it's for 1 item */}
        {/* <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Qty:</span>
          <span className="text-sm font-semibold text-gray-900 dark:text-white">1</span>
          <span className="text-[10px] text-gray-400 ml-1">(Fixed quantity for quotation)</span>
        </div> */}

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Button asChild size="sm" className="flex-1 h-9 text-xs rounded-full bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl transition-all">
              <Link to={`/products/${product.slug}`}>
                View Details
              </Link>
            </Button>
            <Button
              size="sm"
              variant="outline"
              className={cn(
                'flex-1 h-9 text-xs rounded-full border-primary/30 text-primary hover:bg-primary hover:text-white transition-all duration-200',
                isQuotationLoading && 'opacity-50 cursor-not-allowed'
              )}
              onClick={handleQuotationRequest}
              disabled={isQuotationLoading}
              title="Request for Quotation"
            >
              {isQuotationLoading ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mx-auto" />
              ) : (
                <>
                  <FileSpreadsheet className="w-4 h-4 mr-1.5" />
                  <span>Quote</span>
                </>
              )}
            </Button>
          </div>

          <label
            className={cn(
              'flex items-center gap-2 mt-1 select-none',
              isCompareLoading ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <input
              type="checkbox"
              checked={inCompare}
              disabled={isCompareLoading}
              onChange={handleCompareCheckbox}
              onClick={(e) => e.stopPropagation()}
              className={cn(
                'h-4 w-4 rounded border-gray-300 dark:border-gray-600',
                'text-primary focus:ring-primary focus:ring-offset-0',
                'accent-primary cursor-pointer disabled:cursor-not-allowed'
              )}
            />
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
              Add to compare
            </span>
            {isCompareLoading && (
              <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin text-primary" />
            )}
          </label>
        </div>
      </div>
    </Card>
  );
}