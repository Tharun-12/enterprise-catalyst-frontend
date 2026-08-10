// // ComparePage.tsx - Fixed to allow comparing different types and show proper UI
// import { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { X, GitCompare, Plus, ArrowRight, AlertCircle, Loader2, Check, Minus } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Card } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { EmptyState } from '@/components/shared';
// import { useApp } from '@/hooks/use-app';
// import { toast } from 'sonner';
// import { cn } from '@/lib/utils';
// import { PageBreadcrumb as Breadcrumb } from '@/layouts/customer-layout-wrapper';
// import { ProductCard } from '@/components/product-card';
// import type { Product as AppProduct, ProductStatus } from '@/types';
// import axios from 'axios';
// import { baseurl } from '@/Baseurl/baseurl';

// // Interface to match API response
// interface Variant {
//   id: number;
//   product_id: number;
//   variant_name: string;
//   part_code: string;
//   category: string;
//   brand: string;
//   description: string;
//   spec_type: string;
//   color: string;
//   size: string;
//   price: string;
//   availability: string;
//   datasheet_url: string;
//   stock: number;
//   image_url: string;
//   created_at: string;
//   updated_at: string;
// }

// interface SpecComparison {
//   id: number;
//   product_id: number;
//   spec_type: string;
//   bandwidth: string;
//   max_data_rate: string;
//   internal_design: string;
//   typical_applications: string;
//   created_at: string;
//   updated_at: string;
// }

// interface ApiProduct {
//   id: number;
//   product_name: string;
//   product_code: string;
//   product_category_id: number;
//   product_brand: string;
//   product_details_pdf: string;
//   price: string;
//   discount: string;
//   product_description: string;
//   warranty: string;
//   product_series: string;
//   product_type: string;
//   created_at: string;
//   updated_at: string;
//   category_name: string;
//   variants: Variant[];
//   spec_comparison?: SpecComparison[];
// }

// type Product = AppProduct;

// export function ComparePage() {
//   const { compareList, removeFromCompare, clearCompare } = useApp();
//   const [products, setProducts] = useState<ApiProduct[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [showOnlyDifferences, setShowOnlyDifferences] = useState(false);
//   const [relatedProducts, setRelatedProducts] = useState<ApiProduct[]>([]);
//   const [_allProductsData, setAllProductsData] = useState<ApiProduct[]>([]);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         setLoading(true);
        
//         // Fetch all products with variants
//         const response = await axios.get(`${baseurl}/api/products/products-with-variants`);
//         const allProducts = response.data;
//         setAllProductsData(allProducts);
        
//         // If no products in compare list, return
//         if (compareList.length === 0) {
//           setProducts([]);
//           setRelatedProducts([]);
//           return;
//         }
        
//         // Get products that are in the compare list
//         const compareProducts = allProducts.filter((p: ApiProduct) => 
//           compareList.includes(String(p.id))
//         );
        
//         // Fetch spec comparison for each product in compare list
//         const productsWithSpecs = await Promise.all(
//           compareProducts.map(async (product: ApiProduct) => {
//             try {
//               const specRes = await axios.get(`${baseurl}/api/products/spec-comparison/${product.id}`);
//               if (specRes.data && Object.keys(specRes.data).length > 0) {
//                 const specArray = Object.values(specRes.data);
//                 return { ...product, spec_comparison: specArray };
//               }
//               return product;
//             } catch (error) {
//               console.error(`Error fetching spec for product ${product.id}:`, error);
//               return product;
//             }
//           })
//         );
        
//         setProducts(productsWithSpecs);

//         // Get related products based on the first product's type (for "Related Products" section)
//         if (compareProducts.length > 0) {
//           const firstProductType = compareProducts[0].product_type;
          
//           // Related products: same type, NOT in compare list
//           const related = allProducts
//             .filter((p: ApiProduct) => 
//               p.product_type === firstProductType && 
//               !compareList.includes(String(p.id))
//             )
//             .slice(0, 4);
          
//           setRelatedProducts(related);
//         }
        
//       } catch (error) {
//         console.error('Error fetching products:', error);
//         toast.error('Failed to load products for comparison');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProducts();
//   }, [compareList]);

//   // Helper function to get product image with full URL
//   const getProductImage = (product: ApiProduct) => {
//     if (product.variants && product.variants.length > 0 && product.variants[0].image_url) {
//       return `${baseurl}${product.variants[0].image_url}`;
//     }
//     return 'https://via.placeholder.com/400x400?text=No+Image';
//   };

//   // Helper function to get product slug
//   const getProductSlug = (productName: string) => {
//     return productName.toLowerCase().replace(/\s+/g, '-');
//   };

//   // Helper function to get product price with discount
//   const getDiscountedPrice = (product: ApiProduct) => {
//     const originalPrice = parseFloat(product.price);
//     const discount = parseFloat(product.discount) || 0;
//     const discountedPrice = originalPrice * (1 - discount / 100);
//     return discountedPrice.toFixed(2);
//   };

//   // Helper function to get stock status
//   const getStockStatus = (product: ApiProduct) => {
//     const totalStock = product.variants?.reduce((sum, v) => sum + v.stock, 0) || 0;
//     return totalStock > 0 ? 'In Stock' : 'Out of Stock';
//   };

//   // Check if a value is different across products
//   const isValueDifferent = (values: any[]) => {
//     return new Set(values).size > 1;
//   };

//   // Find best value for numeric specs
//   const findBestValue = (values: string[]) => {
//     const numeric = values.map(v => {
//       const match = v.match(/[\d.]+/);
//       return match ? parseFloat(match[0]) : null;
//     });
//     if (numeric.every(n => n !== null) && numeric.length > 1) {
//       const max = Math.max(...numeric as number[]);
//       const maxIdx = numeric.indexOf(max);
//       return values[maxIdx];
//     }
//     return null;
//   };

//   // Format price in Indian Rupees
//   const formatPrice = (price: string | number) => {
//     const numPrice = typeof price === 'string' ? parseFloat(price) : price;
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0,
//     }).format(numPrice);
//   };

//   // Get spec value from product (check both product fields and spec_comparison)
//   const getSpecValue = (product: ApiProduct, specKey: string): string => {
//     // First check if the product has the field directly
//     const directValue = (product as any)[specKey];
//     if (directValue && directValue !== 'null' && directValue !== '') {
//       return directValue;
//     }
    
//     // If not, check spec_comparison
//     if (product.spec_comparison && product.spec_comparison.length > 0) {
//       const spec = product.spec_comparison[0];
//       const specValue = (spec as any)[specKey];
//       if (specValue && specValue !== 'null' && specValue !== '') {
//         return specValue;
//       }
//     }
    
//     return '—';
//   };

//   // Get general info items
//   const getGeneralInfoItems = () => {
//     const items = [
//       { 
//         label: 'Brand', 
//         value: (p: ApiProduct) => p.product_brand || '—' 
//       },
//       { 
//         label: 'Category', 
//         value: (p: ApiProduct) => p.category_name || '—' 
//       },
//       { 
//         label: 'Product Type', 
//         value: (p: ApiProduct) => p.product_type || '—' 
//       },
//       { 
//         label: 'Warranty', 
//         value: (p: ApiProduct) => p.warranty || '—' 
//       },
//       { 
//         label: 'Stock Status', 
//         value: (p: ApiProduct) => getStockStatus(p) 
//       },
//     ];

