import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, GitCompare, Plus, ArrowRight, AlertCircle, Loader2, Check, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/shared';
import { useApp } from '@/hooks/use-app';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { PageBreadcrumb as Breadcrumb } from '@/layouts/customer-layout-wrapper';
import axios from 'axios';
import { baseurl } from '@/Baseurl/baseurl';

// Updated interface to match actual API response
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

interface Product {
  id: number;
  product_name: string;
  product_code: string;
  product_category_id: number;
  product_brand: string;
  product_details_pdf: string;
  price: string;
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

export function ComparePage() {
  const { compareList, removeFromCompare, clearCompare } = useApp();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showOnlyDifferences, setShowOnlyDifferences] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${baseurl}/api/products/products-with-variants`);
        const allProductsData = response.data;
        setAllProducts(allProductsData);
        
        // Get the product_type of the first product in compare list
        const firstProductId = compareList[0];
        const firstProduct = allProductsData.find((p: Product) => String(p.id) === firstProductId);
        
        if (!firstProduct) {
          setProducts([]);
          return;
        }
        
        const firstProductType = firstProduct.product_type;
        
        // Filter products: only those in compareList AND same product_type
        const filteredProducts = allProductsData.filter((p: Product) => 
          compareList.includes(String(p.id)) && p.product_type === firstProductType
        );
        
        // Fetch spec comparison for each product
        const productsWithSpecs = await Promise.all(
          filteredProducts.map(async (product: Product) => {
            try {
              const specRes = await axios.get(`${baseurl}/api/products/spec-comparison/${product.id}`);
              if (specRes.data && Object.keys(specRes.data).length > 0) {
                // Convert spec comparison object to array
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
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to load products for comparison');
      } finally {
        setLoading(false);
      }
    };

    if (compareList.length > 0) {
      fetchProducts();
    } else {
      setLoading(false);
      setProducts([]);
    }
  }, [compareList]);

  // Helper function to get product image with full URL
  const getProductImage = (product: Product) => {
    if (product.variants && product.variants.length > 0 && product.variants[0].image_url) {
      return `${baseurl}${product.variants[0].image_url}`;
    }
    return 'https://via.placeholder.com/400x400?text=No+Image';
  };

  // Helper function to get product slug
  const getProductSlug = (productName: string) => {
    return productName.toLowerCase().replace(/\s+/g, '-');
  };

  // Helper function to get product price with discount
  const getDiscountedPrice = (product: Product) => {
    const originalPrice = parseFloat(product.price);
    const discount = parseFloat(product.discount) || 0;
    const discountedPrice = originalPrice * (1 - discount / 100);
    return discountedPrice.toFixed(2);
  };

  // Helper function to get stock status
  const getStockStatus = (product: Product) => {
    const totalStock = product.variants?.reduce((sum, v) => sum + v.stock, 0) || 0;
    return totalStock > 0 ? 'In Stock' : 'Out of Stock';
  };

  // Check if a value is different across products
  const isValueDifferent = (values: any[]) => {
    return new Set(values).size > 1;
  };

  // Find best value for numeric specs
  const findBestValue = (values: string[]) => {
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
  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numPrice);
  };

  // Get spec value from product (check both product fields and spec_comparison)
  const getSpecValue = (product: Product, specKey: string): string => {
    // First check if the product has the field directly
    const directValue = (product as any)[specKey];
    if (directValue && directValue !== 'null' && directValue !== '') {
      return directValue;
    }
    
    // If not, check spec_comparison
    if (product.spec_comparison && product.spec_comparison.length > 0) {
      // Try to find the spec in the first spec_comparison entry
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
        value: (p: Product) => p.product_brand || '—' 
      },
      { 
        label: 'Category', 
        value: (p: Product) => p.category_name || '—' 
      },
      { 
        label: 'Product Type', 
        value: (p: Product) => p.product_type || '—' 
      },
      { 
        label: 'Warranty', 
        value: (p: Product) => p.warranty || '—' 
      },
      { 
        label: 'Stock Status', 
        value: (p: Product) => getStockStatus(p) 
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
      value: (p: Product) => getSpecValue(p, spec.key)
    }));

    if (showOnlyDifferences) {
      return items.filter(item => {
        const values = products.map(p => item.value(p));
        return isValueDifferent(values);
      });
    }
    return items;
  };

  // Get variant spec types
  const getVariantSpecTypes = (product: Product) => {
    if (!product.variants || product.variants.length === 0) return [];
    const types = product.variants.map(v => v.spec_type).filter(Boolean);
    return [...new Set(types)];
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

  if (products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb items={[{ label: 'Home', path: '/' }, { label: 'Compare' }]} />
        <EmptyState
          icon={<GitCompare className="w-8 h-8" />}
          title="No products to compare"
          description="Add products to comparison to see them side by side. You can compare up to 4 products at once."
          action={<Button asChild><Link to="/products">Browse Products <ArrowRight className="w-4 h-4 ml-2" /></Link></Button>}
        />
      </div>
    );
  }

  // Check if all products have same product_type
  const productTypes = products.map(p => p.product_type);
  const allSameType = new Set(productTypes).size === 1;

  if (!allSameType && products.length > 1) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb items={[{ label: 'Home', path: '/' }, { label: 'Compare' }]} />
        <div className="flex items-center gap-3 p-4 rounded-lg bg-yellow-50 border border-yellow-200 mb-4">
          <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0" />
          <div>
            <p className="font-medium text-yellow-800">Cannot compare different product types</p>
            <p className="text-sm text-yellow-700">
              Only products with the same type can be compared. Please remove products with different types.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <Card key={product.id} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{product.product_name}</h4>
                  <p className="text-sm text-muted-foreground">Type: {product.product_type || 'Unknown'}</p>
                </div>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => {
                    removeFromCompare(String(product.id));
                    toast.success('Removed from comparison');
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const generalInfoItems = getGeneralInfoItems();
  const specItems = getSpecificationItems();

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <Breadcrumb items={[{ label: 'Home', path: '/' }, { label: 'Compare' }]} />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Compare Products</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Compare {products.length} products side by side
            {products.length > 0 && products[0].product_type && (
              <span className="ml-2 text-primary">({products[0].product_type})</span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant={showOnlyDifferences ? 'default' : 'outline'}
            size="sm"
            onClick={() => setShowOnlyDifferences(!showOnlyDifferences)}
            className="rounded-full"
          >
            {showOnlyDifferences ? <Check className="w-4 h-4 mr-1.5" /> : <Minus className="w-4 h-4 mr-1.5" />}
            Show only differences
          </Button>
          <Button variant="outline" size="sm" onClick={() => { clearCompare(); toast.success('Comparison cleared'); }}>
            <X className="w-4 h-4 mr-1.5" /> Clear All
          </Button>
        </div>
      </div>

      {products.length < 2 && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-accent/10 border border-accent/20 mb-4 text-sm">
          <AlertCircle className="w-4 h-4 text-accent shrink-0" />
          <span>Add at least 2 products to see a meaningful comparison.</span>
        </div>
      )}

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-8">
        {products.map((product) => (
          <Card 
            key={product.id} 
            className="group relative overflow-hidden border-border hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
          >
            {/* Remove button */}
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-white/80 hover:bg-white shadow-md backdrop-blur-sm hover:bg-destructive hover:text-destructive-foreground transition-colors"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                removeFromCompare(String(product.id));
                toast.success('Removed from comparison');
              }}
            >
              <X className="w-4 h-4" />
            </Button>

            {/* Image */}
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

            {/* Content */}
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

              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="text-lg font-bold text-primary">
                  {formatPrice(getDiscountedPrice(product))}
                </span>
                {parseFloat(product.discount) > 0 && (
                  <span className="text-xs text-muted-foreground line-through">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>

              <p className="text-xs text-muted-foreground line-clamp-2 mt-2 flex-1">
                {product.product_description?.substring(0, 100) || ''}
              </p>

              {/* Stock Status */}
              <div className="mt-3">
                <Badge variant={getStockStatus(product) === 'In Stock' ? 'default' : 'destructive'} className="w-fit">
                  {getStockStatus(product)}
                </Badge>
              </div>

              {/* View Details Button */}
              <Button asChild size="sm" className="w-full mt-3">
                <Link to={`/products/${getProductSlug(product.product_name)}`}>
                  View Details
                </Link>
              </Button>
            </div>
          </Card>
        ))}

        {/* Add more products card */}
        {products.length < 4 && (
          <Card className="p-4 flex flex-col items-center justify-center border-2 border-dashed min-h-[350px] hover:border-primary/50 transition-colors">
            <div className="w-full aspect-square rounded-lg border-2 border-dashed flex items-center justify-center mb-3 bg-gray-50 dark:bg-gray-800/50">
              <Plus className="w-16 h-16 text-muted-foreground/30" />
            </div>
            <p className="text-sm text-muted-foreground text-center mb-3">Add more products to compare</p>
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link to="/products">Browse Products</Link>
            </Button>
          </Card>
        )}
      </div>

      {/* General Information Section */}
      {generalInfoItems.length > 0 && (
        <div className="mb-6">
          <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-4 py-3 rounded-t-lg font-semibold text-sm flex items-center justify-between">
            <span>General Information</span>
            {showOnlyDifferences && generalInfoItems.length > 0 && (
              <Badge variant="secondary" className="bg-white/20 text-white border-0">
                Showing differences only
              </Badge>
            )}
          </div>
          <div className="border border-t-0 rounded-b-lg overflow-hidden">
            {generalInfoItems.map((item, index) => {
              const values = products.map(p => item.value(p));
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
                  style={{ gridTemplateColumns: `200px repeat(${products.length}, 1fr)` }}
                >
                  <div className="p-3 text-sm font-medium text-muted-foreground border-r flex items-center gap-2">
                    {isDifferent && showOnlyDifferences && (
                      <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    )}
                    {item.label}
                  </div>
                  {products.map((product, idx) => {
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

      {/* Specifications Section */}
      {specItems.length > 0 && (
        <div className="mb-6">
          <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-4 py-3 rounded-t-lg font-semibold text-sm flex items-center justify-between">
            <span>Specifications</span>
            {showOnlyDifferences && specItems.length > 0 && (
              <Badge variant="secondary" className="bg-white/20 text-white border-0">
                Showing differences only
              </Badge>
            )}
          </div>
          <div className="border border-t-0 rounded-b-lg overflow-hidden">
            {specItems.map((item, index) => {
              const values = products.map(p => item.value(p));
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
                  style={{ gridTemplateColumns: `200px repeat(${products.length}, 1fr)` }}
                >
                  <div className="p-3 text-sm font-medium text-muted-foreground border-r flex items-center gap-2">
                    {isDifferent && showOnlyDifferences && (
                      <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    )}
                    {item.label}
                  </div>
                  {products.map((product) => {
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

      {/* Variants Section */}
      <div className="mb-6">
        <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-4 py-3 rounded-t-lg font-semibold text-sm">
          Available Variants
        </div>
        <div className="border border-t-0 rounded-b-lg overflow-hidden">
          <div 
            className={cn('grid gap-0', 'bg-muted/30')}
            style={{ gridTemplateColumns: `200px repeat(${products.length}, 1fr)` }}
          >
            <div className="p-3 text-sm font-medium text-muted-foreground border-r">Variants</div>
            {products.map((product) => (
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

      {/* Spec Comparison from spec_comparison table */}
      {products.some(p => p.spec_comparison && p.spec_comparison.length > 0) && (
        <div className="mb-6">
          <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-4 py-3 rounded-t-lg font-semibold text-sm">
            Specification Comparison Details
          </div>
          <div className="border border-t-0 rounded-b-lg overflow-hidden">
            {products.map((product, idx) => {
              if (!product.spec_comparison || product.spec_comparison.length === 0) return null;
              
              return (
                <div key={product.id} className={cn(
                  'p-4',
                  idx % 2 === 0 ? 'bg-muted/30' : 'bg-card'
                )}>
                  <h4 className="font-semibold text-sm mb-2">{product.product_name}</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {product.spec_comparison.map((spec, specIdx) => (
                      <div key={specIdx} className="flex justify-between p-1.5 border-b border-dashed">
                        <span className="text-muted-foreground">{spec.spec_type || 'Spec'}:</span>
                        <span className="font-medium">
                          {spec.bandwidth && `Bandwidth: ${spec.bandwidth} | `}
                          {spec.max_data_rate && `Data Rate: ${spec.max_data_rate} | `}
                          {spec.internal_design && `Design: ${spec.internal_design}`}
                          {spec.typical_applications && ` | Applications: ${spec.typical_applications}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}