//     if (showOnlyDifferences) {
//       return items.filter(item => {
//         const values = products.map(p => item.value(p));
//         return isValueDifferent(values);
//       });
//     }
//     return items;
//   };

//   // Get specification items
//   const getSpecificationItems = () => {
//     const specKeys = [
//       { label: 'Product Series', key: 'product_series' },
//       { label: 'Spec Type', key: 'spec_type' },
//       { label: 'Bandwidth', key: 'bandwidth' },
//       { label: 'Max Data Rate', key: 'max_data_rate' },
//       { label: 'Internal Design', key: 'internal_design' },
//       { label: 'Typical Applications', key: 'typical_applications' },
//     ];

//     const items = specKeys.map(spec => ({
//       label: spec.label,
//       value: (p: ApiProduct) => getSpecValue(p, spec.key)
//     }));

//     if (showOnlyDifferences) {
//       return items.filter(item => {
//         const values = products.map(p => item.value(p));
//         return isValueDifferent(values);
//       });
//     }
//     return items;
//   };

//   // Transform API product to the Product type expected by ProductCard
//   const transformForProductCard = (product: ApiProduct): Product => {
//     const gallery = product.variants?.map(v => 
//       v.image_url ? `${baseurl}${v.image_url}` : null
//     ).filter(Boolean) as string[] || ['https://via.placeholder.com/400x400'];

//     // Build spec groups from product
//     const specFields = [];
//     if (product.product_series) {
//       specFields.push({ key: 'series', label: 'Series', value: product.product_series });
//     }
//     if (product.product_type) {
//       specFields.push({ key: 'type', label: 'Type', value: product.product_type });
//     }
//     if (product.warranty) {
//       specFields.push({ key: 'warranty', label: 'Warranty', value: product.warranty });
//     }

//     // Add variant spec types
//     if (product.variants && product.variants.length > 0) {
//       const variant = product.variants[0];
//       if (variant.spec_type) {
//         specFields.push({ key: 'spec_type', label: 'Spec Type', value: variant.spec_type });
//       }
//       if (variant.size) {
//         specFields.push({ key: 'size', label: 'Size', value: variant.size });
//       }
//       if (variant.color) {
//         specFields.push({ key: 'color', label: 'Color', value: variant.color });
//       }
//     }

//     // Determine product status based on stock
//     const totalStock = product.variants?.reduce((sum, v) => sum + v.stock, 0) || 0;
//     let status: ProductStatus = 'active';
//     if (totalStock === 0) {
//       status = 'archived';
//     }

//     const variants = product.variants?.map(v => ({
//       id: v.id,
//       color_name: v.color || '',
//       color_hex: v.color || '#cccccc',
//       price: v.price,
//       stock: v.stock,
//       image_url: v.image_url || '',
//       variant_name: v.variant_name,
//       part_code: v.part_code,
//       spec_type: v.spec_type,
//       size: v.size,
//       availability: v.availability,
//       datasheet_url: v.datasheet_url,
//       description: v.description,
//     })) || [];

//     return {
//       id: String(product.id),
//       name: product.product_name,
//       slug: getProductSlug(product.product_name),
//       sku: product.product_code,
//       brandId: String(product.product_category_id),
//       brandName: product.product_brand || 'Unknown',
//       categoryId: String(product.product_category_id),
//       categoryName: product.category_name || 'Uncategorized',
//       shortDescription: product.product_description?.substring(0, 150) || '',
//       description: product.product_description || '',
//       features: [],
//       specifications: {},
//       specGroups: [
//         {
//           groupName: 'Specifications',
//           fields: specFields
//         }
//       ],
//       gallery,
//       price: parseFloat(product.price) || 0,
//       currency: 'INR',
//       status: status,
//       isPopular: false,
//       isNew: false,
//       rating: 4.5,
//       reviewCount: 0,
//       downloads: product.product_details_pdf 
//         ? [{ name: 'Product Details', type: 'pdf' as const, size: 'PDF', url: product.product_details_pdf }]
//         : [],
//       relatedProductIds: [],
//       createdAt: product.created_at,
//       warranty: product.warranty || 'Standard warranty',
//       originalPrice: parseFloat(product.price) * (1 + parseFloat(product.discount || '0') / 100) || 0,
//       discountPercentage: parseFloat(product.discount || '0'),
//       variants: variants,
//       hasVariants: (product.variants?.length || 0) > 0,
//       stock: totalStock,
//     };
//   };

//   if (loading) {
//     return (
//       <div className="container mx-auto px-4 py-8">
//         <Breadcrumb items={[{ label: 'Home', path: '/' }, { label: 'Compare' }]} />
//         <div className="flex items-center justify-center py-12">
//           <Loader2 className="w-8 h-8 animate-spin text-primary" />
//         </div>
//       </div>
//     );
//   }

//   if (products.length === 0) {
//     return (
//       <div className="container mx-auto px-4 py-8">
//         <Breadcrumb items={[{ label: 'Home', path: '/' }, { label: 'Compare' }]} />
//         <EmptyState
//           icon={<GitCompare className="w-8 h-8" />}
//           title="No products to compare"
//           description="Add products to comparison to see them side by side. You can compare up to 4 products at once."
//           action={<Button asChild><Link to="/products">Browse Products <ArrowRight className="w-4 h-4 ml-2" /></Link></Button>}
//         />
//       </div>
//     );
//   }

//   const generalInfoItems = getGeneralInfoItems();
//   const specItems = getSpecificationItems();
  
//   // Get product type for related products section
//   const productType = products[0]?.product_type || '';

//   return (
//     <div className="container mx-auto px-4 py-8 max-w-7xl">
//       <Breadcrumb items={[{ label: 'Home', path: '/' }, { label: 'Compare' }]} />

//       <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
//         <div>
//           <h1 className="text-2xl lg:text-3xl font-bold">Compare Products</h1>
//           <p className="text-sm text-muted-foreground mt-1">
//             Comparing {products.length} product{products.length > 1 ? 's' : ''}
//           </p>
//         </div>
//         <div className="flex items-center gap-2 flex-wrap">
//           <Button
//             variant={showOnlyDifferences ? 'default' : 'outline'}
//             size="sm"
//             onClick={() => setShowOnlyDifferences(!showOnlyDifferences)}
//             className="rounded-full"
//           >
//             {showOnlyDifferences ? <Check className="w-4 h-4 mr-1.5" /> : <Minus className="w-4 h-4 mr-1.5" />}
//             Show only differences
//           </Button>
//           <Button variant="outline" size="sm" onClick={() => { clearCompare(); toast.success('Comparison cleared'); }}>
//             <X className="w-4 h-4 mr-1.5" /> Clear All
//           </Button>
//         </div>
//       </div>

//       {products.length < 2 && (
//         <div className="flex items-center gap-2 p-3 rounded-lg bg-accent/10 border border-accent/20 mb-4 text-sm">
//           <AlertCircle className="w-4 h-4 text-accent shrink-0" />
//           <span>Add at least 2 products to see a meaningful comparison.</span>
//         </div>
//       )}

//       {/* Product Cards Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-8">
//         {products.map((product) => (
//           <Card 
//             key={product.id} 
//             className="group relative overflow-hidden border-border hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
//           >
//             {/* Remove button */}
//             <Button
//               size="icon"
//               variant="ghost"
//               className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-white/80 hover:bg-white shadow-md backdrop-blur-sm hover:bg-destructive hover:text-destructive-foreground transition-colors"
//               onClick={(e) => {
//                 e.preventDefault();
//                 e.stopPropagation();
//                 removeFromCompare(String(product.id));
//                 toast.success('Removed from comparison');
//               }}
//             >
//               <X className="w-4 h-4" />
//             </Button>

//             {/* Image */}
//             <Link to={`/products/${getProductSlug(product.product_name)}`} className="block relative aspect-square overflow-hidden bg-muted/30">
//               <img
//                 src={getProductImage(product)}
//                 alt={product.product_name}
//                 loading="lazy"
//                 className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
//                 onError={(e) => {
//                   (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x400?text=No+Image';
//                 }}
//               />
//               {parseFloat(product.discount) > 0 && (
//                 <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600 text-white text-[10px]">
//                   {product.discount}% OFF
//                 </Badge>
//               )}
//             </Link>

//             {/* Content */}
//             <div className="p-4 flex flex-col flex-1">
//               <div className="flex items-center gap-1.5 mb-2">
//                 <Badge className="text-[10px] font-semibold bg-primary/10 text-primary border-0">
//                   {product.product_brand || 'N/A'}
//                 </Badge>
//                 <span className="text-xs text-muted-foreground/50">·</span>
//                 <span className="text-xs text-muted-foreground">{product.category_name || 'Uncategorized'}</span>
//               </div>

//               <Link to={`/products/${getProductSlug(product.product_name)}`}>
//                 <h3 className="font-semibold text-sm leading-snug mb-1.5 line-clamp-2 group-hover:text-primary transition-colors">
//                   {product.product_name}
//                 </h3>
//               </Link>

//               <div className="flex items-center gap-2 mt-1 flex-wrap">
//                 <span className="text-lg font-bold text-primary">
//                   {formatPrice(getDiscountedPrice(product))}
//                 </span>
//                 {parseFloat(product.discount) > 0 && (
//                   <span className="text-xs text-muted-foreground line-through">
//                     {formatPrice(product.price)}
//                   </span>
//                 )}
//               </div>

//               <p className="text-xs text-muted-foreground line-clamp-2 mt-2 flex-1">
//                 {product.product_description?.substring(0, 100) || ''}
//               </p>

//               {/* Stock Status */}
//               <div className="mt-3">
//                 <Badge variant={getStockStatus(product) === 'In Stock' ? 'default' : 'destructive'} className="w-fit">
//                   {getStockStatus(product)}
//                 </Badge>
//               </div>

//               {/* View Details Button */}
//               <Button asChild size="sm" className="w-full mt-3">
//                 <Link to={`/products/${getProductSlug(product.product_name)}`}>
//                   View Details
//                 </Link>
//               </Button>
//             </div>
//           </Card>
//         ))}

//         {/* Add more products card */}
//         {products.length < 4 && (
//           <Card className="p-4 flex flex-col items-center justify-center border-2 border-dashed min-h-[350px] hover:border-primary/50 transition-colors">
//             <div className="w-full aspect-square rounded-lg border-2 border-dashed flex items-center justify-center mb-3 bg-gray-50 dark:bg-gray-800/50">
//               <Plus className="w-16 h-16 text-muted-foreground/30" />
//             </div>
//             <p className="text-sm text-muted-foreground text-center mb-3">Add more products to compare</p>
//             <Button asChild variant="outline" size="sm" className="w-full">
//               <Link to="/products">Browse Products</Link>
//             </Button>
//           </Card>
//         )}
//       </div>

//       {/* General Information Section - Only show if we have at least 2 products */}
//       {products.length >= 2 && generalInfoItems.length > 0 && (
//         <div className="mb-6">
//           <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-4 py-3 rounded-t-lg font-semibold text-sm flex items-center justify-between">
//             <span>General Information</span>
//             {showOnlyDifferences && generalInfoItems.length > 0 && (
//               <Badge variant="secondary" className="bg-white/20 text-white border-0">
//                 Showing differences only
//               </Badge>
//             )}
//           </div>
//           <div className="border border-t-0 rounded-b-lg overflow-hidden">
//             {generalInfoItems.map((item, index) => {
//               const values = products.map(p => item.value(p));
//               const isDifferent = isValueDifferent(values);
//               const bestValue = findBestValue(values);
              
//               return (
//                 <div 
//                   key={item.label}
//                   className={cn(
//                     'grid gap-0',
//                     index % 2 === 0 ? 'bg-muted/30' : 'bg-card',
//                     isDifferent && showOnlyDifferences && 'border-l-4 border-primary'
//                   )}
//                   style={{ gridTemplateColumns: `200px repeat(${products.length}, 1fr)` }}
//                 >
//                   <div className="p-3 text-sm font-medium text-muted-foreground border-r flex items-center gap-2">
//                     {isDifferent && showOnlyDifferences && (
//                       <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
//                     )}
//                     {item.label}
//                   </div>
//                   {products.map((product) => {
//                     const value = item.value(product);
//                     const isBest = bestValue && value === bestValue && isDifferent;
//                     return (
//                       <div key={product.id} className={cn(
//                         "p-3 text-sm border-l first:border-l-0",
//                         isBest && "bg-green-50 dark:bg-green-950/20"
//                       )}>
//                         {item.label === 'Stock Status' ? (
//                           <Badge variant={value === 'In Stock' ? 'default' : 'destructive'}>
//                             {value}
//                           </Badge>
//                         ) : (
//                           <span className={cn(
//                             isBest && "font-semibold text-green-600 dark:text-green-400"
//                           )}>
//                             {value}
//                             {isBest && (
//                               <Badge className="ml-1.5 text-[9px] bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 border-0">
//                                 BEST
//                               </Badge>
//                             )}
//                           </span>
//                         )}
//                       </div>
//                     );
//                   })}
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       )}

//       {/* Specifications Section - Only show if we have at least 2 products */}
//       {products.length >= 2 && specItems.length > 0 && (
//         <div className="mb-6">
//           <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-4 py-3 rounded-t-lg font-semibold text-sm flex items-center justify-between">
//             <span>Specifications</span>
//             {showOnlyDifferences && specItems.length > 0 && (
//               <Badge variant="secondary" className="bg-white/20 text-white border-0">
//                 Showing differences only
//               </Badge>
//             )}
//           </div>
//           <div className="border border-t-0 rounded-b-lg overflow-hidden">
//             {specItems.map((item, index) => {
//               const values = products.map(p => item.value(p));
//               const isDifferent = isValueDifferent(values);
//               const bestValue = findBestValue(values);
              
//               return (
//                 <div
//                   key={item.label}
//                   className={cn(
//                     'grid gap-0',
//                     index % 2 === 0 ? 'bg-muted/30' : 'bg-card',
//                     isDifferent && showOnlyDifferences && 'border-l-4 border-primary'
//                   )}
//                   style={{ gridTemplateColumns: `200px repeat(${products.length}, 1fr)` }}
//                 >
//                   <div className="p-3 text-sm font-medium text-muted-foreground border-r flex items-center gap-2">
//                     {isDifferent && showOnlyDifferences && (
//                       <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
//                     )}
//                     {item.label}
//                   </div>
//                   {products.map((product) => {
//                     const value = item.value(product);
//                     const isBest = bestValue && value === bestValue && isDifferent;
//                     return (
//                       <div key={product.id} className={cn(
//                         "p-3 text-sm border-l first:border-l-0",
//                         isBest && "bg-green-50 dark:bg-green-950/20"
//                       )}>
//                         <span className={cn(
//                           isBest && "font-semibold text-green-600 dark:text-green-400"
//                         )}>
//                           {value}
//                           {isBest && (
//                             <Badge className="ml-1.5 text-[9px] bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 border-0">
//                               BEST
//                             </Badge>
//                           )}
//                         </span>
//                       </div>
//                     );
//                   })}
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       )}

//       {/* Variants Section - Only show if we have at least 2 products */}
//       {products.length >= 2 && (
//         <div className="mb-6">
//           <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-4 py-3 rounded-t-lg font-semibold text-sm">
//             Available Variants
//           </div>
//           <div className="border border-t-0 rounded-b-lg overflow-hidden">
//             <div 
//               className={cn('grid gap-0', 'bg-muted/30')}
//               style={{ gridTemplateColumns: `200px repeat(${products.length}, 1fr)` }}
//             >
//               <div className="p-3 text-sm font-medium text-muted-foreground border-r">Variants</div>
//               {products.map((product) => (
//                 <div key={product.id} className="p-3 border-l first:border-l-0">
//                   {product.variants && product.variants.length > 0 ? (
//                     <div className="flex flex-wrap gap-2">
//                       {product.variants.map((variant) => (
//                         <div key={variant.id} className="flex items-center gap-1.5 bg-card px-2.5 py-1 rounded-full border text-xs">
//                           <div 
//                             className="w-3.5 h-3.5 rounded-full border"
//                             style={{ backgroundColor: variant.color || '#cccccc' }}
//                           />
//                           <span>{variant.variant_name || variant.color || 'N/A'}</span>
//                         </div>
//                       ))}
//                     </div>
//                   ) : (
//                     <span className="text-sm text-muted-foreground">No variants available</span>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Related Products Section - Same product_type as first product */}
//       {relatedProducts.length > 0 && (
//         <div className="mt-12">
//           <div className="flex items-center justify-between mb-5">
//             <h2 className="text-xl font-bold">
//               Related {productType} Products
//             </h2>
//             <Button asChild variant="ghost" size="sm">
//               <Link to={`/products?type=${encodeURIComponent(productType)}`}>
//                 View More <ArrowRight className="w-4 h-4 ml-1" />
//               </Link>
//             </Button>
//           </div>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
//             {relatedProducts.map((rp) => (
//               <ProductCard 
//                 key={rp.id} 
//                 product={transformForProductCard(rp)} 
//               />
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


// ComparePage.tsx - Fixed type errors
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, GitCompare, Plus, ArrowRight, AlertCircle, Loader2, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/shared';
import { useApp } from '@/hooks/use-app';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { PageBreadcrumb as Breadcrumb } from '@/layouts/customer-layout-wrapper';
import { ProductCard } from '@/components/product-card';
import type { Product as AppProduct, ProductStatus } from '@/types';
import axios from 'axios';
import { baseurl } from '@/Baseurl/baseurl';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { WishlistLeadModal } from '@/components/wishlist-modal';

// Interface to match API response
interface Variant {
  id: number;
  product_id: number;
  variant_name: string;
  part_code: string;
  category: string;
  brand: string;
  description: string;
  spec_type: string;
  color: string;
  size: string;
  price: string;
  availability: string;
  datasheet_url: string;
  stock: number;
  image_url: string;
  created_at: string;
  updated_at: string;
}

interface SpecComparison {
  id: number;
  product_id: number;
  spec_type: string;
  bandwidth: string;
  max_data_rate: string;
  internal_design: string;
  typical_applications: string;
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
  discount: string;
  product_description: string;
  warranty: string;
  product_series: string;
  product_type: string;
  created_at: string;
  updated_at: string;
  category_name: string;
  variants: Variant[];
  spec_comparison?: SpecComparison[];
}

interface Category {
  id: number;
  category_name: string;
}

interface Brand {
  id: number;
  brand_name: string;
  category_id: number;
  category_name: string;
}

type Product = AppProduct;

export function ComparePage() {
  const navigate = useNavigate();
  const { 
    compareList, 
    removeFromCompare, 
    clearCompare, 
    addToWishlist, 
    removeFromWishlist, 
    isInWishlist,
    addToCompare 
  } = useApp();
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [showOnlyDifferences, _setShowOnlyDifferences] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<ApiProduct[]>([]);
  const [allProductsData, setAllProductsData] = useState<ApiProduct[]>([]);
  
  // Dropdown states
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [selectedProductType, setSelectedProductType] = useState<string>('all');
  const [selectedProductName, setSelectedProductName] = useState<string>('all');
  const [filteredProducts, setFilteredProducts] = useState<ApiProduct[]>([]);
  const [productTypes, setProductTypes] = useState<string[]>([]);
  const [productNames, setProductNames] = useState<string[]>([]);
  
  // Wishlist and Quotation states
  const [wishlistLoading, setWishlistLoading] = useState<string | null>(null);
  const [quotationLoading, setQuotationLoading] = useState<string | null>(null);
  const [wishlistModalOpen, setWishlistModalOpen] = useState(false);
  const [selectedProductForWishlist, setSelectedProductForWishlist] = useState<ApiProduct | null>(null);

  // Get user ID
  const getUserId = (): number | null => {
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch categories
        const categoriesRes = await axios.get(`${baseurl}/api/categories/`);
        if (categoriesRes.data.success) {
          setCategories(categoriesRes.data.data);
        }

        // Fetch brands
        const brandsRes = await axios.get(`${baseurl}/api/brands/`);
        if (brandsRes.data.success) {
          setBrands(brandsRes.data.data);
        }

        // Fetch all products with variants
        const response = await axios.get(`${baseurl}/api/products/products-with-variants`);
        const allProducts = response.data;
        setAllProductsData(allProducts);
        
        // Get unique product types
        const types: string[] = [...new Set(allProducts.map((p: ApiProduct) => p.product_type).filter(Boolean))];
        setProductTypes(types);
        
        // Get unique product names
        const names: string[] = allProducts.map((p: ApiProduct) => p.product_name);
        setProductNames(names);
        
        // If no products in compare list, show empty
        if (compareList.length === 0) {
          setProducts([]);
          setFilteredProducts([]);
          setRelatedProducts([]);
          setLoading(false);
          return;
        }
        
        // Get products that are in the compare list
        const compareProducts = allProducts.filter((p: ApiProduct) => 
          compareList.includes(String(p.id))
        );
        
        // Fetch spec comparison for each product in compare list
        const productsWithSpecs = await Promise.all(
          compareProducts.map(async (product: ApiProduct) => {
            try {
              const specRes = await axios.get(`${baseurl}/api/products/spec-comparison/${product.id}`);
              if (specRes.data && Object.keys(specRes.data).length > 0) {
                const specArray = Object.values(specRes.data);
                return { ...product, spec_comparison: specArray };
              }
              return product;
            } catch (error) {
              console.error(`Error fetching spec for product ${product.id}:`, error);
              return product;
            }
          })
        );
        
        setProducts(productsWithSpecs);
        setFilteredProducts(productsWithSpecs);

        // Get related products based on the first product's type
        if (compareProducts.length > 0) {
          const firstProductType = compareProducts[0].product_type;
          
          const related = allProducts
            .filter((p: ApiProduct) => 
              p.product_type === firstProductType && 
              !compareList.includes(String(p.id))
            )
            .slice(0, 4);
          
          setRelatedProducts(related);
        }
        
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load products for comparison');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [compareList]);

  // Handle category change - filter products by category
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedBrand('all');
    setSelectedProductType('all');
    setSelectedProductName('all');
    
    let filtered: ApiProduct[] = [];
    
    if (categoryId === 'all') {
      filtered = allProductsData;
    } else {
      filtered = allProductsData.filter(p => 
        String(p.product_category_id) === categoryId
      );
    }
    
    setFilteredProducts(filtered);
    // Update product names based on filtered products
    const names: string[] = filtered.map((p: ApiProduct) => p.product_name);
    setProductNames(names);
  };

  // Handle brand change - filter products by brand
  const handleBrandChange = (brandName: string) => {
    setSelectedBrand(brandName);
    setSelectedProductType('all');
    setSelectedProductName('all');
    
    let filtered: ApiProduct[] = [];
    
    if (brandName === 'all') {
      // Reset to category filter
      if (selectedCategory && selectedCategory !== 'all') {
        filtered = allProductsData.filter(p => 
          String(p.product_category_id) === selectedCategory
        );
      } else {
        filtered = allProductsData;
      }
    } else {
      filtered = allProductsData.filter(p => 
        p.product_brand === brandName
      );
    }
    
    setFilteredProducts(filtered);
    const names: string[] = filtered.map((p: ApiProduct) => p.product_name);
    setProductNames(names);
  };

  // Handle product type change
  const handleProductTypeChange = (productType: string) => {
    setSelectedProductType(productType);
    setSelectedProductName('all');
    
    let filtered: ApiProduct[] = [];
    
    if (productType === 'all') {
      // Reset to brand/category filter
      if (selectedBrand && selectedBrand !== 'all') {
        filtered = allProductsData.filter(p => 
          p.product_brand === selectedBrand
        );
      } else if (selectedCategory && selectedCategory !== 'all') {
        filtered = allProductsData.filter(p => 
          String(p.product_category_id) === selectedCategory
        );
      } else {
        filtered = allProductsData;
      }
    } else {
      filtered = allProductsData.filter(p => 
        p.product_type === productType
      );
    }
    
    setFilteredProducts(filtered);
    const names: string[] = filtered.map((p: ApiProduct) => p.product_name);
    setProductNames(names);
  };

  // Handle product name selection - this will add the product to compare list using useApp
  const handleProductNameChange = async (productName: string) => {
    setSelectedProductName(productName);
    
    if (productName === 'all') {
      return;
    }
    
    // Find the selected product
    const selectedProduct = allProductsData.find(
      (p: ApiProduct) => p.product_name === productName
    );
    
    if (selectedProduct && !compareList.includes(String(selectedProduct.id))) {
      // Add product to compare list using the useApp hook
      if (compareList.length >= 4) {
        toast.error('You can compare up to 4 products at a time');
        setSelectedProductName('all');
        return;
      }
      
      try {
        // Get user ID for API call
        const userId = getUserId();
        await addToCompare(String(selectedProduct.id), userId || undefined);
        setSelectedProductName('all');
      } catch (error) {
        console.error('Error adding to compare:', error);
        toast.error('Failed to add product to compare');
        setSelectedProductName('all');
      }
    } else if (selectedProduct && compareList.includes(String(selectedProduct.id))) {
      toast.info('Product already in compare list');
      setSelectedProductName('all');
    }
  };

  // Helper function to get product image with full URL
  const getProductImage = (product: ApiProduct): string => {
    if (product.variants && product.variants.length > 0 && product.variants[0].image_url) {
      return `${baseurl}${product.variants[0].image_url}`;
    }
    return 'https://via.placeholder.com/400x400?text=No+Image';
  };

  // Helper function to get product slug
  const getProductSlug = (productName: string): string => {
    return productName.toLowerCase().replace(/\s+/g, '-');
  };

  // Helper function to get product price
  const getProductPrice = (product: ApiProduct): number => {
    const price = parseFloat(product.max_price || product.min_price || product.price || '0');
    return isNaN(price) ? 0 : price;
  };

  // Helper function to get display price string with min/max
  const getDisplayPrice = (product: ApiProduct): string => {
    const minPrice = parseFloat(product.min_price || '0');
    const maxPrice = parseFloat(product.max_price || '0');
    const discount = parseFloat(product.discount || '0');
    
    if (minPrice === 0 && maxPrice === 0) {
      return 'Price on request';
    }
    
    // Calculate discounted prices
    const minDiscounted = minPrice * (1 - discount / 100);
    const maxDiscounted = maxPrice * (1 - discount / 100);
    
    if (minPrice === maxPrice) {
      return formatPrice(minDiscounted);
    }
    
    return `${formatPrice(minDiscounted)} - ${formatPrice(maxDiscounted)}`;
  };

  // Helper function to get original price display
  const getDisplayOriginalPrice = (product: ApiProduct): string => {
    const minPrice = parseFloat(product.min_price || '0');
    const maxPrice = parseFloat(product.max_price || '0');
    
    if (minPrice === 0 && maxPrice === 0) {
      return '';
    }
    
    if (minPrice === maxPrice) {
      return formatPrice(minPrice);
    }
    
    return `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`;
  };

  // Helper function to get stock status
  const getStockStatus = (product: ApiProduct): string => {
    const totalStock = product.variants?.reduce((sum, v) => sum + v.stock, 0) || 0;
    return totalStock > 0 ? 'In Stock' : 'Out of Stock';
  };

  // Check if a value is different across products
  const isValueDifferent = (values: any[]): boolean => {
    return new Set(values).size > 1;
  };

  // Find best value for numeric specs
  const findBestValue = (values: string[]): string | null => {
    const numeric = values.map(v => {
      const match = v.match(/[\d.]+/);
      return match ? parseFloat(match[0]) : null;
    });
    if (numeric.every(n => n !== null) && numeric.length > 1) {
      const max = Math.max(...numeric as number[]);
      const maxIdx = numeric.indexOf(max);
      return values[maxIdx];
    }
    return null;
  };

  // Format price in Indian Rupees
  const formatPrice = (price: string | number): string => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    if (isNaN(numPrice) || numPrice === 0) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numPrice);
  };

  // Get spec value from product
  const getSpecValue = (product: ApiProduct, specKey: string): string => {
    const directValue = (product as any)[specKey];
    if (directValue && directValue !== 'null' && directValue !== '') {
      return directValue;
    }
    
    if (product.spec_comparison && product.spec_comparison.length > 0) {
      const spec = product.spec_comparison[0];
      const specValue = (spec as any)[specKey];
      if (specValue && specValue !== 'null' && specValue !== '') {
        return specValue;
      }
    }
    
    return '—';
  };

  // Get general info items
  const getGeneralInfoItems = () => {
    const items = [
      { 
        label: 'Brand', 
        value: (p: ApiProduct) => p.product_brand || '—' 
      },
      { 
        label: 'Category', 
        value: (p: ApiProduct) => p.category_name || '—' 
      },
      { 
        label: 'Product Type', 
        value: (p: ApiProduct) => p.product_type || '—' 
      },
      { 
        label: 'Warranty', 
        value: (p: ApiProduct) => p.warranty || '—' 
      },
      { 
        label: 'Stock Status', 
        value: (p: ApiProduct) => getStockStatus(p) 
      },
    ];

    if (showOnlyDifferences) {
      return items.filter(item => {
        const values = products.map(p => item.value(p));
        return isValueDifferent(values);
      });
    }
    return items;
  };

  // Get specification items
  const getSpecificationItems = () => {
    const specKeys = [
      { label: 'Product Series', key: 'product_series' },
      { label: 'Spec Type', key: 'spec_type' },
      { label: 'Bandwidth', key: 'bandwidth' },
      { label: 'Max Data Rate', key: 'max_data_rate' },
      { label: 'Internal Design', key: 'internal_design' },
      { label: 'Typical Applications', key: 'typical_applications' },
    ];

    const items = specKeys.map(spec => ({
      label: spec.label,
      value: (p: ApiProduct) => getSpecValue(p, spec.key)
    }));

    if (showOnlyDifferences) {
      return items.filter(item => {
        const values = products.map(p => item.value(p));
        return isValueDifferent(values);
      });
    }
    return items;
  };

  // Transform API product to the Product type expected by ProductCard
 // Replace the transformForProductCard function with this fixed version

// Transform API product to the Product type expected by ProductCard
const transformForProductCard = (product: ApiProduct): Product => {
  const gallery = product.variants?.map(v => 
    v.image_url ? `${baseurl}${v.image_url}` : null
  ).filter(Boolean) as string[] || ['https://via.placeholder.com/400x400'];

  const specFields = [];
  if (product.product_series) {
    specFields.push({ key: 'series', label: 'Series', value: product.product_series });
  }
  if (product.product_type) {
    specFields.push({ key: 'type', label: 'Type', value: product.product_type });
  }
  if (product.warranty) {
    specFields.push({ key: 'warranty', label: 'Warranty', value: product.warranty });
  }

  if (product.variants && product.variants.length > 0) {
    const variant = product.variants[0];
    if (variant.spec_type) {
      specFields.push({ key: 'spec_type', label: 'Spec Type', value: variant.spec_type });
    }
    if (variant.size) {
      specFields.push({ key: 'size', label: 'Size', value: variant.size });
    }
    if (variant.color) {
      specFields.push({ key: 'color', label: 'Color', value: variant.color });
    }
  }

  const totalStock = product.variants?.reduce((sum, v) => sum + v.stock, 0) || 0;
  // Use 'active' as the status since ProductStatus type doesn't include 'inactive' or 'archived'
  const status: ProductStatus = 'active';

  const variants = product.variants?.map(v => ({
    id: v.id,
    color_name: v.color || '',
    color_hex: v.color || '#cccccc',
    price: v.price,
    stock: v.stock,
    image_url: v.image_url || '',
    variant_name: v.variant_name,
    part_code: v.part_code,
    spec_type: v.spec_type,
    size: v.size,
    availability: v.availability,
    datasheet_url: v.datasheet_url,
    description: v.description,
  })) || [];

  const price = getProductPrice(product);

  return {
    id: String(product.id),
    name: product.product_name,
    slug: getProductSlug(product.product_name),
    sku: product.product_code,
    brandId: String(product.product_category_id),
    brandName: product.product_brand || 'Unknown',
    categoryId: String(product.product_category_id),
    categoryName: product.category_name || 'Uncategorized',
    shortDescription: product.product_description?.substring(0, 150) || '',
    description: product.product_description || '',
    features: [],
    specifications: {},
    specGroups: [
      {
        groupName: 'Specifications',
        fields: specFields
      }
    ],
    gallery,
    price: price,
    minPrice: parseFloat(product.min_price || '0'),
    maxPrice: parseFloat(product.max_price || '0'),
    currency: 'INR',
    status: status,
    isPopular: false,
    isNew: false,
    rating: 4.5,
    reviewCount: 0,
    downloads: product.product_details_pdf 
      ? [{ name: 'Product Details', type: 'pdf' as const, size: 'PDF', url: product.product_details_pdf }]
      : [],
    relatedProductIds: [],
    createdAt: product.created_at,
    warranty: product.warranty || 'Standard warranty',
    originalPrice: price * (1 + parseFloat(product.discount || '0') / 100) || 0,
    discountPercentage: parseFloat(product.discount || '0'),
    variants: variants,
    hasVariants: (product.variants?.length || 0) > 0,
    stock: totalStock,
  };
};

  // Handle wishlist toggle
  const handleWishlistToggle = async (product: ApiProduct, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const userId = getUserId();
    const productId = String(product.id);
    
    setWishlistLoading(productId);
    
    try {
      const isWishlisted = isInWishlist(productId);
      
      if (isWishlisted) {
        await removeFromWishlist(productId, userId || undefined);
        toast.success('Removed from wishlist');
      } else {
        await addToWishlist(productId, userId || undefined);
        if (!userId) {
          setSelectedProductForWishlist(product);
          setWishlistModalOpen(true);
        } else {
          toast.success('Added to wishlist');
        }
      }
    } catch (error) {
      console.error('Wishlist error:', error);
      toast.error('Failed to update wishlist');
    } finally {
      setWishlistLoading(null);
    }
  };

  // Handle single quotation request - Navigate to quotation page
  const handleSingleQuotation = async (product: ApiProduct, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const userId = getUserId();
    if (!userId) {
      toast.error('Please login to request a quotation');
      return;
    }

    const productId = String(product.id);
    setQuotationLoading(productId);

    try {
      const user = getUserDetails();
      
      let actualPrice = getProductPrice(product);
      if (product.max_price && parseFloat(product.max_price) > 0) {
        actualPrice = parseFloat(product.max_price);
      } else if (product.min_price && parseFloat(product.min_price) > 0) {
        actualPrice = parseFloat(product.min_price);
      }
      
      const discountPercent = parseFloat(product.discount || '0');
      
      const payload = {
        user_id: userId,
        product_id: product.id,
        product_name: product.product_name,
        product_code: product.product_code,
        product_brand: product.product_brand,
        price: actualPrice,
        discount: discountPercent,
        quantity: 1,
        remarks: `Quotation requested for ${product.product_name}`,
        customer_name: user?.name || '',
        customer_mobile: user?.mobile || '',
        customer_email: user?.email || ''
      };

      const response = await axios.post(`${baseurl}/api/quotations/single`, payload);

      if (response.data.success) {
        toast.success(`Quotation #${response.data.quotation_no} generated successfully!`);
        navigate('/wishlist/quotation');
      } else {
        toast.error(response.data.message || 'Failed to submit quotation request');
      }
    } catch (error: any) {
      console.error('Error submitting quotation:', error);
      toast.error(error.response?.data?.message || 'Failed to submit quotation request. Please try again.');
    } finally {
      setQuotationLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb items={[{ label: 'Home', path: '/' }, { label: 'Compare' }]} />
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  // Get product names for dropdown based on filters
  const getFilteredProductNames = (): string[] => {
    let filtered = allProductsData;
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => String(p.product_category_id) === selectedCategory);
    }
    if (selectedBrand !== 'all') {
      filtered = filtered.filter(p => p.product_brand === selectedBrand);
    }
    if (selectedProductType !== 'all') {
      filtered = filtered.filter(p => p.product_type === selectedProductType);
    }
    
    return filtered.map((p: ApiProduct) => p.product_name);
  };

  const generalInfoItems = getGeneralInfoItems();
  const specItems = getSpecificationItems();
  const productType = products[0]?.product_type || '';

  // Products to display - only show products that are in compareList
  const displayProducts = products;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <Breadcrumb items={[{ label: 'Home', path: '/' }, { label: 'Compare' }]} />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Compare Products</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {compareList.length > 0 
              ? `Comparing ${compareList.length} product${compareList.length > 1 ? 's' : ''}`
              : 'Select products to compare'}
          </p>
        </div>
        {compareList.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="outline" size="sm" onClick={async () => { 
              await clearCompare(); 
              toast.success('Comparison cleared');
            }}>
              <X className="w-4 h-4 mr-1.5" /> Clear All
            </Button>
          </div>
        )}
      </div>

      {/* Dropdown Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-muted/30 rounded-lg border">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">Category:</span>
          <Select value={selectedCategory} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-[160px] h-9">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={String(cat.id)}>
                  {cat.category_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">Brand:</span>
          <Select value={selectedBrand} onValueChange={handleBrandChange}>
            <SelectTrigger className="w-[160px] h-9">
              <SelectValue placeholder="All Brands" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Brands</SelectItem>
              {brands.map((brand) => (
                <SelectItem key={brand.id} value={brand.brand_name}>
                  {brand.brand_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">Product Type:</span>
          <Select value={selectedProductType} onValueChange={handleProductTypeChange}>
            <SelectTrigger className="w-[160px] h-9">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {productTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">Product:</span>
          <Select value={selectedProductName} onValueChange={handleProductNameChange}>
            <SelectTrigger className="w-[200px] h-9">
              <SelectValue placeholder="Select Product" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Products</SelectItem>
              {getFilteredProductNames().map((name) => (
                <SelectItem key={name} value={name}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Show only when products are in compare list */}
      {compareList.length === 0 ? (
        <EmptyState
          icon={<GitCompare className="w-8 h-8" />}
          title="No products to compare"
          description="Add products from the Products page or use the dropdown above to select products to compare. You can compare up to 4 products at once."
          action={
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild>
                <Link to="/products">Browse Products <ArrowRight className="w-4 h-4 ml-2" /></Link>
              </Button>
            </div>
          }
        />
      ) : (
        <>
          {compareList.length < 2 && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-accent/10 border border-accent/20 mb-4 text-sm">
              <AlertCircle className="w-4 h-4 text-accent shrink-0" />
              <span>Add at least 2 products to see a meaningful comparison.</span>
            </div>
          )}

          {/* Product Cards Grid - Show only compared products */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-8">
            {displayProducts.map((product) => {
              const isWishlisted = isInWishlist(String(product.id));
              const isWishlistLoading = wishlistLoading === String(product.id);
              const isQuotationLoading = quotationLoading === String(product.id);
              
              return (
                <Card 
                  key={product.id} 
                  className="group relative overflow-hidden border-primary/50 ring-1 ring-primary/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
                >
                  {/* Wishlist Heart Icon - Top Right */}
                  <Button
                    size="icon"
                    variant="ghost"
                    className={cn(
                      'absolute top-2 right-2 z-20 w-8 h-8 rounded-full transition-all duration-200',
                      'bg-white/80 hover:bg-white shadow-md backdrop-blur-sm',
                      isWishlisted 
                        ? 'text-red-500 hover:text-red-600 hover:bg-red-50' 
                        : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                    )}
                    onClick={(e) => handleWishlistToggle(product, e)}
                    disabled={isWishlistLoading}
                    title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    {isWishlistLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Heart className={cn('w-4 h-4', isWishlisted && 'fill-current')} />
                    )}
                  </Button>

                  {/* Compare status indicator */}
                  <div className="absolute top-2 left-2 z-10">
                    <Badge className="bg-primary text-white text-[9px]">Comparing</Badge>
                  </div>

                  {/* Remove from Compare Button */}
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute top-2 left-[70px] z-10 w-7 h-7 rounded-full bg-white/80 hover:bg-white shadow-md backdrop-blur-sm hover:bg-destructive hover:text-destructive-foreground transition-colors"
                    onClick={async (e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const userId = getUserId();
                      await removeFromCompare(String(product.id), userId || undefined);
                    }}
                  >
                    <X className="w-3.5 h-3.5" />
                  </Button>

                  <Link to={`/products/${getProductSlug(product.product_name)}`} className="block relative aspect-square overflow-hidden bg-muted/30">
                    <img
                      src={getProductImage(product)}
                      alt={product.product_name}
                      loading="lazy"
                      className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x400?text=No+Image';
                      }}
                    />
                    {parseFloat(product.discount) > 0 && (
                      <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600 text-white text-[10px]">
                        {product.discount}% OFF
                      </Badge>
                    )}
                  </Link>

                  <div className="p-4 flex flex-col flex-1">
                    <div className="flex items-center gap-1.5 mb-2">
                      <Badge className="text-[10px] font-semibold bg-primary/10 text-primary border-0">
                        {product.product_brand || 'N/A'}
                      </Badge>
                      <span className="text-xs text-muted-foreground/50">·</span>
                      <span className="text-xs text-muted-foreground">{product.category_name || 'Uncategorized'}</span>
                    </div>

                    <Link to={`/products/${getProductSlug(product.product_name)}`}>
                      <h3 className="font-semibold text-sm leading-snug mb-1.5 line-clamp-2 group-hover:text-primary transition-colors">
                        {product.product_name}
                      </h3>
                    </Link>

                    {/* Price - Show min/max price with discount */}
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-lg font-bold text-primary">
                        {getDisplayPrice(product)}
                      </span>
                      {parseFloat(product.discount) > 0 && (
                        <span className="text-xs text-muted-foreground line-through">
                          {getDisplayOriginalPrice(product)}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-muted-foreground line-clamp-2 mt-2 flex-1">
                      {product.product_description?.substring(0, 100) || ''}
                    </p>

                    <div className="mt-3">
                      <Badge variant={getStockStatus(product) === 'In Stock' ? 'default' : 'destructive'} className="w-fit">
                        {getStockStatus(product)}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2 mt-3">
                      <Button asChild size="sm" className="flex-1">
                        <Link to={`/products/${getProductSlug(product.product_name)}`}>
                          View Details
                        </Link>
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={(e) => handleSingleQuotation(product, e)}
                        disabled={isQuotationLoading}
                        className="flex-shrink-0"
                      >
                        {isQuotationLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          'Get Quote'
                        )}
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}

            {/* Add more products card */}
            {compareList.length < 4 && (
              <Card className="p-4 flex flex-col items-center justify-center border-2 border-dashed min-h-[350px] hover:border-primary/50 transition-colors">
                <div className="w-full aspect-square rounded-lg border-2 border-dashed flex items-center justify-center mb-3 bg-gray-50 dark:bg-gray-800/50">
                  <Plus className="w-16 h-16 text-muted-foreground/30" />
                </div>
                <p className="text-sm text-muted-foreground text-center mb-3">Add more products to compare</p>
                <div className="flex flex-col gap-2 w-full">
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link to="/products">Browse Products</Link>
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">or use the dropdown above</p>
                </div>
              </Card>
            )}
          </div>

          {/* General Information Section - Only show when comparing 2+ products */}
          {compareList.length >= 2 && generalInfoItems.length > 0 && (
            <div className="mb-6">
              <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-4 py-3 rounded-t-lg font-semibold text-sm flex items-center justify-between">
                <span>General Information</span>
              </div>
              <div className="border border-t-0 rounded-b-lg overflow-hidden">
                {generalInfoItems.map((item, index) => {
                  const values = displayProducts.map(p => item.value(p));
                  const isDifferent = isValueDifferent(values);
                  const bestValue = findBestValue(values);
                  
                  return (
                    <div 
                      key={item.label}
                      className={cn(
                        'grid gap-0',
                        index % 2 === 0 ? 'bg-muted/30' : 'bg-card',
                        isDifferent && showOnlyDifferences && 'border-l-4 border-primary'
                      )}
                      style={{ gridTemplateColumns: `200px repeat(${displayProducts.length}, 1fr)` }}
                    >
                      <div className="p-3 text-sm font-medium text-muted-foreground border-r flex items-center gap-2">
                        {isDifferent && showOnlyDifferences && (
                          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        )}
                        {item.label}
                      </div>
                      {displayProducts.map((product) => {
                        const value = item.value(product);
                        const isBest = bestValue && value === bestValue && isDifferent;
                        return (
                          <div key={product.id} className={cn(
                            "p-3 text-sm border-l first:border-l-0",
                            isBest && "bg-green-50 dark:bg-green-950/20"
                          )}>
                            {item.label === 'Stock Status' ? (
                              <Badge variant={value === 'In Stock' ? 'default' : 'destructive'}>
                                {value}
                              </Badge>
                            ) : (
                              <span className={cn(
                                isBest && "font-semibold text-green-600 dark:text-green-400"
                              )}>
                                {value}
                                {isBest && (
                                  <Badge className="ml-1.5 text-[9px] bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 border-0">
                                    BEST
                                  </Badge>
                                )}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Specifications Section - Only show when comparing 2+ products */}
          {compareList.length >= 2 && specItems.length > 0 && (
            <div className="mb-6">
              <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-4 py-3 rounded-t-lg font-semibold text-sm flex items-center justify-between">
                <span>Specifications</span>
              </div>
              <div className="border border-t-0 rounded-b-lg overflow-hidden">
                {specItems.map((item, index) => {
                  const values = displayProducts.map(p => item.value(p));
                  const isDifferent = isValueDifferent(values);
                  const bestValue = findBestValue(values);
                  
                  return (
                    <div
                      key={item.label}
                      className={cn(
                        'grid gap-0',
                        index % 2 === 0 ? 'bg-muted/30' : 'bg-card',
                        isDifferent && showOnlyDifferences && 'border-l-4 border-primary'
                      )}
                      style={{ gridTemplateColumns: `200px repeat(${displayProducts.length}, 1fr)` }}
                    >
                      <div className="p-3 text-sm font-medium text-muted-foreground border-r flex items-center gap-2">
                        {isDifferent && showOnlyDifferences && (
                          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        )}
                        {item.label}
                      </div>
                      {displayProducts.map((product) => {
                        const value = item.value(product);
                        const isBest = bestValue && value === bestValue && isDifferent;
                        return (
                          <div key={product.id} className={cn(
                            "p-3 text-sm border-l first:border-l-0",
                            isBest && "bg-green-50 dark:bg-green-950/20"
                          )}>
                            <span className={cn(
                              isBest && "font-semibold text-green-600 dark:text-green-400"
                            )}>
                              {value}
                              {isBest && (
                                <Badge className="ml-1.5 text-[9px] bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 border-0">
                                  BEST
                                </Badge>
                              )}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Variants Section - Only show when comparing 2+ products */}
          {compareList.length >= 2 && (
            <div className="mb-6">
              <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-4 py-3 rounded-t-lg font-semibold text-sm">
                Available Variants
              </div>
              <div className="border border-t-0 rounded-b-lg overflow-hidden">
                <div 
                  className={cn('grid gap-0', 'bg-muted/30')}
                  style={{ gridTemplateColumns: `200px repeat(${displayProducts.length}, 1fr)` }}
                >
                  <div className="p-3 text-sm font-medium text-muted-foreground border-r">Variants</div>
                  {displayProducts.map((product) => (
                    <div key={product.id} className="p-3 border-l first:border-l-0">
                      {product.variants && product.variants.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {product.variants.map((variant) => (
                            <div key={variant.id} className="flex items-center gap-1.5 bg-card px-2.5 py-1 rounded-full border text-xs">
                              <div 
                                className="w-3.5 h-3.5 rounded-full border"
                                style={{ backgroundColor: variant.color || '#cccccc' }}
                              />
                              <span>{variant.variant_name || variant.color || 'N/A'}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">No variants available</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Related Products Section */}
          {relatedProducts.length > 0 && (
            <div className="mt-12">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold">
                  Related {productType} Products
                </h2>
                <Button asChild variant="ghost" size="sm">
                  <Link to={`/products?type=${encodeURIComponent(productType)}`}>
                    View More <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {relatedProducts.map((rp) => (
                  <ProductCard 
                    key={rp.id} 
                    product={transformForProductCard(rp)} 
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Wishlist Lead Modal */}
      <WishlistLeadModal 
        product={selectedProductForWishlist ? transformForProductCard(selectedProductForWishlist) : null} 
        open={wishlistModalOpen} 
        onOpenChange={setWishlistModalOpen} 
      />
    </div>
  );
}